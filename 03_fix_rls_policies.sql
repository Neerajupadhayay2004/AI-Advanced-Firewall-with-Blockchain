-- Fix infinite recursion in RLS policies
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Analysts and admins can view threat logs" ON threat_logs;
DROP POLICY IF EXISTS "Admins can manage firewall rules" ON firewall_rules;

-- Create corrected RLS policies without circular references
-- Simple policy for user profiles - users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow service role to access all data (for API routes)
CREATE POLICY "Service role full access user_profiles" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access threat_logs" ON threat_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access security_events" ON security_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access firewall_rules" ON firewall_rules
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access web3_transactions" ON web3_transactions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access system_metrics" ON system_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access ai_model_metrics" ON ai_model_metrics
  FOR ALL USING (auth.role() = 'service_role');

-- Allow authenticated users to read system data (for dashboard)
CREATE POLICY "Authenticated users can read threat_logs" ON threat_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read security_events" ON security_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read system_metrics" ON system_metrics
  FOR SELECT USING (auth.role() = 'authenticated');
