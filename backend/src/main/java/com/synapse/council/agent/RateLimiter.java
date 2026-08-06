package com.synapse.council.agent;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.concurrent.Semaphore;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Sliding-window rate limiter for NVIDIA NIM API calls.
 * Enforces max RPM by using a semaphore that refills permits every minute.
 * 
 * Design for 40 RPM limit:
 * - We use 38 RPM as our cap (2 below hard limit for safety)
 * - Semaphore blocks callers when permits are exhausted
 * - Permits refill every 60 seconds
 * - Additional per-batch delay to spread calls evenly
 */
@Slf4j
@Component
public class RateLimiter {

    private final Semaphore permits;
    private final int maxPermits;
    private final AtomicInteger requestsThisWindow = new AtomicInteger(0);
    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public RateLimiter(AgentsConfigProperties config) {
        int rpm = 38;
        if (config != null && config.getNvidia() != null && config.getNvidia().getNim() != null 
                && config.getNvidia().getNim().getRateLimit() != null) {
            rpm = config.getNvidia().getNim().getRateLimit().getMaxRequestsPerMinute();
        }
        this.maxPermits = rpm > 0 ? rpm : 38;
        this.permits = new Semaphore(maxPermits);
        
        // Refill permits every 60 seconds
        scheduler.scheduleAtFixedRate(() -> {
            int used = maxPermits - permits.availablePermits();
            if (used > 0) {
                permits.release(used);
                log.debug("Rate limiter refilled {} permits. Available: {}", used, permits.availablePermits());
            }
            requestsThisWindow.set(0);
        }, 60, 60, TimeUnit.SECONDS);

        log.info("Rate limiter initialized: {} requests/minute", maxPermits);
    }

    /**
     * Acquire a permit before making an API call.
     * Blocks if rate limit is reached until permit refills.
     */
    public void acquire() {
        try {
            permits.acquire();
            int count = requestsThisWindow.incrementAndGet();
            log.debug("Rate limit permit acquired ({}/{} in window)", count, maxPermits);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted while waiting for rate limit permit", e);
        }
    }

    public int getAvailablePermits() {
        return permits.availablePermits();
    }
}
