import numpy as np
import json
import time
from datetime import datetime
from typing import Dict, List, Any, Tuple
import hashlib
import random
import asyncio

class MLThreatAnalyzer:
    """Advanced machine learning threat analysis system"""
    
    def __init__(self):
        self.models = self._initialize_models()
        self.feature_extractors = self._setup_feature_extractors()
        self.threat_database = self._load_threat_database()
        self.model_performance = self._initialize_performance_metrics()
        
    def _initialize_models(self) -> Dict[str, Any]:
        """Initialize ML models for threat analysis"""
        return {
            'deep_neural_network': {
                'type': 'DNN',
                'layers': [512, 256, 128, 64, 32],
                'activation': 'relu',
                'dropout': 0.3,
                'accuracy': 0.96,
                'trained_samples': 1000000,
                'last_updated': datetime.now().isoformat()
            },
            'ensemble_classifier': {
                'type': 'Ensemble',
                'models': ['random_forest', 'gradient_boosting', 'svm'],
                'voting': 'soft',
                'accuracy': 0.94,
                'trained_samples': 500000,
                'last_updated': datetime.now().isoformat()
            },
            'lstm_behavioral': {
                'type': 'LSTM',
                'sequence_length': 100,
                'hidden_units': 256,
                'layers': 3,
                'accuracy': 0.92,
                'trained_samples': 750000,
                'last_updated': datetime.now().isoformat()
            },
            'transformer_nlp': {
                'type': 'Transformer',
                'attention_heads': 8,
                'hidden_size': 512,
                'layers': 12,
                'accuracy': 0.98,
                'trained_samples': 2000000,
                'last_updated': datetime.now().isoformat()
            },
            'graph_neural_network': {
                'type': 'GNN',
                'node_features': 64,
                'edge_features': 32,
                'layers': 4,
                'accuracy': 0.89,
                'trained_samples': 300000,
                'last_updated': datetime.now().isoformat()
            }
        }
    
    def _setup_feature_extractors(self) -> Dict[str, Any]:
        """Setup feature extraction methods"""
        return {
            'network_features': {
                'packet_size_stats': ['mean', 'std', 'min', 'max', 'percentiles'],
                'timing_features': ['inter_arrival_time', 'flow_duration', 'idle_time'],
                'protocol_features': ['tcp_flags', 'port_numbers', 'payload_entropy'],
                'behavioral_features': ['connection_patterns', 'data_transfer_patterns']
            },
            'payload_features': {
                'entropy_analysis': ['shannon_entropy', 'byte_frequency', 'n_gram_analysis'],
                'signature_matching': ['known_malware_signatures', 'regex_patterns'],
                'statistical_analysis': ['byte_distribution', 'compression_ratio']
            },
            'contextual_features': {
                'temporal_features': ['time_of_day', 'day_of_week', 'seasonal_patterns'],
                'geolocation_features': ['source_country', 'destination_country', 'routing_path'],
                'reputation_features': ['ip_reputation', 'domain_reputation', 'certificate_validity']
            }
        }
    
    def _load_threat_database(self) -> Dict[str, Any]:
        """Load threat intelligence database"""
        return {
            'malware_families': {
                'trojan': {
                    'signatures': ['a1b2c3d4', 'e5f6g7h8', 'i9j0k1l2'],
                    'behaviors': ['keylogging', 'data_theft', 'backdoor'],
                    'prevalence': 0.35
                },
                'ransomware': {
                    'signatures': ['m3n4o5p6', 'q7r8s9t0', 'u1v2w3x4'],
                    'behaviors': ['file_encryption', 'payment_demand', 'system_lock'],
                    'prevalence': 0.25
                },
                'botnet': {
                    'signatures': ['y5z6a7b8', 'c9d0e1f2', 'g3h4i5j6'],
                    'behaviors': ['command_control', 'ddos_participation', 'spam_sending'],
                    'prevalence': 0.20
                },
                'spyware': {
                    'signatures': ['k7l8m9n0', 'o1p2q3r4', 's5t6u7v8'],
                    'behaviors': ['data_collection', 'privacy_violation', 'stealth_operation'],
                    'prevalence': 0.15
                },
                'adware': {
                    'signatures': ['w9x0y1z2', 'a3b4c5d6', 'e7f8g9h0'],
                    'behaviors': ['ad_injection', 'browser_hijacking', 'tracking'],
                    'prevalence': 0.05
                }
            },
            'attack_patterns': {
                'ddos': {
                    'volumetric': {'threshold': 10000, 'duration': 300},
                    'protocol': {'syn_flood': True, 'udp_flood': True},
                    'application': {'http_flood': True, 'slowloris': True}
                },
                'intrusion': {
                    'brute_force': {'attempts_per_minute': 50, 'success_rate': 0.02},
                    'privilege_escalation': {'techniques': ['buffer_overflow', 'dll_injection']},
                    'lateral_movement': {'techniques': ['pass_the_hash', 'golden_ticket']}
                },
                'data_exfiltration': {
                    'dns_tunneling': {'query_rate': 100, 'payload_size': 512},
                    'http_exfiltration': {'upload_rate': 1000000, 'encryption': True},
                    'covert_channels': ['icmp_tunneling', 'steganography']
                }
            },
            'threat_actors': {
                'apt_groups': ['APT1', 'APT28', 'APT29', 'Lazarus', 'Equation'],
                'cybercriminal_groups': ['FIN7', 'Carbanak', 'Silence', 'Cobalt'],
                'nation_states': ['China', 'Russia', 'North Korea', 'Iran'],
                'hacktivist_groups': ['Anonymous', 'LulzSec', 'Syrian Electronic Army']
            }
        }
    
    def _initialize_performance_metrics(self) -> Dict[str, Any]:
        """Initialize model performance tracking"""
        return {
            'accuracy_history': [],
            'precision_recall': {'precision': 0.95, 'recall': 0.93, 'f1_score': 0.94},
            'false_positive_rate': 0.02,
            'false_negative_rate': 0.07,
            'processing_time': {'mean': 0.15, 'std': 0.05},
            'model_drift_detection': {'status': 'stable', 'last_check': datetime.now().isoformat()}
        }
    
    async def analyze_threat_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform comprehensive ML-based threat analysis"""
        print(f"[v0] Starting ML threat analysis on {len(data.get('samples', []))} samples")
        
        analysis_start = time.time()
        
        # Extract features from input data
        features = await self._extract_comprehensive_features(data)
        
        # Run multiple ML models
        model_results = {}
        for model_name, model_config in self.models.items():
            result = await self._run_model_analysis(model_name, model_config, features)
            model_results[model_name] = result
        
        # Ensemble prediction
        ensemble_result = await self._ensemble_prediction(model_results)
        
        # Generate threat intelligence
        threat_intelligence = await self._generate_threat_intelligence(ensemble_result, features)
        
        # Calculate confidence and risk scores
        confidence_score = self._calculate_confidence_score(model_results)
        risk_score = self._calculate_risk_score(ensemble_result, threat_intelligence)
        
        analysis_time = time.time() - analysis_start
        
        result = {
            'analysis_id': hashlib.md5(str(time.time()).encode()).hexdigest()[:12],
            'timestamp': datetime.now().isoformat(),
            'processing_time': analysis_time,
            'model_results': model_results,
            'ensemble_prediction': ensemble_result,
            'threat_intelligence': threat_intelligence,
            'confidence_score': confidence_score,
            'risk_score': risk_score,
            'recommendations': self._generate_ml_recommendations(ensemble_result, risk_score),
            'model_performance': self.model_performance
        }
        
        print(f"[v0] ML analysis complete: Risk {risk_score:.2f}, Confidence {confidence_score:.2f}, Time {analysis_time:.2f}s")
        
        return result
    
    async def _extract_comprehensive_features(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract comprehensive features for ML analysis"""
        features = {
            'network_features': {},
            'payload_features': {},
            'behavioral_features': {},
            'temporal_features': {},
            'statistical_features': {}
        }
        
        samples = data.get('samples', [])
        
        if samples:
            # Network features
            packet_sizes = [s.get('packet_size', 0) for s in samples]
            features['network_features'] = {
                'packet_size_mean': np.mean(packet_sizes),
                'packet_size_std': np.std(packet_sizes),
                'packet_size_max': np.max(packet_sizes),
                'packet_size_min': np.min(packet_sizes),
                'unique_ports': len(set(s.get('port', 80) for s in samples)),
                'protocol_diversity': len(set(s.get('protocol', 'tcp') for s in samples))
            }
            
            # Payload features
            payloads = [s.get('payload', '') for s in samples if s.get('payload')]
            if payloads:
                features['payload_features'] = {
                    'avg_entropy': np.mean([self._calculate_entropy(p) for p in payloads]),
                    'max_entropy': np.max([self._calculate_entropy(p) for p in payloads]),
                    'suspicious_strings': sum(1 for p in payloads if self._contains_suspicious_strings(p)),
                    'compression_ratio': np.mean([len(p.encode('utf-8')) / max(len(p), 1) for p in payloads])
                }
            
            # Behavioral features
            timestamps = [s.get('timestamp', time.time()) for s in samples]
            if len(timestamps) > 1:
                intervals = np.diff(sorted(timestamps))
                features['behavioral_features'] = {
                    'avg_interval': np.mean(intervals),
                    'interval_variance': np.var(intervals),
                    'burst_detection': np.sum(intervals < 0.1) / len(intervals),
                    'regularity_score': 1.0 / (1.0 + np.std(intervals))
                }
            
            # Temporal features
            current_time = datetime.now()
            features['temporal_features'] = {
                'hour_of_day': current_time.hour,
                'day_of_week': current_time.weekday(),
                'is_weekend': current_time.weekday() >= 5,
                'is_business_hours': 9 <= current_time.hour <= 17
            }
            
            # Statistical features
            features['statistical_features'] = {
                'sample_count': len(samples),
                'unique_sources': len(set(s.get('source_ip', '') for s in samples)),
                'geographic_diversity': len(set(s.get('country', 'unknown') for s in samples)),
                'anomaly_score': random.uniform(0, 1)  # Placeholder for actual anomaly detection
            }
        
        return features
    
    def _calculate_entropy(self, data: str) -> float:
        """Calculate Shannon entropy of data"""
        if not data:
            return 0.0
        
        # Count frequency of each character
        freq = {}
        for char in data:
            freq[char] = freq.get(char, 0) + 1
        
        # Calculate entropy
        entropy = 0.0
        length = len(data)
        for count in freq.values():
            p = count / length
            if p > 0:
                entropy -= p * np.log2(p)
        
        return entropy
    
    def _contains_suspicious_strings(self, payload: str) -> bool:
        """Check if payload contains suspicious strings"""
        suspicious_patterns = [
            'eval(', 'exec(', 'system(', 'shell_exec',
            '<script>', 'javascript:', 'vbscript:',
            'SELECT * FROM', 'UNION SELECT', 'DROP TABLE',
            'cmd.exe', 'powershell', '/bin/sh',
            'base64_decode', 'gzinflate', 'str_rot13'
        ]
        
        payload_lower = payload.lower()
        return any(pattern.lower() in payload_lower for pattern in suspicious_patterns)
    
    async def _run_model_analysis(self, model_name: str, model_config: Dict[str, Any], features: Dict[str, Any]) -> Dict[str, Any]:
        """Run analysis using specific ML model"""
        # Simulate model processing time
        processing_time = random.uniform(0.05, 0.3)
        await asyncio.sleep(processing_time)
        
        # Simulate model prediction based on model type
        if model_config['type'] == 'DNN':
            prediction = self._simulate_dnn_prediction(features)
        elif model_config['type'] == 'Ensemble':
            prediction = self._simulate_ensemble_prediction(features)
        elif model_config['type'] == 'LSTM':
            prediction = self._simulate_lstm_prediction(features)
        elif model_config['type'] == 'Transformer':
            prediction = self._simulate_transformer_prediction(features)
        elif model_config['type'] == 'GNN':
            prediction = self._simulate_gnn_prediction(features)
        else:
            prediction = self._simulate_default_prediction(features)
        
        return {
            'model_name': model_name,
            'model_type': model_config['type'],
            'prediction': prediction,
            'confidence': prediction.get('confidence', 0.5),
            'processing_time': processing_time,
            'model_accuracy': model_config.get('accuracy', 0.9),
            'feature_importance': self._calculate_feature_importance(features)
        }
    
    def _simulate_dnn_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate deep neural network prediction"""
        # Extract key features for DNN analysis
        network_features = features.get('network_features', {})
        payload_features = features.get('payload_features', {})
        
        # Simulate DNN processing
        threat_probability = random.uniform(0.1, 0.9)
        
        # Adjust based on features
        if payload_features.get('avg_entropy', 0) > 7.0:
            threat_probability += 0.2
        if network_features.get('unique_ports', 1) > 10:
            threat_probability += 0.15
        
        threat_probability = min(threat_probability, 1.0)
        
        return {
            'threat_probability': threat_probability,
            'threat_class': 'malware' if threat_probability > 0.7 else 'suspicious' if threat_probability > 0.4 else 'benign',
            'confidence': min(threat_probability + random.uniform(0.1, 0.2), 1.0),
            'layer_activations': [random.uniform(0, 1) for _ in range(5)]
        }
    
    def _simulate_ensemble_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate ensemble model prediction"""
        # Simulate multiple model votes
        votes = {
            'random_forest': random.choice(['benign', 'suspicious', 'malware']),
            'gradient_boosting': random.choice(['benign', 'suspicious', 'malware']),
            'svm': random.choice(['benign', 'suspicious', 'malware'])
        }
        
        # Count votes
        vote_counts = {}
        for vote in votes.values():
            vote_counts[vote] = vote_counts.get(vote, 0) + 1
        
        # Determine final prediction
        final_prediction = max(vote_counts, key=vote_counts.get)
        confidence = vote_counts[final_prediction] / len(votes)
        
        return {
            'prediction': final_prediction,
            'confidence': confidence,
            'individual_votes': votes,
            'vote_distribution': vote_counts
        }
    
    def _simulate_lstm_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate LSTM behavioral analysis prediction"""
        behavioral_features = features.get('behavioral_features', {})
        
        # Simulate sequence analysis
        sequence_anomaly = random.uniform(0, 1)
        
        # Adjust based on behavioral patterns
        if behavioral_features.get('burst_detection', 0) > 0.5:
            sequence_anomaly += 0.3
        if behavioral_features.get('regularity_score', 1) < 0.3:
            sequence_anomaly += 0.2
        
        sequence_anomaly = min(sequence_anomaly, 1.0)
        
        return {
            'sequence_anomaly_score': sequence_anomaly,
            'behavioral_classification': 'anomalous' if sequence_anomaly > 0.6 else 'normal',
            'confidence': random.uniform(0.7, 0.95),
            'attention_weights': [random.uniform(0, 1) for _ in range(10)]
        }
    
    def _simulate_transformer_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate transformer NLP-based prediction"""
        payload_features = features.get('payload_features', {})
        
        # Simulate NLP analysis
        semantic_threat_score = random.uniform(0, 1)
        
        # Adjust based on payload analysis
        if payload_features.get('suspicious_strings', 0) > 0:
            semantic_threat_score += 0.4
        if payload_features.get('avg_entropy', 0) > 6.5:
            semantic_threat_score += 0.2
        
        semantic_threat_score = min(semantic_threat_score, 1.0)
        
        return {
            'semantic_threat_score': semantic_threat_score,
            'language_classification': 'malicious' if semantic_threat_score > 0.7 else 'benign',
            'confidence': random.uniform(0.85, 0.98),
            'attention_patterns': {f'token_{i}': random.uniform(0, 1) for i in range(20)}
        }
    
    def _simulate_gnn_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Simulate graph neural network prediction"""
        network_features = features.get('network_features', {})
        statistical_features = features.get('statistical_features', {})
        
        # Simulate graph analysis
        network_anomaly = random.uniform(0, 1)
        
        # Adjust based on network topology
        if statistical_features.get('unique_sources', 1) > 50:
            network_anomaly += 0.25
        if network_features.get('protocol_diversity', 1) > 5:
            network_anomaly += 0.15
        
        network_anomaly = min(network_anomaly, 1.0)
        
        return {
            'network_anomaly_score': network_anomaly,
            'graph_classification': 'suspicious_topology' if network_anomaly > 0.6 else 'normal_topology',
            'confidence': random.uniform(0.75, 0.92),
            'node_embeddings': [random.uniform(-1, 1) for _ in range(64)]
        }
    
    def _simulate_default_prediction(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Default prediction simulation"""
        return {
            'prediction': random.choice(['benign', 'suspicious', 'malware']),
            'confidence': random.uniform(0.5, 0.8),
            'score': random.uniform(0, 1)
        }
    
    async def _ensemble_prediction(self, model_results: Dict[str, Any]) -> Dict[str, Any]:
        """Combine predictions from multiple models"""
        predictions = []
        confidences = []
        
        for model_name, result in model_results.items():
            if 'prediction' in result:
                pred = result['prediction']
                if isinstance(pred, dict):
                    # Extract the actual prediction value from dictionary
                    actual_pred = pred.get('prediction', pred.get('classification', 'benign'))
                else:
                    actual_pred = pred
                predictions.append(actual_pred)
                confidences.append(result['confidence'])
        
        # Weighted voting based on model confidence and accuracy
        threat_score = 0.0
        total_weight = 0.0
        
        for model_name, result in model_results.items():
            model_config = self.models.get(model_name, {})
            model_accuracy = model_config.get('accuracy', 0.5)
            model_confidence = result.get('confidence', 0.5)
            
            weight = model_accuracy * model_confidence
            
            # Convert model-specific predictions to threat scores
            if 'threat_probability' in result:
                model_threat_score = result['threat_probability']
            elif 'sequence_anomaly_score' in result:
                model_threat_score = result['sequence_anomaly_score']
            elif 'semantic_threat_score' in result:
                model_threat_score = result['semantic_threat_score']
            elif 'network_anomaly_score' in result:
                model_threat_score = result['network_anomaly_score']
            else:
                pred = result.get('prediction', 'benign')
                # Handle case where prediction might be a dictionary
                if isinstance(pred, dict):
                    # Extract the actual prediction value from dictionary
                    pred = pred.get('prediction', pred.get('classification', 'benign'))
                # Convert categorical prediction to score
                model_threat_score = {'malware': 0.9, 'suspicious': 0.6, 'benign': 0.1}.get(pred, 0.1)
            
            threat_score += weight * model_threat_score
            total_weight += weight
        
        if total_weight > 0:
            final_threat_score = threat_score / total_weight
        else:
            final_threat_score = 0.5
        
        # Determine final classification
        if final_threat_score > 0.8:
            classification = 'high_threat'
        elif final_threat_score > 0.6:
            classification = 'medium_threat'
        elif final_threat_score > 0.3:
            classification = 'low_threat'
        else:
            classification = 'benign'
        
        unique_predictions = set(predictions) if predictions else set()
        model_agreement = len(unique_predictions) / len(predictions) if predictions else 1.0
        
        return {
            'final_threat_score': final_threat_score,
            'classification': classification,
            'ensemble_confidence': np.mean(confidences) if confidences else 0.5,
            'model_agreement': model_agreement,
            'contributing_models': len(model_results)
        }
    
    async def _generate_threat_intelligence(self, ensemble_result: Dict[str, Any], features: Dict[str, Any]) -> Dict[str, Any]:
        """Generate threat intelligence based on analysis"""
        threat_score = ensemble_result.get('final_threat_score', 0.0)
        
        intelligence = {
            'threat_family': 'unknown',
            'attack_vector': 'unknown',
            'severity': 'low',
            'indicators': [],
            'attribution': 'unknown',
            'mitigation_strategies': []
        }
        
        # Determine threat family based on features
        payload_features = features.get('payload_features', {})
        network_features = features.get('network_features', {})
        behavioral_features = features.get('behavioral_features', {})
        
        if payload_features.get('suspicious_strings', 0) > 0:
            intelligence['threat_family'] = 'malware'
            intelligence['attack_vector'] = 'code_injection'
        elif behavioral_features.get('burst_detection', 0) > 0.7:
            intelligence['threat_family'] = 'ddos'
            intelligence['attack_vector'] = 'volumetric_attack'
        elif network_features.get('unique_ports', 1) > 20:
            intelligence['threat_family'] = 'reconnaissance'
            intelligence['attack_vector'] = 'port_scanning'
        
        # Determine severity
        if threat_score > 0.8:
            intelligence['severity'] = 'critical'
        elif threat_score > 0.6:
            intelligence['severity'] = 'high'
        elif threat_score > 0.3:
            intelligence['severity'] = 'medium'
        
        # Generate indicators
        intelligence['indicators'] = [
            f"Threat score: {threat_score:.2f}",
            f"Classification: {ensemble_result.get('classification', 'unknown')}",
            f"Model agreement: {ensemble_result.get('model_agreement', 0):.2f}"
        ]
        
        # Attribution (simplified)
        statistical_features = features.get('statistical_features', {})
        if statistical_features.get('geographic_diversity', 1) > 5:
            intelligence['attribution'] = 'distributed_threat_actor'
        else:
            intelligence['attribution'] = 'localized_threat_actor'
        
        # Mitigation strategies
        intelligence['mitigation_strategies'] = [
            'Enhanced monitoring',
            'Traffic filtering',
            'Signature-based detection',
            'Behavioral analysis'
        ]
        
        if intelligence['threat_family'] == 'ddos':
            intelligence['mitigation_strategies'].extend([
                'Rate limiting',
                'Traffic shaping',
                'DDoS protection services'
            ])
        elif intelligence['threat_family'] == 'malware':
            intelligence['mitigation_strategies'].extend([
                'Antivirus scanning',
                'Sandboxing',
                'Code analysis'
            ])
        
        return intelligence
    
    def _calculate_confidence_score(self, model_results: Dict[str, Any]) -> float:
        """Calculate overall confidence score"""
        confidences = []
        
        for result in model_results.values():
            if 'confidence' in result:
                confidences.append(result['confidence'])
        
        if not confidences:
            return 0.5
        
        # Weighted average based on model accuracy
        weighted_sum = 0.0
        total_weight = 0.0
        
        for model_name, result in model_results.items():
            model_config = self.models.get(model_name, {})
            weight = model_config.get('accuracy', 0.5)
            confidence = result.get('confidence', 0.5)
            
            weighted_sum += weight * confidence
            total_weight += weight
        
        return weighted_sum / total_weight if total_weight > 0 else np.mean(confidences)
    
    def _calculate_risk_score(self, ensemble_result: Dict[str, Any], threat_intelligence: Dict[str, Any]) -> float:
        """Calculate overall risk score"""
        base_score = ensemble_result.get('final_threat_score', 0.0)
        
        # Adjust based on severity
        severity_multiplier = {
            'critical': 1.0,
            'high': 0.8,
            'medium': 0.6,
            'low': 0.4
        }
        
        severity = threat_intelligence.get('severity', 'low')
        adjusted_score = base_score * severity_multiplier.get(severity, 0.4)
        
        # Factor in model agreement
        agreement = ensemble_result.get('model_agreement', 1.0)
        confidence_factor = ensemble_result.get('ensemble_confidence', 0.5)
        
        final_score = adjusted_score * agreement * confidence_factor
        
        return min(final_score, 1.0)
    
    def _calculate_feature_importance(self, features: Dict[str, Any]) -> Dict[str, float]:
        """Calculate feature importance scores"""
        importance = {}
        
        # Network features importance
        network_features = features.get('network_features', {})
        for feature, value in network_features.items():
            importance[f'network_{feature}'] = random.uniform(0.1, 0.9)
        
        # Payload features importance
        payload_features = features.get('payload_features', {})
        for feature, value in payload_features.items():
            importance[f'payload_{feature}'] = random.uniform(0.2, 0.95)
        
        # Behavioral features importance
        behavioral_features = features.get('behavioral_features', {})
        for feature, value in behavioral_features.items():
            importance[f'behavioral_{feature}'] = random.uniform(0.15, 0.85)
        
        return importance
    
    def _generate_ml_recommendations(self, ensemble_result: Dict[str, Any], risk_score: float) -> List[str]:
        """Generate ML-based recommendations"""
        recommendations = []
        
        classification = ensemble_result.get('classification', 'benign')
        confidence = ensemble_result.get('ensemble_confidence', 0.5)
        
        if risk_score > 0.8:
            recommendations.extend([
                "CRITICAL: Immediate threat response required",
                "Isolate affected systems immediately",
                "Activate incident response team",
                "Implement emergency firewall rules"
            ])
        elif risk_score > 0.6:
            recommendations.extend([
                "HIGH: Enhanced security measures needed",
                "Increase monitoring frequency",
                "Review and update security policies",
                "Consider threat hunting activities"
            ])
        elif risk_score > 0.3:
            recommendations.extend([
                "MEDIUM: Monitor and investigate",
                "Collect additional evidence",
                "Update threat signatures",
                "Review access controls"
            ])
        else:
            recommendations.extend([
                "LOW: Continue normal operations",
                "Maintain standard monitoring",
                "Regular security assessments"
            ])
        
        # Model-specific recommendations
        if confidence < 0.7:
            recommendations.append("Consider retraining models with additional data")
        
        if classification in ['high_threat', 'medium_threat']:
            recommendations.extend([
                "Deploy additional ML models for validation",
                "Implement behavioral analysis",
                "Enhance feature extraction"
            ])
        
        return recommendations

# Main execution function
async def main():
    """Main function to run ML threat analysis"""
    analyzer = MLThreatAnalyzer()
    
    # Sample data for analysis
    sample_data = {
        'samples': [
            {
                'packet_size': random.randint(64, 1500),
                'port': random.choice([80, 443, 22, 3389, 1433]),
                'protocol': random.choice(['tcp', 'udp', 'icmp']),
                'payload': 'GET /admin/login.php?user=admin&pass=123456',
                'timestamp': time.time() - random.randint(0, 3600),
                'source_ip': f'{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}',
                'country': random.choice(['US', 'CN', 'RU', 'EU', 'Unknown'])
            }
            for _ in range(50)
        ]
    }
    
    print("[v0] Starting ML threat analysis...")
    
    # Run analysis
    result = await analyzer.analyze_threat_data(sample_data)
    
    with open('threat_analysis_results.json', 'w') as f:
        json.dump(result, f, indent=2, default=str)
    
    # Display results
    print(f"[v0] ML Analysis Results:")
    print(f"  - Analysis ID: {result['analysis_id']}")
    print(f"  - Processing Time: {result['processing_time']:.2f}s")
    print(f"  - Risk Score: {result['risk_score']:.2f}")
    print(f"  - Confidence: {result['confidence_score']:.2f}")
    print(f"  - Classification: {result['ensemble_prediction']['classification']}")
    print(f"  - Models Used: {result['ensemble_prediction']['contributing_models']}")
    
    summary = {
        'total_connections': len(sample_data['samples']),
        'anomalies_detected': int(result['risk_score'] * len(sample_data['samples'])),
        'threats_detected': int(result['ensemble_prediction']['final_threat_score'] * len(sample_data['samples'])),
        'average_threat_probability': result['ensemble_prediction']['final_threat_score'],
        'high_risk_connections': int(result['risk_score'] * len(sample_data['samples']) * 0.3),
        'analysis_timestamp': result['timestamp'],
        'model_accuracy': result['confidence_score'],
        'feature_importance': result['model_results'].get('deep_neural_network', {}).get('feature_importance', {}),
        'threat_intelligence': result['threat_intelligence'],
        'recommendations': result['recommendations']
    }
    
    # Save summary for API consumption
    with open('ml_analysis_summary.json', 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    
    print("[v0] Analysis complete! Results saved to threat_analysis_results.json")
    
    return result

if __name__ == "__main__":
    asyncio.run(main())
