import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, TrendingUp, AlertCircle, Shield, Zap, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface AIInsight {
  id: string
  type: 'prediction' | 'anomaly' | 'recommendation' | 'alert'
  title: string
  description: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  actionable: boolean
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    generateInsights()
    const interval = setInterval(generateInsights, 15000)
    return () => clearInterval(interval)
  }, [])

  const generateInsights = () => {
    setIsAnalyzing(true)
    
    setTimeout(() => {
      const newInsights: AIInsight[] = [
        {
          id: '1',
          type: 'prediction',
          title: 'DDoS Attack Predicted',
          description: 'AI models detect 87% probability of coordinated DDoS attack within next 2 hours based on traffic patterns.',
          confidence: 87,
          severity: 'high',
          timestamp: new Date().toISOString(),
          actionable: true
        },
        {
          id: '2',
          type: 'anomaly',
          title: 'Unusual API Access Pattern',
          description: 'Detected 340% increase in API calls from Eastern European IP ranges. Potential credential stuffing attack.',
          confidence: 94,
          severity: 'critical',
          timestamp: new Date().toISOString(),
          actionable: true
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Firewall Rule Optimization',
          description: 'AI suggests updating rule priority for better performance. Estimated 23% improvement in response time.',
          confidence: 76,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          actionable: true
        },
        {
          id: '4',
          type: 'alert',
          title: 'Zero-Day Exploit Signature',
          description: 'Machine learning models identified potential zero-day exploit attempts targeting web application frameworks.',
          confidence: 91,
          severity: 'critical',
          timestamp: new Date().toISOString(),
          actionable: true
        },
        {
          id: '5',
          type: 'prediction',
          title: 'Resource Scaling Needed',
          description: 'Predictive analytics suggest 45% increase in traffic load expected. Recommend scaling infrastructure.',
          confidence: 82,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          actionable: true
        }
      ]
      
      setInsights(newInsights)
      setIsAnalyzing(false)
    }, 2000)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return TrendingUp
      case 'anomaly': return AlertCircle
      case 'recommendation': return Target
      case 'alert': return Shield
      default: return Brain
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-500/50 bg-red-500/10'
      case 'high': return 'text-orange-400 border-orange-500/50 bg-orange-500/10'
      case 'medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10'
      case 'low': return 'text-green-400 border-green-500/50 bg-green-500/10'
      default: return 'text-gray-400 border-gray-500/50 bg-gray-500/10'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'text-blue-400'
      case 'anomaly': return 'text-red-400'
      case 'recommendation': return 'text-green-400'
      case 'alert': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <Card className="bg-black/50 border-cyan-500/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Brain className="h-5 w-5" />
          AI Security Insights
          {isAnalyzing && (
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-cyan-400">Analyzing...</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {insights.filter(i => i.severity === 'critical').length}
            </div>
            <div className="text-xs text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {insights.filter(i => i.severity === 'high').length}
            </div>
            <div className="text-xs text-gray-400">High</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {insights.filter(i => i.actionable).length}
            </div>
            <div className="text-xs text-gray-400">Actionable</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length) || 0}%
            </div>
            <div className="text-xs text-gray-400">Avg Confidence</div>
          </div>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type)
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-cyan-500/50 ${getSeverityColor(insight.severity)}`}
                  onClick={() => setSelectedInsight(insight)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getTypeColor(insight.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium text-sm">{insight.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getSeverityColor(insight.severity)}`}>
                          {insight.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(insight.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 pt-4 border-t border-cyan-500/20">
          <Button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Brain className="h-4 w-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Refresh Insights'}
          </Button>
          <Button variant="outline" className="border-cyan-500/50 text-cyan-400">
            <Zap className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
