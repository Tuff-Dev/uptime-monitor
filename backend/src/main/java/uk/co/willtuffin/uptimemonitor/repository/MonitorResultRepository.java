package uk.co.willtuffin.uptimemonitor.repository;

import java.util.List;
import java.time.LocalDateTime;
import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.co.willtuffin.uptimemonitor.entity.MonitorResult;

public interface MonitorResultRepository extends JpaRepository<MonitorResult, Long> {
    List<MonitorResult> findByMonitorDefinitionIdOrderByCheckTimeDesc(Long monitorDefinitionId);

    void deleteByMonitorDefinitionId(Long monitorDefinitionId);

    List<MonitorResult> findByMonitorDefinitionIdAndCheckTimeBetweenOrderByCheckTimeDesc(
            Long monitorDefinitionId,
            Instant startDate,
            Instant endDate);
}
