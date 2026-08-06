package com.synapse.council.model;

/**
 * Agent lifecycle status during boardroom discussions.
 */
public enum AgentStatus {
    IDLE("Idle"),
    THINKING("Thinking"),
    REVIEWING("Reviewing"),
    CRITIQUING("Critiquing"),
    IMPROVING("Improving"),
    SUMMARIZING("Summarizing"),
    STREAMING("Streaming"),
    COMPLETE("Complete"),
    UNAVAILABLE("Unavailable"),
    ERROR("Error");

    private final String displayName;

    AgentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
