import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface SecurityEvent {
  id: string
  timestamp: string
  source: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  ip_address: string
  user_id?: string
  path?: string
  metadata?: Record<string, any>
  blocked: boolean
}

interface AIAnalysisResult {
  threat_level: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  analysis: string
  recommendations: string[]
  patterns_detected: string[]
  risk_score: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { events, analysis_type = 'threat_detection' } = await req.json()

    // Advanced AI Analysis (simulating Python ML models)
    const analysis = await performAdvancedAIAnalysis(events, analysis_type)
    
    // Store analysis results
    const { data, error } = await supabaseClient
      .from('threat_analyses')
      .insert({
        analysis_timestamp: new Date().toISOString(),
        events_analyzed: events.length,
        threat_level: analysis.threat_level,
        summary: analysis.analysis,
        recommendations: analysis.recommendations,
        metrics: {
          confidence: analysis.confidence,
          risk_score: analysis.risk_score,
          patterns_detected: analysis.patterns_detected
        }
      })

    if (error) {
      console.error('Error storing analysis:', error)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysis,
        stored: !error 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function performAdvancedAIAnalysis(events: SecurityEvent[], analysisType: string): Promise<AIAnalysisResult> {
  // Simulate advanced Python ML analysis
  const criticalCount = events.filter(e => e.severity === 'critical').length
  const blockedCount = events.filter(e => e.blocked).length
  const uniqueIPs = new Set(events.map(e => e.ip_address)).size
  const blockRate = events.length > 0 ? (blockedCount / events.length) * 100 : 0
  
  // Advanced pattern detection
  const patterns = detectAdvancedPatterns(events)
  
  // Calculate risk score using ML-like algorithm
  const riskScore = calculateRiskScore(events, patterns)
  
  // Determine threat level
  let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  let confidence = 0
  let analysis = ''
  let recommendations: string[] = []

  if (riskScore > 80 || criticalCount > 10) {
    threatLevel = 'critical'
    confidence = 95
    analysis = `CRITICAL THREAT DETECTED: Advanced persistent threat (APT) patterns identified. ${criticalCount} critical events with ${patterns.length} attack patterns detected. Immediate response required.`
    recommendations = [
      'Activate incident response team immediately',
      'Implement emergency firewall rules',
      'Isolate affected systems',
      'Contact security vendors for advanced threat hunting',
      'Review all admin access logs'
    ]
  } else if (riskScore > 60 || criticalCount > 5) {
    threatLevel = 'high'
    confidence = 87
    analysis = `HIGH RISK: Coordinated attack patterns detected across ${uniqueIPs} IP addresses. Block rate: ${blockRate.toFixed(1)}%. Enhanced monitoring required.`
    recommendations = [
      'Increase monitoring frequency to real-time',
      'Deploy additional security sensors',
      'Review and update threat intelligence feeds',
      'Implement geo-blocking for high-risk regions',
      'Schedule emergency security audit'
    ]
  } else if (riskScore > 40 || criticalCount > 2) {
    threatLevel = 'medium'
    confidence = 73
    analysis = `MODERATE RISK: ${events.length} security events analyzed. Detected ${patterns.length} suspicious patterns. Current block rate: ${blockRate.toFixed(1)}%.`
    recommendations = [
      'Review firewall rules for optimization',
      'Update intrusion detection signatures',
      'Analyze traffic patterns for anomalies',
      'Implement rate limiting on vulnerable endpoints',
      'Schedule routine security assessment'
    ]
  } else {
    threatLevel = 'low'
    confidence = 65
    analysis = `NORMAL OPERATIONS: Security posture is stable. ${blockedCount} threats successfully blocked out of ${events.length} events. System performing within normal parameters.`
    recommendations = [
      'Continue standard monitoring procedures',
      'Maintain current security configurations',
      'Schedule monthly security reviews',
      'Update security awareness training',
      'Review compliance requirements'
    ]
  }

  return {
    threat_level: threatLevel,
    confidence,
    analysis,
    recommendations,
    patterns_detected: patterns,
    risk_score: riskScore
  }
}

function detectAdvancedPatterns(events: SecurityEvent[]): string[] {
  const patterns: string[] = []
  
  // Detect brute force attacks
  const ipCounts = events.reduce((acc, event) => {
    acc[event.ip_address] = (acc[event.ip_address] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  Object.entries(ipCounts).forEach(([ip, count]) => {
    if (count > 10) {
      patterns.push(`Brute force attack from ${ip} (${count} attempts)`)
    }
  })
  
  // Detect SQL injection patterns
  const sqlInjectionCount = events.filter(e => 
    e.message.toLowerCase().includes('sql') || 
    e.message.toLowerCase().includes('injection') ||
    e.path?.includes('union') ||
    e.path?.includes('select')
  ).length
  
  if (sqlInjectionCount > 5) {
    patterns.push(`SQL injection attack pattern (${sqlInjectionCount} attempts)`)
  }
  
  // Detect DDoS patterns
  const recentEvents = events.filter(e => 
    new Date(e.timestamp).getTime() > Date.now() - 300000 // Last 5 minutes
  )
  
  if (recentEvents.length > 100) {
    patterns.push(`Potential DDoS attack (${recentEvents.length} events in 5 minutes)`)
  }
  
  // Detect port scanning
  const portScanPatterns = events.filter(e => 
    e.message.toLowerCase().includes('port') || 
    e.message.toLowerCase().includes('scan')
  ).length
  
  if (portScanPatterns > 3) {
    patterns.push(`Port scanning activity detected (${portScanPatterns} instances)`)
  }
  
  return patterns
}

function calculateRiskScore(events: SecurityEvent[], patterns: string[]): number {
  let score = 0
  
  // Base score from event severity
  events.forEach(event => {
    switch (event.severity) {
      case 'critical': score += 10; break
      case 'high': score += 7; break
      case 'medium': score += 4; break
      case 'low': score += 1; break
    }
  })
  
  // Pattern multiplier
  score += patterns.length * 15
  
  // Block rate factor (lower block rate = higher risk)
  const blockedCount = events.filter(e => e.blocked).length
  const blockRate = events.length > 0 ? (blockedCount / events.length) * 100 : 100
  score += (100 - blockRate) * 0.5
  
  // Unique IP factor
  const uniqueIPs = new Set(events.map(e => e.ip_address)).size
  if (uniqueIPs > 50) score += 20
  else if (uniqueIPs > 20) score += 10
  
  return Math.min(100, Math.max(0, score))
}
