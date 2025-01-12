import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MonitorService } from "@/services/monitor-service"
import { MonitorDefinition } from "@/types/monitor"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  const [monitors, setMonitors] = useState<MonitorDefinition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMonitors()
  }, [])

  async function loadMonitors() {
    try {
      setIsLoading(true)
      setError(null)
      const data = await MonitorService.getAllMonitors()
      setMonitors(data)
    } catch (err) {
      setError("Failed to load monitors. Please try again later.")
      console.error("Error loading monitors:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Loading monitors...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {monitors.map((monitor) => (
          <Link
            key={monitor.id}
            to={`/monitor/${monitor.id}`}
            className="rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent/50"
          >
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{monitor.name}</h3>
              <p className="text-sm text-muted-foreground truncate">
                {monitor.url}
              </p>
              <p className="text-sm text-muted-foreground">
                Frequency: {monitor.frequencyMinutes} minutes
              </p>
            </div>
          </Link>
        ))}
      </div>

      {monitors.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No monitors found. Create your first monitor to get started.</p>
        </div>
      )}
    </div>
  )
} 