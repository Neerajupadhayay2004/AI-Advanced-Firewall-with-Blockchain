#!/usr/bin/env python3
"""
Advanced Machine Learning Engine for Cybersecurity
Provides real-time threat detection, behavioral analysis, and predictive security
"""

import numpy as np
import pandas as pd
import json
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Any, Optional
import asyncio
import aiohttp
import asyncpg
from sklearn.ensemble import IsolationForest, RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import pickle
import warnings
warnings.filterwarnings('ignore')

class AdvancedMLEngine:
    def __init__(self, db_url: str = None):
        self.db_url = db_url or os.getenv('POSTGRES_URL')
        self.models = {}
        self.scalers = {}
        self.vectorizers = {}
        self.label_encoders = {}
        self.model_metrics = {}
        
        print("[v0] Initializing Advanced ML Engine...")
        self.initialize_models()
        print("[v0] ML Engine ready for threat detection")
    
    def initialize_models(self):
        """Initialize all ML models for different threat detection tasks"""
        
        # 1. Anomaly Detection Model (Unsupervised)
        self.models['anomaly_detector'] = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=200,
            max_samples='auto',
            max_features=1.0
        )
        
        # 2. Threat Classification Model (Supervised)
        self.models['threat_classifier'] = RandomForestClassifier(
            n_estimators=300,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        # 3. Advanced Neural Network for Complex Patterns
        self.models['neural_detector'] = MLPClassifier(
            hidden_layer_sizes=(128, 64, 32),
            activation='relu',
            solver='adam',
            alpha=0.001,
            batch_size='auto',
            learning_rate='constant',
            learning_rate_init=0.001,
            max_iter=500,
            random_state=42
        )
        
        # 4. Gradient Boosting for High-Precision Detection
        self.models['gradient_detector'] = GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=6,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42
        )
        
        # 5. Text Analysis for Payload Detection
        self.vectorizers['payload_analyzer'] = TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 4),
            analyzer='char_wb',
            lowercase=True,
            stop_words=None
        )
        
        # 6. Feature Scalers
        self.scalers['standard'] = StandardScaler()
        self.scalers['minmax'] = StandardScaler()  # Will be replaced with MinMaxScaler if needed
        
        # 7. Label Encoders
        self.label_encoders['threat_type'] = LabelEncoder()
        self.label_encoders['severity'] = LabelEncoder()
    
    async def connect_database(self):
        """Connect to PostgreSQL database"""
        try:
            self.db_pool = await asyncpg.create_pool(self.db_url)
            print("[v0] Database connection established")
            return True
        except Exception as e:
            print(f"[v0] Database connection failed: {e}")
            return False
    
    async def fetch_training_data(self) -> pd.DataFrame:
        """Fetch training data from database"""
        try:
            async with self.db_pool.acquire() as conn:
                query = """
                SELECT 
                    threat_type,
                    severity,
                    source_ip,
                    user_agent,
                    request_path,
                    payload,
                    ai_confidence,
                    status,
                    created_at
                FROM threat_logs 
                WHERE created_at >= NOW() - INTERVAL '30 days'
                ORDER BY created_at DESC
                LIMIT 10000
                """
                
                rows = await conn.fetch(query)
                df = pd.DataFrame([dict(row) for row in rows])
                print(f"[v0] Fetched {len(df)} training samples")
                return df
                
        except Exception as e:
            print(f"[v0] Error fetching training data: {e}")
            return pd.DataFrame()
    
    def extract_advanced_features(self, data: Dict[str, Any]) -> np.ndarray:
        """Extract comprehensive features for ML analysis"""
        features = []
        
        # Basic request features
        payload = str(data.get('payload', ''))
        user_agent = str(data.get('user_agent', ''))
        path = str(data.get('request_path', ''))
        source_ip = str(data.get('source_ip', ''))
        
        # 1. Length-based features
        features.extend([
            len(payload),
            len(user_agent),
            len(path),
            len(source_ip.split('.')) if '.' in source_ip else 0
        ])
        
        # 2. Character frequency analysis
        if payload:
            total_chars = len(payload)
            special_chars = ['%', ';', '|', '&', '<', '>', "'", '"', '(', ')', '{', '}', '[', ']']
            for char in special_chars:
                features.append(payload.count(char) / total_chars if total_chars > 0 else 0)
        else:
            features.extend([0] * 14)
        
        # 3. SQL Injection indicators
        sql_keywords = ['SELECT', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER']
        sql_score = sum(1 for keyword in sql_keywords if keyword.lower() in payload.lower())
        features.append(sql_score)
        
        # 4. XSS indicators
        xss_patterns = ['<script', 'javascript:', 'onerror=', 'onload=', 'onclick=', 'eval(']
        xss_score = sum(1 for pattern in xss_patterns if pattern.lower() in payload.lower())
        features.append(xss_score)
        
        # 5. Command injection indicators
        cmd_patterns = ['|', '&&', '||', ';', '`', '$', 'bash', 'sh', 'cmd', 'powershell']
        cmd_score = sum(1 for pattern in cmd_patterns if pattern in payload.lower())
        features.append(cmd_score)
        
        # 6. Path traversal indicators
        path_patterns = ['../', '..\\', '%2e%2e', 'etc/passwd', 'windows/system32']
        path_score = sum(1 for pattern in path_patterns if pattern.lower() in payload.lower())
        features.append(path_score)
        
        # 7. Encoding detection
        encoding_patterns = ['%', '+', '\\x', '\\u', 'base64']
        encoding_score = sum(1 for pattern in encoding_patterns if pattern.lower() in payload.lower())
        features.append(encoding_score)
        
        # 8. User agent analysis
        suspicious_agents = ['bot', 'crawler', 'scanner', 'sqlmap', 'nikto', 'nmap', 'curl', 'wget']
        ua_score = sum(1 for agent in suspicious_agents if agent.lower() in user_agent.lower())
        features.append(ua_score)
        
        # 9. IP analysis
        ip_parts = source_ip.split('.')
        if len(ip_parts) == 4:
            try:
                # Check for private IP ranges
                first_octet = int(ip_parts[0])
                is_private = first_octet in [10, 172, 192] or first_octet == 127
                features.append(1 if is_private else 0)
                
                # IP entropy (randomness indicator)
                ip_entropy = len(set(ip_parts)) / 4.0
                features.append(ip_entropy)
            except:
                features.extend([0, 0])
        else:
            features.extend([0, 0])
        
        # 10. Time-based features
        current_hour = datetime.now().hour
        features.extend([
            current_hour,
            1 if 0 <= current_hour <= 6 else 0,  # Night time
            1 if current_hour in [12, 13, 17, 18] else 0,  # Peak hours
            1 if current_hour in range(9, 17) else 0  # Business hours
        ])
        
        # 11. Request complexity
        complexity_score = (
            len(payload.split('&')) +  # Number of parameters
            len(payload.split('=')) +  # Number of assignments
            payload.count('(') + payload.count('[') +  # Nested structures
            len([c for c in payload if not c.isalnum() and c not in ' '])  # Special characters
        )
        features.append(complexity_score)
        
        return np.array(features).reshape(1, -1)
    
    async def train_models(self):
        """Train all ML models with latest data"""
        print("[v0] Starting model training...")
        
        # Fetch training data
        df = await self.fetch_training_data()
        if df.empty:
            print("[v0] No training data available")
            return False
        
        # Prepare features and labels
        X_features = []
        y_threat_type = []
        y_severity = []
        y_is_threat = []
        
        for _, row in df.iterrows():
            try:
                features = self.extract_advanced_features({
                    'payload': row.get('payload', ''),
                    'user_agent': row.get('user_agent', ''),
                    'request_path': row.get('request_path', ''),
                    'source_ip': row.get('source_ip', '')
                })
                
                X_features.append(features.flatten())
                y_threat_type.append(row.get('threat_type', 'unknown'))
                y_severity.append(row.get('severity', 'low'))
                y_is_threat.append(1 if row.get('status') == 'blocked' else 0)
                
            except Exception as e:
                print(f"[v0] Error processing row: {e}")
                continue
        
        if not X_features:
            print("[v0] No valid features extracted")
            return False
        
        X = np.array(X_features)
        
        # Scale features
        X_scaled = self.scalers['standard'].fit_transform(X)
        
        # Encode labels
        y_threat_encoded = self.label_encoders['threat_type'].fit_transform(y_threat_type)
        y_severity_encoded = self.label_encoders['severity'].fit_transform(y_severity)
        y_binary = np.array(y_is_threat)
        
        # Split data
        X_train, X_test, y_train_threat, y_test_threat = train_test_split(
            X_scaled, y_threat_encoded, test_size=0.2, random_state=42, stratify=y_threat_encoded
        )
        
        _, _, y_train_severity, y_test_severity = train_test_split(
            X_scaled, y_severity_encoded, test_size=0.2, random_state=42, stratify=y_severity_encoded
        )
        
        _, _, y_train_binary, y_test_binary = train_test_split(
            X_scaled, y_binary, test_size=0.2, random_state=42, stratify=y_binary
        )
        
        # Train models
        print("[v0] Training anomaly detector...")
        self.models['anomaly_detector'].fit(X_train)
        
        print("[v0] Training threat classifier...")
        self.models['threat_classifier'].fit(X_train, y_train_threat)
        
        print("[v0] Training neural network...")
        self.models['neural_detector'].fit(X_train, y_train_binary)
        
        print("[v0] Training gradient boosting...")
        self.models['gradient_detector'].fit(X_train, y_train_binary)
        
        # Evaluate models
        self.evaluate_models(X_test, y_test_threat, y_test_severity, y_test_binary)
        
        # Save models
        self.save_models()
        
        print("[v0] Model training completed successfully")
        return True
    
    def evaluate_models(self, X_test, y_test_threat, y_test_severity, y_test_binary):
        """Evaluate model performance"""
        print("[v0] Evaluating model performance...")
        
        # Anomaly detection evaluation
        anomaly_scores = self.models['anomaly_detector'].decision_function(X_test)
        anomaly_predictions = self.models['anomaly_detector'].predict(X_test)
        
        # Threat classification evaluation
        threat_predictions = self.models['threat_classifier'].predict(X_test)
        threat_accuracy = np.mean(threat_predictions == y_test_threat)
        
        # Neural network evaluation
        neural_predictions = self.models['neural_detector'].predict(X_test)
        neural_accuracy = np.mean(neural_predictions == y_test_binary)
        
        # Gradient boosting evaluation
        gradient_predictions = self.models['gradient_detector'].predict(X_test)
        gradient_accuracy = np.mean(gradient_predictions == y_test_binary)
        
        # Store metrics
        self.model_metrics = {
            'threat_classifier_accuracy': float(threat_accuracy),
            'neural_detector_accuracy': float(neural_accuracy),
            'gradient_detector_accuracy': float(gradient_accuracy),
            'anomaly_detector_outliers': int(np.sum(anomaly_predictions == -1)),
            'evaluation_timestamp': datetime.now().isoformat()
        }
        
        print(f"[v0] Threat Classifier Accuracy: {threat_accuracy:.4f}")
        print(f"[v0] Neural Detector Accuracy: {neural_accuracy:.4f}")
        print(f"[v0] Gradient Detector Accuracy: {gradient_accuracy:.4f}")
    
    def save_models(self):
        """Save trained models to disk"""
        try:
            model_dir = 'models'
            os.makedirs(model_dir, exist_ok=True)
            
            # Save models
            for name, model in self.models.items():
                joblib.dump(model, f'{model_dir}/{name}.pkl')
            
            # Save scalers and encoders
            for name, scaler in self.scalers.items():
                joblib.dump(scaler, f'{model_dir}/scaler_{name}.pkl')
            
            for name, encoder in self.label_encoders.items():
                joblib.dump(encoder, f'{model_dir}/encoder_{name}.pkl')
            
            # Save metrics
            with open(f'{model_dir}/metrics.json', 'w') as f:
                json.dump(self.model_metrics, f, indent=2)
            
            print("[v0] Models saved successfully")
            
        except Exception as e:
            print(f"[v0] Error saving models: {e}")
    
    def load_models(self):
        """Load pre-trained models from disk"""
        try:
            model_dir = 'models'
            
            # Load models
            for name in self.models.keys():
                model_path = f'{model_dir}/{name}.pkl'
                if os.path.exists(model_path):
                    self.models[name] = joblib.load(model_path)
            
            # Load scalers and encoders
            for name in self.scalers.keys():
                scaler_path = f'{model_dir}/scaler_{name}.pkl'
                if os.path.exists(scaler_path):
                    self.scalers[name] = joblib.load(scaler_path)
            
            for name in self.label_encoders.keys():
                encoder_path = f'{model_dir}/encoder_{name}.pkl'
                if os.path.exists(encoder_path):
                    self.label_encoders[name] = joblib.load(encoder_path)
            
            # Load metrics
            metrics_path = f'{model_dir}/metrics.json'
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r') as f:
                    self.model_metrics = json.load(f)
            
            print("[v0] Models loaded successfully")
            return True
            
        except Exception as e:
            print(f"[v0] Error loading models: {e}")
            return False
    
    def predict_threat(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Advanced threat prediction using ensemble of models"""
        try:
            # Extract features
            features = self.extract_advanced_features(request_data)
            features_scaled = self.scalers['standard'].transform(features)
            
            # Get predictions from all models
            predictions = {}
            
            # Anomaly detection
            anomaly_score = self.models['anomaly_detector'].decision_function(features_scaled)[0]
            is_anomaly = self.models['anomaly_detector'].predict(features_scaled)[0] == -1
            predictions['anomaly'] = {
                'is_anomaly': bool(is_anomaly),
                'score': float(anomaly_score),
                'confidence': float(abs(anomaly_score))
            }
            
            # Threat classification
            threat_proba = self.models['threat_classifier'].predict_proba(features_scaled)[0]
            threat_class = self.models['threat_classifier'].predict(features_scaled)[0]
            threat_type = self.label_encoders['threat_type'].inverse_transform([threat_class])[0]
            predictions['classification'] = {
                'threat_type': threat_type,
                'confidence': float(np.max(threat_proba)),
                'probabilities': {
                    cls: float(prob) for cls, prob in zip(
                        self.label_encoders['threat_type'].classes_, threat_proba
                    )
                }
            }
            
            # Neural network prediction
            neural_proba = self.models['neural_detector'].predict_proba(features_scaled)[0]
            neural_pred = self.models['neural_detector'].predict(features_scaled)[0]
            predictions['neural'] = {
                'is_threat': bool(neural_pred),
                'confidence': float(np.max(neural_proba)),
                'threat_probability': float(neural_proba[1] if len(neural_proba) > 1 else neural_proba[0])
            }
            
            # Gradient boosting prediction
            gradient_proba = self.models['gradient_detector'].predict_proba(features_scaled)[0]
            gradient_pred = self.models['gradient_detector'].predict(features_scaled)[0]
            predictions['gradient'] = {
                'is_threat': bool(gradient_pred),
                'confidence': float(np.max(gradient_proba)),
                'threat_probability': float(gradient_proba[1] if len(gradient_proba) > 1 else gradient_proba[0])
            }
            
            # Ensemble decision
            threat_votes = sum([
                predictions['anomaly']['is_anomaly'],
                predictions['neural']['is_threat'],
                predictions['gradient']['is_threat']
            ])
            
            ensemble_confidence = np.mean([
                predictions['anomaly']['confidence'],
                predictions['classification']['confidence'],
                predictions['neural']['confidence'],
                predictions['gradient']['confidence']
            ])
            
            # Final risk assessment
            risk_score = int(ensemble_confidence * 100)
            is_threat = threat_votes >= 2 or risk_score > 70
            
            # Determine severity
            if risk_score >= 90:
                severity = 'critical'
            elif risk_score >= 70:
                severity = 'high'
            elif risk_score >= 40:
                severity = 'medium'
            else:
                severity = 'low'
            
            return {
                'is_threat': is_threat,
                'threat_type': predictions['classification']['threat_type'],
                'severity': severity,
                'risk_score': risk_score,
                'confidence': float(ensemble_confidence),
                'ensemble_votes': threat_votes,
                'model_predictions': predictions,
                'timestamp': datetime.now().isoformat(),
                'model_version': 'advanced_ml_v2.0'
            }
            
        except Exception as e:
            print(f"[v0] Error in threat prediction: {e}")
            return {
                'is_threat': False,
                'threat_type': 'unknown',
                'severity': 'low',
                'risk_score': 0,
                'confidence': 0.0,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    async def update_model_metrics(self):
        """Update model performance metrics in database"""
        try:
            async with self.db_pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO ai_model_metrics (
                        model_name, model_version, accuracy, precision_score, 
                        recall, f1_score, evaluation_date, is_active
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                """, 
                'advanced_ml_ensemble', 'v2.0',
                self.model_metrics.get('threat_classifier_accuracy', 0.0),
                self.model_metrics.get('neural_detector_accuracy', 0.0),
                self.model_metrics.get('gradient_detector_accuracy', 0.0),
                np.mean([
                    self.model_metrics.get('threat_classifier_accuracy', 0.0),
                    self.model_metrics.get('neural_detector_accuracy', 0.0),
                    self.model_metrics.get('gradient_detector_accuracy', 0.0)
                ]),
                datetime.now(),
                True
                )
                
                print("[v0] Model metrics updated in database")
                
        except Exception as e:
            print(f"[v0] Error updating model metrics: {e}")

async def main():
    """Main function for testing and training"""
    if len(sys.argv) < 2:
        print("Usage: python advanced_ml_engine.py [train|predict|test]")
        return
    
    command = sys.argv[1]
    engine = AdvancedMLEngine()
    
    if not await engine.connect_database():
        print("[v0] Cannot proceed without database connection")
        return
    
    if command == 'train':
        print("[v0] Starting model training...")
        success = await engine.train_models()
        if success:
            await engine.update_model_metrics()
            print("[v0] Training completed successfully")
        else:
            print("[v0] Training failed")
    
    elif command == 'predict':
        # Load existing models
        if engine.load_models():
            # Test prediction
            test_data = {
                'payload': "' OR '1'='1' --",
                'user_agent': 'Mozilla/5.0',
                'request_path': '/login',
                'source_ip': '192.168.1.100'
            }
            
            result = engine.predict_threat(test_data)
            print("[v0] Prediction result:")
            print(json.dumps(result, indent=2))
        else:
            print("[v0] Could not load models")
    
    elif command == 'test':
        # Run comprehensive tests
        test_cases = [
            {
                'name': 'SQL Injection',
                'data': {
                    'payload': "admin' OR '1'='1' --",
                    'user_agent': 'Mozilla/5.0',
                    'request_path': '/login',
                    'source_ip': '10.0.0.1'
                }
            },
            {
                'name': 'XSS Attack',
                'data': {
                    'payload': '<script>alert("XSS")</script>',
                    'user_agent': 'Chrome/91.0',
                    'request_path': '/search',
                    'source_ip': '172.16.0.1'
                }
            },
            {
                'name': 'Normal Request',
                'data': {
                    'payload': 'username=john&password=secret',
                    'user_agent': 'Mozilla/5.0',
                    'request_path': '/api/login',
                    'source_ip': '192.168.1.50'
                }
            }
        ]
        
        if engine.load_models():
            print("[v0] Running test cases...")
            for test_case in test_cases:
                print(f"\n--- {test_case['name']} ---")
                result = engine.predict_threat(test_case['data'])
                print(f"Threat: {result['is_threat']}")
                print(f"Type: {result['threat_type']}")
                print(f"Severity: {result['severity']}")
                print(f"Risk Score: {result['risk_score']}")
                print(f"Confidence: {result['confidence']:.3f}")
        else:
            print("[v0] Could not load models for testing")

if __name__ == "__main__":
    asyncio.run(main())
