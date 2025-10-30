"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Coins, Shield, AlertTriangle, Activity, Globe, Zap, Target, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts"

interface Web3Transaction {
  id: string
  transaction_hash: string
  blockchain: string
  from_address: string
  to_address: string
  value: number
  is_suspicious: boolean
  threat_indicators: string[]
  created_at: string
}

interface Web3Statistics {
  total: number
  suspicious: number
  by_blockchain: Record<string, number>
  total_value: number
  threat_types: Record<string, number>
}

export function Web3SecurityDashboard() {
  const [transactions, setTransactions] = useState<Web3Transaction[]>([])
  const [statistics, setStatistics] = useState<Web3Statistics | null>(null)
  const [defiStats, setDefiStats] = useState<any>(null)
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [alertLevel, setAlertLevel] = useState<"low" | "medium" | "high" | "critical">("low")

  const fetchWeb3Data = async () => {
    try {
      setIsLoading(true)

      // Fetch Web3 transactions
      const txResponse = await fetch(
        `/api/web3/transaction-analysis${selectedBlockchain !== "all" ? `?blockchain=${selectedBlockchain}` : ""}`,
      )
      const txData = await txResponse.json()

      setTransactions(txData.transactions || [])
      setStatistics(txData.statistics)

      // Fetch DeFi statistics
      const defiResponse = await fetch("/api/web3/defi-monitor")
      const defiData = await defiResponse.json()
      setDefiStats(defiData)

      // Determine alert level based on suspicious transactions
      const suspiciousRate =
        txData.statistics?.total > 0 ? (txData.statistics.suspicious / txData.statistics.total) * 100 : 0

      if (suspiciousRate > 20) setAlertLevel("critical")
      else if (suspiciousRate > 10) setAlertLevel("high")
      else if (suspiciousRate > 5) setAlertLevel("medium")
      else setAlertLevel("low")
    } catch (error) {
      console.error("Error fetching Web3 data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWeb3Data()
    const interval = setInterval(fetchWeb3Data, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [selectedBlockchain])

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

  const blockchainColors = ["#627eea", "#f7931a", "#8247e5", "#00d4aa", "#ff6b6b"]

  if (isLoading || !statistics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-purple-400 font-medium">Loading Web3 Security Dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-4 h-4 rounded-full ${getAlertLevelColor(alertLevel)}`}
            animate={{ scale: alertLevel === "critical" ? [1, 1.2, 1] : 1 }}
            transition={{ repeat: alertLevel === "critical" ? Number.POSITIVE_INFINITY : 0, duration: 1 }}
          />
          <h2 className="text-2xl font-bold text-white">Web3 Security Monitor</h2>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold">
            BLOCKCHAIN SECURITY
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {["all", "ethereum", "bitcoin", "polygon", "bsc"].map((blockchain) => (
            <Button
              key={blockchain}
              variant={selectedBlockchain === blockchain ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedBlockchain(blockchain)}
              className={
                selectedBlockchain === blockchain ? "bg-purple-500 text-white" : "border-purple-500/50 text-purple-400"
              }
            >
              {blockchain.charAt(0).toUpperCase() + blockchain.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Coins className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{statistics.total}</p>
                  <p className="text-xs text-purple-300">Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{statistics.suspicious}</p>
                  <p className="text-xs text-red-300">Suspicious</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(((statistics.total - statistics.suspicious) / statistics.total) * 100) || 0}%
                  </p>
                  <p className="text-xs text-green-300">Safe Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Object.keys(statistics.by_blockchain).length}</p>
                  <p className="text-xs text-blue-300">Blockchains</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Math.round(statistics.total_value).toLocaleString()}</p>
                  <p className="text-xs text-yellow-300">Total Value ETH</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-cyan-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Object.keys(statistics.threat_types).length}</p>
                  <p className="text-xs text-cyan-300">Threat Types</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blockchain Distribution */}
        <Card className="bg-black/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Globe className="h-5 w-5" />
              Blockchain Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(statistics.by_blockchain).map(([blockchain, count], index) => ({
                    name: blockchain.toUpperCase(),
                    value: count,
                    fill: blockchainColors[index % blockchainColors.length],
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {Object.entries(statistics.by_blockchain).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={blockchainColors[index % blockchainColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat Types */}
        <Card className="bg-black/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <AlertTriangle className="h-5 w-5" />
              Web3 Threat Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(statistics.threat_types).map(([type, count]) => ({
                  name: type.replace("_", " ").toUpperCase(),
                  count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* DeFi Protocol Statistics */}
      {defiStats && (
        <Card className="bg-black/50 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Activity className="h-5 w-5" />
              DeFi Protocol Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{defiStats.total_protocols}</div>
                <div className="text-sm text-gray-400">Monitored Protocols</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{defiStats.total_transactions}</div>
                <div className="text-sm text-gray-400">DeFi Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Object.values(defiStats.protocol_statistics || {}).reduce(
                    (sum: number, stats: any) => sum + stats.high_risk_transactions,
                    0,
                  )}
                </div>
                <div className="text-sm text-gray-400">High Risk Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="bg-black/50 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Eye className="h-5 w-5" />
            Recent Web3 Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 10).map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${tx.is_suspicious ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
                  />
                  <div>
                    <p className="text-white font-mono text-sm">
                      {tx.transaction_hash.substring(0, 10)}...
                      {tx.transaction_hash.substring(tx.transaction_hash.length - 8)}
                    </p>
                    <p className="text-xs text-gray-400">{tx.blockchain.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${tx.is_suspicious ? "bg-red-500" : "bg-green-500"}`}>
                    {tx.is_suspicious ? "SUSPICIOUS" : "SAFE"}
                  </Badge>
                  <span className="text-xs text-gray-400 font-mono">{tx.value.toFixed(4)} ETH</span>
                  <span className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleTimeString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
