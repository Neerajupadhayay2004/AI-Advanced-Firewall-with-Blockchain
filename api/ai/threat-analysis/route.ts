import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Advanced threat patterns for AI detection
const THREAT_PATTERNS = {
  sql_injection: [
    /(\bUNION\b.*\bSELECT\b)/i,
    /(\bOR\b.*=.*)/i,
    /(\bDROP\b.*\bTABLE\b)/i,
    /(\bINSERT\b.*\bINTO\b)/i,
    /('.*OR.*'.*=.*')/i,
  ],
  xss: [/<script[^>]*>.*<\/script>/i, /javascript:/i, /on\w+\s*=/i, /<iframe[^>]*>/i, /eval\s*\(/i],
  ddos: [
    // Rate-based detection patterns
    /rapid_requests/i,
    /high_frequency/i,
  ],
  brute_force: [/login.*failed/i, /authentication.*error/i, /invalid.*credentials/i],
  malware: [/\.exe$/i, /\.bat$/i, /\.scr$/i, /malicious_payload/i],
}

// AI confidence scoring algorithm
function calculateThreatConfidence(
  request: any,
  detectedPatterns: string[],
  ipReputation: number,
  behaviorScore: number,
): number {
  let confidence = 0

  // Pattern matching weight (40%)
  const patternWeight = detectedPatterns.length * 0.1
  confidence += Math.min(patternWeight, 0.4)

  // IP reputation weight (30%)
  confidence += (1 - ipReputation) * 0.3

  // Behavior analysis weight (30%)
  confidence += behaviorScore * 0.3

  return Math.min(confidence, 1)
}

// Advanced threat classification
function classifyThreat(
  payload: string,
  userAgent: string,
  path: string,
): {
  type: string
  patterns: string[]
  severity: string
} {
  const detectedPatterns: string[] = []
  let threatType = "anomaly"
  let severity = "low"

  // Check for SQL injection
  if (THREAT_PATTERNS.sql_injection.some((pattern) => pattern.test(payload))) {
    detectedPatterns.push("sql_injection")
    threatType = "sql_injection"
    severity = "high"
  }

  // Check for XSS
  if (THREAT_PATTERNS.xss.some((pattern) => pattern.test(payload))) {
    detectedPatterns.push("xss")
    threatType = "xss"
    severity = "high"
  }

  // Check for brute force
  if (THREAT_PATTERNS.brute_force.some((pattern) => pattern.test(payload))) {
    detectedPatterns.push("brute_force")
    threatType = "brute_force"
    severity = "medium"
  }

  // Check for malware
  if (THREAT_PATTERNS.malware.some((pattern) => pattern.test(payload))) {
    detectedPatterns.push("malware")
    threatType = "malware"
    severity = "critical"
  }

  // Suspicious user agent patterns
  const suspiciousAgents = ["bot", "crawler", "scanner", "sqlmap", "nikto"]
  if (suspiciousAgents.some((agent) => userAgent.toLowerCase().includes(agent))) {
    detectedPatterns.push("suspicious_agent")
    if (severity === "low") severity = "medium"
  }

  return { type: threatType, patterns: detectedPatterns, severity }
}

// IP reputation scoring (simplified)
async function getIPReputation(ip: string): Promise<number> {
  // In production, integrate with threat intelligence APIs
  const knownMaliciousIPs = ["192.168.1.100", "10.0.0.50", "172.16.0.10"]

  if (knownMaliciousIPs.includes(ip)) {
    return 0.1 // High risk
  }

  // Check for private/local IPs
  if (ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.")) {
    return 0.8 // Lower risk for internal IPs
  }

  return 0.5 // Neutral reputation
}

// Behavioral analysis
function analyzeBehavior(requestHistory: any[]): number {
  if (!requestHistory.length) return 0.5

  let suspiciousScore = 0

  // Check request frequency
  const recentRequests = requestHistory.filter(
    (req) => Date.now() - new Date(req.timestamp).getTime() < 60000, // Last minute
  )

  if (recentRequests.length > 50) {
    suspiciousScore += 0.4 // High frequency
  }

  // Check for pattern variations
  const uniquePaths = new Set(requestHistory.map((req) => req.path))
  if (uniquePaths.size < requestHistory.length * 0.1) {
    suspiciousScore += 0.3 // Repetitive patterns
  }

  return Math.min(suspiciousScore, 1)
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { source_ip, target_ip, user_agent, request_path, payload, headers } = body

    // Get IP reputation
    const ipReputation = await getIPReputation(source_ip)

    // Get request history for behavioral analysis
    const { data: requestHistory } = await supabase
      .from("threat_logs")
      .select("*")
      .eq("source_ip", source_ip)
      .gte("created_at", new Date(Date.now() - 3600000).toISOString()) // Last hour
      .order("created_at", { ascending: false })
      .limit(100)

    // Analyze behavior
    const behaviorScore = analyzeBehavior(requestHistory || [])

    // Classify threat
    const { type, patterns, severity } = classifyThreat(payload || "", user_agent || "", request_path || "")

    // Calculate AI confidence
    const aiConfidence = calculateThreatConfidence(body, patterns, ipReputation, behaviorScore)

    // Determine if threat should be blocked
    const shouldBlock = aiConfidence > 0.7 || severity === "critical"

    // Log threat to database
    const { data: threatLog, error } = await supabase
      .from("threat_logs")
      .insert({
        threat_type: type,
        severity,
        source_ip,
        target_ip,
        user_agent,
        request_path,
        payload: payload ? { raw: payload, patterns } : null,
        ai_confidence: aiConfidence,
        status: shouldBlock ? "blocked" : "detected",
        blocked_at: shouldBlock ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error logging threat:", error)
    }

    // Create security event
    await supabase.from("security_events").insert({
      event_type: "system_alert",
      source_ip,
      details: {
        threat_type: type,
        severity,
        ai_confidence: aiConfidence,
        patterns_detected: patterns,
        ip_reputation: ipReputation,
        behavior_score: behaviorScore,
      },
      risk_score: Math.round(aiConfidence * 100),
    })

    // Auto-generate firewall rule for high-confidence threats
    if (aiConfidence > 0.8 && shouldBlock) {
      await supabase.from("firewall_rules").insert({
        rule_name: `Auto-Block-${source_ip}-${Date.now()}`,
        rule_type: "ip_block",
        conditions: { ip_ranges: [`${source_ip}/32`] },
        action: "block",
        priority: 5,
        auto_generated: true,
        expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour
      })
    }

    return NextResponse.json({
      success: true,
      threat_detected: aiConfidence > 0.3,
      should_block: shouldBlock,
      analysis: {
        threat_type: type,
        severity,
        ai_confidence: aiConfidence,
        patterns_detected: patterns,
        ip_reputation: ipReputation,
        behavior_score: behaviorScore,
      },
      threat_id: threatLog?.id,
    })
  } catch (error) {
    console.error("AI Threat Analysis Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const severity = searchParams.get("severity")

    let query = supabase.from("threat_logs").select("*").order("created_at", { ascending: false }).limit(limit)

    if (severity) {
      query = query.eq("severity", severity)
    }

    const { data: threats, error } = await query

    if (error) {
      throw error
    }

    // Get threat statistics
    const { data: stats } = await supabase.from("threat_logs").select("threat_type, severity, status")

    const statistics = {
      total: stats?.length || 0,
      blocked: stats?.filter((s) => s.status === "blocked").length || 0,
      critical: stats?.filter((s) => s.severity === "critical").length || 0,
      by_type:
        stats?.reduce((acc: any, threat) => {
          acc[threat.threat_type] = (acc[threat.threat_type] || 0) + 1
          return acc
        }, {}) || {},
    }

    return NextResponse.json({
      threats,
      statistics,
    })
  } catch (error) {
    console.error("Error fetching threats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
