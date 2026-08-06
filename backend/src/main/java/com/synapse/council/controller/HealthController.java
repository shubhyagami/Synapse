package com.synapse.council.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Health check and system status endpoint.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    private static final Instant STARTUP_TIME = Instant.now();

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "synapse-council",
                "version", "1.0.0-SNAPSHOT",
                "timestamp", Instant.now().toString(),
                "uptime", java.time.Duration.between(STARTUP_TIME, Instant.now()).toSeconds() + "s"
        ));
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        return ResponseEntity.ok(Map.of(
                "name", "Synapse Council",
                "description", "Multi-Agent AI Boardroom Platform",
                "version", "1.0.0-SNAPSHOT",
                "agents", 10,
                "provider", "NVIDIA NIM"
        ));
    }
}
