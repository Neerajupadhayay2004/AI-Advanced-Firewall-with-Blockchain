import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Store live analysis data in memory
let liveAnalysisData: any = {
  threats_detected: 0,
  attacks_blocked: 0,
  network_health: 100,
  active_connections: 0,
  threat_level: "LOW",
  last_update: null,
  live_threats: [],
  network_traffic: [],
  security_events: [],
}

export async function GET() {
  try {
    // Try to read from file if Python script is running
    try {
      const filePath = path.join(process.cwd(), "analysis_results.json")
      const fileData = await fs.readFile(filePath, "utf8")
      const data = JSON.parse(fileData)
      liveAnalysisData = { ...liveAnalysisData, ...data }
    } catch (fileError) {
      // File doesn't exist yet, use in-memory data
      console.log("[v0] Using in-memory analysis data")
    }

    return NextResponse.json({
      success: true,
      data: liveAnalysisData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Live analysis API error:", error)
    return NextResponse.json({ success: false, error: "Failed to get live analysis data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Update live analysis data
    liveAnalysisData = {
      ...liveAnalysisData,
      ...data,
      last_update: new Date().toISOString(),
    }

    console.log(`[v0] Received live analysis update: ${data.threats_detected} threats, ${data.attacks_blocked} blocked`)

    return NextResponse.json({
      success: true,
      message: "Live analysis data updated",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Live analysis POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to update live analysis data" }, { status: 500 })
  }
}
