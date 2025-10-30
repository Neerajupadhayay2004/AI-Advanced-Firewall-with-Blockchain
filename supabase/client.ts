import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createClientComponentClient()

// Database types for TypeScript
export interface ThreatLog {
  id: string
  threat_type: "malware" | "ddos" | "intrusion" | "phishing" | "sql_injection" | "xss" | "brute_force" | "anomaly"
  severity: "low" | "medium" | "high" | "critical"
  source_ip: string
  target_ip?: string
  user_agent?: string
  request_path?: string
  payload?: any
  ai_confidence?: number
  status: "detected" | "blocked" | "allowed" | "investigating"
  blocked_at?: string
  resolved_at?: string
  analyst_notes?: string
  created_at: string
}

export interface SecurityEvent {
  id: string
  event_type:
    | "login"
    | "logout"
    | "failed_login"
    | "permission_change"
    | "data_access"
    | "system_alert"
    | "policy_violation"
  user_id?: string
  source_ip?: string
  details: any
  risk_score?: number
  automated_response?: string
  created_at: string
}

export interface FirewallRule {
  id: string
  rule_name: string
  rule_type: "ip_block" | "rate_limit" | "geo_block" | "pattern_match" | "ai_based"
  conditions: any
  action: "block" | "allow" | "rate_limit" | "captcha" | "log_only"
  priority: number
  is_active: boolean
  auto_generated: boolean
  expires_at?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Web3Transaction {
  id: string
  transaction_hash: string
  blockchain: "ethereum" | "bitcoin" | "polygon" | "bsc" | "arbitrum"
  from_address: string
  to_address: string
  value?: number
  gas_used?: number
  gas_price?: number
  transaction_fee?: number
  block_number?: number
  risk_assessment?: any
  threat_indicators?: string[]
  is_suspicious: boolean
  created_at: string
}

export interface SystemMetric {
  id: string
  metric_type: "cpu_usage" | "memory_usage" | "network_traffic" | "threat_count" | "blocked_requests" | "response_time"
  value: number
  unit: string
  timestamp: string
  metadata?: any
}

export interface UserProfile {
  id: string
  user_id: string
  role: "admin" | "analyst" | "user"
  security_clearance: number
  last_login?: string
  failed_login_attempts: number
  account_locked: boolean
  created_at: string
  updated_at: string
}
