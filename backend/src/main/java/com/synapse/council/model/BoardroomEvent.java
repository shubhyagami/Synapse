package com.synapse.council.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Real-time event sent over WebSocket/SSE during a boardroom discussion.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardroomEvent {

    public enum EventType {
        DISCUSSION_STARTED,
        ROUND_STARTED,
        AGENT_STATUS,
        AGENT_TOKEN,
        AGENT_COMPLETE,
        AGENT_ERROR,
        ROUND_COMPLETE,
        CONSENSUS_UPDATE,
        DISCUSSION_COMPLETE
    }

    private EventType type;
    private String discussionId;
    private String agentId;
    private String agentName;
    private AgentStatus agentStatus;
    private int round;
    private String token;
    private String content;
    private Map<String, Object> data;
    private Instant timestamp;

    public static BoardroomEvent agentStatus(String discussionId, String agentId, String agentName, AgentStatus status, int round) {
        return BoardroomEvent.builder()
                .type(EventType.AGENT_STATUS)
                .discussionId(discussionId)
                .agentId(agentId)
                .agentName(agentName)
                .agentStatus(status)
                .round(round)
                .timestamp(Instant.now())
                .build();
    }

    public static BoardroomEvent agentToken(String discussionId, String agentId, String agentName, String token, int round) {
        return BoardroomEvent.builder()
                .type(EventType.AGENT_TOKEN)
                .discussionId(discussionId)
                .agentId(agentId)
                .agentName(agentName)
                .token(token)
                .round(round)
                .timestamp(Instant.now())
                .build();
    }

    public static BoardroomEvent agentComplete(String discussionId, String agentId, String agentName, String content, int round) {
        return BoardroomEvent.builder()
                .type(EventType.AGENT_COMPLETE)
                .discussionId(discussionId)
                .agentId(agentId)
                .agentName(agentName)
                .content(content)
                .round(round)
                .timestamp(Instant.now())
                .build();
    }

    public static BoardroomEvent roundComplete(String discussionId, int round) {
        return BoardroomEvent.builder()
                .type(EventType.ROUND_COMPLETE)
                .discussionId(discussionId)
                .round(round)
                .timestamp(Instant.now())
                .build();
    }

    public static BoardroomEvent discussionComplete(String discussionId, Map<String, Object> consensus) {
        return BoardroomEvent.builder()
                .type(EventType.DISCUSSION_COMPLETE)
                .discussionId(discussionId)
                .data(consensus)
                .timestamp(Instant.now())
                .build();
    }
}
