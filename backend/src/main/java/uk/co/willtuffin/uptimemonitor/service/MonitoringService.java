package uk.co.willtuffin.uptimemonitor.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PreDestroy;
import uk.co.willtuffin.uptimemonitor.entity.MonitorDefinition;
import uk.co.willtuffin.uptimemonitor.entity.MonitorResult;
import uk.co.willtuffin.uptimemonitor.repository.MonitorResultRepository;
import uk.co.willtuffin.uptimemonitor.repository.UptimeDefinitionRepository;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MonitoringService {
    private final UptimeDefinitionRepository definitionRepository;
    private final MonitorResultRepository resultRepository;
    private final Map<Long, ScheduledFuture<?>> monitorTasks = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(
            Runtime.getRuntime().availableProcessors());

    @Scheduled(fixedRate = 60000) // Run every minute to check for updates
    public void updateMonitoringTasks() {
        List<MonitorDefinition> definitions = definitionRepository.findAll();

        // Remove monitors that no longer exist
        monitorTasks.keySet().removeIf(id -> {
            if (definitions.stream().noneMatch(def -> def.getId().equals(id))) {
                stopMonitoring(id);
                return true;
            }
            return false;
        });

        // Start or update monitors
        definitions.forEach(this::startOrUpdateMonitoring);
    }

    private void startOrUpdateMonitoring(MonitorDefinition definition) {
        ScheduledFuture<?> existingTask = monitorTasks.get(definition.getId());

        // If the task exists, check if frequency has changed
        if (existingTask != null) {
            // Cannot directly check the period of existing task, so we'll rely on the
            // definition
            MonitorDefinition existingDef = definitionRepository.findById(definition.getId()).orElse(null);
            if (existingDef != null && existingDef.getFrequencyMinutes().equals(definition.getFrequencyMinutes())) {
                return; // No change needed
            }
            stopMonitoring(definition.getId());
        }

        // Schedule new task
        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(
                () -> checkEndpoint(definition),
                0,
                definition.getFrequencyMinutes(),
                TimeUnit.MINUTES);

        monitorTasks.put(definition.getId(), future);
        log.info("Started/Updated monitoring for: {} with frequency {} minutes",
                definition.getName(), definition.getFrequencyMinutes());
    }

    public void stopMonitoring(Long definitionId) {
        ScheduledFuture<?> task = monitorTasks.remove(definitionId);
        if (task != null) {
            task.cancel(false);
            log.info("Stopped monitoring for definition ID: {}", definitionId);
        }
    }

    private void checkEndpoint(MonitorDefinition definition) {
        MonitorResult result = new MonitorResult();
        result.setMonitorDefinition(definition);
        result.setCheckTime(Instant.now());

        try {
            long startTime = System.currentTimeMillis();
            HttpURLConnection connection = (HttpURLConnection) URI.create(definition.getUrl()).toURL().openConnection();
            connection.setRequestMethod("HEAD");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);

            int responseCode = connection.getResponseCode();
            long endTime = System.currentTimeMillis();

            result.setSuccessful(responseCode >= 200 && responseCode < 400);
            result.setResponseTimeMs((int) (endTime - startTime));

        } catch (IOException e) {
            result.setSuccessful(false);
            result.setErrorMessage(e.getMessage());
            log.error("Error checking endpoint {}: {}", definition.getUrl(), e.getMessage());
        }

        resultRepository.save(result);
    }

    // Add shutdown hook to clean up resources
    @PreDestroy
    public void shutdown() {
        monitorTasks.values().forEach(task -> task.cancel(false));
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(60, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
}