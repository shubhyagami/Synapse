package com.synapse.council.agent;

import com.synapse.council.model.AgentResponse;
import com.synapse.council.model.AgentStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Base AI agent abstraction. Each agent wraps the NVIDIA NIM client
 * with its own system prompt, conversation history, and status tracking.
 */
@Slf4j
@Getter
public class NvidiaAgent {

    private final String id;
    private final String name;
    private final String role;
    private final String model;
    private final String avatar;
    private final String color;
    private final List<String> responsibilities;
    private final String systemPrompt;
    private final NvidiaApiClient nimClient;

    @Setter
    private AgentStatus status = AgentStatus.IDLE;
    private int retryCount = 0;
    private long lastLatencyMs = 0;
    private int lastTokenCount = 0;

    // Conversation history for this agent within a discussion
    private final List<NvidiaApiClient.ChatMessage> conversationHistory = new ArrayList<>();

    public NvidiaAgent(AgentsConfigProperties.AgentDefinition def, NvidiaApiClient nimClient) {
        this.id = def.getId();
        this.name = def.getName();
        this.role = def.getRole();
        this.model = def.getModel();
        this.avatar = def.getAvatar();
        this.color = def.getColor();
        this.responsibilities = def.getResponsibilities();
        this.systemPrompt = def.getSystemPrompt();
        this.nimClient = nimClient;
    }

    /**
     * Reset conversation for a new discussion.
     */
    public void resetConversation() {
        conversationHistory.clear();
        status = AgentStatus.IDLE;
        retryCount = 0;
    }

    /**
     * Round 1: Independent thinking — analyze the user's request.
     */
    public AgentResponse think(String userPrompt) {
        status = AgentStatus.THINKING;
        String prompt = String.format(
            "The user has asked the boardroom: \"%s\"\n\n" +
            "As %s (%s), provide your independent analysis and proposal. " +
            "Focus on your area of expertise: %s.\n" +
            "Be specific, actionable, and concise.",
            userPrompt, name, role, String.join(", ", responsibilities)
        );
        return callNim(prompt, 1);
    }

    /**
     * Round 2: Cross-review — read and respond to all other agents' proposals.
     */
    public AgentResponse review(String userPrompt, Map<String, String> otherResponses) {
        status = AgentStatus.REVIEWING;
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Original request: \"%s\"\n\n", userPrompt));
        sb.append("=== OTHER BOARD MEMBERS' PROPOSALS ===\n\n");
        otherResponses.forEach((agentRole, response) -> {
            sb.append(String.format("[%s]: %s\n\n", agentRole, response));
        });
        sb.append(String.format(
            "As %s (%s), review these proposals from your perspective. " +
            "Identify strengths, gaps, and areas of concern from your expertise in %s. " +
            "DO NOT blindly agree. Challenge assumptions. Suggest improvements.",
            name, role, String.join(", ", responsibilities)
        ));
        return callNim(sb.toString(), 2);
    }

    /**
     * Round 3: Critique — challenge assumptions, identify risks.
     */
    public AgentResponse criticize(String userPrompt, Map<String, String> reviews) {
        status = AgentStatus.CRITIQUING;
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Original request: \"%s\"\n\n", userPrompt));
        sb.append("=== ROUND 2 REVIEWS FROM BOARD ===\n\n");
        reviews.forEach((agentRole, review) -> {
            sb.append(String.format("[%s]: %s\n\n", agentRole, review));
        });
        sb.append(String.format(
            "As %s (%s), now CRITIQUE the discussion so far. " +
            "Identify risks, tradeoffs, and potential failures. " +
            "Challenge optimistic assumptions. Provide evidence for concerns. " +
            "Rate your confidence (0-100%%) in the emerging consensus.",
            name, role
        ));
        return callNim(sb.toString(), 3);
    }

    /**
     * Round 4: Improve — incorporate critiques and provide final position.
     */
    public AgentResponse improve(String userPrompt, Map<String, String> critiques) {
        status = AgentStatus.IMPROVING;
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Original request: \"%s\"\n\n", userPrompt));
        sb.append("=== ROUND 3 CRITIQUES ===\n\n");
        critiques.forEach((agentRole, critique) -> {
            sb.append(String.format("[%s]: %s\n\n", agentRole, critique));
        });
        sb.append(String.format(
            "As %s (%s), provide your FINAL improved position. " +
            "Incorporate valid critiques. Defend your position where warranted. " +
            "State your final recommendation clearly. " +
            "Rate your confidence (0-100%%) in this final position.",
            name, role
        ));
        return callNim(sb.toString(), 4);
    }

    /**
     * CEO only: Synthesize everything into an executive summary.
     */
    public AgentResponse summarize(String userPrompt, Map<Integer, Map<String, String>> allRounds) {
        status = AgentStatus.SUMMARIZING;
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Original request: \"%s\"\n\n", userPrompt));
        sb.append("=== COMPLETE BOARDROOM DISCUSSION ===\n\n");
        
        allRounds.forEach((round, responses) -> {
            String roundName = switch (round) {
                case 1 -> "ROUND 1 — Independent Thinking";
                case 2 -> "ROUND 2 — Cross-Review";
                case 3 -> "ROUND 3 — Critique & Debate";
                case 4 -> "ROUND 4 — Improvement & Consensus";
                default -> "ROUND " + round;
            };
            sb.append(String.format("### %s ###\n\n", roundName));
            responses.forEach((agentRole, response) -> {
                sb.append(String.format("[%s]: %s\n\n", agentRole, response));
            });
        });

        sb.append(
            "As CEO, synthesize EVERYTHING above into a comprehensive executive summary.\n" +
            "Structure your response as:\n\n" +
            "## Executive Summary\n" +
            "Brief overview of the decision\n\n" +
            "## Consensus & Key Decisions\n" +
            "What the board agreed on\n\n" +
            "## Architecture & Approach\n" +
            "Technical direction\n\n" +
            "## Implementation Roadmap\n" +
            "Phased plan with timeline\n\n" +
            "## Risks & Mitigations\n" +
            "Top risks identified\n\n" +
            "## Estimated Cost\n" +
            "Rough cost breakdown\n\n" +
            "## Action Items\n" +
            "Immediate next steps\n\n" +
            "## Minority Opinions\n" +
            "Any dissenting views worth noting\n\n" +
            "## Confidence Score\n" +
            "Overall board confidence (0-100%)"
        );
        return callNim(sb.toString(), 5);
    }

    /**
     * Core NIM call with conversation history management.
     */
    private AgentResponse callNim(String userMessage, int round) {
        long start = System.currentTimeMillis();
        
        try {
            // Build messages: system prompt + conversation history + new message
            List<NvidiaApiClient.ChatMessage> messages = new ArrayList<>();
            messages.add(NvidiaApiClient.ChatMessage.system(systemPrompt));
            messages.addAll(conversationHistory);
            messages.add(NvidiaApiClient.ChatMessage.user(userMessage));

            // Call NVIDIA NIM
            NvidiaApiClient.ChatCompletionResponse response = nimClient.chatCompletion(model, messages);

            long latency = System.currentTimeMillis() - start;
            this.lastLatencyMs = latency;
            this.lastTokenCount = response.getUsage() != null ? response.getUsage().getTotalTokens() : 0;

            String content = response.getContent();

            // Add to conversation history (keep last 2 exchanges to manage context window)
            conversationHistory.add(NvidiaApiClient.ChatMessage.user(userMessage));
            conversationHistory.add(NvidiaApiClient.ChatMessage.assistant(content));
            if (conversationHistory.size() > 4) {
                conversationHistory.subList(0, 2).clear();
            }

            status = AgentStatus.COMPLETE;

            log.info("[{}] Round {} complete: {}ms, {} tokens", name, round, latency, lastTokenCount);

            return AgentResponse.builder()
                    .agentId(id)
                    .agentName(name)
                    .agentRole(role)
                    .model(model)
                    .round(round)
                    .content(content)
                    .confidence(extractConfidence(content))
                    .latencyMs(latency)
                    .tokenCount(lastTokenCount)
                    .retryCount(retryCount)
                    .status(AgentStatus.COMPLETE)
                    .timestamp(Instant.now())
                    .build();

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - start;
            this.lastLatencyMs = latency;
            status = AgentStatus.ERROR;
            retryCount++;

            log.error("[{}] Round {} FAILED: {} ({}ms)", name, round, e.getMessage(), latency);

            return AgentResponse.builder()
                    .agentId(id)
                    .agentName(name)
                    .agentRole(role)
                    .model(model)
                    .round(round)
                    .content("⚠️ " + name + " encountered an error: " + e.getMessage())
                    .confidence(0)
                    .latencyMs(latency)
                    .tokenCount(0)
                    .retryCount(retryCount)
                    .status(AgentStatus.ERROR)
                    .timestamp(Instant.now())
                    .build();
        }
    }

    /**
     * Extract confidence percentage from agent's response text.
     */
    private double extractConfidence(String content) {
        try {
            // Look for patterns like "confidence: 85%" or "85% confident"
            var matcher = java.util.regex.Pattern
                    .compile("(?:confidence[:\\s]+|)(\\d{1,3})\\s*%")
                    .matcher(content.toLowerCase());
            if (matcher.find()) {
                return Double.parseDouble(matcher.group(1)) / 100.0;
            }
        } catch (Exception ignored) {}
        return 0.75; // Default confidence
    }
}
