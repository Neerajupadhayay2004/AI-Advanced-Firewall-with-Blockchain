import React, { useState } from 'react'
import { format } from 'date-fns'
import { AlertCircle, Shield, Eye, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { SecurityEvent } from '../../lib/supabase'

interface SecurityEventFeedProps {
  events: SecurityEvent[]
}

export function SecurityEventFeed({ events }: SecurityEventFeedProps) {
  const [filter, setFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  const filteredEvents = events.filter(event => {
    const matchesFilter = event.message.toLowerCase().includes(filter.toLowerCase()) ||
                         event.source.toLowerCase().includes(filter.toLowerCase()) ||
                         event.ip_address.includes(filter)
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter
    return matchesFilter && matchesSeverity
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-300 border-red-500/50'
      case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/50'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <Card className="h-full bg-cyber-card border-cyber">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyber-primary">
          <Eye className="h-5 w-5" />
          Live Security Feed
          <Badge variant="cyber" className="ml-auto">
            {filteredEvents.length} events
          </Badge>
        </CardTitle>
        
        <div className="flex gap-2 pt-4">
          <div className="flex-1">
            <Input
              placeholder="Filter events..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-cyber-card border-cyber text-white placeholder:text-cyber-secondary"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-cyber-card border border-cyber rounded-md text-white text-sm"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events match your filters</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-gray-900/30 border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="mt-1">
                    {getSeverityIcon(event.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {format(new Date(event.timestamp), 'HH:mm:ss')}
                      </span>
                      <span className="text-sm text-cyan-400">{event.source}</span>
                      {event.blocked && (
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          BLOCKED
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-white text-sm mb-2">{event.message}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>IP: {event.ip_address}</span>
                      {event.path && <span>Path: {event.path}</span>}
                      {event.user_id && <span>User: {event.user_id}</span>}
                    </div>
                    
                    {event.ai_analysis && (
                      <div className="mt-2 p-2 bg-blue-900/20 rounded border border-blue-500/20">
                        <p className="text-xs text-blue-300">{event.ai_analysis}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
