"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts"
import {
  Satellite,
  Radio,
  Globe,
  Zap,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  Lock,
} from "lucide-react"

interface SatelliteData {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance"
  signal: number
  latency: number
  bandwidth: number
  location: string
  threats: number
}

export function SatelliteConnection() {
  const [satellites, setSatellites] = useState<SatelliteData[]>([
    {
      id: "SAT-001",
      name: "CyberGuard Alpha",
      status: "active",
      signal: 98,
      latency: 45,
      bandwidth: 1200,
      location: "North America",
      threats: 0,
    },
    {
      id: "SAT-002",
      name: "CyberGuard Beta",
      status: "active",
      signal: 95,
      latency: 52,
      bandwidth: 1150,
      location: "Europe",
      threats: 2,
    },
    {
      id: "SAT-003",
      name: "CyberGuard Gamma",
      status: "maintenance",
      signal: 0,
      latency: 0,
      bandwidth: 0,
      location: "Asia Pacific",
      threats: 0,
    },
    {
      id: "SAT-004",
      name: "CyberGuard Delta",
      status: "active",
      signal: 92,
      latency: 38,
      bandwidth: 1300,
      location: "South America",
      threats: 1,
    },
    {
      id: "SAT-005",
      name: "CyberGuard Epsilon",
      status: "active",
      signal: 78,
      latency: 67,
      bandwidth: 1000,
      location: "Africa",
      threats: 0,
    },
    {
      id: "SAT-006",
      name: "CyberGuard Zeta",
      status: "active",
      signal: 85,
      latency: 58,
      bandwidth: 1100,
      location: "Middle East",
      threats: 1,
    },
  ])

  const [globalStatus, setGlobalStatus] = useState({
    totalSatellites: 6,
    activeSatellites: 5,
    totalBandwidth: 4750,
    avgLatency: 52,
    globalThreats: 3,
    encryptionLevel: "AES-256-GCM",
  })

  const [connectionMode, setConnectionMode] = useState<"auto" | "manual">("auto")
  const [selectedSatellite, setSelectedSatellite] = useState<string>("SAT-001")

  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites((prev) =>
        prev.map((sat) => ({
          ...sat,
          signal: sat.status === "active" ? Math.max(85, Math.min(100, sat.signal + (Math.random() - 0.5) * 4)) : 0,
          latency: sat.status === "active" ? Math.max(30, Math.min(80, sat.latency + (Math.random() - 0.5) * 10)) : 0,
          bandwidth:
            sat.status === "active" ? Math.max(1000, Math.min(1500, sat.bandwidth + (Math.random() - 0.5) * 100)) : 0,
          threats: Math.max(0, sat.threats + Math.floor(Math.random() * 3) - 1),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400"
      case "maintenance":
        return "text-yellow-400"
      case "inactive":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Satellite className="h-8 w-8 text-primary cyber-glow" />
          <div>
            <h2 className="text-2xl font-bold">Satellite Direct Connection</h2>
            <p className="text-muted-foreground">Global secure communication network</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400">
            <Lock className="h-3 w-3 mr-1" />
            {globalStatus.encryptionLevel}
          </Badge>
          <Button
            variant={connectionMode === "auto" ? "default" : "outline"}
            size="sm"
            onClick={() => setConnectionMode(connectionMode === "auto" ? "manual" : "auto")}
          >
            <Radio className="h-4 w-4 mr-2" />
            {connectionMode === "auto" ? "Auto Mode" : "Manual Mode"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Satellites</CardTitle>
            <Satellite className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {globalStatus.activeSatellites}/{globalStatus.totalSatellites}
            </div>
            <p className="text-xs text-muted-foreground">Global coverage active</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bandwidth</CardTitle>
            <Zap className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{globalStatus.totalBandwidth} Mbps</div>
            <p className="text-xs text-muted-foreground">Combined satellite capacity</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{globalStatus.avgLatency}ms</div>
            <p className="text-xs text-muted-foreground">Network response time</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Threats</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{globalStatus.globalThreats}</div>
            <p className="text-xs text-muted-foreground">Detected across network</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="satellites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="satellites">Satellite Status</TabsTrigger>
          <TabsTrigger value="network">Network Map</TabsTrigger>
          <TabsTrigger value="security">Security Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="satellites" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {satellites.map((satellite) => (
              <Card key={satellite.id} className="cyber-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Satellite className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{satellite.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(satellite.status)}
                      <Badge variant="outline" className={getStatusColor(satellite.status)}>
                        {satellite.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{satellite.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Satellite ID</p>
                      <p className="font-medium font-mono">{satellite.id}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Signal Strength</span>
                      <span className="font-medium">{satellite.signal}%</span>
                    </div>
                    <Progress value={satellite.signal} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Latency</p>
                      <p className="font-medium text-blue-400">{satellite.latency}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bandwidth</p>
                      <p className="font-medium text-green-400">{satellite.bandwidth} Mbps</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Threats</p>
                      <p className="font-medium text-red-400">{satellite.threats}</p>
                    </div>
                  </div>

                  {satellite.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setSelectedSatellite(satellite.id)}
                    >
                      <Wifi className="h-4 w-4 mr-2" />
                      {selectedSatellite === satellite.id ? "Connected" : "Connect"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Global Network Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { region: "North America", coverage: 98, latency: 45, threats: 0 },
                      { region: "Europe", coverage: 95, latency: 52, threats: 2 },
                      { region: "Asia Pacific", coverage: 0, latency: 0, threats: 0 },
                      { region: "South America", coverage: 92, latency: 38, threats: 1 },
                      { region: "Africa", coverage: 78, latency: 67, threats: 0 },
                      { region: "Middle East", coverage: 85, latency: 58, threats: 1 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="region" stroke="#9CA3AF" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="coverage" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-green-400" />
                  <span>Encryption Protocols</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Primary Encryption</span>
                  <Badge variant="outline" className="text-green-400">
                    AES-256-GCM
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Key Exchange</span>
                  <Badge variant="outline" className="text-green-400">
                    ECDH P-384
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Authentication</span>
                  <Badge variant="outline" className="text-green-400">
                    HMAC-SHA256
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Forward Secrecy</span>
                  <Badge variant="outline" className="text-green-400">
                    Enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span>Security Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Quantum Resistance</span>
                  <Badge variant="outline" className="text-blue-400">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Anti-Jamming</span>
                  <Badge variant="outline" className="text-blue-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Intrusion Detection</span>
                  <Badge variant="outline" className="text-blue-400">
                    Real-time
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Auto Failover</span>
                  <Badge variant="outline" className="text-blue-400">
                    Configured
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
