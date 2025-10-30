import { type NextRequest, NextResponse } from "next/server"

interface SystemMetrics {
  timestamp: string
  cpu_usage: number
  memory_usage: number
  network_throughput: number
  active_connections: number
  threats_per_minute: number
  blocked_requests: number
  system_load: number
  disk_usage: number
}

interface SecurityMetrics {
  total_threats: number
  blocked_threats: number
  active_investigations: number
  false_positives: number
  detection_accuracy: number
  response_time: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "1h"
    const metric_type = searchParams.get("type") || "all"

    console.log("[v0] Metrics request:", { timeframe, metric_type })

    const response: any = {
      success: true,
      timeframe,
      timestamp: new Date().toISOString(),
    }

    if (metric_type === "system" || metric_type === "all") {
      response.system_metrics = generateSystemMetrics(timeframe)
    }

    if (metric_type === "security" || metric_type === "all") {
      response.security_metrics = generateSecurityMetrics(timeframe)
    }

    if (metric_type === "performance" || metric_type === "all") {
      response.performance_metrics = generatePerformanceMetrics(timeframe)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Metrics API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch metrics" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric_name, value, tags = {} } = body

    // Store metric (in production, this would go to a time-series database)
    const metric = {
      name: metric_name,
      value,
      tags,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Custom metric recorded:", metric)

    return NextResponse.json({
      success: true,
      message: "Metric recorded successfully",
      metric,
    })
  } catch (error) {
    console.error("[v0] Metric recording error:", error)
    return NextResponse.json({ success: false, error: "Failed to record metric" }, { status: 500 })
  }
}

function generateSystemMetrics(timeframe: string): SystemMetrics[] {
  const points = getTimePoints(timeframe)

  return points.map((timestamp) => ({
    timestamp,
    cpu_usage: Math.random() * 40 + 20,
    memory_usage: Math.random() * 30 + 40,
    network_throughput: Math.random() * 200 + 600,
    active_connections: Math.floor(Math.random() * 5000) + 10000,
    threats_per_minute: Math.floor(Math.random() * 20),
    blocked_requests: Math.floor(Math.random() * 100) + 50,
    system_load: Math.random() * 2 + 0.5,
    disk_usage: Math.random() * 20 + 60,
  }))
}

function generateSecurityMetrics(timeframe: string): SecurityMetrics {
  return {
    total_threats: Math.floor(Math.random() * 1000) + 2000,
    blocked_threats: Math.floor(Math.random() * 950) + 1900,
    active_investigations: Math.floor(Math.random() * 20) + 5,
    false_positives: Math.floor(Math.random() * 50) + 10,
    detection_accuracy: Math.random() * 5 + 95,
    response_time: Math.random() * 100 + 50,
  }
}

function generatePerformanceMetrics(timeframe: string) {
  return {
    avg_response_time: Math.random() * 50 + 25,
    throughput_rps: Math.floor(Math.random() * 1000) + 2000,
    error_rate: Math.random() * 2,
    uptime_percentage: 99.9 + Math.random() * 0.1,
    cache_hit_rate: Math.random() * 20 + 80,
    database_connections: Math.floor(Math.random() * 50) + 100,
  }
}

function getTimePoints(timeframe: string): string[] {
  const now = new Date()
  const points: string[] = []

  let interval: number
  let count: number

  switch (timeframe) {
    case "1h":
      interval = 5 * 60 * 1000 // 5 minutes
      count = 12
      break
    case "24h":
      interval = 60 * 60 * 1000 // 1 hour
      count = 24
      break
    case "7d":
      interval = 24 * 60 * 60 * 1000 // 1 day
      count = 7
      break
    default:
      interval = 5 * 60 * 1000
      count = 12
  }

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval)
    points.push(timestamp.toISOString())
  }

  return points
}
