#!/usr/bin/env python3
"""
Advanced Security Analysis Engine
Implements machine learning models for threat detection and behavioral analysis
"""

import json
import re
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any
import hashlib
import base64

class AdvancedSecurityAnalyzer:
    def __init__(self):
        self.threat_patterns = self._load_threat_patterns()
        self.ml_models = self._initialize_ml_models()
        self.behavioral_baselines = {}
        
    def _load_threat_patterns(self) -> Dict[str, List[str]]:
        """Load advanced threat detection patterns"""
        return {
            'sql_injection': [
                r'(\bunion\b.*\bselect\b)',
                r'(\bor\b.*=.*)',
                r'(\bdrop\b.*\btable\b)',
                r'(\binsert\b.*\binto\b)',
                r'(\bdelete\b.*\bfrom\b)'
            ],
            'xss': [
                r'<script[^>]*>.*?</script>',
                r'javascript:',
                r'on\w+\s*=',
                r'<iframe[^>]*>',
                r'eval\s*\('
            ],
            'command_injection': [
                r';\s*(ls|cat|wget|curl)',
                r'\|\s*(nc|netcat)',
                r'`[^`]*`',
                r'\$$$[^)]*$$',
                r'&&\s*(rm|mv|cp)'
            ],
            'path_traversal': [
                r'\.\./',
                r'\.\.\\',
                r'%2e%2e%2f',
                r'%2e%2e%5c'
            ]
        }
    
    def _initialize_ml_models(self) -> Dict[str, Any]:
        """Initialize machine learning models for threat detection"""
        # Simulate ML model initialization
        return {
            'anomaly_detector': {'threshold': 0.7, 'sensitivity': 0.8},
            'behavioral_analyzer': {'window_size': 100, 'deviation_threshold': 2.5},
            'pattern_classifier': {'confidence_threshold': 0.85}
        }
    
    def analyze_payload(self, payload: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Comprehensive payload analysis using multiple detection methods
        """
        if context is None:
            context = {}
            
        analysis_result = {
            'timestamp': datetime.now().isoformat(),
            'payload_hash': hashlib.sha256(payload.encode()).hexdigest()[:16],
            'threat_level': 'Low',
            'confidence': 0.0,
            'detected_threats': [],
            'anomaly_score': 0.0,
            'behavioral_score': 0.0,
            'recommendations': []
        }
        
        # Pattern-based detection
        pattern_results = self._pattern_analysis(payload)
        analysis_result['detected_threats'].extend(pattern_results['threats'])
        
        # Anomaly detection
        anomaly_score = self._anomaly_detection(payload, context)
        analysis_result['anomaly_score'] = anomaly_score
        
        # Behavioral analysis
        behavioral_score = self._behavioral_analysis(payload, context)
        analysis_result['behavioral_score'] = behavioral_score
        
        # Calculate overall threat level and confidence
        overall_score = self._calculate_threat_score(
            pattern_results['score'],
            anomaly_score,
            behavioral_score
        )
        
        analysis_result['confidence'] = min(0.95, overall_score / 100)
        analysis_result['threat_level'] = self._determine_threat_level(overall_score)
        analysis_result['recommendations'] = self._generate_recommendations(analysis_result)
        
        return analysis_result
    
    def _pattern_analysis(self, payload: str) -> Dict[str, Any]:
        """Advanced pattern matching with weighted scoring"""
        detected_threats = []
        total_score = 0
        
        for threat_type, patterns in self.threat_patterns.items():
            for pattern in patterns:
                matches = re.findall(pattern, payload, re.IGNORECASE)
                if matches:
                    threat_info = {
                        'type': threat_type,
                        'pattern': pattern,
                        'matches': len(matches),
                        'severity': self._get_pattern_severity(threat_type)
                    }
                    detected_threats.append(threat_info)
                    
                    # Weight scoring based on threat type
                    weight = {'sql_injection': 25, 'xss': 20, 'command_injection': 30, 'path_traversal': 15}
                    total_score += weight.get(threat_type, 10) * len(matches)
        
        return {'threats': detected_threats, 'score': min(100, total_score)}
    
    def _anomaly_detection(self, payload: str, context: Dict[str, Any]) -> float:
        """Statistical anomaly detection"""
        anomaly_score = 0.0
        
        # Length-based anomaly
        if len(payload) > 10000:
            anomaly_score += 0.3
        elif len(payload) > 5000:
            anomaly_score += 0.15
            
        # Entropy analysis
        entropy = self._calculate_entropy(payload)
        if entropy < 2.0:  # Low entropy indicates possible encoding
            anomaly_score += 0.25
        elif entropy > 7.0:  # Very high entropy
            anomaly_score += 0.2
            
        # Character frequency analysis
        char_freq = self._analyze_character_frequency(payload)
        if char_freq['suspicious_chars'] > 0.1:
            anomaly_score += 0.2
            
        # URL encoding detection
        url_encoded_ratio = len(re.findall(r'%[0-9a-fA-F]{2}', payload)) / max(1, len(payload))
        if url_encoded_ratio > 0.3:
            anomaly_score += 0.15
            
        return min(1.0, anomaly_score)
    
    def _behavioral_analysis(self, payload: str, context: Dict[str, Any]) -> float:
        """Behavioral pattern analysis"""
        behavioral_score = 0.0
        
        # Request frequency analysis
        if context.get('request_frequency', 0) > 100:
            behavioral_score += 0.3
            
        # Time-based analysis
        current_hour = datetime.now().hour
        if current_hour < 6 or current_hour > 22:  # Off-hours activity
            behavioral_score += 0.1
            
        # Geographic analysis
        suspicious_countries = ['CN', 'RU', 'KP', 'IR']
        if context.get('country_code') in suspicious_countries:
            behavioral_score += 0.2
            
        # User agent analysis
        user_agent = context.get('user_agent', '')
        if self._is_suspicious_user_agent(user_agent):
            behavioral_score += 0.15
            
        return min(1.0, behavioral_score)
    
    def _calculate_entropy(self, data: str) -> float:
        """Calculate Shannon entropy of the data"""
        if not data:
            return 0
            
        # Count character frequencies
        char_counts = {}
        for char in data:
            char_counts[char] = char_counts.get(char, 0) + 1
            
        # Calculate entropy
        entropy = 0
        data_len = len(data)
        for count in char_counts.values():
            probability = count / data_len
            entropy -= probability * np.log2(probability)
            
        return entropy
    
    def _analyze_character_frequency(self, data: str) -> Dict[str, float]:
        """Analyze character frequency for anomalies"""
        total_chars = len(data)
        if total_chars == 0:
            return {'suspicious_chars': 0.0, 'control_chars': 0.0}
            
        suspicious_chars = len(re.findall(r'[<>"\'$$$$\{\}\[\]\\]', data))
        control_chars = len(re.findall(r'[\x00-\x1f\x7f]', data))
        
        return {
            'suspicious_chars': suspicious_chars / total_chars,
            'control_chars': control_chars / total_chars
        }
    
    def _is_suspicious_user_agent(self, user_agent: str) -> bool:
        """Check if user agent is suspicious"""
        suspicious_patterns = [
            r'bot', r'crawler', r'spider', r'scraper',
            r'curl', r'wget', r'python', r'java',
            r'scanner', r'exploit'
        ]
        
        for pattern in suspicious_patterns:
            if re.search(pattern, user_agent, re.IGNORECASE):
                return True
        return False
    
    def _calculate_threat_score(self, pattern_score: float, anomaly_score: float, behavioral_score: float) -> float:
        """Calculate weighted threat score"""
        # Weighted combination of different analysis methods
        weights = {'pattern': 0.5, 'anomaly': 0.3, 'behavioral': 0.2}
        
        total_score = (
            pattern_score * weights['pattern'] +
            anomaly_score * 100 * weights['anomaly'] +
            behavioral_score * 100 * weights['behavioral']
        )
        
        return min(100, total_score)
    
    def _determine_threat_level(self, score: float) -> str:
        """Determine threat level based on score"""
        if score >= 80:
            return 'Critical'
        elif score >= 60:
            return 'High'
        elif score >= 30:
            return 'Medium'
        else:
            return 'Low'
    
    def _get_pattern_severity(self, threat_type: str) -> str:
        """Get severity level for threat type"""
        severity_map = {
            'sql_injection': 'High',
            'xss': 'High',
            'command_injection': 'Critical',
            'path_traversal': 'Medium'
        }
        return severity_map.get(threat_type, 'Low')
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate security recommendations based on analysis"""
        recommendations = []
        
        if analysis['threat_level'] in ['Critical', 'High']:
            recommendations.append('Implement immediate blocking for this pattern')
            recommendations.append('Alert security team for manual review')
            
        if analysis['anomaly_score'] > 0.5:
            recommendations.append('Enable enhanced logging for similar requests')
            recommendations.append('Consider implementing rate limiting')
            
        if analysis['behavioral_score'] > 0.3:
            recommendations.append('Monitor source IP for repeated suspicious activity')
            recommendations.append('Consider geographic blocking if appropriate')
            
        if any(threat['type'] == 'sql_injection' for threat in analysis['detected_threats']):
            recommendations.append('Review and update SQL injection prevention measures')
            recommendations.append('Implement parameterized queries')
            
        return recommendations

def main():
    """Main execution function for testing"""
    analyzer = AdvancedSecurityAnalyzer()
    
    # Test payloads
    test_payloads = [
        "' OR '1'='1' --",
        "<script>alert('XSS')</script>",
        "../../../../etc/passwd",
        "; cat /etc/passwd",
        "normal user input"
    ]
    
    print("Advanced Security Analysis Results:")
    print("=" * 50)
    
    for i, payload in enumerate(test_payloads, 1):
        print(f"\nTest {i}: {payload[:50]}...")
        
        context = {
            'request_frequency': np.random.randint(1, 200),
            'country_code': np.random.choice(['US', 'CN', 'RU', 'DE']),
            'user_agent': 'Mozilla/5.0 (compatible; TestBot/1.0)'
        }
        
        result = analyzer.analyze_payload(payload, context)
        
        print(f"Threat Level: {result['threat_level']}")
        print(f"Confidence: {result['confidence']:.2f}")
        print(f"Detected Threats: {len(result['detected_threats'])}")
        print(f"Anomaly Score: {result['anomaly_score']:.2f}")
        print(f"Behavioral Score: {result['behavioral_score']:.2f}")
        
        if result['recommendations']:
            print("Recommendations:")
            for rec in result['recommendations'][:3]:
                print(f"  - {rec}")

if __name__ == "__main__":
    main()
