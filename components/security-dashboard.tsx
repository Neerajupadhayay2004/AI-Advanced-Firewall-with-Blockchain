"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { Shield, Activity, Globe, AlertTriangle, Eye, FileText } from "lucide-react"

const threatData = [
  { time: "00:00", threats: 12, blocked: 45, allowed: 1203 },
  { time: "04:00", threats: 8, blocked: 32, allowed: 987 },
  { time: "08:00", threats: 23, blocked: 67, allowed: 1456 },
  { time: "12:00", threats: 34, blocked: 89, allowed: 1789 },
  { time: "16:00", threats: 19, blocked: 56, allowed: 1345 },
  { time: "20:00", threats: 15, blocked: 43, allowed: 1123 },
]

const attackTypes = [
  { name: "SQL Injection", value: 35, color: "#ef4444" },
  { name: "DDoS", value: 28, color: "#f97316" },
  { name: "XSS", value: 18, color: "#eab308" },
  { name: "Brute Force", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 7, color: "#6b7280" },
]

const geoData = [
  { country: "Russia", attacks: 234, blocked: 234 },
  { country: "China", attacks: 189, blocked: 187 },
  { country: "North Korea", attacks: 156, blocked: 156 },
  { country: "Iran", attacks: 98, blocked: 97 },
  { country: "Unknown", attacks: 67, blocked: 65 },
]

const vulnerabilityData = [
  { severity: "Critical", count: 3, color: "#ef4444" },
  { severity: "High", count: 12, color: "#f97316" },
  { severity: "Medium", count: 28, color: "#eab308" },
  { severity: "Low", count: 45, color: "#22c55e" },
]

const complianceData = [
  { framework: "SOC 2", status: 98.5, color: "#10b981" },
  { framework: "ISO 27001", status: 95.2, color: "#3b82f6" },
  { framework: "GDPR", status: 99.1, color: "#8b5cf6" },
  { framework: "HIPAA", status: 97.8, color: "#06b6d4" },
]

const incidentData = [
  { time: "00:00", incidents: 2, resolved: 8, investigating: 1 },
  { time: "04:00", incidents: 1, resolved: 3, investigating: 0 },
  { time: "08:00", incidents: 5, resolved: 12, investigating: 2 },
  { time: "12:00", incidents: 8, resolved: 15, investigating: 3 },
  { time: "16:00", incidents: 4, resolved: 9, investigating: 1 },
  { time: "20:00", incidents: 3, resolved: 7, investigating: 1 },
]

const threatIntelligence = [
  {
    id: "TI-001",
    type: "Malware",
    severity: "High",
    source: "VirusTotal",
    description: "New ransomware variant detected",
    timestamp: "2 minutes ago",
    iocs: 15,
  },
  {
    id: "TI-002",
    type: "Phishing",
    severity: "Medium",
    source: "PhishTank",
    description: "Banking phishing campaign targeting users",
    timestamp: "15 minutes ago",
    iocs: 8,
  },
  {
    id: "TI-003",
    type: "Botnet",
    severity: "Critical",
    source: "Spamhaus",
    description: "C2 infrastructure discovered",
    timestamp: "1 hour ago",
    iocs: 23,
  },
]

export function SecurityDashboard() {
  const [realTimeData, setRealTimeData] = useState({
    activeConnections: 15420,
    throughput: 847.3,
    latency: 12.4,
    uptime: 99.97,
  })

  const [securityScore, setSecurityScore] = useState(87.3)
  const [activeIncidents, setActiveIncidents] = useState(5)
  const [vulnerabilities, setVulnerabilities] = useState(88)
  const [complianceScore, setComplianceScore] = useState(97.6)

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 100) - 50,
        throughput: Math.max(0, prev.throughput + Math.random() * 20 - 10),
        latency: Math.max(1, prev.latency + Math.random() * 2 - 1),
        uptime: Math.min(100, prev.uptime + Math.random() * 0.01),
      }))

      setSecurityScore((prev) => Math.max(70, Math.min(100, prev + Math.random() * 2 - 1)))
      setActiveIncidents((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      setVulnerabilities((prev) => Math.max(0, prev + Math.floor(Math.random() * 5) - 2))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{securityScore.toFixed(1)}</div>
            <Progress value={securityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground">Overall security posture</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive threat-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{activeIncidents}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <Eye className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{vulnerabilities}</div>
            <p className="text-xs text-muted-foreground">Identified & tracked</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <FileText className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{complianceScore}%</div>
            <p className="text-xs text-muted-foreground">Regulatory compliance</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{realTimeData.uptime.toFixed(2)}%</div>
            <Progress value={realTimeData.uptime} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="threats">Threat Intel</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Threat Activity (24h)</CardTitle>
                <CardDescription>Real-time threat detection and blocking</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={threatData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="threats"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="blocked"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="allowed"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Attack Types Distribution</CardTitle>
                <CardDescription>Most common attack vectors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={attackTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attackTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {attackTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="text-sm">{type.name}</span>
                      <span className="text-sm text-muted-foreground">{type.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Geographic Threat Analysis</CardTitle>
              <CardDescription>Attack origins and blocking effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geoData.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-destructive">{country.attacks} attacks</div>
                        <div className="text-xs text-muted-foreground">{country.blocked} blocked</div>
                      </div>
                      <Badge variant={country.blocked === country.attacks ? "default" : "destructive"}>
                        {((country.blocked / country.attacks) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Threat Intelligence Feeds</CardTitle>
              <CardDescription>Latest threat intelligence from multiple sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatIntelligence.map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          variant={
                            threat.severity === "Critical"
                              ? "destructive"
                              : threat.severity === "High"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {threat.severity}
                        </Badge>
                        <Badge variant="outline">{threat.type}</Badge>
                        <span className="text-sm text-muted-foreground">#{threat.id}</span>
                      </div>
                      <div className="font-medium mb-1">{threat.description}</div>
                      <div className="text-sm text-muted-foreground">
                        Source: {threat.source} • {threat.iocs} IOCs • {threat.timestamp}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Security Incidents (24h)</CardTitle>
              <CardDescription>Incident response and resolution tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incidentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="incidents" fill="#ef4444" />
                  <Bar dataKey="investigating" fill="#eab308" />
                  <Bar dataKey="resolved" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-6">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Vulnerability Assessment</CardTitle>
              <CardDescription>Security vulnerabilities by severity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {vulnerabilityData.map((vuln, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: vuln.color }}>
                          {vuln.count}
                        </div>
                        <div className="text-sm text-muted-foreground">{vuln.severity}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={vulnerabilityData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="severity" type="category" stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>Regulatory framework compliance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceData.map((framework, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{framework.framework}</span>
                      <span className="text-sm" style={{ color: framework.color }}>
                        {framework.status}%
                      </span>
                    </div>
                    <Progress value={framework.status} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
