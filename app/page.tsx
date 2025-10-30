"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Activity,
  AlertTriangle,
  Eye,
  Zap,
  Globe,
  Lock,
  Cpu,
  Box,
  FileText,
  Settings,
  Radar,
  Satellite,
  Brain,
} from "lucide-react"
import { FirewallEngine } from "@/components/firewall-engine"
import { ThreatMonitor } from "@/components/threat-monitor"
import { SecurityDashboard } from "@/components/security-dashboard"
import { Web3Security } from "@/components/web3-security"
import { RealTimeMonitor } from "@/components/realtime-monitor"
import { GlobalLiveDetector } from "@/components/global-live-detector"
import { SecurityVisualization3D } from "@/components/3d-security-visualization"
import { ReportGenerator } from "@/components/report-generator"
import { SystemOrchestrator } from "@/components/system-orchestrator"
import { AdvancedLiveDetector } from "@/components/advanced-live-detector"
import { SatelliteConnection } from "@/components/satellite-connection"
import { GlobalFirewallEngine } from "@/components/global-firewall-engine"
import { MLTrainingCenter } from "@/components/ml-training-center"

export default function CyberSecurityDashboard() {
  const [mounted, setMounted] = useState(false)
  const [threatLevel, setThreatLevel] = useState(2)
  const [activeThreats, setActiveThreats] = useState(7)
  const [blockedAttacks, setBlockedAttacks] = useState(1247)
  const [systemStatus, setSystemStatus] = useState("SECURE")

  useEffect(() => {
    setMounted(true)

    const interval = setInterval(() => {
      setActiveThreats((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      setBlockedAttacks((prev) => prev + Math.floor(Math.random() * 5))
      setThreatLevel(Math.floor(Math.random() * 5) + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getThreatColor = (level: number) => {
    if (level <= 2) return "text-emerald-400"
    if (level <= 3) return "text-amber-400"
    return "text-red-400"
  }

  const getThreatStatus = (level: number) => {
    if (level <= 2) return "LOW"
    if (level <= 3) return "MEDIUM"
    return "HIGH"
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-lg">Initializing CyberGuard AI...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">CyberGuard AI</h1>
                <p className="text-slate-400 font-medium">Advanced Global Security Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={systemStatus === "SECURE" ? "default" : "destructive"}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                <Lock className="h-4 w-4 mr-2" />
                {systemStatus}
              </Badge>
              <Badge
                variant="outline"
                className={`px-4 py-2 border-2 font-semibold ${getThreatColor(threatLevel)} border-current`}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                THREAT: {getThreatStatus(threatLevel)}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300">Active Threats</CardTitle>
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400 mb-1">{activeThreats}</div>
              <p className="text-xs text-slate-400">Real-time detection active</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300">Blocked Attacks</CardTitle>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400 mb-1">{blockedAttacks.toLocaleString()}</div>
              <p className="text-xs text-slate-400">+{Math.floor(Math.random() * 10)} in last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300">AI Processing</CardTitle>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Cpu className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400 mb-2">98.7%</div>
              <Progress value={98.7} className="h-2 bg-slate-800" />
              <p className="text-xs text-slate-400 mt-2">Neural network efficiency</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold text-slate-300">Network Status</CardTitle>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-400 mb-1">ONLINE</div>
              <p className="text-xs text-slate-400">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orchestrator" className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-2 border border-slate-700">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-transparent">
              <TabsTrigger
                value="orchestrator"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4" />
                Control Center
              </TabsTrigger>
              <TabsTrigger
                value="satellite"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Satellite className="h-4 w-4" />
                Satellite Link
              </TabsTrigger>
              <TabsTrigger
                value="global-firewall"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Globe className="h-4 w-4" />
                Global Firewall
              </TabsTrigger>
              <TabsTrigger
                value="advanced-detector"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Radar className="h-4 w-4" />
                Live Detection
              </TabsTrigger>
              <TabsTrigger
                value="ml-training"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Brain className="h-4 w-4" />
                AI Training
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Eye className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-slate-900 rounded-xl p-2 border border-slate-700">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-transparent">
              <TabsTrigger
                value="firewall"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Shield className="h-4 w-4" />
                AI Firewall
              </TabsTrigger>
              <TabsTrigger
                value="threats"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <AlertTriangle className="h-4 w-4" />
                Threat Monitor
              </TabsTrigger>
              <TabsTrigger
                value="web3"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Globe className="h-4 w-4" />
                Web3 Security
              </TabsTrigger>
              <TabsTrigger
                value="monitor"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Zap className="h-4 w-4" />
                Live Monitor
              </TabsTrigger>
              <TabsTrigger
                value="global"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Globe className="h-4 w-4" />
                Global Detection
              </TabsTrigger>
              <TabsTrigger
                value="3d"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Box className="h-4 w-4" />
                3D Visualization
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <FileText className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orchestrator">
            <SystemOrchestrator />
          </TabsContent>

          <TabsContent value="satellite">
            <SatelliteConnection />
          </TabsContent>

          <TabsContent value="global-firewall">
            <GlobalFirewallEngine />
          </TabsContent>

          <TabsContent value="advanced-detector">
            <AdvancedLiveDetector />
          </TabsContent>

          <TabsContent value="ml-training">
            <MLTrainingCenter />
          </TabsContent>

          <TabsContent value="dashboard">
            <SecurityDashboard />
          </TabsContent>

          <TabsContent value="firewall">
            <FirewallEngine />
          </TabsContent>

          <TabsContent value="threats">
            <ThreatMonitor />
          </TabsContent>

          <TabsContent value="web3">
            <Web3Security />
          </TabsContent>

          <TabsContent value="monitor">
            <RealTimeMonitor />
          </TabsContent>

          <TabsContent value="global">
            <GlobalLiveDetector />
          </TabsContent>

          <TabsContent value="3d">
            <SecurityVisualization3D />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
