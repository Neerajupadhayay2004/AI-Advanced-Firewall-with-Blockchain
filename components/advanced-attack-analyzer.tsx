"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Shield, AlertTriangle, Activity, Target, Eye, Brain, Radar, Lock, Clock } from "lucide-react"

interface AttackData {
  id: string
  type: string
  severity: "critical" | "high" | "medium" | "low"
  source: string
  target: string
  timestamp: string
  status: "active" | "mitigated" | "investigating"
  confidence: number
  indicators: string[]
}

export function AdvancedAttackAnalyzer() {
  const [attacks, setAttacks] = useState<AttackData[]>([
    {
      id: "ATK-001",
      type: "DDoS",
      severity: "critical",
      source: "203.0.113.45",
      target: "192.168.1.100",
      timestamp: "2024-01-15T14:30:00Z",
      status: "mitigated",
      confidence: 98.5,
      indicators: ["High packet rate", "Multiple source IPs", "SYN flood pattern"],
    },
    {
      id: "ATK-002",
      type: "Malware",
      severity: "high",
      source: "198.51.100.23",
      target: "192.168.1.50",
      timestamp: "2024-01-15T14:25:00Z",
      status: "investigating",
      confidence: 87.2,
      indicators: ["Suspicious file hash", "Unusual network behavior", "Registry modifications"],
    },
    {
      id: "ATK-003",
      type: "Phishing",
      severity: "medium",
      source: "malicious-site.example",
      target: "user@company.com",
      timestamp: "2024-01-15T14:20:00Z",
      status: "mitigated",
      confidence: 94.1,
      indicators: ["Suspicious email content", "Fake login page", "Domain spoofing"],
    },
  ])

  const [analysisStats, setAnalysisStats] = useState({
    totalAttacks: 1247,
    activeThreats: 3,
    mitigatedThreats: 1244,
    averageResponseTime: "2.3s",
    detectionAccuracy: 97.8,
    falsePositives: 2.2,
  })

  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks((prev) =>
        prev.map((attack) => ({
          ...attack,
          confidence: Math.min(99.9, attack.confidence + Math.random() * 0.5),
        })),
      )

      setAnalysisStats((prev) => ({
        ...prev,
        totalAttacks: prev.totalAttacks + Math.floor(Math.random() * 3),
        detectionAccuracy: Math.min(99.9, prev.detectionAccuracy + Math.random() * 0.1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const startDeepScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsScanning(false)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 500)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10"
      case "high":
        return "text-orange-500 bg-orange-500/10"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "low":
        return "text-green-500 bg-green-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-red-400 bg-red-400/10"
      case "mitigated":
        return "text-green-400 bg-green-400/10"
      case "investigating":
        return "text-blue-400 bg-blue-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  const attackTimelineData = [
    { hour: "00:00", attacks: 45, blocked: 43, analyzed: 45 },
    { hour: "04:00", attacks: 23, blocked: 22, analyzed: 23 },
    { hour: "08:00", attacks: 89, blocked: 87, analyzed: 89 },
    { hour: "12:00", attacks: 156, blocked: 154, analyzed: 156 },
    { hour: "16:00", attacks: 134, blocked: 132, analyzed: 134 },
    { hour: "20:00", attacks: 67, blocked: 65, analyzed: 67 },
    { hour: "24:00", attacks: 34, blocked: 33, analyzed: 34 },
  ]

  const threatDistributionData = [
    { name: "DDoS", value: 35, color: "#EF4444" },
    { name: "Malware", value: 25, color: "#F59E0B" },
    { name: "Phishing", value: 20, color: "#8B5CF6" },
    { name: "Brute Force", value: 15, color: "#EC4899" },
    { name: "Other", value: 5, color: "#6B7280" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Brain className="h-8 w-8 text-primary cyber-glow" />
          <div>
            <h2 className="text-2xl font-bold">Advanced Attack Analyzer</h2>
            <p className="text-muted-foreground">AI-powered threat analysis and response system</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400">
            <Activity className="h-3 w-3 mr-1" />
            AI Detection Active
          </Badge>
          <Button onClick={startDeepScan} disabled={isScanning} className="cyber-glow">
            <Radar className="h-4 w-4 mr-2" />
            {isScanning ? "Scanning..." : "Deep Scan"}
          </Button>
        </div>
      </div>

      {isScanning && (
        <Card className="cyber-glow border-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Radar className="h-6 w-6 text-blue-400 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span>Deep Security Scan in Progress</span>
                  <span>{scanProgress.toFixed(0)}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attacks</CardTitle>
            <Target className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{analysisStats.totalAttacks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Detected and analyzed</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">{analysisStats.activeThreats}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detection Accuracy</CardTitle>
            <Brain className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{analysisStats.detectionAccuracy}%</div>
            <p className="text-xs text-muted-foreground">AI model performance</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{analysisStats.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">Average mitigation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attacks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attacks">Live Attacks</TabsTrigger>
          <TabsTrigger value="analytics">Attack Analytics</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="response">Auto Response</TabsTrigger>
        </TabsList>

        <TabsContent value="attacks" className="space-y-4">
          <div className="space-y-4">
            {attacks.map((attack) => (
              <Card key={attack.id} className="cyber-glow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className={getSeverityColor(attack.severity)}>{attack.severity.toUpperCase()}</Badge>
                      <h3 className="font-semibold">{attack.type} Attack</h3>
                      <Badge variant="outline" className="text-purple-400">
                        {attack.confidence.toFixed(1)}% Confidence
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(attack.status)}>{attack.status.toUpperCase()}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Source</p>
                      <p className="font-mono">{attack.source}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-mono">{attack.target}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-mono">{new Date(attack.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Attack ID</p>
                      <p className="font-mono">{attack.id}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Threat Indicators:</p>
                    <div className="flex flex-wrap gap-2">
                      {attack.indicators.map((indicator, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {indicator}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Investigate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Auto Mitigate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Block Source
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Attack Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={attackTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="attacks" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="blocked" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="analyzed" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={threatDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {threatDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Attack Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { pattern: "Botnet", frequency: 234, severity: 8.5, trend: "up" },
                      { pattern: "APT", frequency: 45, severity: 9.2, trend: "stable" },
                      { pattern: "Ransomware", frequency: 67, severity: 9.8, trend: "down" },
                      { pattern: "Cryptojacking", frequency: 123, severity: 6.4, trend: "up" },
                      { pattern: "Zero-day", frequency: 12, severity: 9.9, trend: "up" },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="pattern" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="frequency" fill="#3B82F6" />
                    <Bar dataKey="severity" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Automated Response Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-block malicious IPs</span>
                  <Badge variant="outline" className="text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quarantine infected files</span>
                  <Badge variant="outline" className="text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rate limit suspicious traffic</span>
                  <Badge variant="outline" className="text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Alert security team</span>
                  <Badge variant="outline" className="text-blue-400">
                    Configured
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Generate incident reports</span>
                  <Badge variant="outline" className="text-blue-400">
                    Automated
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Response Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Response Time</span>
                    <span className="font-bold text-green-400">{analysisStats.averageResponseTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <span className="font-bold text-green-400">99.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">False Positives</span>
                    <span className="font-bold text-yellow-400">{analysisStats.falsePositives}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto Mitigations</span>
                    <span className="font-bold text-blue-400">1,244</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
