import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { auditLog } from "@/lib/security/audit-logger"
import { getSecurityContext, checkAccess } from "@/lib/security/advanced-auth"

interface SecurityIncident {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  status: "open" | "investigating" | "resolved" | "false_positive"
  description: string
  affected_systems: string[]
  indicators: string[]
  response_actions: string[]
  created_at: string
  updated_at: string
}

export async function GET(request: NextRequest) {
  try {
    // Check security clearance
    const hasAccess = await checkAccess(3) // Analyst level required
    if (!hasAccess) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "list"

    const supabase = createClient()

    if (action === "list") {
      // Get recent security incidents
      const { data: incidents, error } = await supabase
        .from("security_events")
        .select("*")
        .gte("risk_score", 70)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
      }

      return NextResponse.json({ incidents })
    }

    if (action === "stats") {
      // Get incident statistics
      const { data: stats, error } = await supabase.rpc("get_security_stats")

      if (error) {
        console.error("Stats error:", error)
        // Return mock stats if RPC fails
        return NextResponse.json({
          stats: {
            total_incidents: 0,
            open_incidents: 0,
            critical_incidents: 0,
            resolved_today: 0,
            avg_response_time: 0,
          },
        })
      }

      return NextResponse.json({ stats })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Security incident API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const hasAccess = await checkAccess(4) // Admin level required
    if (!hasAccess) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { action, incident_id, status, response_actions } = body

    const supabase = createClient()
    const context = await getSecurityContext()

    if (action === "update_status") {
      const { error } = await supabase
        .from("security_events")
        .update({
          automated_response: `Status updated to ${status} by admin`,
        })
        .eq("id", incident_id)

      if (error) {
        return NextResponse.json({ error: "Failed to update incident" }, { status: 500 })
      }

      await auditLog({
        event_type: "incident_status_update",
        user_id: context?.user_id,
        details: {
          incident_id,
          new_status: status,
          response_actions,
        },
        risk_score: 20,
      })

      return NextResponse.json({ success: true })
    }

    if (action === "create_incident") {
      const { type, severity, description, affected_systems } = body

      const { data: incident, error } = await supabase
        .from("security_events")
        .insert({
          event_type: "manual_incident",
          user_id: context?.user_id,
          details: {
            type,
            severity,
            description,
            affected_systems,
            created_by: "admin",
          },
          risk_score: severity === "critical" ? 95 : severity === "high" ? 80 : 60,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: "Failed to create incident" }, { status: 500 })
      }

      return NextResponse.json({ success: true, incident })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Security incident management error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
