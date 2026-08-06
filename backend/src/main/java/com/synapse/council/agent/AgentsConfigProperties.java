package com.synapse.council.agent;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Binds agents-config.yml into Spring-managed beans.
 * Hot-reloadable via @ConfigurationProperties.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "")
public class AgentsConfigProperties {

    private NvidiaConfig nvidia = new NvidiaConfig();
    private DiscussionConfig discussion = new DiscussionConfig();
    private List<AgentDefinition> agents = new ArrayList<>();

    @Data
    public static class NvidiaConfig {
        private NimConfig nim = new NimConfig();
    }

    @Data
    public static class NimConfig {
        private String baseUrl = "https://integrate.api.nvidia.com/v1";
        private String apiKey = "";
        private List<String> apiKeys = new ArrayList<>();
        private int timeoutMs = 45000;
        private int maxTokens = 1024;
        private double temperature = 0.7;
        private RateLimitConfig rateLimit = new RateLimitConfig();
        private RetryConfig retry = new RetryConfig();
    }

    @Data
    public static class RateLimitConfig {
        private int maxRequestsPerMinute = 38;
        private int requestsPerMinute = 38;
        private int batchSize = 3;
        private long batchDelayMs = 3000;

        public int getMaxRequestsPerMinute() {
            return requestsPerMinute > 0 ? requestsPerMinute : maxRequestsPerMinute;
        }
    }

    @Data
    public static class RetryConfig {
        private int maxRetries = 2;
        private long backoffBaseMs = 1000;
        private List<Integer> retryableStatusCodes = List.of(429, 500, 502, 503, 504);
    }

    @Data
    public static class DiscussionConfig {
        private int totalRounds = 4;
        private Map<Integer, String> roundNames = new HashMap<>();
    }

    @Data
    public static class AgentDefinition {
        private String id;
        private String name;
        private String role;
        private String model;
        private String avatar;
        private String color;
        private List<String> responsibilities = new ArrayList<>();
        private String systemPrompt;
    }
}
