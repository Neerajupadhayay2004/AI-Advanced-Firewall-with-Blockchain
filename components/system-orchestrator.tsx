"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Power,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Database,
  Eye,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Network,
  Shield,
} from "lucide-react"

interface SystemComponent {
  id: string
  name: string
  type: "backend" | "frontend" | "integration"
  status: "online" | "offline" | "error" | "starting" | "stopping"
  health: number
  lastUpdate: string
  metrics: {
    cpu: number
    memory: number
    requests: number
    errors: number
  }
  dependencies: string[]
}

interface SystemAlert {
  id: string
  severity: "low" | "medium" | "high" | "critical"
  component: string
  message: string
  timestamp: string
  resolved: boolean
}

export function SystemOrchestrator() {
  const [systemStatus, setSystemStatus] = useState<"starting" | "running" | "stopping" | "stopped">("stopped")
  const [components, setComponents] = useState<SystemComponent[]>([])
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [autoMode, setAutoMode] = useState(true)
  const [systemHealth, setSystemHealth] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    initializeComponents()
  }, [])

  useEffect(() => {
    if (systemStatus === "running") {
      startSystemMonitoring()
    } else {
      stopSystemMonitoring()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [systemStatus])

  const initializeComponents = () => {
    const systemComponents: SystemComponent[] = [
      {
        id: "python-backend",
        name: "Python Backend Services",
        type: "backend",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: [],
      },
      {
        id: "threat-detector",
        name: "Global Threat Detector",
        type: "backend",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["python-backend"],
      },
      {
        id: "ml-analyzer",
        name: "ML Threat Analyzer",
        type: "backend",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["python-backend"],
      },
      {
        id: "live-monitor",
        name: "Live Monitoring Engine",
        type: "backend",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["python-backend"],
      },
      {
        id: "firewall-engine",
        name: "AI Firewall Engine",
        type: "integration",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["threat-detector", "ml-analyzer"],
      },
      {
        id: "global-detector",
        name: "Global Live Detection",
        type: "frontend",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["threat-detector", "live-monitor"],
      },
      {
        id: "3d-visualization",
        name: "3D Security Visualization",
        type: "frontend",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["threat-detector"],
      },
      {
        id: "report-generator",
        name: "Report Generation System",
        type: "integration",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["python-backend", "threat-detector", "ml-analyzer"],
      },
      {
        id: "web3-security",
        name: "Web3 Security Monitor",
        type: "integration",
        status: "offline",
        health: 0,
        lastUpdate: new Date().toISOString(),
        metrics: { cpu: 0, memory: 0, requests: 0, errors: 0 },
        dependencies: ["threat-detector"],
      },
    ]

    setComponents(systemComponents)
  }

  const startSystem = async () => {
    console.log("[v0] Starting full security system...")
    setSystemStatus("starting")

    try {
      // Start components in dependency order
      const startOrder = [
        "python-backend",
        "threat-detector",
        "ml-analyzer",
        "live-monitor",
        "firewall-engine",
        "global-detector",
        "3d-visualization",
        "report-generator",
        "web3-security",
      ]

      for (const componentId of startOrder) {
        await startComponent(componentId)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Stagger startup
      }

      setSystemStatus("running")
      console.log("[v0] Full security system started successfully")

      // Generate startup alert
      addAlert({
        severity: "low",
        component: "system",
        message: "Full security system started successfully",
        resolved: false,
      })
    } catch (error) {
      console.error("[v0] Failed to start system:", error)
      setSystemStatus("stopped")
      addAlert({
        severity: "critical",
        component: "system",
        message: "Failed to start security system",
        resolved: false,
      })
    }
  }

  const stopSystem = async () => {
    console.log("[v0] Stopping full security system...")
    setSystemStatus("stopping")

    try {
      // Stop all components
      const stopPromises = components.map((component) => stopComponent(component.id))
      await Promise.all(stopPromises)

      setSystemStatus("stopped")
      console.log("[v0] Full security system stopped")

      addAlert({
        severity: "medium",
        component: "system",
        message: "Security system stopped by user",
        resolved: false,
      })
    } catch (error) {
      console.error("[v0] Error stopping system:", error)
    }
  }

  const startComponent = async (componentId: string) => {
    console.log(`[v0] Starting component: ${componentId}`)

    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId ? { ...comp, status: "starting" as const, lastUpdate: new Date().toISOString() } : comp,
      ),
    )

    // Simulate component startup
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000))

    setComponents((prev) => {
      const component = prev.find((c) => c.id === componentId)
      if (component?.dependencies.length) {
        const dependenciesReady = component.dependencies.every((depId) => {
          const dep = prev.find((c) => c.id === depId)
          return dep?.status === "online"
        })

        if (!dependenciesReady) {
          console.log(`[v0] Dependencies not ready for ${componentId}, but continuing with mock startup`)
        }
      }

      // Start component successfully with enhanced metrics
      return prev.map((comp) =>
        comp.id === componentId
          ? {
              ...comp,
              status: "online" as const,
              health: Math.random() * 20 + 80, // 80-100% health
              metrics: {
                cpu: Math.random() * 30 + 10,
                memory: Math.random() * 40 + 20,
                requests: Math.floor(Math.random() * 1000),
                errors: Math.floor(Math.random() * 5),
              },
            }
          : comp,
      )
    })
  }

  const stopComponent = async (componentId: string) => {
    console.log(`[v0] Stopping component: ${componentId}`)

    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId
          ? {
              ...comp,
              status: "stopping" as const, // Set to stopping first
              lastUpdate: new Date().toISOString(),
            }
          : comp,
      ),
    )

    // Wait a moment for any ongoing operations to complete
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Now safely set to offline with zero metrics
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId
          ? {
              ...comp,
              status: "offline" as const,
              health: 0,
              metrics: {
                cpu: 0,
                memory: 0,
                requests: Math.max(0, comp.metrics.requests), // Preserve existing requests count
                errors: Math.max(0, comp.metrics.errors), // Preserve existing error count
              },
            }
          : comp,
      ),
    )
  }

  const restartComponent = async (componentId: string) => {
    console.log(`[v0] Restarting component: ${componentId}`)
    await stopComponent(componentId)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    await startComponent(componentId)
  }

  const startSystemMonitoring = () => {
    intervalRef.current = setInterval(() => {
      updateSystemMetrics()
      checkSystemHealth()
      generateRandomAlerts()
    }, 3000)
  }

  const stopSystemMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const updateSystemMetrics = () => {
    setComponents((prev) =>
      prev.map((comp) => {
        if (comp.status === "online") {
          const healthChange = (Math.random() - 0.5) * 10
          const cpuChange = (Math.random() - 0.5) * 20
          const memoryChange = (Math.random() - 0.5) * 15
          const requestsIncrease = Math.floor(Math.random() * 50)
          const errorIncrease = Math.random() < 0.1 ? 1 : 0

          return {
            ...comp,
            lastUpdate: new Date().toISOString(),
            health: Math.max(10, Math.min(100, comp.health + healthChange)), // Minimum 10% health
            metrics: {
              cpu: Math.max(5, Math.min(100, comp.metrics.cpu + cpuChange)), // Minimum 5% CPU
              memory: Math.max(10, Math.min(100, comp.metrics.memory + memoryChange)), // Minimum 10% memory
              requests: Math.max(0, comp.metrics.requests + requestsIncrease),
              errors: Math.max(0, comp.metrics.errors + errorIncrease),
            },
          }
        }
        return comp
      }),
    )
  }

  const checkSystemHealth = () => {
    const onlineComponents = components.filter((c) => c.status === "online")
    if (onlineComponents.length === 0) {
      setSystemHealth(0)
      return
    }

    const totalHealth = onlineComponents.reduce((sum, comp) => sum + Math.max(0, comp.health), 0)
    const avgHealth = Math.max(0, totalHealth / onlineComponents.length)
    setSystemHealth(avgHealth)

    // Generate health alerts
    if (avgHealth < 50) {
      addAlert({
        severity: "high",
        component: "system",
        message: `System health degraded: ${avgHealth.toFixed(1)}%`,
        resolved: false,
      })
    }
  }

  const generateRandomAlerts = () => {
    if (Math.random() < 0.1) {
      // 10% chance per interval
      const component = components[Math.floor(Math.random() * components.length)]
      const messages = [
        "High CPU usage detected",
        "Memory usage spike",
        "Increased error rate",
        "Network latency detected",
        "Unusual traffic pattern",
        "Performance degradation",
      ]

      addAlert({
        severity: Math.random() < 0.1 ? "critical" : Math.random() < 0.3 ? "high" : "medium",
        component: component.name,
        message: messages[Math.floor(Math.random() * messages.length)],
        resolved: false,
      })
    }
  }

  const addAlert = (alertData: Omit<SystemAlert, "id" | "timestamp">) => {
    const newAlert: SystemAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...alertData,
    }

    setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]) // Keep last 50 alerts
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "starting":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "stopping":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20"
      case "error":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "starting":
        return <Activity className="h-4 w-4 text-yellow-400 animate-pulse" />
      case "stopping":
        return <Activity className="h-4 w-4 text-orange-400 animate-pulse" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      default:
        return "text-green-500 bg-green-500/10 border-green-500/20"
    }
  }

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "backend":
        return <Database className="h-4 w-4" />
      case "frontend":
        return <Eye className="h-4 w-4" />
      case "integration":
        return <Network className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* System Control Panel */}
      <Card className="cyber-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Power className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>System Orchestrator</CardTitle>
                <p className="text-sm text-muted-foreground">Master control for the complete security platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-mode">Auto Mode</Label>
                <Switch id="auto-mode" checked={autoMode} onCheckedChange={setAutoMode} />
              </div>
              <Badge className={getStatusColor(systemStatus)}>{systemStatus.toUpperCase()}</Badge>
              {systemStatus === "stopped" ? (
                <Button onClick={startSystem} className="cyber-glow">
                  <Play className="h-4 w-4 mr-2" />
                  Start System
                </Button>
              ) : systemStatus === "running" ? (
                <Button onClick={stopSystem} variant="destructive" className="cyber-glow">
                  <Pause className="h-4 w-4 mr-2" />
                  Stop System
                </Button>
              ) : (
                <Button disabled className="cyber-glow">
                  <Activity className="h-4 w-4 mr-2 animate-pulse" />
                  {systemStatus === "starting" ? "Starting..." : "Stopping..."}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold text-primary">{systemHealth.toFixed(1)}%</p>
                <Progress value={systemHealth} className="mt-2" />
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online Components</p>
                <p className="text-2xl font-bold text-green-400">
                  {components.filter((c) => c.status === "online").length}/{components.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-destructive">{alerts.filter((a) => !a.resolved).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Uptime</p>
                <p className="text-2xl font-bold text-green-400">{systemStatus === "running" ? "99.9%" : "0%"}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="components" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">System Components</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {components.map((component) => (
              <Card key={component.id} className="cyber-glow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getComponentIcon(component.type)}
                      <CardTitle className="text-sm">{component.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(component.status)}>
                        {getStatusIcon(component.status)}
                        {component.status.toUpperCase()}
                      </Badge>
                      {component.status === "online" && (
                        <Button variant="outline" size="sm" onClick={() => restartComponent(component.id)}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Health:</span>
                    <span className="font-medium">{component.health.toFixed(1)}%</span>
                  </div>
                  <Progress value={component.health} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>CPU:</span>
                      <span>{component.metrics.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memory:</span>
                      <span>{component.metrics.memory.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Requests:</span>
                      <span>{component.metrics.requests.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <span className={component.metrics.errors > 0 ? "text-destructive" : ""}>
                        {component.metrics.errors}
                      </span>
                    </div>
                  </div>

                  {component.dependencies.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span>Dependencies: </span>
                      {component.dependencies.map((dep, index) => (
                        <span key={dep}>
                          {components.find((c) => c.id === dep)?.name || dep}
                          {index < component.dependencies.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Last Update: {new Date(component.lastUpdate).toLocaleTimeString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No system alerts</div>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${
                        alert.resolved ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{alert.component}</span>
                          {alert.resolved && (
                            <Badge variant="default" className="bg-green-500/20 text-green-400">
                              RESOLVED
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                          {!alert.resolved && (
                            <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average CPU Usage</span>
                    <span>
                      {components.length > 0
                        ? (components.reduce((sum, c) => sum + c.metrics.cpu, 0) / components.length).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      components.length > 0
                        ? components.reduce((sum, c) => sum + c.metrics.cpu, 0) / components.length
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Memory Usage</span>
                    <span>
                      {components.length > 0
                        ? (components.reduce((sum, c) => sum + c.metrics.memory, 0) / components.length).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      components.length > 0
                        ? components.reduce((sum, c) => sum + c.metrics.memory, 0) / components.length
                        : 0
                    }
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Requests</span>
                    <span>{components.reduce((sum, c) => sum + c.metrics.requests, 0).toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Errors</span>
                    <span
                      className={components.reduce((sum, c) => sum + c.metrics.errors, 0) > 0 ? "text-destructive" : ""}
                    >
                      {components.reduce((sum, c) => sum + c.metrics.errors, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Component Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["online", "offline", "error", "starting"].map((status) => {
                  const count = components.filter((c) => c.status === status).length
                  const percentage = components.length > 0 ? (count / components.length) * 100 : 0

                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{status}</span>
                        <span>
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
