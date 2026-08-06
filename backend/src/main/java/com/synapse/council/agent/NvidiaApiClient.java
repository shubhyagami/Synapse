package com.synapse.council.agent;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * OpenAI-compatible HTTP client for NVIDIA NIM.
 * Supports multi-API-key rotation with automatic failover.
 * When one key hits rate limit (429), it rotates to the next key.
 */
@Slf4j
@Component
public class NvidiaApiClient {

    private final WebClient baseWebClient;
    private final AgentsConfigProperties config;
    private final RateLimiter rateLimiter;
    private final SimpMessagingTemplate messagingTemplate;

    private final List<String> apiKeys = new ArrayList<>();
    private final AtomicInteger currentKeyIndex = new AtomicInteger(0);

    private static final String[] KEY_COLORS = {"red", "blue", "green", "orange"};
    private static final String[] KEY_LABELS = {"Key-A", "Key-B", "Key-C", "Key-D"};

    public NvidiaApiClient(WebClient nvidiaWebClient, AgentsConfigProperties config,
                           RateLimiter rateLimiter, SimpMessagingTemplate messagingTemplate) {
        this.config = config;
        this.rateLimiter = rateLimiter;
        this.messagingTemplate = messagingTemplate;

        String baseUrl = config.getNvidia().getNim().getBaseUrl();

        // Collect all API keys
        List<String> configKeys = config.getNvidia().getNim().getApiKeys();
        if (configKeys != null && !configKeys.isEmpty()) {
            apiKeys.addAll(configKeys);
        } else if (config.getNvidia().getNim().getApiKey() != null
                && !config.getNvidia().getNim().getApiKey().isEmpty()) {
            apiKeys.add(config.getNvidia().getNim().getApiKey());
        }

        // Build base WebClient without Authorization header (we'll set it per-request)
        this.baseWebClient = nvidiaWebClient.mutate()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        log.info("NVIDIA NIM client initialized: baseUrl={}, apiKeys={}", baseUrl, apiKeys.size());
    }

    /**
     * Get the current active API key index (0-based).
     */
    public int getActiveKeyIndex() {
        return currentKeyIndex.get();
    }

    /**
     * Get the display color for the current active key.
     */
    public String getActiveKeyColor() {
        int idx = currentKeyIndex.get() % KEY_COLORS.length;
        return KEY_COLORS[idx];
    }

    /**
     * Rotate to the next API key and broadcast the switch event.
     */
    private void rotateKey(String reason) {
        if (apiKeys.size() <= 1) return;

        int oldIdx = currentKeyIndex.get();
        int newIdx = (oldIdx + 1) % apiKeys.size();
        currentKeyIndex.set(newIdx);

        log.warn("API Key rotated: {} → {} (reason: {})", KEY_LABELS[oldIdx % KEY_LABELS.length],
                KEY_LABELS[newIdx % KEY_LABELS.length], reason);

        // Broadcast key switch event to frontend
        try {
            messagingTemplate.convertAndSend("/topic/boardroom",
                    Map.of(
                        "type", "API_KEY_SWITCHED",
                        "apiKeyIndex", newIdx,
                        "apiKeyColor", KEY_COLORS[newIdx % KEY_COLORS.length],
                        "apiKeyLabel", KEY_LABELS[newIdx % KEY_LABELS.length],
                        "reason", reason,
                        "timestamp", Instant.now().toString()
                    ));
        } catch (Exception e) {
            log.debug("Could not broadcast key switch event: {}", e.getMessage());
        }
    }

    /**
     * Non-streaming chat completion with rate limiting, retry, and key rotation.
     */
    public ChatCompletionResponse chatCompletion(String model, List<ChatMessage> messages) {
        return chatCompletionWithRetry(model, messages, 0, 0);
    }

    private ChatCompletionResponse chatCompletionWithRetry(String model, List<ChatMessage> messages,
                                                           int attempt, int keyRotations) {
        var retryConfig = config.getNvidia().getNim().getRetry();
        int keyIdx = currentKeyIndex.get();
        String activeKey = apiKeys.isEmpty() ? "" : apiKeys.get(keyIdx % apiKeys.size());

        try {
            rateLimiter.acquire();

            ChatCompletionRequest request = ChatCompletionRequest.builder()
                    .model(model)
                    .messages(messages)
                    .maxTokens(config.getNvidia().getNim().getMaxTokens())
                    .temperature(config.getNvidia().getNim().getTemperature())
                    .stream(false)
                    .build();

            log.debug("NIM request: model={}, messages={}, attempt={}, key={}",
                    model, messages.size(), attempt, KEY_LABELS[keyIdx % KEY_LABELS.length]);

            ChatCompletionResponse response = baseWebClient.post()
                    .uri("/chat/completions")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + activeKey)
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, clientResponse -> {
                        return clientResponse.bodyToMono(String.class)
                                .flatMap(body -> Mono.error(new NimApiException(
                                        clientResponse.statusCode().value(), body)));
                    })
                    .bodyToMono(ChatCompletionResponse.class)
                    .timeout(Duration.ofMillis(config.getNvidia().getNim().getTimeoutMs()))
                    .block();

            log.debug("NIM response: model={}, tokens={}", model,
                    response != null && response.getUsage() != null ? response.getUsage().getTotalTokens() : "?");

            return response;

        } catch (NimApiException e) {
            // On 429 (rate limit), rotate key and retry immediately
            if (e.getStatusCode() == 429 && keyRotations < apiKeys.size()) {
                rotateKey("Rate limit 429 on " + KEY_LABELS[keyIdx % KEY_LABELS.length]);
                return chatCompletionWithRetry(model, messages, 0, keyRotations + 1);
            }

            if (attempt < retryConfig.getMaxRetries() &&
                retryConfig.getRetryableStatusCodes().contains(e.getStatusCode())) {
                long backoff = retryConfig.getBackoffBaseMs() * (long) Math.pow(2, attempt);
                log.warn("NIM API error (status={}, key={}), retrying in {}ms (attempt {}/{})",
                        e.getStatusCode(), KEY_LABELS[keyIdx % KEY_LABELS.length],
                        backoff, attempt + 1, retryConfig.getMaxRetries());
                sleep(backoff);
                return chatCompletionWithRetry(model, messages, attempt + 1, keyRotations);
            }

            // All retries exhausted on this key — try rotating
            if (keyRotations < apiKeys.size() - 1) {
                rotateKey("Exhausted retries on " + KEY_LABELS[keyIdx % KEY_LABELS.length]);
                return chatCompletionWithRetry(model, messages, 0, keyRotations + 1);
            }

            throw new RuntimeException("NIM API failed after " + attempt + " retries: " + e.getMessage(), e);

        } catch (Exception e) {
            if (attempt < retryConfig.getMaxRetries() && isRetryableException(e)) {
                long backoff = retryConfig.getBackoffBaseMs() * (long) Math.pow(2, attempt);
                log.warn("NIM request failed ({}, key={}), retrying in {}ms (attempt {}/{})",
                        e.getClass().getSimpleName(), KEY_LABELS[keyIdx % KEY_LABELS.length],
                        backoff, attempt + 1, retryConfig.getMaxRetries());
                sleep(backoff);
                return chatCompletionWithRetry(model, messages, attempt + 1, keyRotations);
            }

            // Try rotating key on persistent failures
            if (keyRotations < apiKeys.size() - 1) {
                rotateKey("Persistent failure on " + KEY_LABELS[keyIdx % KEY_LABELS.length]);
                return chatCompletionWithRetry(model, messages, 0, keyRotations + 1);
            }

            throw new RuntimeException("NIM API failed: " + e.getMessage(), e);
        }
    }

    private boolean isRetryableException(Exception e) {
        String msg = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
        return msg.contains("timeout") || msg.contains("connection") || msg.contains("reset")
                || e instanceof java.net.SocketTimeoutException
                || e instanceof java.net.ConnectException;
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
    }

    // ─── DTOs (OpenAI-compatible) ───────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatCompletionRequest {
        private String model;
        private List<ChatMessage> messages;
        @JsonProperty("max_tokens")
        private int maxTokens;
        private double temperature;
        private boolean stream;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatMessage {
        private String role; // "system", "user", "assistant"
        private String content;

        public static ChatMessage system(String content) {
            return new ChatMessage("system", content);
        }
        public static ChatMessage user(String content) {
            return new ChatMessage("user", content);
        }
        public static ChatMessage assistant(String content) {
            return new ChatMessage("assistant", content);
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatCompletionResponse {
        private String id;
        private String object;
        private List<Choice> choices;
        private Usage usage;

        public String getContent() {
            if (choices != null && !choices.isEmpty() && choices.get(0).getMessage() != null) {
                return choices.get(0).getMessage().getContent();
            }
            return "";
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        private int index;
        private ChatMessage message;
        @JsonProperty("finish_reason")
        private String finishReason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Usage {
        @JsonProperty("prompt_tokens")
        private int promptTokens;
        @JsonProperty("completion_tokens")
        private int completionTokens;
        @JsonProperty("total_tokens")
        private int totalTokens;
    }

    public static class NimApiException extends RuntimeException {
        private final int statusCode;
        public NimApiException(int statusCode, String body) {
            super("NIM API error " + statusCode + ": " + body);
            this.statusCode = statusCode;
        }
        public int getStatusCode() { return statusCode; }
    }
}
