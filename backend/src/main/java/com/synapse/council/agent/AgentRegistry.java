package com.synapse.council.agent;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Registry of all AI agents. Instantiates agents from YAML config
 * and provides lookup by ID.
 */
@Slf4j
@Component
@Getter
public class AgentRegistry {

    private final AgentsConfigProperties config;
    private final NvidiaApiClient nimClient;
    private final Map<String, NvidiaAgent> agents = new LinkedHashMap<>();

    public AgentRegistry(AgentsConfigProperties config, NvidiaApiClient nimClient) {
        this.config = config;
        this.nimClient = nimClient;
    }

    @PostConstruct
    public void initialize() {
        if (config.getAgents() == null || config.getAgents().isEmpty()) {
            log.warn("No agents configured in agents-config.yml!");
            return;
        }

        for (var def : config.getAgents()) {
            NvidiaAgent agent = new NvidiaAgent(def, nimClient);
            agents.put(def.getId(), agent);
            log.info("Registered agent: {} ({}) → model: {}", def.getName(), def.getRole(), def.getModel());
        }

        log.info("Agent registry initialized: {} agents", agents.size());
    }

    public NvidiaAgent getAgent(String id) {
        return agents.get(id);
    }

    public NvidiaAgent getCeo() {
        return agents.get("ceo");
    }

    public int size() {
        return agents.size();
    }
}
