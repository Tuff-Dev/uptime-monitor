export interface MonitorDefinition {
  id: number
  name: string
  url: string
  frequencyMinutes: number
}

export interface MonitorResult {
  id: number
  checkTime: string
  successful: boolean
  responseTimeMs: number | null
  errorMessage: string | null
}

export interface MonitorResultsResponse {
  startDate: string
  endDate: string
  results: MonitorResult[]
}