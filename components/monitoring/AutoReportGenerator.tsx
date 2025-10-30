import React, { useState } from 'react'
import { FileText, Download, Calendar, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { SecurityEvent } from '../../lib/supabase'
import jsPDF from 'jspdf'

interface AutoReportGeneratorProps {
  events: SecurityEvent[]
  stats: {
    totalEvents: number
    blockedThreats: number
    criticalAlerts: number
    activeConnections: number
  }
}

export function AutoReportGenerator({ events, stats }: AutoReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [lastReportTime, setLastReportTime] = useState<string>('Never')

  const generatePDFReport = async () => {
    setIsGenerating(true)
    
    try {
      const pdf = new jsPDF()
      const pageWidth = pdf.internal.pageSize.width
      
      // Header
      pdf.setFontSize(20)
      pdf.setTextColor(0, 123, 191) // Cyan color
      pdf.text('Nexus Firewall AI - Security Report', 20, 30)
      
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0)
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45)
      
      // Executive Summary
      pdf.setFontSize(16)
      pdf.setTextColor(0, 0, 0)
      pdf.text('Executive Summary', 20, 65)
      
      pdf.setFontSize(11)
      const summaryY = 80
      pdf.text(`Total Security Events: ${stats.totalEvents}`, 20, summaryY)
      pdf.text(`Blocked Threats: ${stats.blockedThreats}`, 20, summaryY + 15)
      pdf.text(`Critical Alerts: ${stats.criticalAlerts}`, 20, summaryY + 30)
      pdf.text(`Active Connections: ${stats.activeConnections}`, 20, summaryY + 45)
      
      const blockRate = stats.totalEvents > 0 ? ((stats.blockedThreats / stats.totalEvents) * 100).toFixed(1) : '0'
      pdf.text(`Threat Block Rate: ${blockRate}%`, 20, summaryY + 60)
      
      // Threat Analysis
      pdf.setFontSize(16)
      pdf.text('Threat Analysis', 20, summaryY + 85)
      
      const severityCounts = events.reduce((acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      let currentY = summaryY + 100
      pdf.setFontSize(11)
      Object.entries(severityCounts).forEach(([severity, count]) => {
        pdf.text(`${severity.toUpperCase()} Threats: ${count}`, 20, currentY)
        currentY += 15
      })
      
      // Recent Incidents (Top 10)
      pdf.setFontSize(16)
      pdf.text('Recent Critical Incidents', 20, currentY + 20)
      
      const criticalEvents = events
        .filter(e => e.severity === 'critical' || e.severity === 'high')
        .slice(0, 10)
      
      currentY += 35
      pdf.setFontSize(9)
      criticalEvents.forEach((event, index) => {
        if (currentY > 270) { // New page if needed
          pdf.addPage()
          currentY = 30
        }
        
        const timeStr = new Date(event.timestamp).toLocaleString()
        pdf.text(`${index + 1}. [${event.severity.toUpperCase()}] ${event.message}`, 20, currentY)
        pdf.text(`   Time: ${timeStr} | IP: ${event.ip_address} | Status: ${event.blocked ? 'BLOCKED' : 'ALLOWED'}`, 25, currentY + 10)
        currentY += 25
      })
      
      // Recommendations
      if (currentY > 220) {
        pdf.addPage()
        currentY = 30
      }
      
      pdf.setFontSize(16)
      pdf.text('Security Recommendations', 20, currentY + 20)
      
      pdf.setFontSize(11)
      currentY += 35
      const recommendations = [
        'Review and update firewall rules for frequently attacking IP addresses',
        'Implement rate limiting for high-volume endpoints',
        'Schedule regular security audits for critical systems',
        'Update threat detection signatures and AI models',
        'Monitor for patterns in blocked traffic for emerging threats'
      ]
      
      recommendations.forEach((rec, index) => {
        pdf.text(`${index + 1}. ${rec}`, 20, currentY)
        currentY += 15
      })
      
      // Save PDF
      const fileName = `nexus-firewall-report-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)
      
      setLastReportTime(new Date().toLocaleString())
    } catch (error) {
      console.error('Error generating PDF:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const scheduleAutoReport = async () => {
    // In a real implementation, this would set up a scheduled job
    // For demo purposes, we'll just show a success message
    alert('Auto-reporting scheduled for daily 9:00 AM UTC')
  }

  return (
    <Card className="bg-cyber-card border-cyber">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyber-primary">
          <FileText className="h-5 w-5" />
          AI Security Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
            <p className="text-sm text-gray-400">Report Coverage</p>
            <p className="text-2xl font-bold text-white">{events.length}</p>
            <p className="text-xs text-gray-500">Events Analyzed</p>
          </div>
          <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
            <p className="text-sm text-gray-400">Last Report</p>
            <p className="text-lg font-bold text-white">{lastReportTime.split(',')[0] || 'Never'}</p>
            <p className="text-xs text-gray-500">Generated</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={generatePDFReport}
            disabled={isGenerating}
            variant="cyber"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Report...' : 'Generate PDF Report'}
          </Button>

          <Button
            onClick={scheduleAutoReport}
            variant="outline"
            className="w-full border-cyber text-cyber-primary hover:bg-cyan-500/10"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Auto Reports
          </Button>
        </div>

        <div className="p-4 bg-cyber-card rounded-lg border border-cyber">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-cyber-primary" />
            <span className="text-sm font-medium text-cyber-primary">Auto-Reporting Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-cyber-secondary">Daily Reports</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-cyber-secondary">Next Report</span>
              <span className="text-xs text-white">Tomorrow 09:00 UTC</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-cyber-secondary">AI Analysis</span>
              <Badge variant="cyber">Enabled</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
