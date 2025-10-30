"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  AlertTriangle,
  Eye,
  Zap,
  Activity,
  Ban,
  FileText,
  Download,
  Play,
  Pause,
  RotateCcw,
  Target,
  Wifi,
  Unlock,
  Brain,
  Radar,
  Database,
  TrendingUp,
  RefreshCw,
} from "lucide-react"

interface ThreatEvent {
  id: string
  timestamp: string
  type: "malware" | "ddos" | "intrusion" | "phishing" | "ransomware" | "botnet" | "injection" | "xss"
  severity: "low" | "medium" | "high" | "critical"
  source: string
  target: string
  country: string
  blocked: boolean
  description: string
  details: {
    method: string
    payload: string
    confidence: number
    aiAnalysis: string
    mlModel: string
    processingTime: number
  }
}

interface AttackPattern {
  id: string
  name: string
  count: number
  trend: "up" | "down" | "stable"
  blocked: number
  countries: string[]
  lastSeen: string
}

interface SecurityMetrics {
  totalThreats: number
  blockedThreats: number
  activeConnections: number
  suspiciousIPs: number
  malwareDetected: number
  ddosAttempts: number
  intrusionAttempts: number
  phishingAttempts: number
}

interface MLModel {
  id: string
  name: string
  type: "neural_network" | "random_forest" | "svm" | "deep_learning"
  accuracy: number
  status: "active" | "training" | "updating"
  processingSpeed: number
  lastTrained: string
}

export function AdvancedLiveDetector() {
  const [isActive, setIsActive] = useState(false)
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [patterns, setPatterns] = useState<AttackPattern[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalThreats: 0,
    blockedThreats: 0,
    activeConnections: 0,
    suspiciousIPs: 0,
    malwareDetected: 0,
    ddosAttempts: 0,
    intrusionAttempts: 0,
    phishingAttempts: 0,
  })
  const [autoBlock, setAutoBlock] = useState(true)
  const [aiMode, setAiMode] = useState(true)
  const [reportGenerated, setReportGenerated] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [mlModels, setMlModels] = useState<MLModel[]>([
    {
      id: "ML-001",
      name: "DeepThreat Neural Network",
      type: "deep_learning",
      accuracy: 99.7,
      status: "active",
      processingSpeed: 1247,
      lastTrained: "2024-01-15T10:30:00Z",
    },
    {
      id: "ML-002",
      name: "Behavioral Analysis Forest",
      type: "random_forest",
      accuracy: 97.3,
      status: "active",
      processingSpeed: 892,
      lastTrained: "2024-01-14T15:45:00Z",
    },
    {
      id: "ML-003",
      name: "Anomaly Detection SVM",
      type: "svm",
      accuracy: 95.8,
      status: "updating",
      processingSpeed: 634,
      lastTrained: "2024-01-13T09:20:00Z",
    },
  ])

  const [liveAnalytics, setLiveAnalytics] = useState({
    packetsAnalyzed: 847293,
    threatsFound: 23,
    processingSpeed: 1200000,
    cpuUsage: 34.7,
    memoryUsage: 56.2,
    gpuUsage: 78.9,
  })

  const threatTypes = ["malware", "ddos", "intrusion", "phishing", "ransomware", "botnet", "injection", "xss"] as const
  const countries = ["US", "CN", "RU", "KP", "IR", "BR", "IN", "DE", "FR", "GB", "JP", "AU"]
  const severityColors = {
    low: "text-green-400 bg-green-400/10 border-green-400/20",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    critical: "text-red-400 bg-red-400/10 border-red-400/20 animate-pulse",
  }

  useEffect(() => {
    if (isActive) {
      startLiveDetection()
    } else {
      stopLiveDetection()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  const startLiveDetection = () => {
    console.log("[v0] Starting advanced live threat detection with ML integration...")
    intervalRef.current = setInterval(() => {
      generateThreatEvent()
      updateMetrics()
      updatePatterns()
      updateMLModels()
      updateLiveAnalytics()
    }, 2000)
  }

  const stopLiveDetection = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    console.log("[v0] Stopped live threat detection")
  }

  const generateThreatEvent = () => {
    if (Math.random() < 0.7) {
      const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)]
      const severity =
        Math.random() < 0.1 ? "critical" : Math.random() < 0.2 ? "high" : Math.random() < 0.4 ? "medium" : "low"
      const country = countries[Math.floor(Math.random() * countries.length)]
      const blocked = autoBlock && (severity === "critical" || severity === "high" || Math.random() < 0.8)
      const activeModel = mlModels.find((m) => m.status === "active") || mlModels[0]

      const threatDescriptions = {
        malware: "Advanced malware detected using deep learning analysis",
        ddos: "Distributed denial of service attack identified by behavioral patterns",
        intrusion: "Unauthorized access attempt detected via anomaly detection",
        phishing: "Phishing attempt identified using neural network classification",
        ransomware: "Ransomware signature detected with 99.7% confidence",
        botnet: "Botnet communication pattern identified by ML algorithms",
        injection: "SQL injection attempt detected using pattern recognition",
        xss: "Cross-site scripting attack identified by AI analysis",
      }

      const newThreat: ThreatEvent = {
        id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        type: threatType,
        severity,
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: `192.168.1.${Math.floor(Math.random() * 255)}`,
        country,
        blocked,
        description: threatDescriptions[threatType],
        details: {
          method: ["HTTP", "HTTPS", "TCP", "UDP", "ICMP"][Math.floor(Math.random() * 5)],
          payload: `${Math.floor(Math.random() * 10000)}B`,
          confidence: Math.random() * 30 + 70,
          aiAnalysis: aiMode
            ? `${activeModel.name} detected ${threatType} with ${(Math.random() * 30 + 70).toFixed(1)}% confidence`
            : "Manual analysis required",
          mlModel: activeModel.name,
          processingTime: Math.random() * 2 + 0.1,
        },
      }

      setThreats((prev) => [newThreat, ...prev.slice(0, 99)])

      if (severity === "critical") {
        console.log(`[v0] CRITICAL THREAT DETECTED: ${threatType} from ${country} - ${blocked ? "BLOCKED" : "ALLOWED"}`)
      }
    }
  }

  const updateMLModels = () => {
    setMlModels((prev) =>
      prev.map((model) => ({
        ...model,
        processingSpeed:
          model.status === "active"
            ? Math.max(500, Math.min(1500, model.processingSpeed + (Math.random() - 0.5) * 100))
            : model.processingSpeed,
        accuracy: model.status === "training" ? Math.min(99.9, model.accuracy + Math.random() * 0.1) : model.accuracy,
      })),
    )
  }

  const updateLiveAnalytics = () => {
    setLiveAnalytics((prev) => ({
      packetsAnalyzed: prev.packetsAnalyzed + Math.floor(Math.random() * 1000) + 500,
      threatsFound: Math.max(0, prev.threatsFound + Math.floor(Math.random() * 3) - 1),
      processingSpeed: Math.max(800000, Math.min(1500000, prev.processingSpeed + (Math.random() - 0.5) * 50000)),
      cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 5)),
      memoryUsage: Math.max(30, Math.min(85, prev.memoryUsage + (Math.random() - 0.5) * 3)),
      gpuUsage: Math.max(50, Math.min(95, prev.gpuUsage + (Math.random() - 0.5) * 4)),
    }))
  }

  const updateMetrics = () => {
    setMetrics((prev) => {
      const connectionChange = Math.floor((Math.random() - 0.5) * 20)
      const suspiciousChange = Math.floor((Math.random() - 0.7) * 5)

      return {
        totalThreats: prev.totalThreats + (Math.random() < 0.7 ? 1 : 0),
        blockedThreats: prev.blockedThreats + (Math.random() < 0.6 ? 1 : 0),
        activeConnections: Math.max(10, prev.activeConnections + connectionChange),
        suspiciousIPs: Math.max(0, prev.suspiciousIPs + Math.max(-prev.suspiciousIPs, suspiciousChange)),
        malwareDetected: prev.malwareDetected + (Math.random() < 0.1 ? 1 : 0),
        ddosAttempts: prev.ddosAttempts + (Math.random() < 0.05 ? 1 : 0),
        intrusionAttempts: prev.intrusionAttempts + (Math.random() < 0.15 ? 1 : 0),
        phishingAttempts: prev.phishingAttempts + (Math.random() < 0.08 ? 1 : 0),
      }
    })
  }

  const updatePatterns = () => {
    setPatterns((prev) => {
      const updated = prev.map((pattern) => ({
        ...pattern,
        count: pattern.count + Math.floor(Math.random() * 5),
        blocked: pattern.blocked + Math.floor(Math.random() * 3),
        trend: Math.random() < 0.33 ? "up" : Math.random() < 0.66 ? "down" : ("stable" as const),
        lastSeen: new Date().toISOString(),
      }))

      if (Math.random() < 0.1 && updated.length < 10) {
        const newPattern: AttackPattern = {
          id: `pattern_${Date.now()}`,
          name: `${threatTypes[Math.floor(Math.random() * threatTypes.length)].toUpperCase()} Campaign ${Math.floor(Math.random() * 1000)}`,
          count: Math.floor(Math.random() * 50) + 10,
          trend: "up",
          blocked: Math.floor(Math.random() * 30) + 5,
          countries: countries.slice(0, Math.floor(Math.random() * 5) + 1),
          lastSeen: new Date().toISOString(),
        }
        updated.push(newPattern)
      }

      return updated
    })
  }

  const blockThreat = (threatId: string) => {
    setThreats((prev) => prev.map((threat) => (threat.id === threatId ? { ...threat, blocked: true } : threat)))
    console.log(`[v0] Manually blocked threat: ${threatId}`)
  }

  const generateSecurityReport = async () => {
    console.log("[v0] Generating comprehensive security report with ML analytics...")
    setReportGenerated(false)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    const reportData = {
      timestamp: new Date().toISOString(),
      period: "Last 24 Hours",
      summary: {
        totalThreats: metrics.totalThreats,
        blockedThreats: metrics.blockedThreats,
        blockRate: metrics.totalThreats > 0 ? ((metrics.blockedThreats / metrics.totalThreats) * 100).toFixed(1) : "0",
        mlAccuracy: mlModels.reduce((acc, model) => acc + model.accuracy, 0) / mlModels.length,
        processingSpeed: liveAnalytics.processingSpeed,
        criticalIncidents: threats.filter((t) => t.severity === "critical").length,
      },
      mlPerformance: {
        activeModels: mlModels.filter((m) => m.status === "active").length,
        avgAccuracy: (mlModels.reduce((acc, model) => acc + model.accuracy, 0) / mlModels.length).toFixed(1),
        totalProcessingSpeed: mlModels.reduce((acc, model) => acc + model.processingSpeed, 0),
      },
      recommendations: [
        "Increase monitoring for DDoS attacks from identified source countries",
        "Update ML models with latest threat intelligence data",
        "Implement additional GPU resources for faster processing",
        "Review and retrain behavioral analysis models",
      ],
    }

    console.log("[v0] Enhanced security report generated:", reportData)
    setReportGenerated(true)
  }

  const resetSystem = () => {
    setThreats([])
    setPatterns([])
    setMetrics({
      totalThreats: 0,
      blockedThreats: 0,
      activeConnections: Math.floor(Math.random() * 100) + 50,
      suspiciousIPs: 0,
      malwareDetected: 0,
      ddosAttempts: 0,
      intrusionAttempts: 0,
      phishingAttempts: 0,
    })
    setLiveAnalytics({
      packetsAnalyzed: 0,
      threatsFound: 0,
      processingSpeed: 1200000,
      cpuUsage: 25,
      memoryUsage: 40,
      gpuUsage: 60,
    })
    setReportGenerated(false)
    console.log("[v0] System reset completed")
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="cyber-glow border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Radar className={`h-6 w-6 text-primary ${isActive ? "animate-spin" : ""}`} />
                {isActive && <div className="absolute -inset-1 bg-primary/20 rounded-full animate-ping" />}
              </div>
              <div>
                <CardTitle className="text-primary">Advanced Live Threat Detector</CardTitle>
                <p className="text-sm text-muted-foreground">
                  AI-powered real-time global cyber threat monitoring & protection
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm">AI Mode</span>
                <Badge variant={aiMode ? "default" : "secondary"} className="animate-pulse">
                  {aiMode ? "ACTIVE" : "OFF"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-sm">Auto Block</span>
                <Badge variant={autoBlock ? "default" : "secondary"}>{autoBlock ? "ON" : "OFF"}</Badge>
              </div>
              {!isActive ? (
                <Button onClick={() => setIsActive(true)} className="cyber-glow bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Start Detection
                </Button>
              ) : (
                <Button onClick={() => setIsActive(false)} variant="destructive" className="cyber-glow">
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Detection
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cyber-glow border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span>ML Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Processing Speed</span>
              <span className="text-purple-400 font-medium">
                {(liveAnalytics.processingSpeed / 1000000).toFixed(1)}M/sec
              </span>
            </div>
            <div className="flex justify-between">
              <span>Packets Analyzed</span>
              <span className="text-blue-400 font-medium">{liveAnalytics.packetsAnalyzed.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>GPU Usage</span>
              <span className="text-green-400 font-medium">{liveAnalytics.gpuUsage.toFixed(1)}%</span>
            </div>
            <Progress value={liveAnalytics.gpuUsage} className="h-2" />
          </CardContent>
        </Card>

        <Card className="cyber-glow border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-400" />
              <span>System Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{liveAnalytics.cpuUsage.toFixed(1)}%</span>
              </div>
              <Progress value={liveAnalytics.cpuUsage} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{liveAnalytics.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress value={liveAnalytics.memoryUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <span>Detection Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Threats Found</span>
              <span className="text-red-400 font-medium">{liveAnalytics.threatsFound}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Models</span>
              <span className="text-green-400 font-medium">{mlModels.filter((m) => m.status === "active").length}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Accuracy</span>
              <span className="text-primary font-medium">
                {(mlModels.reduce((acc, model) => acc + model.accuracy, 0) / mlModels.length).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="cyber-glow border-red-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400 animate-pulse">{metrics.totalThreats}</p>
              <p className="text-xs text-muted-foreground">Total Threats</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-green-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Shield className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{metrics.blockedThreats}</p>
              <p className="text-xs text-muted-foreground">Blocked</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-blue-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Wifi className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">{metrics.activeConnections}</p>
              <p className="text-xs text-muted-foreground">Active Connections</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-orange-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Target className="h-6 w-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-400">{metrics.suspiciousIPs}</p>
              <p className="text-xs text-muted-foreground">Suspicious IPs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Zap className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">{metrics.malwareDetected}</p>
              <p className="text-xs text-muted-foreground">Malware</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-yellow-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Activity className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-400">{metrics.ddosAttempts}</p>
              <p className="text-xs text-muted-foreground">DDoS Attempts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-pink-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Unlock className="h-6 w-6 text-pink-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-pink-400">{metrics.intrusionAttempts}</p>
              <p className="text-xs text-muted-foreground">Intrusions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow border-cyan-500/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Eye className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-cyan-400">{metrics.phishingAttempts}</p>
              <p className="text-xs text-muted-foreground">Phishing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="threats">Live Threats</TabsTrigger>
          <TabsTrigger value="ml-models">ML Models</TabsTrigger>
          <TabsTrigger value="patterns">Attack Patterns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="ml-models">
          <Card className="cyber-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span>Machine Learning Models</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMlModels((prev) => prev.map((m) => ({ ...m, status: "training" as const })))}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retrain All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mlModels.map((model) => (
                  <Card key={model.id} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{model.name}</CardTitle>
                        <Badge
                          variant={
                            model.status === "active"
                              ? "default"
                              : model.status === "training"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {model.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Type</span>
                        <span className="text-blue-400 capitalize">{model.type.replace("_", " ")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span className="text-green-400">{model.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Speed</span>
                        <span className="text-primary">{model.processingSpeed}/s</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Last trained: {new Date(model.lastTrained).toLocaleDateString()}
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats">
          <Card className="cyber-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Real-time Threat Feed</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={isActive ? "text-green-400 animate-pulse" : "text-gray-400"}>
                    {isActive ? "LIVE" : "STOPPED"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={resetSystem}>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {threats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {isActive ? "Monitoring for threats..." : "Start detection to see live threats"}
                  </div>
                ) : (
                  threats.map((threat) => (
                    <div
                      key={threat.id}
                      className={`p-4 rounded-lg border ${severityColors[threat.severity]} transition-all duration-300 hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={severityColors[threat.severity]}>
                            {threat.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-purple-400">
                            {threat.type.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{threat.country}</span>
                          {threat.blocked ? (
                            <Badge className="bg-green-500/20 text-green-400">
                              <Ban className="h-3 w-3 mr-1" />
                              BLOCKED
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              ALLOWED
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(threat.timestamp).toLocaleTimeString()}
                          </span>
                          {!threat.blocked && (
                            <Button variant="outline" size="sm" onClick={() => blockThreat(threat.id)}>
                              <Ban className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm mb-2">{threat.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>Source: {threat.source}</div>
                        <div>Target: {threat.target}</div>
                        <div>Method: {threat.details.method}</div>
                        <div>Payload: {threat.details.payload}</div>
                      </div>
                      {aiMode && (
                        <div className="mt-2 p-2 bg-purple-500/10 rounded text-xs">
                          <div className="flex items-center justify-between text-purple-400">
                            <div className="flex items-center">
                              <Brain className="h-3 w-3 inline mr-1" />
                              {threat.details.aiAnalysis}
                            </div>
                            <div className="text-xs">{threat.details.processingTime.toFixed(2)}ms</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ... existing code for other tabs ... */}

        <TabsContent value="patterns">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Attack Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No attack patterns detected yet</div>
                ) : (
                  patterns.map((pattern) => (
                    <div key={pattern.id} className="p-4 border rounded-lg cyber-glow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{pattern.name}</h4>
                        <Badge
                          variant={
                            pattern.trend === "up" ? "destructive" : pattern.trend === "down" ? "default" : "secondary"
                          }
                        >
                          {pattern.trend === "up" ? "↗" : pattern.trend === "down" ? "↘" : "→"}{" "}
                          {pattern.trend.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-medium">{pattern.count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Blocked: </span>
                          <span className="font-medium text-green-400">{pattern.blocked}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success Rate: </span>
                          <span className="font-medium">
                            {pattern.count > 0 ? ((pattern.blocked / pattern.count) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Countries: </span>
                        <span className="text-xs">{pattern.countries.join(", ")}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={(pattern.blocked / pattern.count) * 100} className="h-2" />
                      </div>
                    </div>
                  ))
                )}
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
              <CardContent className="space-y-4">
                {threatTypes.map((type) => {
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
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Protection Effectiveness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {metrics.totalThreats > 0 ? ((metrics.blockedThreats / metrics.totalThreats) * 100).toFixed(1) : 0}%
                  </div>
                  <p className="text-muted-foreground">Overall Block Rate</p>
                  <Progress
                    value={metrics.totalThreats > 0 ? (metrics.blockedThreats / metrics.totalThreats) * 100 : 0}
                    className="mt-4 h-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{metrics.blockedThreats}</div>
                    <div className="text-xs text-muted-foreground">Threats Blocked</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold text-red-400">
                      {metrics.totalThreats - metrics.blockedThreats}
                    </div>
                    <div className="text-xs text-muted-foreground">Threats Allowed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="cyber-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Security Reports</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button onClick={generateSecurityReport} className="cyber-glow">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  {reportGenerated && (
                    <Button variant="outline" className="cyber-glow bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {reportGenerated ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <h3 className="font-medium text-green-400 mb-2">Enhanced Security Report Generated Successfully</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Threats: </span>
                        <span className="font-medium">{metrics.totalThreats}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Blocked: </span>
                        <span className="font-medium text-green-400">{metrics.blockedThreats}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ML Accuracy: </span>
                        <span className="font-medium text-purple-400">
                          {(mlModels.reduce((acc, model) => acc + model.accuracy, 0) / mlModels.length).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Processing Speed: </span>
                        <span className="font-medium text-blue-400">
                          {(liveAnalytics.processingSpeed / 1000000).toFixed(1)}M/sec
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Enhanced Security Recommendations</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Increase monitoring for DDoS attacks from identified source countries</li>
                      <li>• Update ML models with latest threat intelligence data</li>
                      <li>• Implement additional GPU resources for faster processing</li>
                      <li>• Review and retrain behavioral analysis models</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Click "Generate Report" to create a comprehensive security analysis with ML metrics
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
