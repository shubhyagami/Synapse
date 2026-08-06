package com.synapse.council.service;

import com.synapse.council.agent.AgentRegistry;
import com.synapse.council.agent.AgentsConfigProperties;
import com.synapse.council.agent.NvidiaAgent;
import com.synapse.council.model.AgentResponse;
import com.synapse.council.model.BoardroomEvent;
import com.synapse.council.model.Discussion;
import com.synapse.council.repository.DiscussionRepository;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Orchestrates the 4-round boardroom discussion.
 * 
 * Rate Limit Strategy (40 RPM cap, using 38 RPM):
 * - 10 agents processed in batches of 3-4
 * - ~5s delay between batches within a round
 * - Each round processes all agents before next round starts
 * - Total: 10 agents × 4 rounds + 1 CEO summary = 41 calls
 * - At 38 RPM we need ~65s minimum, plus processing time
 */
@Slf4j
@Service
public class DiscussionEngine {

    private final AgentRegistry agentRegistry;
    private final AgentsConfigProperties config;
    private final DiscussionRepository discussionRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ExecutorService executor = Executors.newFixedThreadPool(4);

    public DiscussionEngine(
            AgentRegistry agentRegistry,
            AgentsConfigProperties config,
            DiscussionRepository discussionRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.agentRegistry = agentRegistry;
        this.config = config;
        this.discussionRepository = discussionRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Start a full boardroom discussion asynchronously.
     */
    @Async("agentExecutor")
    public CompletableFuture<Discussion> startDiscussion(String userPrompt, String projectId) {
        log.info("═══ BOARDROOM SESSION STARTED ═══");
        log.info("Prompt: {}", userPrompt);
        log.info("Agents: {}", agentRegistry.size());

        // Create discussion entity
        Discussion discussion = Discussion.builder()
                .projectId(projectId != null ? projectId : "default")
                .userPrompt(userPrompt)
                .status("IN_PROGRESS")
                .currentRound(0)
                .totalRounds(4)
                .rounds(new ArrayList<>())
                .build();
        discussion = discussionRepository.save(discussion);
        String discussionId = discussion.getId().toString();

        // Broadcast: discussion started
        broadcast(BoardroomEvent.builder()
                .type(BoardroomEvent.EventType.DISCUSSION_STARTED)
                .discussionId(discussionId)
                .timestamp(Instant.now())
                .build());

        // Reset all agents
        agentRegistry.getAgents().values().forEach(NvidiaAgent::resetConversation);

        // Store all rounds' responses for cross-referencing
        Map<Integer, Map<String, String>> allRounds = new LinkedHashMap<>();

        try {
            // ─── ROUND 1: Independent Thinking ────────
            Map<String, String> round1 = executeRound(discussionId, userPrompt, 1, allRounds);
            allRounds.put(1, round1);
            saveRound(discussion, 1, "Independent Thinking", round1);

            // ─── ROUND 2: Cross-Review ────────────────
            Map<String, String> round2 = executeRound(discussionId, userPrompt, 2, allRounds);
            allRounds.put(2, round2);
            saveRound(discussion, 2, "Cross-Review", round2);

            // ─── ROUND 3: Critique & Debate ───────────
            Map<String, String> round3 = executeRound(discussionId, userPrompt, 3, allRounds);
            allRounds.put(3, round3);
            saveRound(discussion, 3, "Critique & Debate", round3);

            // ─── ROUND 4: Improvement & Consensus ─────
            Map<String, String> round4 = executeRound(discussionId, userPrompt, 4, allRounds);
            allRounds.put(4, round4);
            saveRound(discussion, 4, "Improvement & Consensus", round4);

            // ─── CEO SUMMARY ──────────────────────────
            log.info("═══ CEO SYNTHESIZING EXECUTIVE SUMMARY ═══");
            NvidiaAgent ceo = agentRegistry.getCeo();
            
            broadcastAgentStatus(discussionId, ceo, "SUMMARIZING", 5);
            AgentResponse summary = ceo.summarize(userPrompt, allRounds);
            broadcastAgentComplete(discussionId, ceo, summary, 5);

            discussion.setExecutiveSummary(summary.getContent());

            // ─── BUILD CONSENSUS REPORT ───────────────
            Map<String, Object> consensusReport = buildConsensusReport(allRounds);
            discussion.setConsensusReport(consensusReport);
            discussion.setStatus("COMPLETED");
            discussion.setCompletedAt(Instant.now());
            discussion = discussionRepository.save(discussion);

            // Broadcast: complete
            broadcast(BoardroomEvent.discussionComplete(discussionId, consensusReport));

            log.info("═══ BOARDROOM SESSION COMPLETE ═══");
            log.info("Discussion ID: {}", discussionId);

            return CompletableFuture.completedFuture(discussion);

        } catch (Exception e) {
            log.error("Discussion FAILED: {}", e.getMessage(), e);
            discussion.setStatus("FAILED");
            discussionRepository.save(discussion);
            return CompletableFuture.failedFuture(e);
        }
    }

    /**
     * Execute a single round across all agents with rate-limited batching.
     */
    private Map<String, String> executeRound(
            String discussionId, String userPrompt, int round,
            Map<Integer, Map<String, String>> previousRounds) {

        String roundName = config.getDiscussion().getRoundNames().getOrDefault(round, "Round " + round);
        log.info("─── ROUND {}: {} ───", round, roundName);

        // Broadcast round start
        broadcast(BoardroomEvent.builder()
                .type(BoardroomEvent.EventType.ROUND_STARTED)
                .discussionId(discussionId)
                .round(round)
                .data(Map.of("name", roundName))
                .timestamp(Instant.now())
                .build());

        Map<String, NvidiaAgent> agents = agentRegistry.getAgents();
        Map<String, String> roundResponses = new ConcurrentHashMap<>();
        int batchSize = config.getNvidia().getNim().getRateLimit().getBatchSize();
        long batchDelay = config.getNvidia().getNim().getRateLimit().getBatchDelayMs();

        // Split agents into batches
        List<List<Map.Entry<String, NvidiaAgent>>> batches = new ArrayList<>();
        List<Map.Entry<String, NvidiaAgent>> entries = new ArrayList<>(agents.entrySet());
        for (int i = 0; i < entries.size(); i += batchSize) {
            batches.add(entries.subList(i, Math.min(i + batchSize, entries.size())));
        }

        // Process each batch sequentially, agents within batch in parallel
        for (int batchIdx = 0; batchIdx < batches.size(); batchIdx++) {
            List<Map.Entry<String, NvidiaAgent>> batch = batches.get(batchIdx);
            
            log.info("  Batch {}/{}: {} agents", batchIdx + 1, batches.size(), 
                    batch.stream().map(e -> e.getValue().getName()).collect(Collectors.joining(", ")));

            // Process agents within batch — sequential to manage rate limit
            for (var entry : batch) {
                NvidiaAgent agent = entry.getValue();
                
                try {
                    broadcastAgentStatus(discussionId, agent, agent.getStatus().name(), round);

                    AgentResponse response = switch (round) {
                        case 1 -> agent.think(userPrompt);
                        case 2 -> agent.review(userPrompt, previousRounds.getOrDefault(1, Map.of()));
                        case 3 -> agent.criticize(userPrompt, previousRounds.getOrDefault(2, Map.of()));
                        case 4 -> agent.improve(userPrompt, previousRounds.getOrDefault(3, Map.of()));
                        default -> throw new IllegalStateException("Unknown round: " + round);
                    };

                    roundResponses.put(agent.getRole(), response.getContent());
                    broadcastAgentComplete(discussionId, agent, response, round);
                    
                } catch (Exception e) {
                    log.error("  [{}] FAILED in round {}: {}", agent.getName(), round, e.getMessage());
                    roundResponses.put(agent.getRole(), "⚠️ " + agent.getName() + " unavailable: " + e.getMessage());
                    broadcastAgentError(discussionId, agent, e.getMessage(), round);
                }
            }

            // Delay between batches (except last)
            if (batchIdx < batches.size() - 1) {
                log.info("  Rate limit pause: {}ms before next batch", batchDelay);
                sleep(batchDelay);
            }
        }

        // Broadcast round complete
        broadcast(BoardroomEvent.roundComplete(discussionId, round));
        log.info("─── ROUND {} COMPLETE ({} responses) ───", round, roundResponses.size());

        return roundResponses;
    }

    /**
     * Build a consensus report from all rounds.
     */
    private Map<String, Object> buildConsensusReport(Map<Integer, Map<String, String>> allRounds) {
        Map<String, Object> report = new LinkedHashMap<>();
        
        // Count total responses
        int totalResponses = allRounds.values().stream()
                .mapToInt(Map::size).sum();
        int successfulResponses = allRounds.values().stream()
                .flatMap(m -> m.values().stream())
                .filter(v -> !v.startsWith("⚠️"))
                .mapToInt(v -> 1).sum();

        report.put("totalResponses", totalResponses);
        report.put("successfulResponses", successfulResponses);
        report.put("successRate", totalResponses > 0 ? (double) successfulResponses / totalResponses : 0);
        report.put("rounds", allRounds.size());
        report.put("agentCount", agentRegistry.size());
        report.put("completedAt", Instant.now().toString());

        // Extract confidence scores from Round 4 (agents report confidence in final positions)
        Map<String, Object> confidences = new LinkedHashMap<>();
        Map<String, String> round4 = allRounds.getOrDefault(4, Map.of());
        for (var entry : round4.entrySet()) {
            double confidence = extractConfidenceFromText(entry.getValue());
            confidences.put(entry.getKey(), confidence);
        }
        report.put("agentConfidences", confidences);

        // Average confidence
        double avgConfidence = confidences.values().stream()
                .mapToDouble(v -> (double) v)
                .average().orElse(0.75);
        report.put("overallConfidence", Math.round(avgConfidence * 100) + "%");

        return report;
    }

    private double extractConfidenceFromText(String text) {
        try {
            var matcher = java.util.regex.Pattern
                    .compile("(\\d{1,3})\\s*%")
                    .matcher(text);
            double lastFound = 0.75;
            while (matcher.find()) {
                double val = Double.parseDouble(matcher.group(1)) / 100.0;
                if (val > 0 && val <= 1) lastFound = val;
            }
            return lastFound;
        } catch (Exception e) {
            return 0.75;
        }
    }

    private void saveRound(Discussion discussion, int round, String name, Map<String, String> responses) {
        Map<String, Object> roundData = new LinkedHashMap<>();
        roundData.put("round", round);
        roundData.put("name", name);
        roundData.put("responses", responses);
        roundData.put("timestamp", Instant.now().toString());
        roundData.put("agentCount", responses.size());
        discussion.getRounds().add(roundData);
        discussion.setCurrentRound(round);
        discussionRepository.save(discussion);
    }

    // ─── WebSocket Broadcasting ──────────────────────────

    private void broadcast(BoardroomEvent event) {
        messagingTemplate.convertAndSend("/topic/boardroom", event);
    }

    private void broadcastAgentStatus(String discussionId, NvidiaAgent agent, String status, int round) {
        broadcast(BoardroomEvent.agentStatus(discussionId, agent.getId(), agent.getName(),
                agent.getStatus(), round));
    }

    private void broadcastAgentComplete(String discussionId, NvidiaAgent agent, AgentResponse response, int round) {
        broadcast(BoardroomEvent.agentComplete(discussionId, agent.getId(), agent.getName(),
                response.getContent(), round));
    }

    private void broadcastAgentError(String discussionId, NvidiaAgent agent, String error, int round) {
        broadcast(BoardroomEvent.builder()
                .type(BoardroomEvent.EventType.AGENT_ERROR)
                .discussionId(discussionId)
                .agentId(agent.getId())
                .agentName(agent.getName())
                .content(error)
                .round(round)
                .timestamp(Instant.now())
                .build());
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}
