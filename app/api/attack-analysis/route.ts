import { type NextRequest, NextResponse } from "next/server"

interface AttackPattern {
  id: string
  type: "ddos" | "malware" | "phishing" | "bruteforce" | "injection" | "mitm"
  severity: "critical" | "high" | "medium" | "low"
  source: string
  target: string
  timestamp: string
  status: "active" | "mitigated" | "investigating"
  indicators: string[]
  mitigation: string[]
  confidence: number
}

interface AttackAnalysis {
  totalAttacks: number
  activeThreats: number
  mitigatedThreats: number
  topAttackTypes: { type: string; count: number }[]
  geographicDistribution: { country: string; attacks: number }[]
  timelineData: { hour: string; attacks: number; blocked: number }[]
  severityBreakdown: { severity: string; count: number }[]
}

// Mock attack data
const mockAttacks: AttackPattern[] = [
  {
    id: "ATK-001",
    type: "ddos",
    severity: "critical",
    source: "203.0.113.45",
    target: "192.168.1.100",
    timestamp: "2024-01-15T14:30:00Z",
    status: "mitigated",
    indicators: ["High packet rate", "Multiple source IPs", "SYN flood pattern"],
    mitigation: ["Rate limiting applied", "Source IPs blocked", "Traffic rerouted"],
    confidence: 98.5,
  },
  {
    id: "ATK-002",
    type: "malware",
    severity: "high",
    source: "198.51.100.23",
    target: "192.168.1.50",
    timestamp: "2024-01-15T14:25:00Z",
    status: "investigating",
    indicators: ["Suspicious file hash", "Unusual network behavior", "Registry modifications"],
    mitigation: ["File quarantined", "Network isolation", "Forensic analysis started"],
    confidence: 87.2,
  },
  {
    id: "ATK-003",
    type: "phishing",
    severity: "medium",
    source: "malicious-site.example",
    target: "user@company.com",
    timestamp: "2024-01-15T14:20:00Z",
    status: "mitigated",
    indicators: ["Suspicious email content", "Fake login page", "Domain spoofing"],
    mitigation: ["Email blocked", "Domain blacklisted", "User notified"],
    confidence: 94.1,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const attackId = searchParams.get("attackId")
  const analysisType = searchParams.get("type") || "overview"

  if (attackId) {
    const attack = mockAttacks.find((a) => a.id === attackId)
    if (!attack) {
      return NextResponse.json({ error: "Attack not found" }, { status: 404 })
    }
    return NextResponse.json(attack)
  }

  if (analysisType === "overview") {
    const analysis: AttackAnalysis = {
      totalAttacks: 1247,
      activeThreats: 3,
      mitigatedThreats: 1244,
      topAttackTypes: [
        { type: "DDoS", count: 456 },
        { type: "Malware", count: 312 },
        { type: "Phishing", count: 234 },
        { type: "Brute Force", count: 156 },
        { type: "SQL Injection", count: 89 },
      ],
      geographicDistribution: [
        { country: "China", attacks: 234 },
        { country: "Russia", attacks: 189 },
        { country: "North Korea", attacks: 156 },
        { country: "Iran", attacks: 123 },
        { country: "Unknown", attacks: 545 },
      ],
      timelineData: [
        { hour: "00:00", attacks: 45, blocked: 43 },
        { hour: "04:00", attacks: 23, blocked: 22 },
        { hour: "08:00", attacks: 89, blocked: 87 },
        { hour: "12:00", attacks: 156, blocked: 154 },
        { hour: "16:00", attacks: 134, blocked: 132 },
        { hour: "20:00", attacks: 67, blocked: 65 },
        { hour: "24:00", attacks: 34, blocked: 33 },
      ],
      severityBreakdown: [
        { severity: "Critical", count: 12 },
        { severity: "High", count: 45 },
        { severity: "Medium", count: 123 },
        { severity: "Low", count: 67 },
      ],
    }

    return NextResponse.json(analysis)
  }

  return NextResponse.json({ attacks: mockAttacks })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, attackId, mitigationSteps } = body

    if (action === "mitigate" && attackId) {
      // Simulate attack mitigation
      const attack = mockAttacks.find((a) => a.id === attackId)
      if (attack) {
        attack.status = "mitigated"
        attack.mitigation = mitigationSteps || ["Automated response applied"]
      }

      return NextResponse.json({
        message: "Attack mitigation initiated",
        attackId,
        status: "mitigated",
      })
    }

    if (action === "analyze") {
      // Simulate deep attack analysis
      return NextResponse.json({
        message: "Deep analysis initiated",
        analysisId: `ANALYSIS-${Date.now()}`,
        estimatedTime: "2-5 minutes",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Attack analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
