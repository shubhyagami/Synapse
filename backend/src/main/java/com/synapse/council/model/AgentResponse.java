package com.synapse.council.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

/**
 * Represents a single response from an AI agent during a discussion round.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {

    private String agentId;
    private String agentName;
    private String agentRole;
    private String model;
    private int round;
    private String content;
    private double confidence;
    private long latencyMs;
    private int tokenCount;
    private int retryCount;
    private AgentStatus status;
    private Instant timestamp;
    private Map<String, Object> metadata;
}
