import socket
import struct
import threading
import time
import json
import numpy as np
from datetime import datetime
from typing import Dict, List, Any
import concurrent.futures
import hashlib

class AdvancedNetworkAnalyzer:
    """Advanced network traffic analysis and anomaly detection"""
    
    def __init__(self):
        self.traffic_data = []
        self.anomaly_threshold = 0.7
        self.analysis_window = 300  # 5 minutes
        self.baseline_metrics = self._initialize_baseline()
        
    def _initialize_baseline(self) -> Dict[str, Any]:
        """Initialize baseline network metrics"""
        return {
            'normal_packet_size': {'mean': 512, 'std': 200},
            'normal_connection_rate': {'mean': 100, 'std': 30},
            'normal_port_distribution': {
                80: 0.4, 443: 0.3, 22: 0.1, 53: 0.1, 25: 0.05, 'other': 0.05
            },
            'normal_protocol_distribution': {
                'tcp': 0.7, 'udp': 0.25, 'icmp': 0.05
            },
            'geographic_baseline': {
                'US': 0.4, 'EU': 0.25, 'Asia': 0.2, 'Other': 0.15
            }
        }
    
    def capture_network_traffic(self, duration: int = 60) -> List[Dict[str, Any]]:
        """Simulate network traffic capture"""
        print(f"[v0] Capturing network traffic for {duration} seconds...")
        
        traffic_samples = []
        start_time = time.time()
        
        # Simulate traffic capture
        for i in range(duration * 10):  # 10 samples per second
            sample = {
                'timestamp': start_time + (i * 0.1),
                'source_ip': self._generate_ip(),
                'dest_ip': self._generate_ip(),
                'source_port': np.random.randint(1024, 65535),
                'dest_port': np.random.choice([80, 443, 22, 53, 25, 3389, 1433, 3306]),
                'protocol': np.random.choice(['tcp', 'udp', 'icmp'], p=[0.7, 0.25, 0.05]),
                'packet_size': max(64, int(np.random.normal(512, 200))),
                'flags': np.random.choice(['SYN', 'ACK', 'FIN', 'RST', 'PSH']),
                'payload_size': np.random.randint(0, 1400),
                'ttl': np.random.randint(32, 128),
                'country': np.random.choice(['US', 'CN', 'RU', 'DE', 'UK', 'FR', 'Unknown']),
                'is_encrypted': np.random.choice([True, False], p=[0.6, 0.4])
            }
            
            # Add some anomalous traffic
            if np.random.random() < 0.05:  # 5% anomalous traffic
                sample.update(self._generate_anomalous_traffic())
            
            traffic_samples.append(sample)
        
        self.traffic_data = traffic_samples
        print(f"[v0] Captured {len(traffic_samples)} network packets")
        return traffic_samples
    
    def _generate_ip(self) -> str:
        """Generate random IP address"""
        return f"{np.random.randint(1, 255)}.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}.{np.random.randint(1, 255)}"
    
    def _generate_anomalous_traffic(self) -> Dict[str, Any]:
        """Generate anomalous traffic patterns"""
        anomaly_type = np.random.choice(['port_scan', 'ddos', 'data_exfiltration', 'malware_c2'])
        
        if anomaly_type == 'port_scan':
            return {
                'dest_port': np.random.randint(1, 1024),
                'packet_size': 64,
                'flags': 'SYN',
                'anomaly_type': 'port_scan'
            }
        elif anomaly_type == 'ddos':
            return {
                'packet_size': np.random.randint(1200, 1500),
                'payload_size': np.random.randint(1000, 1400),
                'anomaly_type': 'ddos'
            }
        elif anomaly_type == 'data_exfiltration':
            return {
                'packet_size': np.random.randint(1400, 1500),
                'payload_size': np.random.randint(1300, 1400),
                'dest_port': 443,
                'is_encrypted': True,
                'anomaly_type': 'data_exfiltration'
            }
        else:  # malware_c2
            return {
                'dest_port': np.random.choice([8080, 8443, 9999, 4444]),
                'packet_size': np.random.randint(200, 400),
                'anomaly_type': 'malware_c2'
            }
    
    def analyze_traffic_patterns(self) -> Dict[str, Any]:
        """Analyze traffic patterns for anomalies"""
        print("[v0] Analyzing traffic patterns...")
        
        if not self.traffic_data:
            return {'error': 'No traffic data available'}
        
        analysis = {
            'total_packets': len(self.traffic_data),
            'analysis_period': self.analysis_window,
            'timestamp': datetime.now().isoformat(),
            'packet_analysis': self._analyze_packet_patterns(),
            'connection_analysis': self._analyze_connection_patterns(),
            'protocol_analysis': self._analyze_protocol_distribution(),
            'geographic_analysis': self._analyze_geographic_distribution(),
            'anomaly_detection': self._detect_anomalies(),
            'threat_indicators': self._identify_threat_indicators(),
            'security_score': 0.0
        }
        
        # Calculate overall security score
        anomaly_score = analysis['anomaly_detection']['anomaly_score']
        threat_score = len(analysis['threat_indicators']) / 10.0  # Normalize
        analysis['security_score'] = max(0, 100 - (anomaly_score * 50) - (threat_score * 30))
        
        return analysis
    
    def _analyze_packet_patterns(self) -> Dict[str, Any]:
        """Analyze packet size and timing patterns"""
        packet_sizes = [p['packet_size'] for p in self.traffic_data]
        timestamps = [p['timestamp'] for p in self.traffic_data]
        
        # Calculate inter-arrival times
        inter_arrival_times = np.diff(sorted(timestamps))
        
        return {
            'packet_size_stats': {
                'mean': np.mean(packet_sizes),
                'std': np.std(packet_sizes),
                'min': np.min(packet_sizes),
                'max': np.max(packet_sizes),
                'percentiles': {
                    '25th': np.percentile(packet_sizes, 25),
                    '50th': np.percentile(packet_sizes, 50),
                    '75th': np.percentile(packet_sizes, 75),
                    '95th': np.percentile(packet_sizes, 95)
                }
            },
            'timing_analysis': {
                'avg_inter_arrival': np.mean(inter_arrival_times),
                'inter_arrival_std': np.std(inter_arrival_times),
                'burst_detection': np.sum(inter_arrival_times < 0.01) / len(inter_arrival_times),
                'regularity_score': 1.0 / (1.0 + np.std(inter_arrival_times))
            }
        }
    
    def _analyze_connection_patterns(self) -> Dict[str, Any]:
        """Analyze connection patterns and flows"""
        # Group by source IP
        connections_by_source = {}
        for packet in self.traffic_data:
            source = packet['source_ip']
            if source not in connections_by_source:
                connections_by_source[source] = []
            connections_by_source[source].append(packet)
        
        # Analyze connection patterns
        connection_counts = [len(conns) for conns in connections_by_source.values()]
        unique_destinations = {}
        
        for source, packets in connections_by_source.items():
            unique_dests = set(p['dest_ip'] for p in packets)
            unique_destinations[source] = len(unique_dests)
        
        return {
            'unique_sources': len(connections_by_source),
            'connection_distribution': {
                'mean_connections_per_source': np.mean(connection_counts),
                'max_connections_per_source': np.max(connection_counts),
                'std_connections': np.std(connection_counts)
            },
            'destination_diversity': {
                'mean_destinations_per_source': np.mean(list(unique_destinations.values())),
                'max_destinations_per_source': np.max(list(unique_destinations.values()))
            },
            'top_talkers': sorted(connections_by_source.keys(), 
                                key=lambda x: len(connections_by_source[x]), 
                                reverse=True)[:10]
        }
    
    def _analyze_protocol_distribution(self) -> Dict[str, Any]:
        """Analyze protocol and port distributions"""
        protocols = [p['protocol'] for p in self.traffic_data]
        dest_ports = [p['dest_port'] for p in self.traffic_data]
        
        # Protocol distribution
        protocol_counts = {}
        for proto in protocols:
            protocol_counts[proto] = protocol_counts.get(proto, 0) + 1
        
        protocol_dist = {k: v/len(protocols) for k, v in protocol_counts.items()}
        
        # Port distribution
        port_counts = {}
        for port in dest_ports:
            port_counts[port] = port_counts.get(port, 0) + 1
        
        # Top 10 ports
        top_ports = sorted(port_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return {
            'protocol_distribution': protocol_dist,
            'protocol_entropy': self._calculate_entropy(protocols),
            'top_ports': top_ports,
            'port_diversity': len(set(dest_ports)),
            'uncommon_ports': [port for port, count in port_counts.items() 
                             if port not in [80, 443, 22, 53, 25] and count > 1]
        }
    
    def _analyze_geographic_distribution(self) -> Dict[str, Any]:
        """Analyze geographic distribution of traffic"""
        countries = [p['country'] for p in self.traffic_data]
        
        country_counts = {}
        for country in countries:
            country_counts[country] = country_counts.get(country, 0) + 1
        
        country_dist = {k: v/len(countries) for k, v in country_counts.items()}
        
        return {
            'country_distribution': country_dist,
            'geographic_diversity': len(set(countries)),
            'top_countries': sorted(country_counts.items(), key=lambda x: x[1], reverse=True)[:5],
            'suspicious_countries': [country for country, count in country_counts.items() 
                                   if country in ['CN', 'RU', 'KP'] and count > len(countries) * 0.1]
        }
    
    def _detect_anomalies(self) -> Dict[str, Any]:
        """Detect network anomalies using statistical methods"""
        anomalies = []
        anomaly_score = 0.0
        
        # Packet size anomalies
        packet_sizes = [p['packet_size'] for p in self.traffic_data]
        baseline_mean = self.baseline_metrics['normal_packet_size']['mean']
        baseline_std = self.baseline_metrics['normal_packet_size']['std']
        
        size_anomalies = [size for size in packet_sizes 
                         if abs(size - baseline_mean) > 3 * baseline_std]
        
        if size_anomalies:
            anomalies.append({
                'type': 'packet_size_anomaly',
                'count': len(size_anomalies),
                'severity': 'medium' if len(size_anomalies) < 10 else 'high'
            })
            anomaly_score += 0.2
        
        # Connection rate anomalies
        time_windows = self._create_time_windows()
        for window in time_windows:
            connection_rate = len(window) / 60  # connections per second
            if connection_rate > 200:  # Threshold for high connection rate
                anomalies.append({
                    'type': 'high_connection_rate',
                    'rate': connection_rate,
                    'severity': 'high'
                })
                anomaly_score += 0.3
        
        # Port scanning detection
        port_scan_indicators = self._detect_port_scanning()
        if port_scan_indicators:
            anomalies.extend(port_scan_indicators)
            anomaly_score += 0.4
        
        # DDoS detection
        ddos_indicators = self._detect_ddos_patterns()
        if ddos_indicators:
            anomalies.extend(ddos_indicators)
            anomaly_score += 0.5
        
        return {
            'anomalies': anomalies,
            'anomaly_count': len(anomalies),
            'anomaly_score': min(anomaly_score, 1.0),
            'risk_level': 'high' if anomaly_score > 0.7 else 'medium' if anomaly_score > 0.4 else 'low'
        }
    
    def _create_time_windows(self, window_size: int = 60) -> List[List[Dict]]:
        """Create time-based windows for analysis"""
        if not self.traffic_data:
            return []
        
        sorted_data = sorted(self.traffic_data, key=lambda x: x['timestamp'])
        windows = []
        current_window = []
        window_start = sorted_data[0]['timestamp']
        
        for packet in sorted_data:
            if packet['timestamp'] - window_start <= window_size:
                current_window.append(packet)
            else:
                if current_window:
                    windows.append(current_window)
                current_window = [packet]
                window_start = packet['timestamp']
        
        if current_window:
            windows.append(current_window)
        
        return windows
    
    def _detect_port_scanning(self) -> List[Dict[str, Any]]:
        """Detect port scanning activities"""
        indicators = []
        
        # Group by source IP and analyze port diversity
        source_ports = {}
        for packet in self.traffic_data:
            source = packet['source_ip']
            if source not in source_ports:
                source_ports[source] = set()
            source_ports[source].add(packet['dest_port'])
        
        # Detect sources accessing many different ports
        for source, ports in source_ports.items():
            if len(ports) > 20:  # Threshold for port scanning
                indicators.append({
                    'type': 'port_scanning',
                    'source_ip': source,
                    'ports_accessed': len(ports),
                    'severity': 'high' if len(ports) > 50 else 'medium'
                })
        
        return indicators
    
    def _detect_ddos_patterns(self) -> List[Dict[str, Any]]:
        """Detect DDoS attack patterns"""
        indicators = []
        
        # Analyze traffic volume per destination
        dest_traffic = {}
        for packet in self.traffic_data:
            dest = packet['dest_ip']
            if dest not in dest_traffic:
                dest_traffic[dest] = []
            dest_traffic[dest].append(packet)
        
        # Check for high volume to single destination
        for dest, packets in dest_traffic.items():
            if len(packets) > 1000:  # Threshold for potential DDoS
                # Analyze source diversity
                sources = set(p['source_ip'] for p in packets)
                if len(sources) > 100:  # Many sources targeting one destination
                    indicators.append({
                        'type': 'ddos_attack',
                        'target_ip': dest,
                        'packet_count': len(packets),
                        'source_count': len(sources),
                        'severity': 'critical'
                    })
        
        return indicators
    
    def _identify_threat_indicators(self) -> List[Dict[str, Any]]:
        """Identify various threat indicators"""
        indicators = []
        
        # Malware C2 communication patterns
        c2_ports = [8080, 8443, 9999, 4444, 6666]
        c2_traffic = [p for p in self.traffic_data if p['dest_port'] in c2_ports]
        
        if c2_traffic:
            indicators.append({
                'type': 'malware_c2_communication',
                'packet_count': len(c2_traffic),
                'suspicious_ports': list(set(p['dest_port'] for p in c2_traffic)),
                'severity': 'high'
            })
        
        # Data exfiltration patterns
        large_uploads = [p for p in self.traffic_data 
                        if p['payload_size'] > 1000 and p['dest_port'] in [443, 80]]
        
        if len(large_uploads) > 100:
            indicators.append({
                'type': 'potential_data_exfiltration',
                'large_transfer_count': len(large_uploads),
                'total_data_size': sum(p['payload_size'] for p in large_uploads),
                'severity': 'medium'
            })
        
        # Suspicious geographic patterns
        suspicious_countries = ['CN', 'RU', 'KP', 'IR']
        suspicious_traffic = [p for p in self.traffic_data if p['country'] in suspicious_countries]
        
        if len(suspicious_traffic) > len(self.traffic_data) * 0.3:
            indicators.append({
                'type': 'suspicious_geographic_activity',
                'suspicious_packet_ratio': len(suspicious_traffic) / len(self.traffic_data),
                'countries': list(set(p['country'] for p in suspicious_traffic)),
                'severity': 'medium'
            })
        
        return indicators
    
    def _calculate_entropy(self, data: List[str]) -> float:
        """Calculate Shannon entropy of data"""
        if not data:
            return 0.0
        
        # Count frequencies
        freq = {}
        for item in data:
            freq[item] = freq.get(item, 0) + 1
        
        # Calculate entropy
        entropy = 0.0
        total = len(data)
        for count in freq.values():
            p = count / total
            if p > 0:
                entropy -= p * np.log2(p)
        
        return entropy
    
    def generate_network_report(self) -> Dict[str, Any]:
        """Generate comprehensive network analysis report"""
        print("[v0] Generating network analysis report...")
        
        if not self.traffic_data:
            self.capture_network_traffic(60)
        
        analysis = self.analyze_traffic_patterns()
        
        report = {
            'report_id': hashlib.md5(str(time.time()).encode()).hexdigest()[:12],
            'generated_at': datetime.now().isoformat(),
            'analysis_summary': analysis,
            'executive_summary': {
                'total_packets_analyzed': analysis['total_packets'],
                'security_score': analysis['security_score'],
                'anomalies_detected': analysis['anomaly_detection']['anomaly_count'],
                'threat_indicators': len(analysis['threat_indicators']),
                'risk_assessment': analysis['anomaly_detection']['risk_level']
            },
            'recommendations': self._generate_network_recommendations(analysis)
        }
        
        # Save report
        with open('network_analysis_report.json', 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        print(f"[v0] Network analysis complete! Security score: {analysis['security_score']:.1f}/100")
        
        return report
    
    def _generate_network_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate network security recommendations"""
        recommendations = []
        
        security_score = analysis['security_score']
        anomaly_count = analysis['anomaly_detection']['anomaly_count']
        threat_count = len(analysis['threat_indicators'])
        
        if security_score < 50:
            recommendations.extend([
                "CRITICAL: Immediate network security review required",
                "Implement advanced intrusion detection system",
                "Consider network segmentation",
                "Deploy additional monitoring tools"
            ])
        elif security_score < 70:
            recommendations.extend([
                "Enhanced network monitoring recommended",
                "Review firewall rules and policies",
                "Implement traffic analysis tools",
                "Regular security assessments"
            ])
        
        if anomaly_count > 5:
            recommendations.append("Investigate detected anomalies immediately")
        
        if threat_count > 3:
            recommendations.append("Activate incident response procedures")
        
        # Specific recommendations based on analysis
        if analysis['protocol_analysis']['port_diversity'] > 100:
            recommendations.append("Review and restrict unnecessary port access")
        
        if analysis['geographic_analysis']['geographic_diversity'] > 20:
            recommendations.append("Consider geographic access restrictions")
        
        return recommendations

def main():
    """Main function for network analysis"""
    print("[v0] Starting Advanced Network Analysis...")
    
    analyzer = AdvancedNetworkAnalyzer()
    
    # Capture and analyze network traffic
    traffic_data = analyzer.capture_network_traffic(duration=120)  # 2 minutes
    report = analyzer.generate_network_report()
    
    print(f"[v0] Analysis complete!")
    print(f"  - Packets analyzed: {len(traffic_data)}")
    print(f"  - Security score: {report['executive_summary']['security_score']:.1f}/100")
    print(f"  - Anomalies detected: {report['executive_summary']['anomalies_detected']}")
    print(f"  - Threat indicators: {report['executive_summary']['threat_indicators']}")
    
    return report

if __name__ == "__main__":
    main()
