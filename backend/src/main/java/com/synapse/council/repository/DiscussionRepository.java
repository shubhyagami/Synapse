package com.synapse.council.repository;

import com.synapse.council.model.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for Discussion persistence.
 */
@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, UUID> {

    List<Discussion> findByProjectIdOrderByCreatedAtDesc(String projectId);

    List<Discussion> findByStatusOrderByCreatedAtDesc(String status);

    List<Discussion> findAllByOrderByCreatedAtDesc();
}
