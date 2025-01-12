package uk.co.willtuffin.uptimemonitor.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Entity
@Table(name = "monitor_result")
@Getter
@Setter
public class MonitorResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "monitor_definition_id", nullable = false)
    private MonitorDefinition monitorDefinition;

    @Column(nullable = false)
    private Instant checkTime;

    @Column(nullable = false)
    private boolean successful;

    @Column
    private Integer responseTimeMs;

    @Column
    private String errorMessage;
}