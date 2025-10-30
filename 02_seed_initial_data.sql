-- Seed initial data for the firewall AI system

-- Insert default firewall rules
INSERT INTO firewall_rules (rule_name, rule_type, conditions, action, priority, auto_generated) VALUES
('Block Known Malicious IPs', 'ip_block', '{"ip_ranges": ["192.168.1.100/32", "10.0.0.50/32"]}', 'block', 10, true),
('Rate Limit API Endpoints', 'rate_limit', '{"paths": ["/api/*"], "max_requests": 100, "window_seconds": 60}', 'rate_limit', 20, true),
('Block Suspicious User Agents', 'pattern_match', '{"user_agent_patterns": [".*bot.*", ".*crawler.*", ".*scanner.*"]}', 'block', 30, true),
('AI-Based Anomaly Detection', 'ai_based', '{"confidence_threshold": 0.8, "models": ["threat_detector_v1"]}', 'block', 5, true);

-- Insert sample AI model metrics
INSERT INTO ai_model_metrics (model_name, model_version, accuracy, precision_score, recall, f1_score, false_positive_rate, false_negative_rate, training_date, is_active) VALUES
('threat_detector_v1', '1.0.0', 0.9450, 0.9200, 0.9100, 0.9150, 0.0300, 0.0900, NOW() - INTERVAL '7 days', true),
('malware_classifier', '2.1.0', 0.9680, 0.9500, 0.9400, 0.9450, 0.0200, 0.0600, NOW() - INTERVAL '3 days', true),
('ddos_detector', '1.5.0', 0.9320, 0.9000, 0.8900, 0.8950, 0.0400, 0.1100, NOW() - INTERVAL '5 days', true);

-- Insert sample system metrics
INSERT INTO system_metrics (metric_type, value, unit) VALUES
('cpu_usage', 45.2, 'percent'),
('memory_usage', 68.7, 'percent'),
('network_traffic', 1024.5, 'mbps'),
('threat_count', 127, 'count'),
('blocked_requests', 89, 'count'),
('response_time', 0.245, 'seconds');
