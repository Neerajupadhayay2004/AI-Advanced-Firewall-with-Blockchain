import { type NextRequest, NextResponse } from "next/server"

interface NetworkNode {
  id: string
  label: string
  type: "server" | "router" | "firewall" | "endpoint" | "threat"
  ip: string
  status: "online" | "offline" | "warning" | "critical"
  location: {
    x: number
    y: number
    z: number
  }
  connections: string[]
  metadata: {
    os?: string
    services: string[]
    threat_level: number
    last_seen: number
  }
}

interface NetworkTopology {
  nodes: NetworkNode[]
  edges: Array<{
    source: string
    target: string
    type: "normal" | "encrypted" | "suspicious"
    bandwidth: number
    latency: number
  }>
  statistics: {
    total_nodes: number
    active_connections: number
    threat_nodes: number
    network_health: number
  }
}

function generateNetworkTopology(): NetworkTopology {
  const nodes: NetworkNode[] = []
  const nodeTypes = ["server", "router", "firewall", "endpoint", "threat"] as const
  const statuses = ["online", "offline", "warning", "critical"] as const

  // Generate core infrastructure nodes
  for (let i = 0; i < 20; i++) {
    const type = nodeTypes[Math.floor(Math.random() * (nodeTypes.length - 1))] // Exclude 'threat' for core nodes
    nodes.push({
      id: `node_${i}`,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      type,
      ip: `192.168.${Math.floor(i / 10) + 1}.${(i % 10) + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 50,
      },
      connections: [],
      metadata: {
        os: ["Linux", "Windows", "macOS"][Math.floor(Math.random() * 3)],
        services: ["HTTP", "SSH", "FTP", "DNS"].slice(0, Math.floor(Math.random() * 4) + 1),
        threat_level: Math.floor(Math.random() * 5) + 1,
        last_seen: Date.now() - Math.random() * 3600000,
      },
    })
  }

  // Add some threat nodes
  for (let i = 0; i < 5; i++) {
    nodes.push({
      id: `threat_${i}`,
      label: `Threat Source ${i + 1}`,
      type: "threat",
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: "critical",
      location: {
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 75,
      },
      connections: [],
      metadata: {
        services: ["Unknown"],
        threat_level: Math.floor(Math.random() * 5) + 6,
        last_seen: Date.now() - Math.random() * 1800000,
      },
    })
  }

  // Generate connections
  const edges = []
  for (let i = 0; i < nodes.length; i++) {
    const connectionsCount = Math.floor(Math.random() * 4) + 1
    for (let j = 0; j < connectionsCount; j++) {
      const targetIndex = Math.floor(Math.random() * nodes.length)
      if (targetIndex !== i) {
        const target = nodes[targetIndex]
        nodes[i].connections.push(target.id)

        edges.push({
          source: nodes[i].id,
          target: target.id,
          type: target.type === "threat" ? "suspicious" : Math.random() > 0.7 ? "encrypted" : "normal",
          bandwidth: Math.floor(Math.random() * 1000) + 100,
          latency: Math.floor(Math.random() * 100) + 10,
        })
      }
    }
  }

  return {
    nodes,
    edges,
    statistics: {
      total_nodes: nodes.length,
      active_connections: edges.length,
      threat_nodes: nodes.filter((n) => n.type === "threat").length,
      network_health: Math.floor(Math.random() * 30) + 70,
    },
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format") || "topology"

  console.log("[v0] Generating network topology data")

  if (format === "topology") {
    const topology = generateNetworkTopology()
    return NextResponse.json({ success: true, topology })
  }

  if (format === "geolocation") {
    // Generate global threat map data
    const globalThreats = Array.from({ length: 50 }, (_, i) => ({
      id: `global_threat_${i}`,
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      intensity: Math.floor(Math.random() * 10) + 1,
      type: ["malware", "ddos", "intrusion", "phishing"][Math.floor(Math.random() * 4)],
      count: Math.floor(Math.random() * 100) + 10,
    }))

    return NextResponse.json({ success: true, global_threats: globalThreats })
  }

  return NextResponse.json({ success: false, error: "Invalid format" }, { status: 400 })
}
