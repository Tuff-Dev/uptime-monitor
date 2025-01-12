package uk.co.willtuffin.uptimemonitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uk.co.willtuffin.uptimemonitor.entity.MonitorDefinition;

public interface UptimeDefinitionRepository extends JpaRepository<MonitorDefinition, Long> {

}
