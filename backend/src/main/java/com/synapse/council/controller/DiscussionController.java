package com.synapse.council.controller;

import com.synapse.council.agent.AgentRegistry;
import com.synapse.council.agent.NvidiaAgent;
import com.synapse.council.model.Discussion;
import com.synapse.council.repository.DiscussionRepository;
import com.synapse.council.service.DiscussionEngine;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * REST API for boardroom discussions.
 */
@RestController
@RequestMapping("/api/discussions")
public class DiscussionController {

    private final DiscussionEngine discussionEngine;
    private final DiscussionRepository discussionRepository;
    private final AgentRegistry agentRegistry;

    // Track active discussions
    private final Map<String, CompletableFuture<Discussion>> activeDiscussions = new HashMap<>();

    public DiscussionController(DiscussionEngine discussionEngine,
                                 DiscussionRepository discussionRepository,
                                 AgentRegistry agentRegistry) {
        this.discussionEngine = discussionEngine;
        this.discussionRepository = discussionRepository;
        this.agentRegistry = agentRegistry;
    }

    /**
     * Start a new boardroom discussion.
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> startDiscussion(@RequestBody StartDiscussionRequest request) {
        if (request.getPrompt() == null || request.getPrompt().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Prompt is required"));
        }

        // Start async discussion
        CompletableFuture<Discussion> future = discussionEngine.startDiscussion(
                request.getPrompt(), request.getProjectId());

        // We can't get the discussion ID immediately since it's async,
        // but we return confirmation that it started
        return ResponseEntity.accepted().body(Map.of(
                "status", "STARTED",
                "message", "Boardroom discussion started. Connect to WebSocket /ws/boardroom for live updates.",
                "prompt", request.getPrompt(),
                "agents", agentRegistry.size()
        ));
    }

    /**
     * Get all discussions.
     */
    @GetMapping
    public ResponseEntity<List<Discussion>> getAllDiscussions() {
        return ResponseEntity.ok(discussionRepository.findAllByOrderByCreatedAtDesc());
    }

    /**
     * Get a specific discussion by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Discussion> getDiscussion(@PathVariable UUID id) {
        return discussionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get consensus report for a discussion.
     */
    @GetMapping("/{id}/consensus")
    public ResponseEntity<Map<String, Object>> getConsensus(@PathVariable UUID id) {
        return discussionRepository.findById(id)
                .map(d -> ResponseEntity.ok(d.getConsensusReport() != null ? d.getConsensusReport() : Map.<String, Object>of()))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a discussion by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscussion(@PathVariable UUID id) {
        if (discussionRepository.existsById(id)) {
            discussionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get all registered agents and their current status.
     */
    @GetMapping("/agents")
    public ResponseEntity<List<Map<String, Object>>> getAgents() {
        List<Map<String, Object>> agentList = agentRegistry.getAgents().values().stream()
                .map(agent -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", agent.getId());
                    map.put("name", agent.getName());
                    map.put("role", agent.getRole());
                    map.put("model", agent.getModel());
                    map.put("avatar", agent.getAvatar());
                    map.put("color", agent.getColor());
                    map.put("responsibilities", agent.getResponsibilities());
                    map.put("status", agent.getStatus().name());
                    map.put("latencyMs", agent.getLastLatencyMs());
                    map.put("tokenCount", agent.getLastTokenCount());
                    map.put("retryCount", agent.getRetryCount());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(agentList);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StartDiscussionRequest {
        private String prompt;
        private String projectId;
    }
}
