"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts"
import {
  Shield,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Server,
  Network,
  Settings,
} from "lucide-react"

interface FirewallRule {
  id: string
  name: string
  type: "allow" | "block" | "monitor"
  source: string
  destination: string
  port: string
  protocol: string
  priority: number
  status: "active" | "inactive"
  hits: number
}

interface GlobalNode {
  id: string
  location: string
  status: "online" | "offline" | "maintenance"
  load: number
  threats: number
  bandwidth: number
  connections: number
}

export function GlobalFirewallEngine() {
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([
    {
      id: "FW-001",
      name: "Block Malicious IPs",
      type: "block",
      source: "threat-intel-db",
      destination: "any",
      port: "any",
      protocol: "any",
      priority: 1,
      status: "active",
      hits: 15420,
    },
    {
      id: "FW-002",
      name: "Allow Internal Traffic",
      type: "allow",
      source: "10.0.0.0/8",
      destination: "10.0.0.0/8",
      port: "any",
      protocol: "any",
      priority: 2,
      status: "active",
      hits: 892341,
    },
    {
      id: "FW-003",
      name: "Monitor Suspicious Ports",
      type: "monitor",
      source: "any",
      destination: "any",
      port: "1337,4444,31337",
      protocol: "tcp",
      priority: 3,
      status: "active",
      hits: 234,
    },
  ])

  const [globalNodes, setGlobalNodes] = useState<GlobalNode[]>([
    {
      id: "NODE-US-EAST",
      location: "US East (Virginia)",
      status: "online",
      load: 67,
      threats: 12,
      bandwidth: 8500,
      connections: 45230,
    },
    {
      id: "NODE-EU-WEST",
      location: "EU West (Ireland)",
      status: "online",
      load: 54,
      threats: 8,
      bandwidth: 7200,
      connections: 38940,
    },
    {
      id: "NODE-ASIA-PAC",
      location: "Asia Pacific (Singapore)",
      status: "maintenance",
      load: 0,
      threats: 0,
      bandwidth: 0,
      connections: 0,
    },
    {
      id: "NODE-SA-EAST",
      location: "South America (São Paulo)",
      status: "online",
      load: 43,
      threats: 5,
      bandwidth: 5800,
      connections: 28750,
    },
  ])

  const [globalStats, setGlobalStats] = useState({
    totalNodes: 4,
    activeNodes: 3,
    totalThreats: 25,
    blockedAttacks: 847293,
    totalBandwidth: 21500,
    activeConnections: 112920,
    firewallEfficiency: 99.7,
  })

  const [selectedNode, setSelectedNode] = useState<string>("NODE-US-EAST")
  const [firewallMode, setFirewallMode] = useState<"strict" | "balanced" | "permissive">("balanced")

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalNodes((prev) =>
        prev.map((node) => ({
          ...node,
          load: node.status === "online" ? Math.max(20, Math.min(90, node.load + (Math.random() - 0.5) * 10)) : 0,
          threats: node.status === "online" ? Math.max(0, node.threats + Math.floor(Math.random() * 3) - 1) : 0,
          connections:
            node.status === "online" ? Math.max(10000, node.connections + Math.floor(Math.random() * 1000) - 500) : 0,
        })),
      )

      setGlobalStats((prev) => ({
        ...prev,
        totalThreats: Math.max(0, prev.totalThreats + Math.floor(Math.random() * 5) - 2),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 50),
        activeConnections: Math.max(50000, prev.activeConnections + Math.floor(Math.random() * 2000) - 1000),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "maintenance":
        return "text-yellow-400"
      case "offline":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getNodeStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "maintenance":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case "allow":
        return "text-green-400"
      case "block":
        return "text-red-400"
      case "monitor":
        return "text-blue-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Globe className="h-8 w-8 text-primary cyber-glow" />
          <div>
            <h2 className="text-2xl font-bold">Global Firewall Engine</h2>
            <p className="text-muted-foreground">Enterprise-grade distributed security</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400">
            <Shield className="h-3 w-3 mr-1" />
            {firewallMode.toUpperCase()} MODE
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const modes = ["strict", "balanced", "permissive"] as const
              const currentIndex = modes.indexOf(firewallMode)
              const nextMode = modes[(currentIndex + 1) % modes.length]
              setFirewallMode(nextMode)
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Switch Mode
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
            <Server className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {globalStats.activeNodes}/{globalStats.totalNodes}
            </div>
            <p className="text-xs text-muted-foreground">Global coverage</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Attacks</CardTitle>
            <Shield className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{globalStats.blockedAttacks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total intercepted</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Network className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{globalStats.activeConnections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Real-time sessions</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{globalStats.firewallEfficiency}%</div>
            <Progress value={globalStats.firewallEfficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="nodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nodes">Global Nodes</TabsTrigger>
          <TabsTrigger value="rules">Firewall Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {globalNodes.map((node) => (
              <Card key={node.id} className="cyber-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{node.location}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getNodeStatusIcon(node.status)}
                      <Badge variant="outline" className={getNodeStatusColor(node.status)}>
                        {node.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Node ID</p>
                      <p className="font-medium font-mono">{node.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Connections</p>
                      <p className="font-medium">{node.connections.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System Load</span>
                      <span className="font-medium">{node.load}%</span>
                    </div>
                    <Progress value={node.load} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Threats</p>
                      <p className="font-medium text-red-400">{node.threats}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bandwidth</p>
                      <p className="font-medium text-green-400">{node.bandwidth} Mbps</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className={`font-medium ${getNodeStatusColor(node.status)}`}>{node.status.toUpperCase()}</p>
                    </div>
                  </div>

                  {node.status === "online" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => setSelectedNode(node.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {selectedNode === node.id ? "Monitoring" : "Monitor Node"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="space-y-4">
            {firewallRules.map((rule) => (
              <Card key={rule.id} className="cyber-glow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={getRuleTypeColor(rule.type)}>
                        {rule.type.toUpperCase()}
                      </Badge>
                      <h3 className="font-semibold">{rule.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-blue-400">
                        Priority {rule.priority}
                      </Badge>
                      <Badge variant={rule.status === "active" ? "default" : "secondary"}>
                        {rule.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Source</p>
                      <p className="font-mono">{rule.source}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Destination</p>
                      <p className="font-mono">{rule.destination}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Port</p>
                      <p className="font-mono">{rule.port}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Protocol</p>
                      <p className="font-mono">{rule.protocol}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Rule hits: </span>
                      <span className="font-medium">{rule.hits.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        {rule.status === "active" ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Enable
                          </>
                        )}
                      </Button>
                    </div>
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
                <CardTitle>Threat Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "DDoS", value: 35, color: "#EF4444" },
                          { name: "Malware", value: 25, color: "#F59E0B" },
                          { name: "Phishing", value: 20, color: "#8B5CF6" },
                          { name: "Brute Force", value: 15, color: "#EC4899" },
                          { name: "Other", value: 5, color: "#6B7280" },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: "DDoS", value: 35, color: "#EF4444" },
                          { name: "Malware", value: 25, color: "#F59E0B" },
                          { name: "Phishing", value: 20, color: "#8B5CF6" },
                          { name: "Brute Force", value: 15, color: "#EC4899" },
                          { name: "Other", value: 5, color: "#6B7280" },
                        ].map((entry, index) => (
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

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Traffic Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { hour: "00", inbound: 1200, outbound: 800, blocked: 45 },
                        { hour: "04", inbound: 800, outbound: 600, blocked: 23 },
                        { hour: "08", inbound: 2400, outbound: 1800, blocked: 89 },
                        { hour: "12", inbound: 3200, outbound: 2400, blocked: 156 },
                        { hour: "16", inbound: 2800, outbound: 2100, blocked: 134 },
                        { hour: "20", inbound: 2000, outbound: 1500, blocked: 67 },
                        { hour: "24", inbound: 1400, outbound: 1000, blocked: 34 },
                      ]}
                    >
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
                      <Bar dataKey="inbound" fill="#10B981" />
                      <Bar dataKey="outbound" fill="#3B82F6" />
                      <Bar dataKey="blocked" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Firewall Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mode">Security Mode</Label>
                  <select
                    id="mode"
                    value={firewallMode}
                    onChange={(e) => setFirewallMode(e.target.value as any)}
                    className="w-full p-2 bg-input border border-border rounded-md"
                  >
                    <option value="strict">Strict - Maximum Security</option>
                    <option value="balanced">Balanced - Recommended</option>
                    <option value="permissive">Permissive - Minimal Blocking</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
                  <Input id="timeout" type="number" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-connections">Max Connections per IP</Label>
                  <Input id="max-connections" type="number" defaultValue="100" />
                </div>

                <Button className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Apply Configuration
                </Button>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Advanced Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>DDoS Protection</span>
                  <Badge variant="outline" className="text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Geo-blocking</span>
                  <Badge variant="outline" className="text-green-400">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>AI Threat Detection</span>
                  <Badge variant="outline" className="text-green-400">
                    Learning
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zero-day Protection</span>
                  <Badge variant="outline" className="text-green-400">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quantum Encryption</span>
                  <Badge variant="outline" className="text-blue-400">
                    Ready
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
