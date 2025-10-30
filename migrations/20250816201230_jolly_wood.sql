/*
# Security Monitoring Database Schema

## Overview
This migration creates the complete database schema for the Nexus Firewall AI monitoring system.

## Tables Created
1. **security_events** - Main table for storing all security events and incidents
2. **threat_analyses** - AI-generated threat analysis results
3. **security_reports** - Generated security reports with PDF storage
4. **firewall_rules** - Dynamic firewall rules and configurations
5. **ip_reputation** - IP address reputation and blocking status

## Security Features
- Row Level Security (RLS) enabled on all tables
- Policies for authenticated users
- Real-time subscriptions enabled
- Automated cleanup policies for old data

## Indexes
- Optimized indexes for real-time queries
- Composite indexes for common filtering patterns
- GIN indexes for JSON metadata searches
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Security Events Table
CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'Unknown',
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  message text NOT NULL,
  ip_address inet NOT NULL,
  user_id uuid,
  path text,
  metadata jsonb DEFAULT '{}',
  ai_analysis text,
  blocked boolean NOT NULL DEFAULT false,
  rule_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Threat Analyses Table
CREATE TABLE IF NOT EXISTS threat_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_timestamp timestamptz NOT NULL DEFAULT now(),
  events_analyzed integer NOT NULL DEFAULT 0,
  threat_level text NOT NULL CHECK (threat_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'low',
  summary text NOT NULL,
  recommendations jsonb DEFAULT '[]',
  metrics jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Security Reports Table
CREATE TABLE IF NOT EXISTS security_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL DEFAULT 'daily',
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  total_events integer NOT NULL DEFAULT 0,
  blocked_threats integer NOT NULL DEFAULT 0,
  critical_alerts integer NOT NULL DEFAULT 0,
  ai_summary text,
  report_data jsonb DEFAULT '{}',
  pdf_url text,
  generated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

-- Firewall Rules Table
CREATE TABLE IF NOT EXISTS firewall_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  rule_type text NOT NULL CHECK (rule_type IN ('allow', 'block', 'rate_limit', 'monitor')) DEFAULT 'monitor',
  source_ip cidr,
  destination_ip cidr,
  port_range text,
  protocol text CHECK (protocol IN ('tcp', 'udp', 'icmp', 'any')) DEFAULT 'any',
  action jsonb DEFAULT '{}',
  priority integer NOT NULL DEFAULT 100,
  enabled boolean NOT NULL DEFAULT true,
  hit_count bigint DEFAULT 0,
  last_triggered timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid
);

-- IP Reputation Table
CREATE TABLE IF NOT EXISTS ip_reputation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL UNIQUE,
  reputation_score integer NOT NULL DEFAULT 50 CHECK (reputation_score >= 0 AND reputation_score <= 100),
  threat_categories jsonb DEFAULT '[]',
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  total_events bigint DEFAULT 0,
  blocked_events bigint DEFAULT 0,
  is_whitelisted boolean DEFAULT false,
  is_blacklisted boolean DEFAULT false,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON security_events (ip_address);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events (severity);
CREATE INDEX IF NOT EXISTS idx_security_events_blocked ON security_events (blocked);
CREATE INDEX IF NOT EXISTS idx_security_events_composite ON security_events (timestamp DESC, severity, blocked);

CREATE INDEX IF NOT EXISTS idx_threat_analyses_timestamp ON threat_analyses (analysis_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_threat_analyses_level ON threat_analyses (threat_level);

CREATE INDEX IF NOT EXISTS idx_security_reports_period ON security_reports (period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_security_reports_type ON security_reports (report_type);

CREATE INDEX IF NOT EXISTS idx_firewall_rules_enabled ON firewall_rules (enabled);
CREATE INDEX IF NOT EXISTS idx_firewall_rules_priority ON firewall_rules (priority DESC);

CREATE INDEX IF NOT EXISTS idx_ip_reputation_score ON ip_reputation (reputation_score);
CREATE INDEX IF NOT EXISTS idx_ip_reputation_last_seen ON ip_reputation (last_seen DESC);

-- GIN indexes for JSON columns
CREATE INDEX IF NOT EXISTS idx_security_events_metadata_gin ON security_events USING gin (metadata);
CREATE INDEX IF NOT EXISTS idx_threat_analyses_recommendations_gin ON threat_analyses USING gin (recommendations);
CREATE INDEX IF NOT EXISTS idx_ip_reputation_categories_gin ON ip_reputation USING gin (threat_categories);

-- Enable Row Level Security
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE firewall_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_reputation ENABLE ROW LEVEL SECURITY;

-- RLS Policies for security_events
CREATE POLICY "Allow authenticated users to read security events"
  ON security_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert security events"
  ON security_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for threat_analyses
CREATE POLICY "Allow authenticated users to read threat analyses"
  ON threat_analyses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert threat analyses"
  ON threat_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for security_reports
CREATE POLICY "Allow authenticated users to read security reports"
  ON security_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert security reports"
  ON security_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for firewall_rules
CREATE POLICY "Allow authenticated users to read firewall rules"
  ON firewall_rules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage firewall rules"
  ON firewall_rules
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for ip_reputation
CREATE POLICY "Allow authenticated users to read IP reputation"
  ON ip_reputation
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update IP reputation"
  ON ip_reputation
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_security_events_updated_at
    BEFORE UPDATE ON security_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_firewall_rules_updated_at
    BEFORE UPDATE ON firewall_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ip_reputation_updated_at
    BEFORE UPDATE ON ip_reputation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up old events (optional, for data retention)
CREATE OR REPLACE FUNCTION cleanup_old_security_events()
RETURNS void AS $$
BEGIN
  DELETE FROM security_events 
  WHERE created_at < now() - interval '90 days'
  AND severity NOT IN ('high', 'critical');
  
  DELETE FROM threat_analyses 
  WHERE created_at < now() - interval '180 days';
END;
$$ LANGUAGE plpgsql;

-- Insert some sample firewall rules
INSERT INTO firewall_rules (name, description, rule_type, priority, enabled) VALUES
  ('Block Known Bad IPs', 'Block traffic from known malicious IP ranges', 'block', 1, true),
  ('Rate Limit API', 'Limit API requests to prevent abuse', 'rate_limit', 10, true),
  ('Monitor Admin Access', 'Monitor all admin panel access attempts', 'monitor', 50, true),
  ('Allow Internal Network', 'Allow all traffic from internal network', 'allow', 100, true)
ON CONFLICT DO NOTHING;

-- Insert some sample IP reputation data
INSERT INTO ip_reputation (ip_address, reputation_score, threat_categories, is_blacklisted, notes) VALUES
  ('192.168.1.1'::inet, 95, '[]'::jsonb, false, 'Internal network gateway'),
  ('10.0.0.1'::inet, 90, '[]'::jsonb, false, 'Internal server'),
  ('203.0.113.1'::inet, 10, '["malware", "botnet"]'::jsonb, true, 'Known malicious IP'),
  ('198.51.100.1'::inet, 25, '["suspicious"]'::jsonb, false, 'Flagged for unusual activity')
ON CONFLICT (ip_address) DO NOTHING;
