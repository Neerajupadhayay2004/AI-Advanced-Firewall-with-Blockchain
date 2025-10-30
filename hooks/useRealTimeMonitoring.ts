import { useEffect, useState } from 'react'
import { supabase, SecurityEvent } from '../lib/supabase'

export function useRealTimeMonitoring() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [stats, setStats] = useState({
    totalEvents: 0,
    blockedThreats: 0,
    criticalAlerts: 0,
    activeConnections: 0
  })

  useEffect(() => {
    // Subscribe to real-time security events
    const channel = supabase
      .channel('security_events')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'security_events' },
        (payload) => {
          const newEvent = payload.new as SecurityEvent
          setEvents(prev => [newEvent, ...prev.slice(0, 99)]) // Keep last 100 events
          
          // Update stats
          setStats(prev => ({
            totalEvents: prev.totalEvents + 1,
            blockedThreats: prev.blockedThreats + (newEvent.blocked ? 1 : 0),
            criticalAlerts: prev.criticalAlerts + (newEvent.severity === 'critical' ? 1 : 0),
            activeConnections: prev.activeConnections + 1
          }))
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    // Simulate demo events if no real connection
    const demoInterval = setInterval(() => {
      if (!isConnected) {
        const demoEvent: SecurityEvent = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          source: ['Web Application', 'API Gateway', 'Database', 'Network'][Math.floor(Math.random() * 4)],
          severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          message: [
            'Suspicious login attempt detected',
            'DDoS attack blocked',
            'SQL injection attempt prevented',
            'Malware signature detected',
            'Brute force attack blocked',
            'Unusual API access pattern'
          ][Math.floor(Math.random() * 6)],
          ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          blocked: Math.random() > 0.3,
          ai_analysis: 'AI threat analysis pending...'
        }
        
        setEvents(prev => [demoEvent, ...prev.slice(0, 99)])
        setStats(prev => ({
          totalEvents: prev.totalEvents + 1,
          blockedThreats: prev.blockedThreats + (demoEvent.blocked ? 1 : 0),
          criticalAlerts: prev.criticalAlerts + (demoEvent.severity === 'critical' ? 1 : 0),
          activeConnections: Math.max(0, prev.activeConnections + Math.floor(Math.random() * 3) - 1)
        }))
      }
    }, 2000)

    return () => {
      channel.unsubscribe()
      clearInterval(demoInterval)
    }
  }, [isConnected])

  return { events, isConnected, stats }
}
