import { MonitorResult } from "@/types/monitor"
import { format } from "date-fns"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"

interface MonitorChartsProps {
  results: MonitorResult[]
}

export function MonitorCharts({ results }: MonitorChartsProps) {
  // Process data for charts
  const chartData = results.slice().reverse().map((result) => ({
    time: format(new Date(result.checkTime), "HH:mm"),
    date: format(new Date(result.checkTime), "MMM d"),
    responseTime: result.responseTimeMs || 0,
    status: result.successful ? "success" : "failure",
  }))

  // Calculate min and max response times for Y-axis domain
  const responseTimesOnly = chartData.map(d => d.responseTime).filter(t => t > 0)
  const minResponse = Math.min(...responseTimesOnly, 0)
  const maxResponse = Math.max(...responseTimesOnly, 100)
  const yAxisDomain = [minResponse, maxResponse + (maxResponse * 0.1)] // Add 10% padding to top

  // Calculate success rate for the bar chart
  const totalChecks = results.length
  const successCount = results.filter(r => r.successful).length
  const failureCount = totalChecks - successCount
  const uptimeData = [
    {
      name: "Uptime",
      success: (successCount / totalChecks) * 100,
      failure: (failureCount / totalChecks) * 100,
    }
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Response Time (ms)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis 
                domain={yAxisDomain}
                width={60}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--background)", borderRadius: "6px" }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number) => [`${value}ms`, "Response Time"]}
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)", strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-4">Uptime Percentage</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "var(--background)", 
                  borderRadius: "6px",
                  border: "1px solid var(--border)"
                }}
                labelStyle={{ color: "var(--foreground)" }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === "success" ? "Uptime" : "Downtime"
                ]}
                itemStyle={{ 
                  color: "var(--foreground)",
                  textTransform: "capitalize"
                }}
              />
              <Legend 
                formatter={(value) => (value === "success" ? "Uptime" : "Downtime")}
              />
              <Bar
                dataKey="success"
                fill="rgb(34 197 94)"
                stackId="a"
                name="success"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="failure"
                fill="rgb(239 68 68)"
                stackId="a"
                name="failure"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Total Checks: {totalChecks} | Successful: {successCount} | Failed: {failureCount}
        </div>
      </div>
    </div>
  )
} 