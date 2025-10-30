#!/usr/bin/env python3
"""
Real-time Security Data Processor
Handles continuous monitoring, data processing, and threat analysis
"""

import asyncio
import asyncpg
import json
import sys
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any
import numpy as np
import pandas as pd
from advanced_ml_engine import AdvancedMLEngine

class RealTimeProcessor:
    def __init__(self, db_url: str = None):
        self.db_url = db_url or os.getenv('POSTGRES_URL')
        self.ml_engine = AdvancedMLEngine(db_url)
        self.db_pool = None
        self.is_running = False
        self.processing_stats = {
            'processed_count': 0,
            'threats_detected': 0,
            'false_positives': 0,
            'start_time': None
        }
        
    async def initialize(self):
        """Initialize the real-time processor"""
        print("[v0] Initializing Real-time Security Processor...")
        
        # Connect to database
        if not await self.ml_engine.connect_database():
            return False
            
        self.db_pool = self.ml_engine.db_pool
        
        # Load ML models
        if not self.ml_engine.load_models():
            print("[v0] Warning: Could not load ML models, using basic analysis")
        
        self.processing_stats['start_time'] = datetime.now()
        print("[v0] Real-time processor ready")
        return True
    
    async def process_security_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process a single security event in real-time"""
        try:
            # Extract relevant data for ML analysis
            ml_data = {
                'payload': event_data.get('payload', ''),
                'user_agent': event_data.get('user_agent', ''),
                'request_path': event_data.get('request_path', ''),
                'source_ip': event_data.get('source_ip', ''),
                'method': event_data.get('method', 'GET')
            }
            
            # Run ML analysis
            ml_result = self.ml_engine.predict_threat(ml_data)
            
            # Update processing stats
            self.processing_stats['processed_count'] += 1
            if ml_result['is_threat']:
                self.processing_stats['threats_detected'] += 1
            
            # Store enhanced analysis
            analysis_result = {
                'event_id': event_data.get('id'),
                'ml_analysis': ml_result,
                'processing_time': datetime.now().isoformat(),
                'processor_version': 'real_time_v1.0'
            }
            
            # Store in database if high risk
            if ml_result['risk_score'] > 50:
                await self.store_threat_analysis(event_data, ml_result)
            
            return analysis_result
            
        except Exception as e:
            print(f"[v0] Error processing security event: {e}")
            return {
                'error': str(e),
                'event_id': event_data.get('id'),
                'processing_time': datetime.now().isoformat()
            }
    
    async def store_threat_analysis(self, event_data: Dict[str, Any], ml_result: Dict[str, Any]):
        """Store threat analysis in database"""
        try:
            async with self.db_pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO threat_logs (
                        threat_type, severity, source_ip, user_agent, 
                        request_path, payload, ai_confidence, status
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                """,
                ml_result['threat_type'],
                ml_result['severity'],
                event_data.get('source_ip', '0.0.0.0'),
                event_data.get('user_agent'),
                event_data.get('request_path'),
                json.dumps({
                    'raw': event_data.get('payload', ''),
                    'ml_analysis': ml_result
                }),
                ml_result['confidence'],
                'detected' if ml_result['is_threat'] else 'allowed'
                )
                
        except Exception as e:
            print(f"[v0] Error storing threat analysis: {e}")
    
    async def monitor_system_metrics(self):
        """Monitor and update system performance metrics"""
        try:
            # Calculate processing rate
            uptime = (datetime.now() - self.processing_stats['start_time']).total_seconds()
            processing_rate = self.processing_stats['processed_count'] / max(uptime, 1)
            
            # Calculate threat detection rate
            threat_rate = (self.processing_stats['threats_detected'] / 
                          max(self.processing_stats['processed_count'], 1)) * 100
            
            # Store system metrics
            async with self.db_pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO system_metrics (metric_type, value, unit, metadata)
                    VALUES ($1, $2, $3, $4)
                """,
                'processing_rate',
                processing_rate,
                'events_per_second',
                json.dumps({
                    'total_processed': self.processing_stats['processed_count'],
                    'threats_detected': self.processing_stats['threats_detected'],
                    'threat_rate_percent': threat_rate,
                    'uptime_seconds': uptime
                })
                )
                
            print(f"[v0] System metrics updated - Rate: {processing_rate:.2f} events/sec, Threats: {threat_rate:.1f}%")
            
        except Exception as e:
            print(f"[v0] Error updating system metrics: {e}")
    
    async def continuous_learning(self):
        """Implement continuous learning from new data"""
        try:
            # Check if we have enough new data for retraining
            async with self.db_pool.acquire() as conn:
                result = await conn.fetchval("""
                    SELECT COUNT(*) FROM threat_logs 
                    WHERE created_at >= NOW() - INTERVAL '1 hour'
                """)
                
                if result > 100:  # Retrain if we have 100+ new samples
                    print("[v0] Sufficient new data available, triggering model retraining...")
                    await self.ml_engine.train_models()
                    await self.ml_engine.update_model_metrics()
                    print("[v0] Continuous learning update completed")
                
        except Exception as e:
            print(f"[v0] Error in continuous learning: {e}")
    
    async def run_real_time_monitoring(self):
        """Main real-time monitoring loop"""
        self.is_running = True
        print("[v0] Starting real-time security monitoring...")
        
        while self.is_running:
            try:
                # Monitor for new security events (simulated)
                # In production, this would connect to log streams, APIs, etc.
                
                # Update system metrics every 60 seconds
                await self.monitor_system_metrics()
                
                # Check for continuous learning every 30 minutes
                if self.processing_stats['processed_count'] % 1800 == 0:
                    await self.continuous_learning()
                
                # Sleep for monitoring interval
                await asyncio.sleep(60)
                
            except KeyboardInterrupt:
                print("[v0] Stopping real-time monitoring...")
                self.is_running = False
                break
            except Exception as e:
                print(f"[v0] Error in monitoring loop: {e}")
                await asyncio.sleep(10)  # Wait before retrying
    
    async def process_batch_events(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Process multiple events in batch for efficiency"""
        results = []
        
        print(f"[v0] Processing batch of {len(events)} events...")
        
        # Process events concurrently
        tasks = [self.process_security_event(event) for event in events]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out exceptions and log them
        valid_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"[v0] Error processing event {i}: {result}")
            else:
                valid_results.append(result)
        
        print(f"[v0] Batch processing completed: {len(valid_results)} successful")
        return valid_results
    
    def get_processing_stats(self) -> Dict[str, Any]:
        """Get current processing statistics"""
        uptime = (datetime.now() - self.processing_stats['start_time']).total_seconds() if self.processing_stats['start_time'] else 0
        
        return {
            **self.processing_stats,
            'uptime_seconds': uptime,
            'processing_rate': self.processing_stats['processed_count'] / max(uptime, 1),
            'threat_detection_rate': (self.processing_stats['threats_detected'] / 
                                    max(self.processing_stats['processed_count'], 1)) * 100,
            'is_running': self.is_running
        }

async def main():
    """Main function for real-time processor"""
    if len(sys.argv) < 2:
        print("Usage: python real_time_processor.py [monitor|process|stats]")
        return
    
    command = sys.argv[1]
    processor = RealTimeProcessor()
    
    if not await processor.initialize():
        print("[v0] Failed to initialize processor")
        return
    
    if command == 'monitor':
        # Start continuous monitoring
        await processor.run_real_time_monitoring()
    
    elif command == 'process':
        # Process sample events
        sample_events = [
            {
                'id': '1',
                'source_ip': '192.168.1.100',
                'payload': "' OR '1'='1' --",
                'user_agent': 'Mozilla/5.0',
                'request_path': '/login',
                'method': 'POST'
            },
            {
                'id': '2',
                'source_ip': '10.0.0.50',
                'payload': '<script>alert("XSS")</script>',
                'user_agent': 'Chrome/91.0',
                'request_path': '/search',
                'method': 'GET'
            }
        ]
        
        results = await processor.process_batch_events(sample_events)
        print("[v0] Processing results:")
        for result in results:
            print(json.dumps(result, indent=2))
    
    elif command == 'stats':
        # Get processing statistics
        stats = processor.get_processing_stats()
        print("[v0] Processing Statistics:")
        print(json.dumps(stats, indent=2, default=str))

if __name__ == "__main__":
    asyncio.run(main())
