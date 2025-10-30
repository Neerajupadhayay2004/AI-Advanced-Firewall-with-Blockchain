import { createClient } from "@/lib/supabase/server"

interface AuditLogEntry {
  event_type: string
  user_id?: string
  user_email?: string
  ip_address?: string
  details: Record<string, any>
  risk_score: number
  automated_response?: string
}

export async function auditLog(entry: AuditLogEntry) {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("security_events").insert({
      event_type: entry.event_type,
      user_id: entry.user_id,
      source_ip: entry.ip_address,
      details: {
        ...entry.details,
        user_email: entry.user_email,
      },
      risk_score: entry.risk_score,
      automated_response: entry.automated_response,
    })

    if (error) {
      console.error("Audit log error:", error)
    }

    // Trigger automated responses for high-risk events
    if (entry.risk_score >= 80) {
      await triggerSecurityResponse(entry)
    }
  } catch (error) {
    console.error("Failed to write audit log:", error)
  }
}

async function triggerSecurityResponse(entry: AuditLogEntry) {
  const supabase = createClient()

  // Auto-block IP for very high risk events
  if (entry.risk_score >= 90 && entry.ip_address) {
    await supabase.from("firewall_rules").insert({
      rule_name: `auto_block_${entry.ip_address}_${Date.now()}`,
      rule_type: "ip_block",
      conditions: { ip_address: entry.ip_address },
      action: "block",
      priority: 1,
      auto_generated: true,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    })

    console.log(`[SECURITY] Auto-blocked IP ${entry.ip_address} due to high-risk activity`)
  }

  // Lock user account for repeated failed attempts
  if (entry.event_type === "failed_login" && entry.user_id) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("failed_login_attempts")
      .eq("user_id", entry.user_id)
      .single()

    if (profile && profile.failed_login_attempts >= 5) {
      await supabase.from("user_profiles").update({ account_locked: true }).eq("user_id", entry.user_id)

      console.log(`[SECURITY] Locked account ${entry.user_id} due to repeated failed logins`)
    }
  }
}
