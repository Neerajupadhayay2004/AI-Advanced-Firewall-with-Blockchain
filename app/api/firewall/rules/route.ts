import { type NextRequest, NextResponse } from "next/server"

interface FirewallRule {
  id: string
  name: string
  type: "BLOCK" | "ALLOW" | "MONITOR"
  pattern: string
  confidence: number
  active: boolean
  threats_blocked: number
  created_at: string
  updated_at: string
  priority: number
  source: "AI" | "Manual" | "Threat_Intel"
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const active = searchParams.get("active")
    const source = searchParams.get("source")

    let rules = getFirewallRules()

    // Apply filters
    if (type && type !== "All") {
      rules = rules.filter((rule) => rule.type === type)
    }
    if (active !== null) {
      rules = rules.filter((rule) => rule.active === (active === "true"))
    }
    if (source && source !== "All") {
      rules = rules.filter((rule) => rule.source === source)
    }

    // Sort by priority
    rules.sort((a, b) => b.priority - a.priority)

    return NextResponse.json({
      success: true,
      data: {
        rules,
        total: rules.length,
        active_rules: rules.filter((r) => r.active).length,
        ai_generated: rules.filter((r) => r.source === "AI").length,
      },
    })
  } catch (error) {
    console.error("[v0] Firewall rules API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch firewall rules" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, type, pattern, priority = 50, source = "Manual" } = body

    const validation = await validateRule(pattern, type)
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
    }

    const newRule: FirewallRule = {
      id: `RULE-${Date.now()}`,
      name,
      type,
      pattern,
      confidence: validation.confidence,
      active: true,
      threats_blocked: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      priority,
      source,
    }

    console.log("[v0] New firewall rule created:", newRule)

    return NextResponse.json({
      success: true,
      data: newRule,
      message: "Firewall rule created successfully",
    })
  } catch (error) {
    console.error("[v0] Firewall rule creation error:", error)
    return NextResponse.json({ success: false, error: "Failed to create firewall rule" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (updates.pattern) {
      const validation = await validateRule(updates.pattern, updates.type)
      if (!validation.valid) {
        return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
      }
      updates.confidence = validation.confidence
    }

    updates.updated_at = new Date().toISOString()

    console.log("[v0] Firewall rule updated:", { id, updates })

    return NextResponse.json({
      success: true,
      message: "Firewall rule updated successfully",
    })
  } catch (error) {
    console.error("[v0] Firewall rule update error:", error)
    return NextResponse.json({ success: false, error: "Failed to update firewall rule" }, { status: 500 })
  }
}

async function validateRule(pattern: string, type: string) {
  try {
    // Test if pattern is valid regex
    new RegExp(pattern)

    // AI-based pattern analysis
    let confidence = 70

    // Check for common security patterns
    const securityPatterns = {
      "SQL Injection": /(\bunion\b|\bselect\b|\binsert\b|\bdrop\b)/i,
      XSS: /(<script|javascript:|onload=|onerror=)/i,
      "Path Traversal": /(\.\.\/|\.\.\\)/,
      "Command Injection": /(\||;|&|`|\$\()/,
    }

    for (const [patternType, regex] of Object.entries(securityPatterns)) {
      if (regex.test(pattern)) {
        confidence += 20
        break
      }
    }

    return { valid: true, confidence, error: null }
  } catch (error) {
    return { valid: false, confidence: 0, error: "Invalid regex pattern" }
  }
}

function getFirewallRules(): FirewallRule[] {
  return [
    {
      id: "RULE-001",
      name: "SQL Injection Detection",
      type: "BLOCK",
      pattern: "/(union|select|insert|drop|delete|script)/i",
      confidence: 95.7,
      active: true,
      threats_blocked: 342,
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-15T14:00:00Z",
      priority: 90,
      source: "AI",
    },
    {
      id: "RULE-002",
      name: "DDoS Pattern Recognition",
      type: "BLOCK",
      pattern: "rate_limit > 1000/min",
      confidence: 98.2,
      active: true,
      threats_blocked: 1847,
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-15T14:00:00Z",
      priority: 95,
      source: "AI",
    },
    {
      id: "RULE-003",
      name: "Suspicious User Agent",
      type: "MONITOR",
      pattern: "/bot|crawler|spider/i",
      confidence: 87.3,
      active: true,
      threats_blocked: 156,
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-15T14:00:00Z",
      priority: 60,
      source: "Manual",
    },
  ]
}
