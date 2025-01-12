package uk.co.willtuffin.uptimemonitor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import uk.co.willtuffin.uptimemonitor.entity.MonitorDefinition;
import uk.co.willtuffin.uptimemonitor.repository.UptimeDefinitionRepository;

@RestController
@RequestMapping("/api")
@Tag(name = "Uptime Monitor", description = "API for managing uptime monitors")
public class UptimeMonitorController {

    @Autowired
    private UptimeDefinitionRepository uptimeDefinitionRepository;

    @GetMapping("/uptime-monitor")
    @Operation(summary = "Get all uptime monitors", description = "Get all uptime monitors")
    public List<MonitorDefinition> getUptimeMonitorDefinitions() {
        return uptimeDefinitionRepository.findAll();
    }

    @PostMapping("/uptime-monitor")
    @Operation(summary = "Create a new uptime monitor", description = "Create a new uptime monitor")
    public MonitorDefinition createUptimeMonitorDefinition(@RequestBody MonitorDefinition monitorDefinition) {
        return uptimeDefinitionRepository.save(monitorDefinition);
    }

    @PutMapping("/uptime-monitor/{id}")
    @Operation(summary = "Update an existing uptime monitor", description = "Update an existing uptime monitor")
    public MonitorDefinition updateUptimeMonitorDefinition(@PathVariable Long id,
            @RequestBody MonitorDefinition monitorDefinition) {
        MonitorDefinition existingMonitorDefinition = uptimeDefinitionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MonitorDefinition not found"));
        existingMonitorDefinition.setName(monitorDefinition.getName());
        existingMonitorDefinition.setUrl(monitorDefinition.getUrl());
        existingMonitorDefinition.setFrequencyMinutes(monitorDefinition.getFrequencyMinutes());
        return uptimeDefinitionRepository.save(existingMonitorDefinition);
    }

    @DeleteMapping("/uptime-monitor/{id}")
    @Operation(summary = "Delete an existing uptime monitor", description = "Delete an existing uptime monitor")
    public void deleteUptimeMonitorDefinition(@PathVariable Long id) {
        uptimeDefinitionRepository.deleteById(id);
    }
}
