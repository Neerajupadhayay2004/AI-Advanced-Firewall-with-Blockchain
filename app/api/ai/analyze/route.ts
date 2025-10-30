import { type NextRequest, NextResponse } from "next/server"

interface AIAnalysisRequest {
  data: string
  type: "traffic" | "payload" | "behavior" | "network"
  context?: Record<string, any>
}

interface AIAnalysisResult {
  threat_level: "Low" | "Medium" | "High" | "Critical"
  confidence: number
  analysis: {
    patterns_detected: string[]
    anomalies: string[]
    recommendations: string[]
    risk_factors: string[]
  }
  action: "allow" | "monitor" | "block" | "quarantine"
  explanation: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AIAnalysisRequest = await request.json()
    const { data, type, context = {} } = body

    console.log("[v0] AI Analysis request:", { type, dataLength: data.length })

    const analysis = await performAIAnalysis(data, type, context)

    return NextResponse.json({
      success: true,
      data: analysis,
      processing_time: Math.random() * 100 + 50, // Simulate processing time
      model_version: "2.1.0",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] AI Analysis error:", error)
    return NextResponse.json({ success: false, error: "AI analysis failed" }, { status: 500 })
  }
}

async function performAIAnalysis(data: string, type: string, context: Record<string, any>): Promise<AIAnalysisResult> {
  const analysis: AIAnalysisResult = {
    threat_level: "Low",
    confidence: 50,
    analysis: {
      patterns_detected: [],
      anomalies: [],
      recommendations: [],
      risk_factors: [],
    },
    action: "allow",
    explanation: "No significant threats detected",
  }

  // Pattern Detection Model
  const patterns = await detectPatterns(data, type)
  analysis.analysis.patterns_detected = patterns

  // Anomaly Detection Model
  const anomalies = await detectAnomalies(data, type, context)
  analysis.analysis.anomalies = anomalies

  // Behavioral Analysis Model
  const behavior = await analyzeBehavior(data, type, context)
  analysis.analysis.risk_factors = behavior.risk_factors

  // Calculate overall threat level
  let score = 0

  // Pattern-based scoring
  if (patterns.includes("SQL Injection")) score += 40
  if (patterns.includes("XSS")) score += 35
  if (patterns.includes("Command Injection")) score += 45
  if (patterns.includes("Path Traversal")) score += 30

  // Anomaly-based scoring
  score += anomalies.length * 15

  // Behavioral scoring
  score += behavior.risk_factors.length * 10

  // Determine threat level and action
  if (score >= 80) {
    analysis.threat_level = "Critical"
    analysis.action = "block"
    analysis.explanation = "Critical threat detected - immediate blocking required"
  } else if (score >= 60) {
    analysis.threat_level = "High"
    analysis.action = "monitor"
    analysis.explanation = "High-risk activity detected - enhanced monitoring enabled"
  } else if (score >= 30) {
    analysis.threat_level = "Medium"
    analysis.action = "monitor"
    analysis.explanation = "Moderate risk detected - monitoring recommended"
  }

  analysis.confidence = Math.min(95, Math.max(50, score + Math.random() * 20))

  // Generate recommendations
  analysis.analysis.recommendations = generateRecommendations(analysis)

  return analysis
}

async function detectPatterns(data: string, type: string): Promise<string[]> {
  const patterns: string[] = []

  const detectionRules = {
    "SQL Injection": /(\bunion\b|\bselect\b|\binsert\b|\bdrop\b|\bdelete\b)/i,
    XSS: /(<script|javascript:|onload=|onerror=|<iframe)/i,
    "Command Injection": /(\||;|&|`|\$\(|system\(|exec\()/i,
    "Path Traversal": /(\.\.\/|\.\.\\|%2e%2e%2f)/i,
    "LDAP Injection": /(\*|$$|$$|\\|\||&)/,
    "XML Injection": /(<\?xml|<!DOCTYPE|<!ENTITY)/i,
  }

  for (const [patternName, regex] of Object.entries(detectionRules)) {
    if (regex.test(data)) {
      patterns.push(patternName)
    }
  }

  return patterns
}

async function detectAnomalies(data: string, type: string, context: Record<string, any>): Promise<string[]> {
  const anomalies: string[] = []

  // Size-based anomalies
  if (data.length > 10000) {
    anomalies.push("Unusually large payload")
  }

  // Encoding anomalies
  if (data.includes("%") && data.match(/%[0-9a-f]{2}/gi)) {
    anomalies.push("URL encoding detected")
  }

  // Character anomalies
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(data)) {
    anomalies.push("Control characters detected")
  }

  // Frequency anomalies
  const charFreq = getCharacterFrequency(data)
  if (charFreq.entropy < 2.0) {
    anomalies.push("Low entropy - possible encoded payload")
  }

  return anomalies
}

async function analyzeBehavior(data: string, type: string, context: Record<string, any>) {
  const risk_factors: string[] = []

  // Request frequency analysis
  if (context.request_count && context.request_count > 100) {
    risk_factors.push("High request frequency")
  }

  // Geographic analysis
  if (context.country && ["Russia", "China", "North Korea"].includes(context.country)) {
    risk_factors.push("High-risk geographic origin")
  }

  // Time-based analysis
  const hour = new Date().getHours()
  if (hour < 6 || hour > 22) {
    risk_factors.push("Off-hours activity")
  }

  return { risk_factors }
}

function generateRecommendations(analysis: AIAnalysisResult): string[] {
  const recommendations: string[] = []

  if (analysis.threat_level === "Critical") {
    recommendations.push("Implement immediate IP blocking")
    recommendations.push("Alert security team")
    recommendations.push("Review and update firewall rules")
  } else if (analysis.threat_level === "High") {
    recommendations.push("Enable enhanced logging")
    recommendations.push("Increase monitoring frequency")
    recommendations.push("Consider rate limiting")
  } else if (analysis.threat_level === "Medium") {
    recommendations.push("Monitor for pattern repetition")
    recommendations.push("Log for future analysis")
  }

  if (analysis.analysis.patterns_detected.length > 0) {
    recommendations.push("Update pattern detection rules")
  }

  return recommendations
}

function getCharacterFrequency(data: string) {
  const freq: Record<string, number> = {}
  for (const char of data) {
    freq[char] = (freq[char] || 0) + 1
  }

  const total = data.length
  let entropy = 0
  for (const count of Object.values(freq)) {
    const p = count / total
    entropy -= p * Math.log2(p)
  }

  return { entropy, unique_chars: Object.keys(freq).length }
}
