import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function MonitorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Monitor {id}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="font-medium">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Checked</span>
              <span className="font-medium">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <span className="font-medium">234ms</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Configuration</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">URL</span>
              <span className="font-medium">https://example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Check Interval</span>
              <span className="font-medium">5 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Monitoring Since</span>
              <span className="font-medium">Jan 1, 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 