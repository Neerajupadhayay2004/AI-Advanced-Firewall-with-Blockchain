import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, MapPin, Shield, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'

interface ThreatLocation {
  id: string
  country: string
  city: string
  lat: number
  lng: number
  threatCount: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  blocked: boolean
}

export function ThreatMap() {
  const [threats, setThreats] = useState<ThreatLocation[]>([])
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null)

  useEffect(() => {
    // Simulate global threat data
    const mockThreats: ThreatLocation[] = [
      { id: '1', country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6176, threatCount: 1247, severity: 'critical', blocked: true },
      { id: '2', country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074, threatCount: 892, severity: 'high', blocked: true },
      { id: '3', country: 'North Korea', city: 'Pyongyang', lat: 39.0392, lng: 125.7625, threatCount: 634, severity: 'critical', blocked: true },
      { id: '4', country: 'Iran', city: 'Tehran', lat: 35.6892, lng: 51.3890, threatCount: 445, severity: 'medium', blocked: false },
      { id: '5', country: 'Brazil', city: 'São Paulo', lat: -23.5505, lng: -46.6333, threatCount: 234, severity: 'low', blocked: false },
      { id: '6', country: 'India', city: 'Mumbai', lat: 19.0760, lng: 72.8777, threatCount: 156, severity: 'low', blocked: false },
    ]
    setThreats(mockThreats)

    // Update threat counts periodically
    const interval = setInterval(() => {
      setThreats(prev => prev.map(threat => ({
        ...threat,
        threatCount: threat.threatCount + Math.floor(Math.random() * 10)
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'
      case 'high': return '#f97316'
      case 'medium': return '#eab308'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  const getThreatSize = (count: number) => {
    if (count > 1000) return 'w-6 h-6'
    if (count > 500) return 'w-5 h-5'
    if (count > 100) return 'w-4 h-4'
    return 'w-3 h-3'
  }

  return (
    <Card className="bg-black/50 border-cyan-500/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Globe className="h-5 w-5" />
          Global Threat Map
          <Badge variant="outline" className="ml-auto border-red-500/50 text-red-400">
            {threats.reduce((sum, t) => sum + t.threatCount, 0)} Active Threats
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-96 bg-gradient-to-b from-blue-900/20 to-black/50 overflow-hidden">
          {/* World Map Background */}
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              <path
                d="M150,100 Q200,80 250,100 T350,120 L400,140 Q450,130 500,140 T600,160 L650,180 Q700,170 750,180 T850,200"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M100,200 Q150,180 200,200 T300,220 L350,240 Q400,230 450,240 T550,260 L600,280 Q650,270 700,280 T800,300"
                stroke="#374151"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Threat Indicators */}
          {threats.map((threat, index) => (
            <motion.div
              key={threat.id}
              className="absolute cursor-pointer"
              style={{
                left: `${((threat.lng + 180) / 360) * 100}%`,
                top: `${((90 - threat.lat) / 180) * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.5 }}
              onClick={() => setSelectedThreat(threat)}
            >
              <div
                className={`${getThreatSize(threat.threatCount)} rounded-full flex items-center justify-center animate-pulse`}
                style={{
                  backgroundColor: getSeverityColor(threat.severity),
                  boxShadow: `0 0 20px ${getSeverityColor(threat.severity)}80`
                }}
              >
                {threat.blocked ? (
                  <Shield className="w-2 h-2 text-white" />
                ) : (
                  <AlertTriangle className="w-2 h-2 text-white" />
                )}
              </div>
              
              {/* Ripple Effect */}
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: getSeverityColor(threat.severity) }}
              />
            </motion.div>
          ))}

          {/* Threat Details Popup */}
          {selectedThreat && (
            <motion.div
              className="absolute top-4 right-4 bg-black/90 border border-cyan-500/50 rounded-lg p-4 min-w-64"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{selectedThreat.city}, {selectedThreat.country}</h3>
                <button
                  onClick={() => setSelectedThreat(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threats:</span>
                  <span className="text-white font-mono">{selectedThreat.threatCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Severity:</span>
                  <Badge
                    className="text-xs"
                    style={{
                      backgroundColor: `${getSeverityColor(selectedThreat.severity)}20`,
                      color: getSeverityColor(selectedThreat.severity),
                      border: `1px solid ${getSeverityColor(selectedThreat.severity)}50`
                    }}
                  >
                    {selectedThreat.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge
                    variant={selectedThreat.blocked ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {selectedThreat.blocked ? 'BLOCKED' : 'MONITORING'}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Threat Summary */}
        <div className="p-4 border-t border-cyan-500/20">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-400">
                {threats.filter(t => t.severity === 'critical').length}
              </p>
              <p className="text-xs text-gray-400">Critical</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">
                {threats.filter(t => t.severity === 'high').length}
              </p>
              <p className="text-xs text-gray-400">High</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {threats.filter(t => t.severity === 'medium').length}
              </p>
              <p className="text-xs text-gray-400">Medium</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {threats.filter(t => t.blocked).length}
              </p>
              <p className="text-xs text-gray-400">Blocked</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
