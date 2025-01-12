import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Activity, Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-primary" />
                <span className="hidden font-bold text-xl sm:inline-block">
                  Uptime Monitor
                </span>
              </Link>
              
              <div className="hidden sm:ml-10 sm:flex sm:items-center sm:gap-4">
                <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                  All Monitors
                </Button>
                <Button size="sm" onClick={() => navigate("/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Monitor
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex sm:hidden">
                <Button variant="outline" size="sm" className="mr-2" onClick={() => navigate("/")}>
                  All Monitors
                </Button>
                <Button size="sm" onClick={() => navigate("/new")}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  WT
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  )
} 