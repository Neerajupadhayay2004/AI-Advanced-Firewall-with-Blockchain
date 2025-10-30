import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Network, Shield, AlertTriangle, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface Node {
  id: string
  x: number
  y: number
  type: 'server' | 'firewall' | 'client' | 'threat'
  status: 'secure' | 'warning' | 'critical'
  connections: string[]
}

export function NetworkTopology() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [threats, setThreats] = useState<{ x: number; y: number; id: string }[]>([])

  useEffect(() => {
    // Initialize network nodes
    const initialNodes: Node[] = [
      { id: 'firewall', x: 400, y: 200, type: 'firewall', status: 'secure', connections: ['server1', 'server2', 'client1'] },
      { id: 'server1', x: 200, y: 100, type: 'server', status: 'secure', connections: ['firewall'] },
      { id: 'server2', x: 200, y: 300, type: 'server', status: 'warning', connections: ['firewall'] },
      { id: 'client1', x: 600, y: 150, type: 'client', status: 'secure', connections: ['firewall'] },
      { id: 'client2', x: 600, y: 250, type: 'client', status: 'secure', connections: ['firewall'] },
    ]
    setNodes(initialNodes)

    // Simulate threats
    const threatInterval = setInterval(() => {
      const newThreat = {
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * 800,
        y: Math.random() * 400
      }
      setThreats(prev => [...prev.slice(-4), newThreat])
    }, 3000)

    return () => clearInterval(threatInterval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      ctx.strokeStyle = '#374151'
      ctx.lineWidth = 2
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const connNode = nodes.find(n => n.id === connId)
          if (connNode) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(connNode.x, connNode.y)
            ctx.stroke()
          }
        })
      })

      // Draw threat paths
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      threats.forEach(threat => {
        const firewall = nodes.find(n => n.id === 'firewall')
        if (firewall) {
          ctx.beginPath()
          ctx.moveTo(threat.x, threat.y)
          ctx.lineTo(firewall.x, firewall.y)
          ctx.stroke()
        }
      })
      ctx.setLineDash([])
    }

    draw()
  }, [nodes, threats])

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'secure': return '#10b981'
      case 'warning': return '#f59e0b'
      case 'critical': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'firewall': return Shield
      case 'server': return Network
      case 'client': return Zap
      case 'threat': return AlertTriangle
      default: return Network
    }
  }

  return (
    <Card className="bg-black/50 border-cyan-500/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Network className="h-5 w-5" />
          Network Topology
        </CardTitle>
      </CardHeader>
      <CardContent className="relative p-0">
        <div className="relative w-full h-96 overflow-hidden">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="absolute inset-0 w-full h-full"
          />
          
          {/* Network Nodes */}
          {nodes.map((node) => {
            const Icon = getNodeIcon(node.type)
            return (
              <motion.div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${(node.x / 800) * 100}%`, top: `${(node.y / 400) * 100}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg"
                  style={{
                    backgroundColor: getNodeColor(node.status),
                    borderColor: getNodeColor(node.status),
                    boxShadow: `0 0 20px ${getNodeColor(node.status)}40`
                  }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                  {node.id}
                </div>
              </motion.div>
            )
          })}

          {/* Threat Indicators */}
          {threats.map((threat) => (
            <motion.div
              key={threat.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(threat.x / 800) * 100}%`, top: `${(threat.y / 400) * 100}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
