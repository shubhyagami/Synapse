package com.synapse.council.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Persistent entity representing a full boardroom discussion session.
 * Uses JSON type for complex nested data (rounds, consensus).
 * Compatible with both H2 (dev) and PostgreSQL (prod).
 */
@Entity
@Table(name = "discussions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Discussion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String projectId;

    @Column(nullable = false, length = 10000)
    private String userPrompt;

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED, FAILED

    @Column(nullable = false)
    private int currentRound;

    @Column(nullable = false)
    private int totalRounds;

    /**
     * All round data stored as JSON text.
     * H2 stores as CLOB, PostgreSQL stores as jsonb.
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "CLOB")
    private List<Map<String, Object>> rounds;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "CLOB")
    private Map<String, Object> consensusReport;

    @Column(length = 100000)
    private String executiveSummary;

    @Column(nullable = false)
    private Instant createdAt;

    @Column
    private Instant completedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (rounds == null) {
            rounds = new ArrayList<>();
        }
        if (status == null) {
            status = "PENDING";
        }
        if (totalRounds == 0) {
            totalRounds = 4;
        }
    }
}
