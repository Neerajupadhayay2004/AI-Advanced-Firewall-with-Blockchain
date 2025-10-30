import { type NextRequest, NextResponse } from "next/server"

interface ThreatEvent {
  id: string
  timestamp: string
  type: string
  severity: "Low" | "Medium" | "High" | "Critical"
  source_ip: string
  destination_ip: string
  description: string
  status: "Active" | "Blocked" | "Investigating" | "Resolved"
  confidence: number
  payload?: string
  user_agent?: string
  country?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get("severity")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Simulate advanced threat detection with AI analysis
    const threats: ThreatEvent[] = generateThreatEvents(limit)

    // Apply filters
    let filteredThreats = threats
    if (severity && severity !== "All") {
      filteredThreats = filteredThreats.filter((t) => t.severity === severity)
    }
    if (status && status !== "All") {
      filteredThreats = filteredThreats.filter((t) => t.status === status)
    }

    // Apply pagination
    const paginatedThreats = filteredThreats.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: {
        threats: paginatedThreats,
        total: filteredThreats.length,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(filteredThreats.length / limit),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Threat API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch threats" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { source_ip, destination_ip, type, payload } = body

    const aiAnalysis = await analyzeWithAI(payload, source_ip, type)

    const newThreat: ThreatEvent = {
      id: `T-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: type || "Unknown",
      severity: aiAnalysis.severity,
      source_ip,
      destination_ip,
      description: aiAnalysis.description,
      status: aiAnalysis.shouldBlock ? "Blocked" : "Active",
      confidence: aiAnalysis.confidence,
      payload,
      user_agent: body.user_agent,
      country: await getCountryFromIP(source_ip),
    }

    // Store threat event (in production, this would go to a database)
    console.log("[v0] New threat detected:", newThreat)

    return NextResponse.json({
      success: true,
      data: newThreat,
      action: aiAnalysis.shouldBlock ? "blocked" : "monitored",
    })
  } catch (error) {
    console.error("[v0] Threat creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to process threat" }, { status: 500 })
  }
}

async function analyzeWithAI(payload: string, sourceIP: string, type: string) {
  // Simulate advanced AI threat analysis
  const patterns = {
    "SQL Injection": /(\bunion\b|\bselect\b|\binsert\b|\bdrop\b)/i,
    XSS: /(<script|javascript:|onload=|onerror=)/i,
    DDoS: /high_request_rate/i,
    "Brute Force": /failed_login_attempts/i,
  }

  let confidence = 50
  let severity: "Low" | "Medium" | "High" | "Critical" = "Low"
  let shouldBlock = false
  let description = `Potential ${type} detected`

  // Pattern matching analysis
  for (const [patternType, regex] of Object.entries(patterns)) {
    if (regex.test(payload)) {
      confidence += 30
      if (patternType === "SQL Injection" || patternType === "XSS") {
        severity = "High"
        shouldBlock = true
      }
    }
  }

  // IP reputation analysis
  const suspiciousIPs = ["203.0.113.", "198.51.100.", "192.0.2."]
  if (suspiciousIPs.some((ip) => sourceIP.startsWith(ip))) {
    confidence += 20
    severity = severity === "Low" ? "Medium" : "High"
  }

  // Behavioral analysis
  if (confidence > 80) {
    severity = "Critical"
    shouldBlock = true
    description = `High-confidence ${type} attack blocked by AI`
  }

  return { confidence, severity, shouldBlock, description }
}

function generateThreatEvents(count: number): ThreatEvent[] {
  const types = ["SQL Injection", "XSS", "DDoS Attack", "Port Scan", "Brute Force", "Malware"]
  const severities: ("Low" | "Medium" | "High" | "Critical")[] = ["Low", "Medium", "High", "Critical"]
  const statuses: ("Active" | "Blocked" | "Investigating" | "Resolved")[] = [
    "Active",
    "Blocked",
    "Investigating",
    "Resolved",
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `T-${Date.now()}-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    type: types[Math.floor(Math.random() * types.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    destination_ip: `10.0.0.${Math.floor(Math.random() * 255)}`,
    description: "AI-detected security threat",
    status: statuses[Math.floor(Math.random() * statuses.length)],
    confidence: Math.floor(Math.random() * 40) + 60,
  }))
}

async function getCountryFromIP(ip: string): Promise<string> {
  // Simulate IP geolocation
  const countries = ["Russia", "China", "North Korea", "Iran", "Unknown"]
  return countries[Math.floor(Math.random() * countries.length)]
}
