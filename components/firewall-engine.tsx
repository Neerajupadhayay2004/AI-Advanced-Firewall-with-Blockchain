"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Shield, Zap, Settings } from "lucide-react"

interface FirewallRule {
  id: string
  name: string
  type: "BLOCK" | "ALLOW" | "MONITOR"
  pattern: string
  confidence: number
  active: boolean
  threats_blocked: number
}

interface AIModel {
  name: string
  accuracy: number
  processing_speed: number
  active: boolean
  last_updated: string
}

export function FirewallEngine() {
  const [aiModels, setAiModels] = useState<AIModel[]>([
    {
      name: "Deep Packet Inspection AI",
      accuracy: 99.2,
      processing_speed: 847,
      active: true,
      last_updated: "2 minutes ago",
    },
    {
      name: "Behavioral Analysis Engine",
      accuracy: 97.8,
      processing_speed: 1203,
      active: true,
      last_updated: "5 minutes ago",
    },
    {
      name: "Threat Intelligence ML",
      accuracy: 98.5,
      processing_speed: 692,
      active: true,
      last_updated: "1 minute ago",
    },
  ])

  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>([
    {
      id: "1",
      name: "SQL Injection Detection",
      type: "BLOCK",
      pattern: "/(union|select|insert|drop|delete|script)/i",
      confidence: 95.7,
      active: true,
      threats_blocked: 342,
    },
    {
      id: "2",
      name: "DDoS Pattern Recognition",
      type: "BLOCK",
      pattern: "rate_limit > 1000/min",
      confidence: 98.2,
      active: true,
      threats_blocked: 1847,
    },
    {
      id: "3",
      name: "Suspicious User Agent",
      type: "MONITOR",
      pattern: "/bot|crawler|spider/i",
      confidence: 87.3,
      active: true,
      threats_blocked: 156,
    },
  ])

  const [newRule, setNewRule] = useState({
    name: "",
    type: "BLOCK" as const,
    pattern: "",
  })

  const [engineStatus, setEngineStatus] = useState({
    active: true,
    processing_rate: 15420,
    cpu_usage: 23.7,
    memory_usage: 45.2,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineStatus((prev) => ({
        ...prev,
        processing_rate: prev.processing_rate + Math.floor(Math.random() * 100) - 50,
        cpu_usage: Math.max(10, Math.min(90, prev.cpu_usage + Math.random() * 4 - 2)),
        memory_usage: Math.max(20, Math.min(80, prev.memory_usage + Math.random() * 3 - 1.5)),
      }))

      setAiModels((prev) =>
        prev.map((model) => ({
          ...model,
          processing_speed: model.processing_speed + Math.floor(Math.random() * 100) - 50,
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const toggleEngine = () => {
    setEngineStatus((prev) => ({ ...prev, active: !prev.active }))
  }

  const toggleRule = (ruleId: string) => {
    setFirewallRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, active: !rule.active } : rule)))
  }

  const addRule = () => {
    if (newRule.name && newRule.pattern) {
      const rule: FirewallRule = {
        id: Date.now().toString(),
        name: newRule.name,
        type: newRule.type,
        pattern: newRule.pattern,
        confidence: Math.floor(Math.random() * 20) + 80,
        active: true,
        threats_blocked: 0,
      }
      setFirewallRules((prev) => [...prev, rule])
      setNewRule({ name: "", type: "BLOCK", pattern: "" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 cyber-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle>AI Firewall Engine</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="engine-toggle">Engine Status</Label>
                <Switch id="engine-toggle" checked={engineStatus.active} onCheckedChange={toggleEngine} />
                <Badge variant={engineStatus.active ? "default" : "secondary"}>
                  {engineStatus.active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Processing Rate</Label>
                <div className="text-2xl font-bold text-primary">
                  {engineStatus.processing_rate.toLocaleString()}/sec
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Threat Detection</Label>
                <div className="text-2xl font-bold text-green-400">99.7%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>{engineStatus.cpu_usage.toFixed(1)}%</span>
              </div>
              <Progress value={engineStatus.cpu_usage} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>{engineStatus.memory_usage.toFixed(1)}%</span>
              </div>
              <Progress value={engineStatus.memory_usage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-transparent" variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Optimize Rules
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              Retrain Models
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Export Config
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-glow">
        <CardHeader>
          <CardTitle>AI Detection Models</CardTitle>
          <CardDescription>Neural networks powering threat detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiModels.map((model, index) => (
              <Card key={index} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{model.name}</CardTitle>
                    <Badge variant={model.active ? "default" : "secondary"} className="text-xs">
                      {model.active ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="text-green-400">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Speed</span>
                    <span className="text-primary">{model.processing_speed}/s</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Updated {model.last_updated}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle>Active Firewall Rules</CardTitle>
            <CardDescription>AI-generated and custom security rules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {firewallRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          rule.type === "BLOCK" ? "destructive" : rule.type === "ALLOW" ? "default" : "secondary"
                        }
                      >
                        {rule.type}
                      </Badge>
                      <span className="font-medium">{rule.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Pattern: {rule.pattern}</div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {rule.confidence}% • Blocked: {rule.threats_blocked}
                    </div>
                  </div>
                  <Switch checked={rule.active} onCheckedChange={() => toggleRule(rule.id)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader>
            <CardTitle>Add Custom Rule</CardTitle>
            <CardDescription>Create new firewall rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input
                id="rule-name"
                value={newRule.name}
                onChange={(e) => setNewRule((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter rule name"
              />
            </div>

            <div>
              <Label htmlFor="rule-type">Action Type</Label>
              <select
                id="rule-type"
                value={newRule.type}
                onChange={(e) => setNewRule((prev) => ({ ...prev, type: e.target.value as any }))}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                <option value="BLOCK">Block</option>
                <option value="ALLOW">Allow</option>
                <option value="MONITOR">Monitor</option>
              </select>
            </div>

            <div>
              <Label htmlFor="rule-pattern">Pattern/Condition</Label>
              <Textarea
                id="rule-pattern"
                value={newRule.pattern}
                onChange={(e) => setNewRule((prev) => ({ ...prev, pattern: e.target.value }))}
                placeholder="Enter regex pattern or condition"
                rows={3}
              />
            </div>

            <Button onClick={addRule} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Add Rule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
