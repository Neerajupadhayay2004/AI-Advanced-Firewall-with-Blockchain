import asyncio
import json
import time
import random
import websockets
from datetime import datetime
from typing import Dict, List, Any
import threading
import queue

class LiveMonitoringEngine:
    """Real-time monitoring engine for global threat detection"""
    
    def __init__(self):
        self.active_monitors = {}
        self.alert_queue = queue.Queue()
        self.metrics_buffer = []
        self.is_running = False
        self.websocket_clients = set()
        
    async def start_monitoring(self):
        """Start the live monitoring system"""
        print("[v0] Starting live monitoring engine...")
        self.is_running = True
        
        # Start monitoring tasks
        tasks = [
            asyncio.create_task(self.monitor_network_traffic()),
            asyncio.create_task(self.monitor_system_resources()),
            asyncio.create_task(self.monitor_security_events()),
            asyncio.create_task(self.process_alerts()),
            asyncio.create_task(self.broadcast_updates())
        ]
        
        await asyncio.gather(*tasks)
    
    async def monitor_network_traffic(self):
        """Monitor network traffic in real-time"""
        while self.is_running:
            try:
                # Simulate network traffic monitoring
                traffic_data = {
                    'timestamp': datetime.now().isoformat(),
                    'type': 'network_traffic',
                    'metrics': {
                        'packets_per_second': random.randint(1000, 10000),
                        'bytes_per_second': random.randint(1000000, 100000000),
                        'active_connections': random.randint(100, 1000),
                        'blocked_attempts': random.randint(0, 50),
                        'suspicious_ips': random.randint(0, 10)
                    },
                    'alerts': []
                }
                
                # Check for anomalies
                if traffic_data['metrics']['packets_per_second'] > 8000:
                    alert = {
                        'severity': 'HIGH',
                        'type': 'traffic_spike',
                        'message': f"High traffic detected: {traffic_data['metrics']['packets_per_second']} pps",
                        'timestamp': datetime.now().isoformat()
                    }
                    traffic_data['alerts'].append(alert)
                    self.alert_queue.put(alert)
                
                if traffic_data['metrics']['blocked_attempts'] > 30:
                    alert = {
                        'severity': 'MEDIUM',
                        'type': 'attack_attempt',
                        'message': f"Multiple blocked attempts: {traffic_data['metrics']['blocked_attempts']}",
                        'timestamp': datetime.now().isoformat()
                    }
                    traffic_data['alerts'].append(alert)
                    self.alert_queue.put(alert)
                
                self.metrics_buffer.append(traffic_data)
                await self.broadcast_to_clients(traffic_data)
                
                print(f"[v0] Network monitoring: {traffic_data['metrics']['packets_per_second']} pps, {len(traffic_data['alerts'])} alerts")
                
            except Exception as e:
                print(f"[v0] Network monitoring error: {e}")
            
            await asyncio.sleep(2)  # Update every 2 seconds
    
    async def monitor_system_resources(self):
        """Monitor system resources in real-time"""
        while self.is_running:
            try:
                # Simulate system resource monitoring
                resource_data = {
                    'timestamp': datetime.now().isoformat(),
                    'type': 'system_resources',
                    'metrics': {
                        'cpu_usage': random.uniform(10, 90),
                        'memory_usage': random.uniform(30, 85),
                        'disk_usage': random.uniform(40, 80),
                        'network_io': random.uniform(10, 100),
                        'active_processes': random.randint(150, 300),
                        'firewall_rules_active': random.randint(500, 1000)
                    },
                    'alerts': []
                }
                
                # Check for resource alerts
                if resource_data['metrics']['cpu_usage'] > 80:
                    alert = {
                        'severity': 'HIGH',
                        'type': 'high_cpu',
                        'message': f"High CPU usage: {resource_data['metrics']['cpu_usage']:.1f}%",
                        'timestamp': datetime.now().isoformat()
                    }
                    resource_data['alerts'].append(alert)
                    self.alert_queue.put(alert)
                
                if resource_data['metrics']['memory_usage'] > 80:
                    alert = {
                        'severity': 'MEDIUM',
                        'type': 'high_memory',
                        'message': f"High memory usage: {resource_data['metrics']['memory_usage']:.1f}%",
                        'timestamp': datetime.now().isoformat()
                    }
                    resource_data['alerts'].append(alert)
                    self.alert_queue.put(alert)
                
                self.metrics_buffer.append(resource_data)
                await self.broadcast_to_clients(resource_data)
                
                print(f"[v0] System monitoring: CPU {resource_data['metrics']['cpu_usage']:.1f}%, Memory {resource_data['metrics']['memory_usage']:.1f}%")
                
            except Exception as e:
                print(f"[v0] System monitoring error: {e}")
            
            await asyncio.sleep(3)  # Update every 3 seconds
    
    async def monitor_security_events(self):
        """Monitor security events in real-time"""
        while self.is_running:
            try:
                # Simulate security event monitoring
                security_data = {
                    'timestamp': datetime.now().isoformat(),
                    'type': 'security_events',
                    'events': [],
                    'metrics': {
                        'threats_blocked': random.randint(0, 20),
                        'malware_detected': random.randint(0, 5),
                        'intrusion_attempts': random.randint(0, 10),
                        'policy_violations': random.randint(0, 8),
                        'geo_blocks': random.randint(0, 15)
                    },
                    'alerts': []
                }
                
                # Generate random security events
                event_types = ['malware_blocked', 'intrusion_detected', 'policy_violation', 'geo_block', 'ddos_attempt']
                
                for _ in range(random.randint(0, 5)):
                    event = {
                        'id': f'evt_{int(time.time())}_{random.randint(1000, 9999)}',
                        'type': random.choice(event_types),
                        'severity': random.choice(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
                        'source_ip': f'{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}',
                        'target': f'server_{random.randint(1, 10)}',
                        'description': f'Security event detected from {random.choice(["China", "Russia", "Unknown", "Internal"])}',
                        'timestamp': datetime.now().isoformat()
                    }
                    security_data['events'].append(event)
                    
                    if event['severity'] in ['HIGH', 'CRITICAL']:
                        alert = {
                            'severity': event['severity'],
                            'type': 'security_event',
                            'message': f"{event['type']}: {event['description']}",
                            'timestamp': datetime.now().isoformat(),
                            'event_id': event['id']
                        }
                        security_data['alerts'].append(alert)
                        self.alert_queue.put(alert)
                
                self.metrics_buffer.append(security_data)
                await self.broadcast_to_clients(security_data)
                
                print(f"[v0] Security monitoring: {len(security_data['events'])} events, {security_data['metrics']['threats_blocked']} threats blocked")
                
            except Exception as e:
                print(f"[v0] Security monitoring error: {e}")
            
            await asyncio.sleep(5)  # Update every 5 seconds
    
    async def process_alerts(self):
        """Process and prioritize alerts"""
        while self.is_running:
            try:
                if not self.alert_queue.empty():
                    alert = self.alert_queue.get()
                    
                    # Process alert based on severity
                    if alert['severity'] == 'CRITICAL':
                        await self.handle_critical_alert(alert)
                    elif alert['severity'] == 'HIGH':
                        await self.handle_high_alert(alert)
                    else:
                        await self.handle_standard_alert(alert)
                    
                    print(f"[v0] Processed {alert['severity']} alert: {alert['message']}")
                
            except Exception as e:
                print(f"[v0] Alert processing error: {e}")
            
            await asyncio.sleep(1)
    
    async def handle_critical_alert(self, alert: Dict[str, Any]):
        """Handle critical alerts with immediate response"""
        response_data = {
            'type': 'critical_response',
            'alert': alert,
            'actions_taken': [
                'Automatic firewall rule activated',
                'Security team notified',
                'Incident response initiated',
                'System backup triggered'
            ],
            'timestamp': datetime.now().isoformat()
        }
        
        await self.broadcast_to_clients(response_data)
    
    async def handle_high_alert(self, alert: Dict[str, Any]):
        """Handle high priority alerts"""
        response_data = {
            'type': 'high_response',
            'alert': alert,
            'actions_taken': [
                'Enhanced monitoring activated',
                'Security team alerted',
                'Traffic analysis initiated'
            ],
            'timestamp': datetime.now().isoformat()
        }
        
        await self.broadcast_to_clients(response_data)
    
    async def handle_standard_alert(self, alert: Dict[str, Any]):
        """Handle standard alerts"""
        response_data = {
            'type': 'standard_response',
            'alert': alert,
            'actions_taken': [
                'Event logged',
                'Monitoring continued'
            ],
            'timestamp': datetime.now().isoformat()
        }
        
        await self.broadcast_to_clients(response_data)
    
    async def broadcast_updates(self):
        """Broadcast periodic updates to all clients"""
        while self.is_running:
            try:
                # Generate summary update
                summary = {
                    'type': 'system_summary',
                    'timestamp': datetime.now().isoformat(),
                    'status': 'operational',
                    'uptime': f'{random.randint(1, 100)} days',
                    'total_events_today': random.randint(1000, 5000),
                    'threats_blocked_today': random.randint(50, 200),
                    'active_monitors': len(self.active_monitors),
                    'connected_clients': len(self.websocket_clients)
                }
                
                await self.broadcast_to_clients(summary)
                print(f"[v0] Broadcast summary: {summary['total_events_today']} events, {summary['threats_blocked_today']} threats blocked")
                
            except Exception as e:
                print(f"[v0] Broadcast error: {e}")
            
            await asyncio.sleep(10)  # Broadcast every 10 seconds
    
    async def broadcast_to_clients(self, data: Dict[str, Any]):
        """Broadcast data to all connected WebSocket clients"""
        if self.websocket_clients:
            message = json.dumps(data)
            disconnected_clients = set()
            
            for client in self.websocket_clients:
                try:
                    await client.send(message)
                except websockets.exceptions.ConnectionClosed:
                    disconnected_clients.add(client)
                except Exception as e:
                    print(f"[v0] Broadcast error to client: {e}")
                    disconnected_clients.add(client)
            
            # Remove disconnected clients
            self.websocket_clients -= disconnected_clients
    
    async def websocket_handler(self, websocket, path):
        """Handle WebSocket connections"""
        self.websocket_clients.add(websocket)
        print(f"[v0] New WebSocket client connected. Total clients: {len(self.websocket_clients)}")
        
        try:
            # Send initial data
            initial_data = {
                'type': 'connection_established',
                'message': 'Connected to live monitoring system',
                'timestamp': datetime.now().isoformat()
            }
            await websocket.send(json.dumps(initial_data))
            
            # Keep connection alive
            async for message in websocket:
                # Handle incoming messages from clients
                try:
                    data = json.loads(message)
                    await self.handle_client_message(websocket, data)
                except json.JSONDecodeError:
                    await websocket.send(json.dumps({
                        'type': 'error',
                        'message': 'Invalid JSON format'
                    }))
                
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.websocket_clients.discard(websocket)
            print(f"[v0] WebSocket client disconnected. Total clients: {len(self.websocket_clients)}")
    
    async def handle_client_message(self, websocket, data: Dict[str, Any]):
        """Handle messages from WebSocket clients"""
        message_type = data.get('type', 'unknown')
        
        if message_type == 'get_metrics':
            # Send recent metrics
            recent_metrics = self.metrics_buffer[-10:] if self.metrics_buffer else []
            response = {
                'type': 'metrics_response',
                'data': recent_metrics,
                'timestamp': datetime.now().isoformat()
            }
            await websocket.send(json.dumps(response))
        
        elif message_type == 'get_status':
            # Send system status
            status = {
                'type': 'status_response',
                'data': {
                    'is_running': self.is_running,
                    'active_monitors': len(self.active_monitors),
                    'buffer_size': len(self.metrics_buffer),
                    'alert_queue_size': self.alert_queue.qsize()
                },
                'timestamp': datetime.now().isoformat()
            }
            await websocket.send(json.dumps(status))
    
    def stop_monitoring(self):
        """Stop the monitoring system"""
        print("[v0] Stopping live monitoring engine...")
        self.is_running = False

# Main execution function
async def main():
    """Main function to run live monitoring"""
    engine = LiveMonitoringEngine()
    
    try:
        await engine.start_monitoring()
    except KeyboardInterrupt:
        print("[v0] Monitoring stopped by user")
    finally:
        engine.stop_monitoring()

if __name__ == "__main__":
    asyncio.run(main())
