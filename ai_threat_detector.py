#!/usr/bin/env python3
"""
Advanced AI Threat Detection System
Integrates machine learning models for real-time threat analysis
"""

import numpy as np
import pandas as pd
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import requests
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import joblib
import os

class AdvancedThreatDetector:
    def __init__(self):
        self.models = {}
        self.vectorizers = {}
        self.scalers = {}
        self.threat_patterns = self._load_threat_patterns()
        self.initialize_models()
    
    def _load_threat_patterns(self) -> Dict[str, List[str]]:
        """Load comprehensive threat patterns"""
        return {
            'sql_injection': [
                r'(\bUNION\b.*\bSELECT\b)',
                r'(\bOR\b.*=.*)',
                r'(\bDROP\b.*\bTABLE\b)',
                r'(\bINSERT\b.*\bINTO\b)',
                r'(\'.*OR.*\'.*=.*\')',
                r'(\bEXEC\b.*\bXP_)',
                r'(\bSELECT\b.*\bFROM\b.*\bWHERE\b.*=.*)',
                r'(\bDELETE\b.*\bFROM\b)',
                r'(\bUPDATE\b.*\bSET\b)',
                r'(\bALTER\b.*\bTABLE\b)'
            ],
            'xss': [
                r'<script[^>]*>.*</script>',
                r'javascript:',
                r'on\w+\s*=',
                r'<iframe[^>]*>',
                r'eval\s*\(',
                r'<object[^>]*>',
                r'<embed[^>]*>',
                r'<link[^>]*>',
                r'<meta[^>]*>',
                r'<style[^>]*>.*</style>'
            ],
            'command_injection': [
                r';\s*(ls|cat|pwd|whoami|id|uname)',
                r'\|\s*(ls|cat|pwd|whoami|id|uname)',
                r'&&\s*(ls|cat|pwd|whoami|id|uname)',
                r'`[^`]*`',
                r'\$$$[^)]*$$',
                r'>\s*/dev/null',
                r'2>&1',
                r'/bin/(sh|bash|csh|tcsh|zsh)',
                r'(wget|curl)\s+http'
            ],
            'path_traversal': [
                r'\.\./\.\.',
                r'\.\.\\\.\.\\',
                r'%2e%2e%2f',
                r'%2e%2e\\',
                r'\.\.%2f',
                r'\.\.%5c',
                r'/etc/passwd',
                r'/etc/shadow',
                r'C:\\Windows\\System32'
            ],
            'ldap_injection': [
                r'\*\)\(\|',
                r'\*\)\(\&',
                r'\(\|\(',
                r'\(\&\(',
                r'\)\(\|',
                r'\)\(\&'
            ]
        }
    
    def initialize_models(self):
        """Initialize ML models for threat detection"""
        print("[v0] Initializing AI threat detection models...")
        
        # Anomaly detection model
        self.models['anomaly'] = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
        
        # Classification model for threat types
        self.models['classifier'] = RandomForestClassifier(
            n_estimators=200,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        
        # Text vectorizer for payload analysis
        self.vectorizers['payload'] = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),
            analyzer='char_wb'
        )
        
        # Feature scaler
        self.scalers['features'] = StandardScaler()
        
        print("[v0] AI models initialized successfully")
    
    def extract_features(self, request_data: Dict[str, Any]) -> np.ndarray:
        """Extract features from request data for ML analysis"""
        features = []
        
        # Basic request features
        payload = request_data.get('payload', '')
        user_agent = request_data.get('user_agent', '')
        path = request_data.get('request_path', '')
        
        # Length-based features
        features.extend([
            len(payload),
            len(user_agent),
            len(path),
            payload.count('='),
            payload.count('&'),
            payload.count('<'),
            payload.count('>'),
            payload.count("'"),
            payload.count('"'),
            payload.count('('),
            payload.count(')')
        ])
        
        # Character frequency features
        if payload:
            features.extend([
                payload.count(c) / len(payload) for c in ['%', ';', '|', '&', '<', '>', "'", '"']
            ])
        else:
            features.extend([0] * 8)
        
        # Pattern matching features
        for threat_type, patterns in self.threat_patterns.items():
            pattern_matches = sum(1 for pattern in patterns if re.search(pattern, payload, re.IGNORECASE))
            features.append(pattern_matches)
        
        # HTTP method and status features
        method = request_data.get('method', 'GET')
        features.extend([
            1 if method == 'POST' else 0,
            1 if method == 'PUT' else 0,
            1 if method == 'DELETE' else 0
        ])
        
        # Time-based features
        hour = datetime.now().hour
        features.extend([
            hour,
            1 if 0 <= hour <= 6 else 0,  # Night time requests
            1 if 22 <= hour <= 23 or 0 <= hour <= 6 else 0  # Off-hours
        ])
        
        return np.array(features).reshape(1, -1)
    
    def detect_pattern_threats(self, payload: str) -> Dict[str, Any]:
        """Detect threats using pattern matching"""
        detected_threats = {}
        confidence_scores = {}
        
        for threat_type, patterns in self.threat_patterns.items():
            matches = []
            for pattern in patterns:
                if re.search(pattern, payload, re.IGNORECASE):
                    matches.append(pattern)
            
            if matches:
                detected_threats[threat_type] = matches
                # Calculate confidence based on number of pattern matches
                confidence_scores[threat_type] = min(len(matches) * 0.2, 1.0)
        
        return {
            'threats': detected_threats,
            'confidence_scores': confidence_scores
        }
    
    def analyze_request_anomaly(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze request for anomalies using ML"""
        try:
            features = self.extract_features(request_data)
            
            # Anomaly detection
            anomaly_score = self.models['anomaly'].decision_function(features)[0]
            is_anomaly = self.models['anomaly'].predict(features)[0] == -1
            
            # Normalize anomaly score to 0-1 range
            normalized_score = max(0, min(1, (anomaly_score + 0.5) / 1.0))
            
            return {
                'is_anomaly': bool(is_anomaly),
                'anomaly_score': float(normalized_score),
                'confidence': float(1 - normalized_score) if is_anomaly else float(normalized_score)
            }
        except Exception as e:
            print(f"[v0] Error in anomaly analysis: {e}")
            return {
                'is_anomaly': False,
                'anomaly_score': 0.0,
                'confidence': 0.5
            }
    
    def classify_threat_type(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Classify the type of threat using ML"""
        try:
            # Pattern-based classification first
            pattern_results = self.detect_pattern_threats(request_data.get('payload', ''))
            
            if pattern_results['threats']:
                # Return the threat type with highest confidence
                best_threat = max(pattern_results['confidence_scores'].items(), key=lambda x: x[1])
                return {
                    'threat_type': best_threat[0],
                    'confidence': best_threat[1],
                    'method': 'pattern_matching',
                    'detected_patterns': pattern_results['threats'][best_threat[0]]
                }
            
            # If no patterns matched, use anomaly detection
            anomaly_result = self.analyze_request_anomaly(request_data)
            if anomaly_result['is_anomaly']:
                return {
                    'threat_type': 'anomaly',
                    'confidence': anomaly_result['confidence'],
                    'method': 'anomaly_detection',
                    'anomaly_score': anomaly_result['anomaly_score']
                }
            
            return {
                'threat_type': 'benign',
                'confidence': 0.9,
                'method': 'classification'
            }
            
        except Exception as e:
            print(f"[v0] Error in threat classification: {e}")
            return {
                'threat_type': 'unknown',
                'confidence': 0.0,
                'method': 'error'
            }
    
    def calculate_risk_score(self, request_data: Dict[str, Any], threat_analysis: Dict[str, Any]) -> int:
        """Calculate overall risk score (0-100)"""
        base_score = 0
        
        # Threat type scoring
        threat_scores = {
            'sql_injection': 90,
            'xss': 85,
            'command_injection': 95,
            'path_traversal': 80,
            'ldap_injection': 75,
            'anomaly': 60,
            'benign': 10
        }
        
        threat_type = threat_analysis.get('threat_type', 'benign')
        base_score = threat_scores.get(threat_type, 50)
        
        # Confidence multiplier
        confidence = threat_analysis.get('confidence', 0.5)
        base_score = int(base_score * confidence)
        
        # IP reputation factor (simplified)
        source_ip = request_data.get('source_ip', '')
        if source_ip.startswith('192.168.') or source_ip.startswith('10.'):
            base_score = max(10, base_score - 20)  # Lower risk for internal IPs
        
        # Time-based factor
        hour = datetime.now().hour
        if 0 <= hour <= 6 or 22 <= hour <= 23:
            base_score = min(100, base_score + 10)  # Higher risk for off-hours
        
        return min(100, max(0, base_score))
    
    def analyze_threat(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main threat analysis function"""
        print(f"[v0] Analyzing threat for IP: {request_data.get('source_ip', 'unknown')}")
        
        try:
            # Classify threat
            threat_analysis = self.classify_threat_type(request_data)
            
            # Calculate risk score
            risk_score = self.calculate_risk_score(request_data, threat_analysis)
            
            # Determine severity
            if risk_score >= 90:
                severity = 'critical'
            elif risk_score >= 70:
                severity = 'high'
            elif risk_score >= 40:
                severity = 'medium'
            else:
                severity = 'low'
            
            # Determine if should block
            should_block = risk_score >= 70 or threat_analysis.get('threat_type') in [
                'sql_injection', 'xss', 'command_injection'
            ]
            
            result = {
                'threat_detected': risk_score > 30,
                'threat_type': threat_analysis.get('threat_type', 'unknown'),
                'severity': severity,
                'risk_score': risk_score,
                'confidence': threat_analysis.get('confidence', 0.0),
                'should_block': should_block,
                'analysis_method': threat_analysis.get('method', 'unknown'),
                'detected_patterns': threat_analysis.get('detected_patterns', []),
                'timestamp': datetime.now().isoformat(),
                'model_version': '2.0.0'
            }
            
            print(f"[v0] Threat analysis complete: {threat_analysis.get('threat_type')} (risk: {risk_score})")
            return result
            
        except Exception as e:
            print(f"[v0] Error in threat analysis: {e}")
            return {
                'threat_detected': False,
                'threat_type': 'error',
                'severity': 'low',
                'risk_score': 0,
                'confidence': 0.0,
                'should_block': False,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

def main():
    """Main function for testing the threat detector"""
    detector = AdvancedThreatDetector()
    
    # Test cases
    test_requests = [
        {
            'source_ip': '192.168.1.100',
            'payload': "' OR '1'='1' --",
            'user_agent': 'Mozilla/5.0',
            'request_path': '/login',
            'method': 'POST'
        },
        {
            'source_ip': '10.0.0.50',
            'payload': '<script>alert("XSS")</script>',
            'user_agent': 'Chrome/91.0',
            'request_path': '/search',
            'method': 'GET'
        },
        {
            'source_ip': '172.16.0.10',
            'payload': '; ls -la',
            'user_agent': 'curl/7.68.0',
            'request_path': '/api/exec',
            'method': 'POST'
        }
    ]
    
    print("[v0] Testing AI Threat Detection System")
    print("=" * 50)
    
    for i, request in enumerate(test_requests, 1):
        print(f"\nTest Case {i}:")
        print(f"IP: {request['source_ip']}")
        print(f"Payload: {request['payload']}")
        
        result = detector.analyze_threat(request)
        print(f"Result: {result['threat_type']} ({result['severity']}) - Risk: {result['risk_score']}")
        print(f"Should Block: {result['should_block']}")
        
        if result.get('detected_patterns'):
            print(f"Patterns: {result['detected_patterns']}")

if __name__ == "__main__":
    main()
