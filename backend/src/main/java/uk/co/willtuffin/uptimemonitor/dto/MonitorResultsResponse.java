package uk.co.willtuffin.uptimemonitor.dto;

import java.time.Instant;
import java.util.List;
import uk.co.willtuffin.uptimemonitor.entity.MonitorResult;

public class MonitorResultsResponse {
    private Instant startDate;
    private Instant endDate;
    private List<MonitorResult> results;

    public MonitorResultsResponse(Instant startDate, Instant endDate, List<MonitorResult> results) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.results = results;
    }

    // Getters
    public Instant getStartDate() {
        return startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public List<MonitorResult> getResults() {
        return results;
    }
}