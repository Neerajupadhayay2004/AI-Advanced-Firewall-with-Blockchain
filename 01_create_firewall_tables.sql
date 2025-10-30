-- Advanced Firewall AI System Database Schema
-- Create tables for threat detection, security monitoring, and web3 integration

-- Users table extension for security profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user')),
  security_clearance INTEGER DEFAULT 1 CHECK (security_clearance BETWEEN 1 AND 5),
  last_login TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Threat detection logs
CREATE TABLE IF NOT EXISTS threat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threat_type TEXT NOT NULL CHECK (threat_type IN ('malware', 'ddos', 'intrusion', 'phishing', 'sql_injection', 'xss', 'brute_force', 'anomaly')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_ip INET NOT NULL,
  target_ip INET,
  user_agent TEXT,
  request_path TEXT,
  payload JSONB,
  ai_confidence DECIMAL(5,4) CHECK (ai_confidence BETWEEN 0 AND 1),
  status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'blocked', 'allowed', 'investigating')),
  blocked_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  analyst_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security events and incidents
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('login', 'logout', 'failed_login', 'permission_change', 'data_access', 'system_alert', 'policy_violation')),
  user_id UUID REFERENCES auth.users(id),
  source_ip INET,
  details JSONB NOT NULL,
  risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
  automated_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dynamic firewall rules
CREATE TABLE IF NOT EXISTS firewall_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL UNIQUE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('ip_block', 'rate_limit', 'geo_block', 'pattern_match', 'ai_based')),
  conditions JSONB NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('block', 'allow', 'rate_limit', 'captcha', 'log_only')),
  priority INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  auto_generated BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Web3 transaction monitoring
CREATE TABLE IF NOT EXISTS web3_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_hash TEXT NOT NULL UNIQUE,
  blockchain TEXT NOT NULL CHECK (blockchain IN ('ethereum', 'bitcoin', 'polygon', 'bsc', 'arbitrum')),
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  value DECIMAL(36,18),
  gas_used BIGINT,
  gas_price DECIMAL(36,18),
  transaction_fee DECIMAL(36,18),
  block_number BIGINT,
  risk_assessment JSONB,
  threat_indicators TEXT[],
  is_suspicious BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System performance metrics
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL CHECK (metric_type IN ('cpu_usage', 'memory_usage', 'network_traffic', 'threat_count', 'blocked_requests', 'response_time')),
  value DECIMAL(10,4) NOT NULL,
  unit TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- AI model performance tracking
CREATE TABLE IF NOT EXISTS ai_model_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  accuracy DECIMAL(5,4),
  precision_score DECIMAL(5,4),
  recall DECIMAL(5,4),
  f1_score DECIMAL(5,4),
  false_positive_rate DECIMAL(5,4),
  false_negative_rate DECIMAL(5,4),
  training_date TIMESTAMPTZ,
  evaluation_date TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_threat_logs_created_at ON threat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_logs_severity ON threat_logs(severity);
CREATE INDEX IF NOT EXISTS idx_threat_logs_source_ip ON threat_logs(source_ip);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_firewall_rules_active ON firewall_rules(is_active, priority);
CREATE INDEX IF NOT EXISTS idx_web3_transactions_hash ON web3_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_web3_transactions_suspicious ON web3_transactions(is_suspicious);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE threat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE firewall_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE web3_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Analysts and admins can view threat logs" ON threat_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'analyst')
    )
  );

CREATE POLICY "Admins can manage firewall rules" ON firewall_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
