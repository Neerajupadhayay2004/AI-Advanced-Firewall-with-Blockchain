import asyncio
import json
import time
import random
import numpy as np
from datetime import datetime, timedelta
import threading
import requests
from pathlib import Path

class LiveThreatMonitor:
    def __init__(self):
        self.is_running = False
        self.analysis_data = {
            'threats_detected': 0,
            'attacks_blocked': 0,
            'network_health': 100,
            'active_connections': 0,
            'threat_level': 'LOW',
            'last_update': None,
            'live_threats': [],
            'network_traffic': [],
            'security_events': []
        }
        self.output_file = Path('analysis_results.json')
        
    def generate_realistic_threat_data(self):
        """Generate realistic threat detection data"""
        threat_types = ['DDoS', 'Malware', 'Phishing', 'SQL Injection', 'XSS', 'Brute Force']
        countries = ['US', 'CN', 'RU', 'DE', 'BR', 'IN', 'UK', 'FR', 'JP', 'KR']
        
        # Simulate threat detection
        if random.random() < 0.3:  # 30% chance of new threat
            threat = {
                'id': f"THR-{int(time.time())}-{random.randint(1000, 9999)}",
                'type': random.choice(threat_types),
                'severity': random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
                'source_ip': f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
                'source_country': random.choice(countries),
                'target_port': random.choice([80, 443, 22, 21, 3389, 8080]),
                'timestamp': datetime.now().isoformat(),
                'blocked': random.choice([True, False]),
                'confidence': round(random.uniform(0.7, 0.99), 2)
            }
            
            self.analysis_data['live_threats'].append(threat)
            if threat['blocked']:
                self.analysis_data['attacks_blocked'] += 1
            else:
                self.analysis_data['threats_detected'] += 1
                
            # Keep only last 50 threats
            if len(self.analysis_data['live_threats']) > 50:
                self.analysis_data['live_threats'] = self.analysis_data['live_threats'][-50:]
    
    def analyze_network_traffic(self):
        """Analyze network traffic patterns"""
        # Simulate network traffic analysis
        traffic_data = {
            'timestamp': datetime.now().isoformat(),
            'bytes_in': random.randint(1000000, 10000000),
            'bytes_out': random.randint(500000, 5000000),
            'packets_in': random.randint(1000, 10000),
            'packets_out': random.randint(500, 5000),
            'connections': random.randint(50, 500),
            'anomaly_score': round(random.uniform(0.0, 1.0), 3)
        }
        
        self.analysis_data['network_traffic'].append(traffic_data)
        self.analysis_data['active_connections'] = traffic_data['connections']
        
        # Keep only last 100 traffic records
        if len(self.analysis_data['network_traffic']) > 100:
            self.analysis_data['network_traffic'] = self.analysis_data['network_traffic'][-100:]
    
    def calculate_threat_level(self):
        """Calculate overall threat level based on recent activity"""
        recent_threats = [t for t in self.analysis_data['live_threats'] 
                         if datetime.fromisoformat(t['timestamp']) > datetime.now() - timedelta(minutes=5)]
        
        critical_count = len([t for t in recent_threats if t['severity'] == 'CRITICAL'])
        high_count = len([t for t in recent_threats if t['severity'] == 'HIGH'])
        
        if critical_count > 0:
            self.analysis_data['threat_level'] = 'CRITICAL'
            self.analysis_data['network_health'] = max(20, self.analysis_data['network_health'] - 10)
        elif high_count > 2:
            self.analysis_data['threat_level'] = 'HIGH'
            self.analysis_data['network_health'] = max(40, self.analysis_data['network_health'] - 5)
        elif len(recent_threats) > 5:
            self.analysis_data['threat_level'] = 'MEDIUM'
            self.analysis_data['network_health'] = max(60, self.analysis_data['network_health'] - 2)
        else:
            self.analysis_data['threat_level'] = 'LOW'
            self.analysis_data['network_health'] = min(100, self.analysis_data['network_health'] + 1)
    
    def perform_ml_analysis(self):
        """Perform ML-based threat analysis"""
        try:
            # Simulate ML model predictions
            features = np.random.rand(10)  # Simulate network features
            
            # Simulate different ML models
            models = ['RandomForest', 'SVM', 'NeuralNetwork', 'GradientBoosting']
            predictions = []
            
            for model in models:
                # Simulate model prediction
                threat_probability = random.uniform(0.0, 1.0)
                prediction = {
                    'model': model,
                    'threat_probability': round(threat_probability, 3),
                    'prediction': 'THREAT' if threat_probability > 0.7 else 'NORMAL',
                    'confidence': round(random.uniform(0.8, 0.99), 3)
                }
                predictions.append(prediction)
            
            # Create security event
            event = {
                'timestamp': datetime.now().isoformat(),
                'type': 'ML_ANALYSIS',
                'predictions': predictions,
                'ensemble_result': max(predictions, key=lambda x: x['confidence']),
                'features_analyzed': len(features)
            }
            
            self.analysis_data['security_events'].append(event)
            
            # Keep only last 20 events
            if len(self.analysis_data['security_events']) > 20:
                self.analysis_data['security_events'] = self.analysis_data['security_events'][-20:]
                
        except Exception as e:
            print(f"[v0] ML Analysis Error: {e}")
    
    def save_results(self):
        """Save analysis results to JSON file"""
        self.analysis_data['last_update'] = datetime.now().isoformat()
        
        try:
            with open(self.output_file, 'w') as f:
                json.dump(self.analysis_data, f, indent=2)
        except Exception as e:
            print(f"[v0] Error saving results: {e}")
    
    def send_to_api(self):
        """Send live data to API endpoint"""
        try:
            # Try to send data to local API
            response = requests.post(
                'http://localhost:3000/api/live-analysis',
                json=self.analysis_data,
                timeout=2
            )
            if response.status_code == 200:
                print(f"[v0] Data sent to API successfully")
        except Exception as e:
            # API not available, continue with file-based approach
            pass
    
    async def run_continuous_analysis(self):
        """Main analysis loop"""
        print(f"[v0] Starting Live Threat Monitor...")
        print(f"[v0] Analysis results will be saved to: {self.output_file}")
        
        self.is_running = True
        iteration = 0
        
        while self.is_running:
            try:
                iteration += 1
                print(f"[v0] Analysis iteration {iteration} - {datetime.now().strftime('%H:%M:%S')}")
                
                # Perform different types of analysis
                self.generate_realistic_threat_data()
                self.analyze_network_traffic()
                self.calculate_threat_level()
                
                # Run ML analysis every 3rd iteration
                if iteration % 3 == 0:
                    self.perform_ml_analysis()
                
                # Save results and try to send to API
                self.save_results()
                self.send_to_api()
                
                # Print current status
                print(f"[v0] Threats: {self.analysis_data['threats_detected']}, "
                      f"Blocked: {self.analysis_data['attacks_blocked']}, "
                      f"Level: {self.analysis_data['threat_level']}, "
                      f"Health: {self.analysis_data['network_health']}%")
                
                # Wait before next analysis
                await asyncio.sleep(5)  # Analyze every 5 seconds
                
            except KeyboardInterrupt:
                print(f"\n[v0] Stopping Live Threat Monitor...")
                self.is_running = False
                break
            except Exception as e:
                print(f"[v0] Analysis Error: {e}")
                await asyncio.sleep(1)
    
    def stop(self):
        """Stop the analysis"""
        self.is_running = False

# Main execution
if __name__ == "__main__":
    monitor = LiveThreatMonitor()
    
    try:
        # Run the continuous analysis
        asyncio.run(monitor.run_continuous_analysis())
    except KeyboardInterrupt:
        print(f"\n[v0] Live analysis stopped by user")
    except Exception as e:
        print(f"[v0] Fatal error: {e}")
