import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MonitorService } from "@/services/monitor-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface MonitorFormData {
  name: string
  url: string
  frequencyMinutes: number
}

const initialFormData: MonitorFormData = {
  name: "",
  url: "",
  frequencyMinutes: 5
}

export function NewMonitorPage() {
  const [formData, setFormData] = useState<MonitorFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frequencyMinutes' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      await MonitorService.createMonitor(formData)
      
      toast({
        title: "Monitor created",
        description: "Your new monitor has been created successfully.",
      })
      
      navigate("/")
    } catch (error) {
      console.error("Failed to create monitor:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create monitor. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Monitor</CardTitle>
          <CardDescription>
            Set up a new URL to monitor for uptime
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Monitor Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="My Website Monitor"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL to Monitor</Label>
              <Input
                id="url"
                name="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequencyMinutes">Check Frequency (minutes)</Label>
              <Input
                id="frequencyMinutes"
                name="frequencyMinutes"
                type="number"
                min="1"
                max="1440"
                value={formData.frequencyMinutes}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Monitor"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 