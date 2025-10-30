"use client"

import { useState, useEffect } from "react"
import { Brain, Shield, AlertTriangle, TrendingUp, Zap, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { supabase } from "../../lib/supabase"

interface ThreatLog {
  id: string
  threat_type: string
  severity: "low" | "medium" | "high" | "critical"
  source_ip: string
  ai_confidence: number
  status: string
  created_at: string
  payload?: any
}

interface ThreatAnalyzerProps {
  events: any[]
}

export function ThreatAnalyzer({ events }: ThreatAnalyzerProps) {
  const [threats, setThreats] = useState<ThreatLog[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiMetrics, setAiMetrics] = useState<any>(null)
  const [realTimeAnalysis, setRealTimeAnalysis] = useState<string>("")

  const analyzeThreats = async () => {
    setIsAnalyzing(true)

    try {
      // Fetch real threat data from Supabase
      const { data: threatData, error } = await supabase
        .from("threat_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (error) throw error

      setThreats(threatData || [])

      // Get AI model metrics
      const response = await fetch("/api/ai/model-metrics")
      const metricsData = await response.json()
      setAiMetrics(metricsData.metrics?.[0])

      // Generate real-time analysis
      const criticalCount = threatData?.filter((t) => t.severity === "critical").length || 0
      const blockedCount = threatData?.filter((t) => t.status === "blocked").length || 0
      const avgConfidence = threatData?.reduce((sum, t) => sum + (t.ai_confidence || 0), 0) / (threatData?.length || 1)

      let analysis = `🤖 AI Threat Analysis Report\n\n`
      analysis += `📊 Processed ${threatData?.length || 0} security events\n`
      analysis += `🛡️ Blocked ${blockedCount} threats (${Math.round((blockedCount / (threatData?.length || 1)) * 100)}% success rate)\n`
      analysis += `⚠️ Critical threats: ${criticalCount}\n`
      analysis += `🎯 Average AI confidence: ${Math.round(avgConfidence * 100)}%\n\n`

      if (criticalCount > 3) {
        analysis += `🚨 HIGH ALERT: Multiple critical threats detected!\n`
        analysis += `• Immediate investigation required\n`
        analysis += `• Consider activating incident response\n`
      } else if (criticalCount > 0) {
        analysis += `🟡 MODERATE RISK: Critical threats identified\n`
        analysis += `• Enhanced monitoring active\n`
        analysis += `• Review threat patterns\n`
      } else {
        analysis += `✅ SECURE STATUS: Threat levels normal\n`
        analysis += `• AI models performing optimally\n`
        analysis += `• Continuous monitoring active\n`
      }

      analysis += `\n🔧 AI Model Performance:\n`
      if (aiMetrics) {
        analysis += `• Accuracy: ${Math.round(aiMetrics.accuracy * 100)}%\n`
        analysis += `• Precision: ${Math.round(aiMetrics.precision_score * 100)}%\n`
        analysis += `• False Positive Rate: ${Math.round(aiMetrics.false_positive_rate * 100)}%\n`
      }

      analysis += `\n💡 Recommendations:\n`
      analysis += `• Update ML models with latest threat patterns\n`
      analysis += `• Review firewall rules for optimization\n`
      analysis += `• Schedule security audit for high-risk endpoints\n`
      analysis += `• Consider threat hunting for advanced persistent threats`

      setRealTimeAnalysis(analysis)
    } catch (error) {
      console.error("Error analyzing threats:", error)
      setRealTimeAnalysis("❌ Error: Unable to fetch threat data. Please check database connection.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  useEffect(() => {
    analyzeThreats()

    // Set up real-time subscription
    const subscription = supabase
      .channel("threat_logs")
      .on("postgres_changes", { event: "*", schema: "public", table: "threat_logs" }, (payload) => {
        console.log("[v0] New threat detected:", payload)
        analyzeThreats() // Refresh analysis when new threats are detected
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const getThreatLevelColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      default:
        return "bg-green-500 text-white"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400"
    if (confidence >= 0.6) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className="h-full bg-cyber-card border-cyber">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyber-primary">
          <Brain className="h-5 w-5" />
          AI Threat Analyzer
          <Badge variant="cyber" className="ml-auto bg-gradient-to-r from-cyan-400 to-blue-600 text-black">
            ADVANCED AI
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <Shield className="h-6 w-6 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Blocked</p>
              <p className="text-xl font-bold text-white">{threats.filter((t) => t.status === "blocked").length}</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Critical</p>
              <p className="text-xl font-bold text-white">{threats.filter((t) => t.severity === "critical").length}</p>
            </div>
            <div className="text-center">
              <Target className="h-6 w-6 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">AI Confidence</p>
              <p className="text-xl font-bold text-white">
                {threats.length > 0
                  ? Math.round((threats.reduce((sum, t) => sum + (t.ai_confidence || 0), 0) / threats.length) * 100)
                  : 0}
                %
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-xl font-bold text-white">{threats.length}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={analyzeThreats}
              disabled={isAnalyzing}
              variant="cyber"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
            </Button>
            <Button
              variant="outline"
              className="border-cyber text-cyber-primary bg-transparent"
              onClick={() => window.open("/api/ai/threat-analysis", "_blank")}
            >
              <Zap className="h-4 w-4" />
            </Button>
          </div>

          {realTimeAnalysis && (
            <div className="bg-cyber-card rounded-lg p-4 border border-cyber max-h-64 overflow-y-auto">
              <pre className="text-sm text-cyber-primary whitespace-pre-wrap font-mono">{realTimeAnalysis}</pre>
            </div>
          )}

          {threats.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cyber-primary">Recent Threats</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {threats.slice(0, 5).map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center justify-between text-xs bg-cyber-card/50 p-2 rounded border border-cyber/30"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getThreatLevelColor(threat.severity)}`}>{threat.threat_type}</Badge>
                      <span className="text-gray-400">{threat.source_ip}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono ${getConfidenceColor(threat.ai_confidence || 0)}`}>
                        {Math.round((threat.ai_confidence || 0) * 100)}%
                      </span>
                      <Badge
                        variant="outline"
                        className={threat.status === "blocked" ? "text-red-400" : "text-yellow-400"}
                      >
                        {threat.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
