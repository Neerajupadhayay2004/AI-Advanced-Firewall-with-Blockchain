"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, AlertTriangle, Activity, Eye, Lock, Zap, Server, Target, Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface SecurityMetrics {
  overview: {
    totalThreats: number
    blockedThreats: number
    criticalThreats: number
    activeRules: number
    securityScore: number
    blockRate: number
  }
  trends: {
    threatsByHour: Array<{ hour: number; threats: number; timestamp: string }>
    threatTypes: Record<string, number>
  }
  performance: {
    cpuUsage: number
    memoryUsage: number
    networkTraffic: number
    responseTime: number
  }
  recentThreats: any[]
}

export function SecurityOperationsCenter() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [timeRange, setTimeRange] = useState("24h")
  const [isLoading, setIsLoading] = useState(true)
  const [alertLevel, setAlertLevel] = useState<"low" | "medium" | "high" | "critical">("low")

  const fetchMetrics = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/security-metrics?range=${timeRange}`)
      const data = await response.json()
      setMetrics(data)

      // Determine alert level
      if (data.overview.criticalThreats > 5) {
        setAlertLevel("critical")
      } else if (data.overview.criticalThreats > 2) {
        setAlertLevel("high")
      } else if (data.overview.totalThreats > 10) {
        setAlertLevel("medium")
      } else {
        setAlertLevel("low")
      }
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    if (score >= 50) return "text-orange-400"
    return "text-red-400"
  }

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500 animate-pulse"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const threatTypeColors = ["#00f5ff", "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"]

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-cyan-400 font-medium">Loading Security Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Alert Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-4 h-4 rounded-full ${getAlertLevelColor(alertLevel)}`}
            animate={{ scale: alertLevel === "critical" ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: alertLevel === "critical" ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
          />
          <h2 className="text-2xl font-bold text-white">Security Operations Center</h2>
          <Badge className={`${getAlertLevelColor(alertLevel)} text-white font-semibold`}>
            {alertLevel.toUpperCase()} ALERT
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {["1h", "24h", "7d", "30d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-cyan-500 text-black" : "border-cyan-500/50 text-cyan-400"}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{metrics.overview.totalThreats}</p>
                  <p className="text-xs text-red-300">Total Threats</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{metrics.overview.blockedThreats}</p>
                  <p className="text-xs text-green-300">Blocked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{metrics.overview.criticalThreats}</p>
                  <p className="text-xs text-orange-300">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Lock className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{metrics.overview.activeRules}</p>
                  <p className="text-xs text-blue-300">Active Rules</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Brain className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className={`text-2xl font-bold ${getSecurityScoreColor(metrics.overview.securityScore)}`}>
                    {metrics.overview.securityScore}
                  </p>
                  <p className="text-xs text-cyan-300">Security Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{metrics.overview.blockRate}%</p>
                  <p className="text-xs text-purple-300">Block Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Timeline */}
        <Card className="bg-black/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Activity className="h-5 w-5" />
              Threat Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.trends.threatsByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hour" stroke="#9CA3AF" tickFormatter={(hour) => `${hour}:00`} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelFormatter={(hour) => `${hour}:00`}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#00f5ff"
                  strokeWidth={2}
                  dot={{ fill: "#00f5ff", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat Types Distribution */}
        <Card className="bg-black/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Target className="h-5 w-5" />
              Threat Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(metrics.trends.threatTypes).map(([type, count], index) => ({
                    name: type.replace("_", " ").toUpperCase(),
                    value: count,
                    fill: threatTypeColors[index % threatTypeColors.length],
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(metrics.trends.threatTypes).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={threatTypeColors[index % threatTypeColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <Card className="bg-black/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Server className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="30" stroke="#374151" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#00f5ff"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - metrics.performance.cpuUsage / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{Math.round(metrics.performance.cpuUsage)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">CPU Usage</p>
            </div>

            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="30" stroke="#374151" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#4ade80"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - metrics.performance.memoryUsage / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{Math.round(metrics.performance.memoryUsage)}%</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Memory Usage</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {Math.round(metrics.performance.networkTraffic)} Mbps
              </div>
              <p className="text-xs text-gray-400">Network Traffic</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {Math.round(metrics.performance.responseTime * 1000)}ms
              </div>
              <p className="text-xs text-gray-400">Response Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Threats */}
      <Card className="bg-black/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Eye className="h-5 w-5" />
            Recent Threat Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentThreats.map((threat, index) => (
              <motion.div
                key={threat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      threat.severity === "critical"
                        ? "bg-red-500"
                        : threat.severity === "high"
                          ? "bg-orange-500"
                          : threat.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                  />
                  <div>
                    <p className="text-white font-medium">{threat.threat_type.replace("_", " ").toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{threat.source_ip}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${threat.status === "blocked" ? "bg-red-500" : "bg-yellow-500"}`}>
                    {threat.status}
                  </Badge>
                  <span className="text-xs text-gray-400">{new Date(threat.created_at).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
