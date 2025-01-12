package uk.co.willtuffin.uptimemonitor.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import uk.co.willtuffin.uptimemonitor.entity.MonitorDefinition;
import uk.co.willtuffin.uptimemonitor.entity.MonitorResult;
import uk.co.willtuffin.uptimemonitor.repository.UptimeDefinitionRepository;
import uk.co.willtuffin.uptimemonitor.repository.MonitorResultRepository;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UptimeMonitorControllerTest {

    @Mock
    private UptimeDefinitionRepository uptimeDefinitionRepository;

    @Mock
    private MonitorResultRepository resultRepository;

    @InjectMocks
    private UptimeMonitorController controller;

    private MonitorDefinition testMonitorDefinition;
    private MonitorResult testMonitorResult;

    @BeforeEach
    void setUp() {
        testMonitorDefinition = new MonitorDefinition();
        testMonitorDefinition.setId(1L);
        testMonitorDefinition.setName("Test Monitor");
        testMonitorDefinition.setUrl("http://test.com");
        testMonitorDefinition.setFrequencyMinutes(5);

        testMonitorResult = new MonitorResult();
        testMonitorResult.setId(1L);
        testMonitorResult.setMonitorDefinition(testMonitorDefinition);
        testMonitorResult.setCheckTime(Instant.now());
        testMonitorResult.setResponseTimeMs(100);
        testMonitorResult.setSuccessful(true);
    }

    @Test
    void getUptimeMonitorDefinitions_ShouldReturnAllMonitors() {
        // Arrange
        List<MonitorDefinition> expectedMonitors = Arrays.asList(testMonitorDefinition);
        when(uptimeDefinitionRepository.findAll()).thenReturn(expectedMonitors);

        // Act
        List<MonitorDefinition> actualMonitors = controller.getUptimeMonitorDefinitions();

        // Assert
        assertEquals(expectedMonitors, actualMonitors);
        verify(uptimeDefinitionRepository).findAll();
    }

    @Test
    void createUptimeMonitorDefinition_ShouldCreateNewMonitor() {
        // Arrange
        when(uptimeDefinitionRepository.save(any(MonitorDefinition.class))).thenReturn(testMonitorDefinition);

        // Act
        MonitorDefinition result = controller.createUptimeMonitorDefinition(testMonitorDefinition);

        // Assert
        assertEquals(testMonitorDefinition, result);
        verify(uptimeDefinitionRepository).save(testMonitorDefinition);
    }

    @Test
    void updateUptimeMonitorDefinition_WhenMonitorExists_ShouldUpdateMonitor() {
        // Arrange
        when(uptimeDefinitionRepository.findById(1L)).thenReturn(Optional.of(testMonitorDefinition));
        when(uptimeDefinitionRepository.save(any(MonitorDefinition.class))).thenReturn(testMonitorDefinition);

        MonitorDefinition updateRequest = new MonitorDefinition();
        updateRequest.setName("Updated Name");
        updateRequest.setUrl("http://updated.com");
        updateRequest.setFrequencyMinutes(10);

        // Act
        MonitorDefinition result = controller.updateUptimeMonitorDefinition(1L, updateRequest);

        // Assert
        assertEquals(updateRequest.getName(), result.getName());
        assertEquals(updateRequest.getUrl(), result.getUrl());
        assertEquals(updateRequest.getFrequencyMinutes(), result.getFrequencyMinutes());
        verify(uptimeDefinitionRepository).save(any(MonitorDefinition.class));
    }

    @Test
    void updateUptimeMonitorDefinition_WhenMonitorDoesNotExist_ShouldThrowException() {
        // Arrange
        when(uptimeDefinitionRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> controller.updateUptimeMonitorDefinition(1L, new MonitorDefinition()));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("MonitorDefinition not found", exception.getReason());
    }

    @Test
    void deleteUptimeMonitorDefinition_ShouldDeleteMonitorAndResults() {
        // Arrange
        Long monitorId = 1L;

        // Act
        controller.deleteUptimeMonitorDefinition(monitorId);

        // Assert
        verify(resultRepository).deleteByMonitorDefinitionId(monitorId);
        verify(uptimeDefinitionRepository).deleteById(monitorId);
    }

    @Test
    void getMonitorResults_ShouldReturnResultsForMonitor() {
        // Arrange
        Long monitorId = 1L;
        List<MonitorResult> expectedResults = Arrays.asList(testMonitorResult);
        when(resultRepository.findByMonitorDefinitionIdOrderByCheckTimeDesc(monitorId)).thenReturn(expectedResults);

        // Act
        List<MonitorResult> actualResults = controller.getMonitorResults(monitorId);

        // Assert
        assertEquals(expectedResults, actualResults);
        verify(resultRepository).findByMonitorDefinitionIdOrderByCheckTimeDesc(monitorId);
    }
}