import { type NextRequest, NextResponse } from "next/server"

// Advanced global firewall API endpoints
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  switch (action) {
    case "rules":
      return NextResponse.json({
        rules: [
          {
            id: "FW-001",
            name: "Block Malicious IPs",
            type: "block",
            source: "threat-intel-db",
            destination: "any",
            port: "any",
            protocol: "any",
            priority: 1,
            status: "active",
            hits: 15420,
            createdAt: "2024-01-01T00:00:00Z",
            lastHit: new Date().toISOString(),
          },
          {
            id: "FW-002",
            name: "Allow Internal Traffic",
            type: "allow",
            source: "10.0.0.0/8",
            destination: "10.0.0.0/8",
            port: "any",
            protocol: "any",
            priority: 2,
            status: "active",
            hits: 892341,
            createdAt: "2024-01-01T00:00:00Z",
            lastHit: new Date().toISOString(),
          },
        ],
        stats: {
          totalRules: 156,
          activeRules: 142,
          blockedAttacks: 847293,
          allowedConnections: 12847392,
          efficiency: 99.7,
        },
      })

    case "nodes":
      return NextResponse.json({
        nodes: [
          {
            id: "NODE-US-EAST",
            location: "US East (Virginia)",
            status: "online",
            load: 67,
            threats: 12,
            bandwidth: 8500,
            connections: 45230,
            uptime: "99.9%",
            lastUpdate: new Date().toISOString(),
          },
          {
            id: "NODE-EU-WEST",
            location: "EU West (Ireland)",
            status: "online",
            load: 54,
            threats: 8,
            bandwidth: 7200,
            connections: 38940,
            uptime: "99.8%",
            lastUpdate: new Date().toISOString(),
          },
        ],
        globalStats: {
          totalNodes: 4,
          activeNodes: 3,
          totalThreats: 25,
          totalBandwidth: 21500,
          activeConnections: 112920,
        },
      })

    case "analytics":
      return NextResponse.json({
        threatsByType: {
          ddos: 45,
          malware: 23,
          portScan: 67,
          bruteForce: 12,
          sqlInjection: 8,
        },
        trafficByRegion: {
          "North America": 45230,
          Europe: 38940,
          "Asia Pacific": 28750,
          "South America": 15680,
        },
        hourlyStats: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          threats: Math.floor(Math.random() * 100),
          blocked: Math.floor(Math.random() * 1000),
          allowed: Math.floor(Math.random() * 10000),
        })),
      })

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, data } = body

  switch (action) {
    case "createRule":
      return NextResponse.json({
        success: true,
        message: "Firewall rule created and deployed globally",
        ruleId: `FW-${Date.now()}`,
        deploymentTime: "1.8s",
        affectedNodes: ["NODE-US-EAST", "NODE-EU-WEST", "NODE-SA-EAST"],
      })

    case "updateRule":
      return NextResponse.json({
        success: true,
        message: `Firewall rule ${data.ruleId} updated globally`,
        propagationTime: "2.1s",
        affectedNodes: ["NODE-US-EAST", "NODE-EU-WEST", "NODE-SA-EAST"],
      })

    case "deleteRule":
      return NextResponse.json({
        success: true,
        message: `Firewall rule ${data.ruleId} deleted from all nodes`,
        cleanupTime: "1.5s",
      })

    case "emergencyBlock":
      return NextResponse.json({
        success: true,
        message: `Emergency block activated for ${data.target}`,
        blockId: `BLOCK-${Date.now()}`,
        propagationTime: "0.8s",
        affectedNodes: ["NODE-US-EAST", "NODE-EU-WEST", "NODE-SA-EAST"],
      })

    case "updateMode":
      return NextResponse.json({
        success: true,
        message: `Firewall mode updated to ${data.mode}`,
        newMode: data.mode,
        appliedAt: new Date().toISOString(),
      })

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
