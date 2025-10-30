"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, Cpu, Activity, TrendingUp, Zap, Target, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface MLMetrics {
  model_name: string
  model_version: string
  accuracy: number
  precision_score: number
  recall: number
  f1_score: number
  evaluation_date: string
  is_active: boolean
}

interface ProcessingStats {
  processed_count: number
  threats_detected: number
  uptime_seconds: number
  processing_rate: number
  threat_detection_rate: number
  is_running: boolean
}

export function PythonMLDashboard() {
  const [mlMetrics, setMlMetrics] = useState<MLMetrics | null>(null)
  const [processingStats, setProcessingStats] = useState<ProcessingStats | null>(null)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingOutput, setTrainingOutput] = useState<string>("")
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([])

  const fetchMLMetrics = async () => {
    try {
      const response = await fetch("/api/python/ml-analysis?action=metrics")
      const data = await response.json()
      setMlMetrics(data.metrics)
    } catch (error) {
      console.error("Error fetching ML metrics:", error)
    }
  }

  const fetchProcessingStats = async () => {
    try {
      // This would connect to the real-time processor
      // For now, we'll simulate some stats
      setProcessingStats({
        processed_count: Math.floor(Math.random() * 10000),
        threats_detected: Math.floor(Math.random() * 500),
        uptime_seconds: Math.floor(Math.random() * 86400),
        processing_rate: Math.random() * 100,
        threat_detection_rate: Math.random() * 20,
        is_running: true,
      })
    } catch (error) {
      console.error("Error fetching processing stats:", error)
    }
  }

  const startModelTraining = async () => {
    setIsTraining(true)
    setTrainingOutput("Starting model training...\n")

    try {
      const response = await fetch("/api/python/ml-analysis?action=train")
      const data = await response.json()

      setTrainingOutput((prev) => prev + `Training completed: ${data.message}\n`)
      if (data.success) {
        await fetchMLMetrics() // Refresh metrics after training
      }
    } catch (error) {
      setTrainingOutput((prev) => prev + `Training failed: ${error}\n`)
    } finally {
      setIsTraining(false)
    }
  }

  const testMLAnalysis = async () => {
    try {
      const testData = {
        payload: "' OR '1'='1' --",
        user_agent: "Mozilla/5.0",
        request_path: "/login",
        source_ip: "192.168.1.100",
      }

      const response = await fetch("/api/python/ml-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      const result = await response.json()
      setAnalysisHistory((prev) => [result, ...prev.slice(0, 9)]) // Keep last 10 results
    } catch (error) {
      console.error("Error testing ML analysis:", error)
    }
  }

  useEffect(() => {
    fetchMLMetrics()
    fetchProcessingStats()

    const interval = setInterval(() => {
      fetchProcessingStats()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <Brain className="text-white text-xl" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Python ML Engine</h2>
            <p className="text-gray-400">Advanced Machine Learning Security Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={testMLAnalysis}
            variant="outline"
            className="border-green-500/50 text-green-400 bg-transparent"
          >
            <Target className="h-4 w-4 mr-2" />
            Test Analysis
          </Button>
          <Button
            onClick={startModelTraining}
            disabled={isTraining}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isTraining ? "Training..." : "Train Models"}
          </Button>
        </div>
      </div>

      {/* ML Model Metrics */}
      {mlMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Math.round(mlMetrics.accuracy * 100)}%</p>
                  <p className="text-xs text-green-300">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Math.round(mlMetrics.precision_score * 100)}%</p>
                  <p className="text-xs text-blue-300">Precision</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Math.round(mlMetrics.recall * 100)}%</p>
                  <p className="text-xs text-purple-300">Recall</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-orange-400" />
                <div>
                  <p className="text-2xl font-bold text-white">{Math.round(mlMetrics.f1_score * 100)}%</p>
                  <p className="text-xs text-orange-300">F1 Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Processing Statistics */}
      {processingStats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-black/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Cpu className="h-5 w-5" />
                Real-time Processing Stats
                <Badge className={`ml-auto ${processingStats.is_running ? "bg-green-500" : "bg-red-500"}`}>
                  {processingStats.is_running ? "RUNNING" : "STOPPED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {processingStats.processed_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Events Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {processingStats.threats_detected.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Threats Detected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {processingStats.processing_rate.toFixed(1)}/sec
                  </div>
                  <div className="text-sm text-gray-400">Processing Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatUptime(processingStats.uptime_seconds)}
                  </div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/50 border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Activity className="h-5 w-5" />
                Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mlMetrics && (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={[
                      { name: "Accuracy", value: mlMetrics.accuracy * 100 },
                      { name: "Precision", value: mlMetrics.precision_score * 100 },
                      { name: "Recall", value: mlMetrics.recall * 100 },
                      { name: "F1 Score", value: mlMetrics.f1_score * 100 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Training Output */}
      {(isTraining || trainingOutput) && (
        <Card className="bg-black/50 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Settings className="h-5 w-5" />
              Model Training
              {isTraining && (
                <div className="ml-auto w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-64 overflow-y-auto">
              <pre>{trainingOutput}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Analysis Results */}
      {analysisHistory.length > 0 && (
        <Card className="bg-black/50 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Target className="h-5 w-5" />
              Recent ML Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisHistory.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        result.analysis?.is_threat ? "bg-red-500 animate-pulse" : "bg-green-500"
                      }`}
                    />
                    <div>
                      <p className="text-white font-medium">
                        {result.analysis?.threat_type?.toUpperCase() || "UNKNOWN"}
                      </p>
                      <p className="text-xs text-gray-400">Risk Score: {result.analysis?.risk_score || 0}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-xs ${
                        result.analysis?.severity === "critical"
                          ? "bg-red-500"
                          : result.analysis?.severity === "high"
                            ? "bg-orange-500"
                            : result.analysis?.severity === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                    >
                      {result.analysis?.severity?.toUpperCase() || "LOW"}
                    </Badge>
                    <span className="text-xs text-gray-400 font-mono">
                      {Math.round((result.analysis?.confidence || 0) * 100)}% confidence
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
