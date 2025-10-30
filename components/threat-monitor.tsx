"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Search, Download, RefreshCw } from "lucide-react"

interface ThreatEvent {
  id: string
  timestamp: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  source_ip: string
  destination_ip: string
  description: string
  status: "Active" | "Blocked" | "Investigating" | "Resolved"
  confidence: number
}

interface ThreatSignature {
  id: string
  name: string
  type: string
  pattern: string
  severity: string
  last_seen: string
  hit_count: number
  active: boolean
}

export function ThreatMonitor() {
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([
    {
      id: "T-001",
      timestamp: "2024-01-15 14:23:45",
      type: "SQL Injection",
      severity: "High",
      source_ip: "192.168.1.100",
      destination_ip: "10.0.0.5",
      description: "Attempted SQL injection on login form",
      status: "Blocked",
      confidence: 95.7,
    },
    {
      id: "T-002",
      timestamp: "2024-01-15 14:22:12",
      type: "DDoS Attack",
      severity: "Critical",
      source_ip: "203.0.113.45",
      destination_ip: "10.0.0.1",
      description: "High volume traffic from suspicious source",
      status: "Active",
      confidence: 98.3,
    },
    {
      id: "T-003",
      timestamp: "2024-01-15 14:20:33",
      type: "Port Scan",
      severity: "Medium",
      source_ip: "198.51.100.23",
      destination_ip: "10.0.0.8",
      description: "Sequential port scanning detected",
      status: "Investigating",
      confidence: 87.2,
    },
  ])

  const [threatSignatures, setThreatSignatures] = useState<ThreatSignature[]>([
    {
      id: "SIG-001",
      name: "SQL Injection Pattern",
      type: "Web Attack",
      pattern: "/(union|select|insert|drop)/i",
      severity: "High",
      last_seen: "2 minutes ago",
      hit_count: 1247,
      active: true,
    },
    {
      id: "SIG-002",
      name: "Brute Force Login",
      type: "Authentication",
      pattern: "failed_login_attempts > 10",
      severity: "Medium",
      last_seen: "5 minutes ago",
      hit_count: 892,
      active: true,
    },
    {
      id: "SIG-003",
      name: "Malware C2 Communication",
      type: "Malware",
      pattern: "suspicious_domain_pattern",
      severity: "Critical",
      last_seen: "1 hour ago",
      hit_count: 45,
      active: true,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("All")

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new threat events
      if (Math.random() > 0.7) {
        const newEvent: ThreatEvent = {
          id: `T-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          type: ["SQL Injection", "XSS", "DDoS Attack", "Port Scan"][Math.floor(Math.random() * 4)],
          severity: ["Low", "Medium", "High", "Critical"][Math.floor(Math.random() * 4)] as any,
          source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          destination_ip: `10.0.0.${Math.floor(Math.random() * 255)}`,
          description: "Automated threat detection",
          status: ["Active", "Blocked", "Investigating"][Math.floor(Math.random() * 3)] as any,
          confidence: Math.floor(Math.random() * 30) + 70,
        }
        setThreatEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-400"
      case "High":
        return "text-orange-400"
      case "Medium":
        return "text-yellow-400"
      case "Low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "destructive"
      case "Blocked":
        return "default"
      case "Investigating":
        return "secondary"
      case "Resolved":
        return "outline"
      default:
        return "secondary"
    }
  }

  const filteredEvents = threatEvents.filter((event) => {
    const matchesSearch =
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.source_ip.includes(searchTerm)
    const matchesSeverity = filterSeverity === "All" || event.severity === filterSeverity
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Threat Monitor</h2>
          <p className="text-muted-foreground">Real-time threat detection and analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Threats</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by description, type, or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="severity-filter">Filter by Severity</Label>
          <select
            id="severity-filter"
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Threat Events</TabsTrigger>
          <TabsTrigger value="signatures">Threat Signatures</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Active Threat Events</CardTitle>
              <CardDescription>Real-time security events and incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getStatusColor(event.status) as any}>{event.status}</Badge>
                        <Badge variant="outline" className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">#{event.id}</span>
                      </div>
                      <div className="font-medium mb-1">{event.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.type} • {event.source_ip} → {event.destination_ip} • {event.timestamp} • Confidence:{" "}
                        {event.confidence}%
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      {event.status === "Active" && (
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
        </TabsContent>

        <TabsContent value="signatures">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Threat Signatures</CardTitle>
              <CardDescription>Detection patterns and rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatSignatures.map((signature) => (
                  <div
                    key={signature.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={signature.active ? "default" : "secondary"}>
                          {signature.active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{signature.type}</Badge>
                        <span className="text-sm text-muted-foreground">#{signature.id}</span>
                      </div>
                      <div className="font-medium mb-1">{signature.name}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Pattern: <code className="bg-muted px-1 rounded">{signature.pattern}</code>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Severity: {signature.severity} • Hits: {signature.hit_count} • Last seen: {signature.last_seen}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant={signature.active ? "destructive" : "default"} size="sm">
                        {signature.active ? "Disable" : "Enable"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle className="text-lg">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">2,847</div>
                <p className="text-sm text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle className="text-lg">Blocked Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">2,791</div>
                <p className="text-sm text-muted-foreground">98.0% success rate</p>
              </CardContent>
            </Card>
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle className="text-lg">Active Investigations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">12</div>
                <p className="text-sm text-muted-foreground">Requiring attention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
