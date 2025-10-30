#!/usr/bin/env python3
"""
Advanced Python Service Manager for Firewall AI System
Manages Python services, real-time processing, and ML model lifecycle
"""

import asyncio
import json
import logging
import os
import sys
import time
import threading
from datetime import datetime
from typing import Dict, List, Any, Optional
import subprocess
import psutil
import websockets
from dataclasses import dataclass, asdict

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ServiceStatus:
    name: str
    status: str
    cpu_usage: float
    memory_usage: float
    uptime: float
    last_activity: str
    error_count: int

class PythonServiceManager:
    def __init__(self):
        self.services = {}
        self.websocket_clients = set()
        self.running = False
        self.metrics_thread = None
        
    async def start_service_manager(self):
        """Start the Python service manager"""
        logger.info("Starting Python Service Manager...")
        self.running = True
        
        # Start metrics collection thread
        self.metrics_thread = threading.Thread(target=self._collect_metrics)
        self.metrics_thread.daemon = True
        self.metrics_thread.start()
        
        # Start WebSocket server for real-time communication
        await self._start_websocket_server()
        
    def _collect_metrics(self):
        """Collect system and service metrics"""
        while self.running:
            try:
                # Collect system metrics
                cpu_percent = psutil.cpu_percent(interval=1)
                memory = psutil.virtual_memory()
                disk = psutil.disk_usage('/')
                
                metrics = {
                    'timestamp': datetime.now().isoformat(),
                    'system': {
                        'cpu_usage': cpu_percent,
                        'memory_usage': memory.percent,
                        'memory_available': memory.available,
                        'disk_usage': disk.percent
                    },
                    'services': self._get_service_statuses(),
                    'python_processes': self._get_python_processes()
                }
                
                # Broadcast metrics to WebSocket clients
                asyncio.run_coroutine_threadsafe(
                    self._broadcast_metrics(metrics),
                    asyncio.get_event_loop()
                )
                
                time.sleep(5)  # Collect metrics every 5 seconds
                
            except Exception as e:
                logger.error(f"Error collecting metrics: {e}")
                
    def _get_service_statuses(self) -> List[Dict]:
        """Get status of all managed services"""
        statuses = []
        
        for service_name, process in self.services.items():
            try:
                if process and process.poll() is None:
                    # Process is running
                    proc = psutil.Process(process.pid)
                    status = ServiceStatus(
                        name=service_name,
                        status="running",
                        cpu_usage=proc.cpu_percent(),
                        memory_usage=proc.memory_percent(),
                        uptime=time.time() - proc.create_time(),
                        last_activity=datetime.now().isoformat(),
                        error_count=0
                    )
                else:
                    # Process is not running
                    status = ServiceStatus(
                        name=service_name,
                        status="stopped",
                        cpu_usage=0.0,
                        memory_usage=0.0,
                        uptime=0.0,
                        last_activity="N/A",
                        error_count=0
                    )
                    
                statuses.append(asdict(status))
                
            except Exception as e:
                logger.error(f"Error getting status for {service_name}: {e}")
                
        return statuses
        
    def _get_python_processes(self) -> List[Dict]:
        """Get all Python processes"""
        python_processes = []
        
        for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_percent']):
            try:
                if 'python' in proc.info['name'].lower():
                    python_processes.append({
                        'pid': proc.info['pid'],
                        'name': proc.info['name'],
                        'cmdline': ' '.join(proc.info['cmdline']) if proc.info['cmdline'] else '',
                        'cpu_usage': proc.info['cpu_percent'],
                        'memory_usage': proc.info['memory_percent']
                    })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
                
        return python_processes
        
    async def _start_websocket_server(self):
        """Start WebSocket server for real-time communication"""
        async def handle_client(websocket, path):
            logger.info(f"New WebSocket client connected: {websocket.remote_address}")
            self.websocket_clients.add(websocket)
            
            try:
                await websocket.wait_closed()
            finally:
                self.websocket_clients.remove(websocket)
                logger.info(f"WebSocket client disconnected: {websocket.remote_address}")
                
        # Start WebSocket server on port 8765
        start_server = websockets.serve(handle_client, "localhost", 8765)
        logger.info("WebSocket server started on ws://localhost:8765")
        await start_server
        
    async def _broadcast_metrics(self, metrics: Dict):
        """Broadcast metrics to all connected WebSocket clients"""
        if self.websocket_clients:
            message = json.dumps({
                'type': 'metrics_update',
                'data': metrics
            })
            
            # Send to all connected clients
            disconnected_clients = set()
            for client in self.websocket_clients:
                try:
                    await client.send(message)
                except websockets.exceptions.ConnectionClosed:
                    disconnected_clients.add(client)
                    
            # Remove disconnected clients
            self.websocket_clients -= disconnected_clients
            
    def start_ml_service(self, service_name: str, script_path: str, args: List[str] = None):
        """Start a Python ML service"""
        try:
            cmd = ['python3', script_path]
            if args:
                cmd.extend(args)
                
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            self.services[service_name] = process
            logger.info(f"Started service: {service_name} (PID: {process.pid})")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to start service {service_name}: {e}")
            return False
            
    def stop_service(self, service_name: str):
        """Stop a Python service"""
        if service_name in self.services:
            process = self.services[service_name]
            if process and process.poll() is None:
                process.terminate()
                process.wait(timeout=10)
                logger.info(f"Stopped service: {service_name}")
            del self.services[service_name]
            
    def restart_service(self, service_name: str, script_path: str, args: List[str] = None):
        """Restart a Python service"""
        self.stop_service(service_name)
        return self.start_ml_service(service_name, script_path, args)

async def main():
    """Main function to run the service manager"""
    manager = PythonServiceManager()
    
    # Start core ML services
    manager.start_ml_service("ml_engine", "scripts/advanced_ml_engine.py", ["daemon"])
    manager.start_ml_service("real_time_processor", "scripts/real_time_processor.py", ["start"])
    
    # Start the service manager
    await manager.start_service_manager()
    
    # Keep running
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down Python Service Manager...")
        manager.running = False
        
        # Stop all services
        for service_name in list(manager.services.keys()):
            manager.stop_service(service_name)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "status":
        # Quick status check
        manager = PythonServiceManager()
        statuses = manager._get_service_statuses()
        print(json.dumps(statuses, indent=2))
    else:
        # Run the service manager
        asyncio.run(main())
