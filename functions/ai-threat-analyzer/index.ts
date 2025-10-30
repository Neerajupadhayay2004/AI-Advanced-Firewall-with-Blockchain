import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { events } = await req.json()

    // Analyze threat patterns using AI
    const analysis = analyzeThreats(events)
    
    // Store analysis results
    const { data, error } = await supabaseClient
      .from('threat_analyses')
      .insert({
        analysis_timestamp: new Date().toISOString(),
        events_analyzed: events.length,
        threat_level: analysis.threatLevel,
        summary: analysis.summary,
        recommendations: analysis.recommendations
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

function analyzeThreats(events: any[]) {
  const criticalCount = events.filter(e => e.severity === 'critical').length
  const blockedCount = events.filter(e => e.blocked).length
  const uniqueIPs = new Set(events.map(e => e.ip_address)).size
  
  const blockRate = events.length > 0 ? (blockedCount / events.length) * 100 : 0
  
  let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  let summary = ''
  let recommendations: string[] = []

  if (criticalCount > 10 || blockRate < 50) {
    threatLevel = 'critical'
    summary = 'Critical threat level detected. Immediate attention required.'
    recommendations = [
      'Implement emergency response protocols',
      'Review and strengthen firewall rules',
      'Consider temporary IP blocking for repeat offenders',
      'Escalate to security team'
    ]
  } else if (criticalCount > 5 || blockRate < 70) {
    threatLevel = 'high'
    summary = 'Elevated threat activity requiring enhanced monitoring.'
    recommendations = [
      'Increase monitoring frequency',
      'Review recent rule changes',
      'Analyze attack patterns for trends',
      'Update threat signatures'
    ]
  } else if (criticalCount > 2 || blockRate < 85) {
    threatLevel = 'medium'
    summary = 'Moderate threat activity within acceptable parameters.'
    recommendations = [
      'Continue standard monitoring',
      'Review monthly security metrics',
      'Schedule routine system updates',
      'Maintain current security posture'
    ]
  } else {
    threatLevel = 'low'
    summary = 'Security status is normal with minimal threat activity.'
    recommendations = [
      'Maintain current configuration',
      'Continue regular monitoring',
      'Schedule preventive maintenance',
      'Review security policies quarterly'
    ]
  }

  return {
    threatLevel,
    summary,
    recommendations,
    metrics: {
      totalEvents: events.length,
      criticalEvents: criticalCount,
      blockedEvents: blockedCount,
      uniqueIPs,
      blockRate: Math.round(blockRate)
    }
  }
}
