import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import { DashboardPage } from "@/pages/dashboard"
import { MonitorPage } from "@/pages/monitor"
import { NewMonitorPage } from "@/pages/new-monitor"

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/monitor/:id" element={<MonitorPage />} />
          <Route path="/new" element={<NewMonitorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
