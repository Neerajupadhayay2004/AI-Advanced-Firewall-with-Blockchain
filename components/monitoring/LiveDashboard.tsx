"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SecurityOperationsCenter } from "../dashboard/SecurityOperationsCenter"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Shield, Activity, Globe, Zap } from "lucide-react"

interface LiveDashboardProps {
  stats: any
  events: any[]
}

export function LiveDashboard({ stats, events }: LiveDashboardProps) {
  const [activeView, setActiveView] = useState<"overview" | "soc">("soc")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="text-black font-bold text-xl" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-cyber-primary">Advanced Security Dashboard</h1>
            <p className="text-cyber-secondary text-sm">Real-time threat monitoring and analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView("overview")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === "overview"
                ? "bg-cyan-500 text-black font-semibold"
                : "bg-cyber-card text-cyber-secondary border border-cyber"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView("soc")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === "soc"
                ? "bg-cyan-500 text-black font-semibold"
                : "bg-cyber-card text-cyber-secondary border border-cyber"
            }`}
          >
            Security Operations Center
          </button>
        </div>
      </div>

      {activeView === "soc" ? (
        <SecurityOperationsCenter />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Original overview cards */}
          <Card className="bg-cyber-card border-cyber">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-cyber-primary text-sm">
                <Shield className="h-4 w-4" />
                Threats Blocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.blocked || 0}</div>
              <p className="text-xs text-cyber-secondary">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-cyber-card border-cyber">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-cyber-primary text-sm">
                <Activity className="h-4 w-4" />
                Active Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.connections || 0}</div>
              <p className="text-xs text-cyber-secondary">Current sessions</p>
            </CardContent>
          </Card>

          <Card className="bg-cyber-card border-cyber">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-cyber-primary text-sm">
                <Globe className="h-4 w-4" />
                Global Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.global || 0}</div>
              <p className="text-xs text-cyber-secondary">Worldwide</p>
            </CardContent>
          </Card>

          <Card className="bg-cyber-card border-cyber">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-cyber-primary text-sm">
                <Zap className="h-4 w-4" />
                System Load
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats?.load || 0}%</div>
              <p className="text-xs text-cyber-secondary">CPU utilization</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
