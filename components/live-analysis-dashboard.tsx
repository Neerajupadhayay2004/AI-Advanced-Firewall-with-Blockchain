"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Shield, Activity, AlertTriangle, Globe, Zap, Brain } from "lucide-react"

interface LiveAnalysisData {
  threats_detected: number
  attacks_blocked: number
  network_health: number
  active_connections: number
  threat_level: string
  last_update: string | null
  live_threats: any[]
  network_traffic: any[]
  security_events: any[]
}

export default function LiveAnalysisDashboard() {
  const [analysisData, setAnalysisData] = useState<LiveAnalysisData>({
    threats_detected: 0,
    attacks_blocked: 0,
    network_health: 100,
    active_connections: 0,
    threat_level: "LOW",
    last_update: null,
    live_threats: [],
    network_traffic: [],
    security_events: [],
  })
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch("/api/live-analysis")
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setAnalysisData(result.data)
            setIsConnected(true)
            setLastUpdate(new Date().toLocaleTimeString())
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch live analysis data:", error)
        setIsConnected(false)
      }
    }

    // Fetch data immediately
    fetchLiveData()

    // Set up polling every 3 seconds
    const interval = setInterval(fetchLiveData, 3000)

    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "default"
      case "LOW":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const threatDistribution = analysisData.live_threats.reduce((acc: any, threat) => {
    acc[threat.severity] = (acc[threat.severity] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(threatDistribution).map(([severity, count]) => ({
    name: severity,
    value: count,
    color:
      severity === "CRITICAL"
        ? "#ef4444"
        : severity === "HIGH"
          ? "#f97316"
          : severity === "MEDIUM"
            ? "#eab308"
            : "#22c55e",
  }))

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
          <h2 className="text-2xl font-bold">Live Threat Analysis</h2>
          <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "CONNECTED" : "DISCONNECTED"}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">Last Update: {lastUpdate || "Never"}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{analysisData.threats_detected}</div>
            <p className="text-xs text-muted-foreground">Active threats in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attacks Blocked</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{analysisData.attacks_blocked}</div>
            <p className="text-xs text-muted-foreground">Successfully mitigated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{analysisData.network_health}%</div>
            <Progress value={analysisData.network_health} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
            <Zap className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Badge variant={getThreatLevelColor(analysisData.threat_level)} className="text-lg px-3 py-1">
              {analysisData.threat_level}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Current security status</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Network Traffic Analysis
            </CardTitle>
            <CardDescription>Real-time network activity monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysisData.network_traffic.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
                <YAxis />
                <Tooltip labelFormatter={(value) => new Date(value).toLocaleString()} />
                <Line
                  type="monotone"
                  dataKey="connections"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Active Connections"
                />
                <Line type="monotone" dataKey="anomaly_score" stroke="#ef4444" strokeWidth={2} name="Anomaly Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Threat Distribution
            </CardTitle>
            <CardDescription>Current threat severity breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Threats */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Threat Activity</CardTitle>
          <CardDescription>Latest security events and detections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {analysisData.live_threats
              .slice(-10)
              .reverse()
              .map((threat, index) => (
                <div key={threat.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant={getThreatLevelColor(threat.severity)}>{threat.severity}</Badge>
                    <div>
                      <div className="font-medium">{threat.type}</div>
                      <div className="text-sm text-muted-foreground">
                        {threat.source_ip} ({threat.source_country}) → Port {threat.target_port}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${threat.blocked ? "text-green-500" : "text-red-500"}`}>
                      {threat.blocked ? "BLOCKED" : "DETECTED"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(threat.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            {analysisData.live_threats.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No threats detected yet. System monitoring...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
