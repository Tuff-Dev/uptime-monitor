import axios from 'axios'
import { MonitorDefinition, MonitorResultsResponse } from '@/types/monitor'

const API_BASE_URL = '/api'

export const MonitorService = {
  async getAllMonitors(): Promise<MonitorDefinition[]> {
    const response = await axios.get<MonitorDefinition[]>(`${API_BASE_URL}/uptime-monitor`)
    return response.data
  },

  async createMonitor(monitor: Omit<MonitorDefinition, 'id'>): Promise<MonitorDefinition> {
    const response = await axios.post<MonitorDefinition>(`${API_BASE_URL}/uptime-monitor`, monitor)
    return response.data
  },

  async updateMonitor(id: number, monitor: Omit<MonitorDefinition, 'id'>): Promise<MonitorDefinition> {
    const response = await axios.put<MonitorDefinition>(`${API_BASE_URL}/uptime-monitor/${id}`, monitor)
    return response.data
  },

  async deleteMonitor(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/uptime-monitor/${id}`)
  },

  async getMonitorResults(id: number, startDate?: Date, endDate?: Date): Promise<MonitorResultsResponse> {
    let url = `${API_BASE_URL}/uptime-monitor/${id}/results`
    
    if (startDate && endDate) {
      url += `?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    }
    
    const response = await axios.get<MonitorResultsResponse>(url)
    return response.data
  }
} 