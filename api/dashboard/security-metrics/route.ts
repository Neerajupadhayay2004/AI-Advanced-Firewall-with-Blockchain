import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("range") || "24h"

    // Calculate time range
    const now = new Date()
    const timeRanges = {
      "1h": new Date(now.getTime() - 60 * 60 * 1000),
      "24h": new Date(now.getTime() - 24 * 60 * 60 * 1000),
      "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    }

    const startTime = timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["24h"]

    // Get threat statistics
    const { data: threats } = await supabase.from("threat_logs").select("*").gte("created_at", startTime.toISOString())

    // Get security events
    const { data: events } = await supabase
      .from("security_events")
      .select("*")
      .gte("created_at", startTime.toISOString())

    // Get firewall rules
    const { data: rules } = await supabase.from("firewall_rules").select("*").eq("is_active", true)

    // Get system metrics
    const { data: metrics } = await supabase
      .from("system_metrics")
      .select("*")
      .gte("timestamp", startTime.toISOString())
      .order("timestamp", { ascending: false })

    // Calculate security metrics
    const totalThreats = threats?.length || 0
    const blockedThreats = threats?.filter((t) => t.status === "blocked").length || 0
    const criticalThreats = threats?.filter((t) => t.severity === "critical").length || 0
    const activeRules = rules?.length || 0

    // Calculate threat trends
    const threatsByHour = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
      const hourThreats =
        threats?.filter((t) => {
          const threatTime = new Date(t.created_at)
          return threatTime.getHours() === hour.getHours() && threatTime.getDate() === hour.getDate()
        }).length || 0

      return {
        hour: hour.getHours(),
        threats: hourThreats,
        timestamp: hour.toISOString(),
      }
    })

    // Calculate threat types distribution
    const threatTypes =
      threats?.reduce((acc: any, threat) => {
        acc[threat.threat_type] = (acc[threat.threat_type] || 0) + 1
        return acc
      }, {}) || {}

    // Calculate security score (0-100)
    const securityScore = Math.max(0, Math.min(100, 100 - criticalThreats * 10 - totalThreats * 0.5))

    // Get latest system performance
    const latestMetrics = metrics?.reduce((acc: any, metric) => {
      if (!acc[metric.metric_type] || new Date(metric.timestamp) > new Date(acc[metric.metric_type].timestamp)) {
        acc[metric.metric_type] = metric
      }
      return acc
    }, {})

    return NextResponse.json({
      overview: {
        totalThreats,
        blockedThreats,
        criticalThreats,
        activeRules,
        securityScore,
        blockRate: totalThreats > 0 ? Math.round((blockedThreats / totalThreats) * 100) : 100,
      },
      trends: {
        threatsByHour,
        threatTypes,
      },
      performance: {
        cpuUsage: latestMetrics?.cpu_usage?.value || 0,
        memoryUsage: latestMetrics?.memory_usage?.value || 0,
        networkTraffic: latestMetrics?.network_traffic?.value || 0,
        responseTime: latestMetrics?.response_time?.value || 0,
      },
      recentThreats: threats?.slice(0, 10) || [],
      timeRange,
    })
  } catch (error) {
    console.error("Error fetching security metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
