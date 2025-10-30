"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Zap, Cpu, HardDrive, Wifi, AlertTriangle, Play, Pause } from "lucide-react"

interface SystemMetric {
  timestamp: string
  cpu: number
  memory: number
  network: number
  threats: number
}

interface NetworkConnection {
  id: string
  source_ip: string
  destination_ip: string
  port: number
  protocol: string
  status: "Active" | "Blocked" | "Monitoring"
  bytes_transferred: number
  duration: string
}

export function RealTimeMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    { timestamp: "14:20", cpu: 23, memory: 45, network: 67, threats: 2 },
    { timestamp: "14:21", cpu: 28, memory: 47, network: 72, threats: 1 },
    { timestamp: "14:22", cpu: 31, memory: 44, network: 68, threats: 3 },
    { timestamp: "14:23", cpu: 26, memory: 46, network: 71, threats: 0 },
    { timestamp: "14:24", cpu: 29, memory: 48, network: 69, threats: 2 },
  ])

  const [currentMetrics, setCurrentMetrics] = useState({
    cpu_usage: 29.3,
    memory_usage: 47.8,
    network_throughput: 847.2,
    active_connections: 15420,
    threats_per_minute: 12,
    blocked_requests: 1247,
  })

  const [networkConnections, setNetworkConnections] = useState<NetworkConnection[]>([
    {
      id: "CONN-001",
      source_ip: "192.168.1.100",
      destination_ip: "10.0.0.5",
      port: 443,
      protocol: "HTTPS",
      status: "Active",
      bytes_transferred: 1024768,
      duration: "00:02:34",
    },
    {
      id: "CONN-002",
      source_ip: "203.0.113.45",
      destination_ip: "10.0.0.1",
      port: 80,
      protocol: "HTTP",
      status: "Blocked",
      bytes_transferred: 0,
      duration: "00:00:01",
    },
    {
      id: "CONN-003",
      source_ip: "198.51.100.23",
      destination_ip: "10.0.0.8",
      port: 22,
      protocol: "SSH",
      status: "Monitoring",
      bytes_transferred: 45632,
      duration: "00:01:12",
    },
  ])

  const [alerts, setAlerts] = useState([
    {
      id: "ALERT-001",
      type: "High CPU Usage",
      severity: "Warning",
      message: "CPU usage exceeded 80% threshold",
      timestamp: "14:23:45",
    },
    {
      id: "ALERT-002",
      type: "Suspicious Activity",
      severity: "Critical",
      message: "Multiple failed login attempts detected",
      timestamp: "14:22:12",
    },
  ])

  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Update current metrics
      setCurrentMetrics((prev) => ({
        cpu_usage: Math.max(10, Math.min(90, prev.cpu_usage + Math.random() * 6 - 3)),
        memory_usage: Math.max(20, Math.min(80, prev.memory_usage + Math.random() * 4 - 2)),
        network_throughput: Math.max(100, prev.network_throughput + Math.random() * 100 - 50),
        active_connections: prev.active_connections + Math.floor(Math.random() * 200) - 100,
        threats_per_minute: Math.max(0, prev.threats_per_minute + Math.floor(Math.random() * 6) - 3),
        blocked_requests: prev.blocked_requests + Math.floor(Math.random() * 10),
      }))

      // Update system metrics chart
      setSystemMetrics((prev) => {
        const newMetric: SystemMetric = {
          timestamp: new Date().toLocaleTimeString().slice(0, 5),
          cpu: Math.floor(Math.random() * 40) + 20,
          memory: Math.floor(Math.random() * 30) + 40,
          network: Math.floor(Math.random() * 40) + 50,
          threats: Math.floor(Math.random() * 5),
        }
        return [...prev.slice(1), newMetric]
      })

      // Simulate new connections
      if (Math.random() > 0.7) {
        const newConnection: NetworkConnection = {
          id: `CONN-${Date.now()}`,
          source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          destination_ip: `10.0.0.${Math.floor(Math.random() * 255)}`,
          port: [80, 443, 22, 21, 25][Math.floor(Math.random() * 5)],
          protocol: ["HTTP", "HTTPS", "SSH", "FTP", "SMTP"][Math.floor(Math.random() * 5)],
          status: ["Active", "Blocked", "Monitoring"][Math.floor(Math.random() * 3)] as any,
          bytes_transferred: Math.floor(Math.random() * 1000000),
          duration: `00:0${Math.floor(Math.random() * 6)}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, "0")}`,
        }
        setNetworkConnections((prev) => [newConnection, ...prev.slice(0, 9)])
      }

      // Generate alerts occasionally
      if (Math.random() > 0.9) {
        const alertTypes = ["High CPU Usage", "Memory Warning", "Network Anomaly", "Suspicious Activity"]
        const severities = ["Warning", "Critical"]
        const newAlert = {
          id: `ALERT-${Date.now()}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: "Automated detection triggered",
          timestamp: new Date().toLocaleTimeString(),
        }
        setAlerts((prev) => [newAlert, ...prev.slice(0, 4)])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Blocked":
        return "destructive"
      case "Monitoring":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getSeverityColor = (severity: string) => {
    return severity === "Critical" ? "destructive" : "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Monitor</h2>
          <p className="text-muted-foreground">Live system and security monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant={isMonitoring ? "destructive" : "default"} onClick={() => setIsMonitoring(!isMonitoring)}>
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics.cpu_usage.toFixed(1)}%</div>
            <Progress value={currentMetrics.cpu_usage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{currentMetrics.memory_usage.toFixed(1)}%</div>
            <Progress value={currentMetrics.memory_usage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Throughput</CardTitle>
            <Wifi className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{currentMetrics.network_throughput.toFixed(1)} MB/s</div>
            <p className="text-xs text-muted-foreground">
              {currentMetrics.active_connections.toLocaleString()} connections
            </p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats/Min</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive threat-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{currentMetrics.threats_per_minute}</div>
            <p className="text-xs text-muted-foreground">Real-time detection</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{currentMetrics.blocked_requests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total blocked today</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">ONLINE</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={systemMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                <XAxis dataKey="timestamp" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="memory" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="network" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>System and security alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity}</Badge>
                      <span className="font-medium">{alert.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{alert.message}</div>
                    <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Dismiss
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle>Active Network Connections</CardTitle>
          <CardDescription>Real-time network activity monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {networkConnections.map((connection) => (
              <div
                key={connection.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant={getStatusColor(connection.status) as any}>{connection.status}</Badge>
                    <Badge variant="outline">{connection.protocol}</Badge>
                    <span className="text-sm text-muted-foreground">#{connection.id}</span>
                  </div>
                  <div className="text-sm font-mono">
                    {connection.source_ip}:{connection.port} → {connection.destination_ip}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {(connection.bytes_transferred / 1024).toFixed(1)} KB transferred • Duration: {connection.duration}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                  {connection.status === "Active" && (
                    <Button variant="destructive" size="sm">
                      Block
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
