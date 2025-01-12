import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format } from "date-fns"
import { MonitorService } from "@/services/monitor-service"
import { MonitorResultsResponse } from "@/types/monitor"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Trash2, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { MonitorCharts } from "@/components/monitor/monitor-charts"

export function MonitorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [resultsData, setResultsData] = useState<MonitorResultsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<DateRange | undefined>()

  async function loadResults(startDate?: Date, endDate?: Date) {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      
      const data = await MonitorService.getMonitorResults(parseInt(id), startDate, endDate)
      setResultsData(data)
    } catch (err) {
      setError("Failed to load monitor results")
      console.error("Error loading results:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadResults()
  }, [id])

  async function handleDelete() {
    try {
      await MonitorService.deleteMonitor(parseInt(id!))
      toast({
        title: "Monitor deleted",
        description: "The monitor has been deleted successfully.",
      })
      navigate("/")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete monitor. Please try again.",
      })
    }
  }

  function handleDateSelect(range: DateRange | undefined) {
    setDate(range)
    if (range?.from && range?.to) {
      loadResults(range.from, range.to)
    }
  }

  function handleReset() {
    setDate(undefined)
    loadResults()
  }

  if (isLoading) {
    return <div className="text-center">Loading results...</div>
  }

  if (error) {
    return <div className="text-destructive text-center">{error}</div>
  }

  if (!resultsData) {
    return <div className="text-center">No results found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Monitor Results</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Monitor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this monitor and all its results.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing results from {format(new Date(resultsData.startDate), "PPP")} to {format(new Date(resultsData.endDate), "PPP")}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            title="Reset to last month"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <MonitorCharts results={resultsData.results} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultsData.results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>
                  {format(new Date(result.checkTime), "MMM d, yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>
                  <Badge variant={result.successful ? "default" : "destructive"} className={result.successful ? "bg-green-500" : ""}>
                    {result.successful ? "Success" : "Failed"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {result.responseTimeMs ? `${result.responseTimeMs}ms` : "-"}
                </TableCell>
                <TableCell className="text-destructive">
                  {result.errorMessage || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 