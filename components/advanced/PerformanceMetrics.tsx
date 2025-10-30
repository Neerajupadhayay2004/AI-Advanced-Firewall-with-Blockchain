import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts'
import { Activity, Cpu, HardDrive, Wifi, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface MetricData {
  time: string
  cpu: number
  memory: number
  network: number
  threats: number
  blocked: number
}

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [currentStats, setCurrentStats] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    uptime: '99.9%'
  })

  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      time: new Date(Date.now() - (29 - i) * 60000).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      cpu: Math.floor(Math.random() * 40) + 20,
      memory: Math.floor(Math.random() * 30) + 40,
      network: Math.floor(Math.random() * 80) + 20,
      threats: Math.floor(Math.random() * 15) + 5,
      blocked: Math.floor(Math.random() * 12) + 3
    }))
    setMetrics(initialData)

    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      const newMetric: MetricData = {
        time: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 40,
        network: Math.floor(Math.random() * 80) + 20,
        threats: Math.floor(Math.random() * 15) + 5,
        blocked: Math.floor(Math.random() * 12) + 3
      }

      setMetrics(prev => [...prev.slice(1), newMetric])
      setCurrentStats({
        cpu: newMetric.cpu,
        memory: newMetric.memory,
        network: newMetric.network,
        uptime: '99.9%'
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <div className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm text-gray-400">{title}</span>
        </div>
        {trend && (
          <span className={`text-xs ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CPU Usage"
          value={currentStats.cpu}
          unit="%"
          icon={Cpu}
          color="text-blue-400"
          trend={Math.floor(Math.random() * 10) - 5}
        />
        <StatCard
          title="Memory"
          value={currentStats.memory}
          unit="%"
          icon={HardDrive}
          color="text-green-400"
          trend={Math.floor(Math.random() * 6) - 3}
        />
        <StatCard
          title="Network"
          value={currentStats.network}
          unit="Mbps"
          icon={Wifi}
          color="text-purple-400"
          trend={Math.floor(Math.random() * 8) - 4}
        />
        <StatCard
          title="Uptime"
          value={currentStats.uptime}
          unit=""
          icon={Zap}
          color="text-cyan-400"
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Performance */}
        <Card className="bg-black/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Activity className="h-5 w-5" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cpu" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="CPU %"
                />
                <Area 
                  type="monotone" 
                  dataKey="memory" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.6}
                  name="Memory %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Network Traffic */}
        <Card className="bg-black/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Wifi className="h-5 w-5" />
              Network Traffic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="network" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Network Mbps"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Threat Activity */}
        <Card className="bg-black/50 border-cyan-500/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cyan-400">
              <Activity className="h-5 w-5" />
              Threat Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics.slice(-15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="threats" fill="#EF4444" name="Threats Detected" />
                <Bar dataKey="blocked" fill="#10B981" name="Threats Blocked" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
