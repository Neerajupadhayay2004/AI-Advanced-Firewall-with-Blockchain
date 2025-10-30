import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

export type SecurityEvent = {
  id: string
  timestamp: string
  source: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  ip_address: string
  user_id?: string
  path?: string
  metadata?: Record<string, any>
  ai_analysis?: string
  blocked: boolean
}

export type ThreatReport = {
  id: string
  created_at: string
  period_start: string
  period_end: string
  total_events: number
  blocked_threats: number
  ai_summary: string
  report_data: Record<string, any>
  pdf_url?: string
}
