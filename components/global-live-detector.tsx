"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Activity, AlertTriangle, Zap, Eye, MapPin, Wifi, Shield, Target, Radar } from "lucide-react"

interface ThreatEvent {
  id: string
  type: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  source_ip: string
  target: string
  country: string
  timestamp: string
  description: string
  blocked: boolean
}

interface GlobalMetrics {
  total_connections: number
  threats_detected: number
  countries_monitored: number
  active_attacks: number
  blocked_attempts: number
  risk_score: number
}

export function GlobalLiveDetector() {
  const [isActive, setIsActive] = useState(false)
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [metrics, setMetrics] = useState<GlobalMetrics>({
    total_connections: 0,
    threats_detected: 0,
    countries_monitored: 0,
    active_attacks: 0,
    blocked_attempts: 0,
    risk_score: 0,
  })
  const [globalMap, setGlobalMap] = useState<any[]>([])
  const [detectionStatus, setDetectionStatus] = useState<"IDLE" | "SCANNING" | "ANALYZING" | "RESPONDING">("IDLE")
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (isActive) {
      startGlobalDetection()
    } else {
      stopGlobalDetection()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [isActive])

  const startGlobalDetection = async () => {
    console.log("[v0] Starting global live detection system...")
    setDetectionStatus("SCANNING")

    // Simulate WebSocket connection to Python backend
    try {
      // In a real implementation, this would connect to the Python WebSocket server
      // wsRef.current = new WebSocket('ws://localhost:8765')

      // Simulate real-time data updates
      const interval = setInterval(() => {
        updateGlobalMetrics()
        generateThreatEvents()
        updateGlobalMap()
      }, 2000)

      // Store interval for cleanup
      ;(wsRef as any).current = { interval }

      console.log("[v0] Global detection system activated")
    } catch (error) {
      console.error("[v0] Failed to connect to detection backend:", error)
    }
  }

  const stopGlobalDetection = () => {
    console.log("[v0] Stopping global live detection system...")
    setDetectionStatus("IDLE")

    if (wsRef.current && (wsRef.current as any).interval) {
      clearInterval((wsRef.current as any).interval)
    }
  }

  const updateGlobalMetrics = () => {
    setMetrics((prev) => ({
      total_connections: prev.total_connections + Math.floor(Math.random() * 100) + 50,
      threats_detected: prev.threats_detected + Math.floor(Math.random() * 5),
      countries_monitored: Math.min(195, prev.countries_monitored + Math.floor(Math.random() * 2)),
      active_attacks: Math.max(0, prev.active_attacks + Math.floor(Math.random() * 4) - 1),
      blocked_attempts: prev.blocked_attempts + Math.floor(Math.random() * 10) + 5,
      risk_score: Math.min(100, Math.max(0, prev.risk_score + Math.max(-2, Math.min(2, (Math.random() - 0.5) * 4)))),
    }))
  }

  const generateThreatEvents = () => {
    const threatTypes = ["malware", "ddos", "intrusion", "data_breach", "phishing", "ransomware"]
    const countries = ["China", "Russia", "North Korea", "Iran", "Unknown", "Brazil", "India"]
    const severities: ("LOW" | "MEDIUM" | "HIGH" | "CRITICAL")[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    if (Math.random() < 0.7) {
      // 70% chance to generate new threat
      const newThreat: ThreatEvent = {
        id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: `server_${Math.floor(Math.random() * 20) + 1}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        timestamp: new Date().toISOString(),
        description: `${threatTypes[Math.floor(Math.random() * threatTypes.length)]} attack detected from ${countries[Math.floor(Math.random() * countries.length)]}`,
        blocked: Math.random() > 0.3, // 70% blocked
      }

      setThreats((prev) => [newThreat, ...prev.slice(0, 49)]) // Keep last 50 threats

      // Update detection status based on threat severity
      if (newThreat.severity === "CRITICAL") {
        setDetectionStatus("RESPONDING")
        setTimeout(() => setDetectionStatus("SCANNING"), 3000)
      } else if (newThreat.severity === "HIGH") {
        setDetectionStatus("ANALYZING")
        setTimeout(() => setDetectionStatus("SCANNING"), 2000)
      }
    }
  }

  const updateGlobalMap = () => {
    const regions = [
      { name: "North America", threats: Math.floor(Math.random() * 50) + 10, lat: 45, lng: -100 },
      { name: "Europe", threats: Math.floor(Math.random() * 40) + 15, lat: 50, lng: 10 },
      { name: "Asia", threats: Math.floor(Math.random() * 80) + 30, lat: 35, lng: 100 },
      { name: "South America", threats: Math.floor(Math.random() * 30) + 5, lat: -15, lng: -60 },
      { name: "Africa", threats: Math.floor(Math.random() * 25) + 8, lat: 0, lng: 20 },
      { name: "Oceania", threats: Math.floor(Math.random() * 15) + 3, lat: -25, lng: 140 },
    ]

    setGlobalMap(regions)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      case "HIGH":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20"
      case "MEDIUM":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
      case "LOW":
        return "text-green-500 bg-green-500/10 border-green-500/20"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESPONDING":
        return "text-red-400 animate-pulse"
      case "ANALYZING":
        return "text-yellow-400 animate-pulse"
      case "SCANNING":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="cyber-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Global Live Detection System</CardTitle>
                <p className="text-sm text-muted-foreground">Real-time worldwide threat monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getStatusColor(detectionStatus)}>
                <Radar className="h-3 w-3 mr-1" />
                {detectionStatus}
              </Badge>
              <Button
                onClick={() => setIsActive(!isActive)}
                variant={isActive ? "destructive" : "default"}
                className="cyber-glow"
              >
                {isActive ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Stop Detection
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Start Detection
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Global Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Global Connections</p>
                <p className="text-2xl font-bold text-primary">{metrics.total_connections.toLocaleString()}</p>
              </div>
              <Wifi className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threats Detected</p>
                <p className="text-2xl font-bold text-destructive">{metrics.threats_detected}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive threat-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Countries Monitored</p>
                <p className="text-2xl font-bold text-green-400">{metrics.countries_monitored}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Attacks</p>
                <p className="text-2xl font-bold text-orange-400">{metrics.active_attacks}</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked Attempts</p>
                <p className="text-2xl font-bold text-green-400">{metrics.blocked_attempts.toLocaleString()}</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Global Risk Score</p>
                <p className="text-2xl font-bold text-yellow-400">{metrics.risk_score.toFixed(1)}%</p>
                <Progress value={metrics.risk_score} className="mt-2" />
              </div>
              <Eye className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="threats">Live Threats</TabsTrigger>
          <TabsTrigger value="map">Global Map</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Real-Time Threat Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {isActive ? "Scanning for threats..." : "Start detection to monitor threats"}
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div
                      key={threat.id}
                      className={`p-3 rounded-lg border ${getSeverityColor(threat.severity)} transition-all duration-300`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge variant="secondary">{threat.type.toUpperCase()}</Badge>
                          {threat.blocked && (
                            <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                              BLOCKED
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(threat.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mb-1">{threat.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Source: {threat.source_ip} ({threat.country})
                        </span>
                        <span>Target: {threat.target}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Global Threat Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {globalMap.map((region) => (
                  <Card key={region.name} className="cyber-glow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{region.name}</h3>
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Threats:</span>
                          <span className="text-destructive font-bold">{region.threats}</span>
                        </div>
                        <Progress value={(region.threats / 100) * 100} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Coordinates: {region.lat}°, {region.lng}°
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["malware", "ddos", "intrusion", "phishing", "ransomware"].map((type) => {
                    const count = threats.filter((t) => t.type === type).length
                    const percentage = threats.length > 0 ? (count / threats.length) * 100 : 0

                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{type}</span>
                          <span>
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Detection Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Detection Rate</span>
                    <span className="text-green-400 font-bold">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>False Positive Rate</span>
                    <span className="text-yellow-400 font-bold">1.2%</span>
                  </div>
                  <Progress value={1.2} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="text-primary font-bold">0.15s</span>
                  </div>
                  <Progress value={85} className="h-2" />

                  <div className="flex justify-between items-center">
                    <span>System Uptime</span>
                    <span className="text-green-400 font-bold">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
