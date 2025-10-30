import socket
import threading
import subprocess
import json
import time
from datetime import datetime
import concurrent.futures
import requests
import hashlib
import os

class AdvancedSecurityScanner:
    def __init__(self):
        self.scan_results = {
            'timestamp': datetime.now().isoformat(),
            'port_scan': {},
            'vulnerability_scan': {},
            'network_analysis': {},
            'security_assessment': {}
        }
        
    def port_scan(self, target_host, port_range=(1, 1000)):
        """Advanced port scanning with service detection"""
        print(f"[v0] Starting port scan on {target_host}...")
        
        open_ports = []
        services = {}
        
        def scan_port(port):
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                result = sock.connect_ex((target_host, port))
                
                if result == 0:
                    try:
                        # Try to grab banner
                        sock.send(b'HEAD / HTTP/1.0\r\n\r\n')
                        banner = sock.recv(1024).decode('utf-8', errors='ignore')
                        services[port] = banner[:100] if banner else 'Unknown'
                    except:
                        services[port] = 'Unknown'
                    
                    open_ports.append(port)
                    print(f"[v0] Port {port} is open")
                
                sock.close()
            except:
                pass
        
        # Multi-threaded scanning
        with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
            executor.map(scan_port, range(port_range[0], port_range[1] + 1))
        
        self.scan_results['port_scan'] = {
            'target': target_host,
            'open_ports': open_ports,
            'services': services,
            'total_ports_scanned': port_range[1] - port_range[0] + 1
        }
        
        return open_ports
    
    def vulnerability_assessment(self, target_host, open_ports):
        """Assess vulnerabilities based on open ports and services"""
        print("[v0] Performing vulnerability assessment...")
        
        vulnerabilities = []
        risk_score = 0
        
        # Common vulnerable ports and services
        vulnerable_ports = {
            21: {'service': 'FTP', 'risk': 'High', 'issues': ['Anonymous access', 'Weak encryption']},
            22: {'service': 'SSH', 'risk': 'Medium', 'issues': ['Brute force attacks', 'Weak passwords']},
            23: {'service': 'Telnet', 'risk': 'Critical', 'issues': ['Unencrypted communication', 'No authentication']},
            25: {'service': 'SMTP', 'risk': 'Medium', 'issues': ['Email relay', 'Information disclosure']},
            53: {'service': 'DNS', 'risk': 'Medium', 'issues': ['DNS amplification', 'Zone transfer']},
            80: {'service': 'HTTP', 'risk': 'Medium', 'issues': ['Web vulnerabilities', 'Information disclosure']},
            110: {'service': 'POP3', 'risk': 'High', 'issues': ['Unencrypted passwords', 'Email interception']},
            135: {'service': 'RPC', 'risk': 'High', 'issues': ['Remote code execution', 'Information disclosure']},
            139: {'service': 'NetBIOS', 'risk': 'High', 'issues': ['SMB vulnerabilities', 'Information disclosure']},
            143: {'service': 'IMAP', 'risk': 'Medium', 'issues': ['Unencrypted passwords', 'Email access']},
            443: {'service': 'HTTPS', 'risk': 'Low', 'issues': ['SSL/TLS vulnerabilities', 'Certificate issues']},
            445: {'service': 'SMB', 'risk': 'Critical', 'issues': ['EternalBlue', 'Remote code execution']},
            993: {'service': 'IMAPS', 'risk': 'Low', 'issues': ['Certificate validation', 'Weak ciphers']},
            995: {'service': 'POP3S', 'risk': 'Low', 'issues': ['Certificate validation', 'Weak ciphers']},
            1433: {'service': 'MSSQL', 'risk': 'High', 'issues': ['SQL injection', 'Weak authentication']},
            3306: {'service': 'MySQL', 'risk': 'High', 'issues': ['SQL injection', 'Default credentials']},
            3389: {'service': 'RDP', 'risk': 'High', 'issues': ['Brute force', 'BlueKeep vulnerability']},
            5432: {'service': 'PostgreSQL', 'risk': 'Medium', 'issues': ['SQL injection', 'Weak authentication']},
            6379: {'service': 'Redis', 'risk': 'High', 'issues': ['No authentication', 'Remote code execution']}
        }
        
        for port in open_ports:
            if port in vulnerable_ports:
                vuln_info = vulnerable_ports[port]
                vulnerabilities.append({
                    'port': port,
                    'service': vuln_info['service'],
                    'risk_level': vuln_info['risk'],
                    'potential_issues': vuln_info['issues']
                })
                
                # Calculate risk score
                risk_values = {'Low': 1, 'Medium': 3, 'High': 7, 'Critical': 10}
                risk_score += risk_values.get(vuln_info['risk'], 0)
        
        # Security recommendations
        recommendations = []
        if risk_score > 20:
            recommendations.append("Immediate action required - Critical vulnerabilities detected")
        if any(p in open_ports for p in [21, 23, 135, 445]):
            recommendations.append("Disable unnecessary services (FTP, Telnet, RPC, SMB)")
        if 22 in open_ports:
            recommendations.append("Implement SSH key authentication and disable password auth")
        if any(p in open_ports for p in [80, 443]):
            recommendations.append("Implement web application firewall and regular security updates")
        
        self.scan_results['vulnerability_scan'] = {
            'vulnerabilities': vulnerabilities,
            'risk_score': risk_score,
            'risk_level': 'Critical' if risk_score > 20 else 'High' if risk_score > 10 else 'Medium' if risk_score > 5 else 'Low',
            'recommendations': recommendations
        }
        
        return vulnerabilities, risk_score
    
    def network_analysis(self, target_host):
        """Perform network analysis and fingerprinting"""
        print("[v0] Performing network analysis...")
        
        analysis = {}
        
        try:
            # OS fingerprinting attempt
            import platform
            analysis['scanner_os'] = platform.system()
            
            # DNS resolution
            analysis['dns_resolution'] = socket.gethostbyname(target_host)
            
            # Reverse DNS lookup
            try:
                analysis['reverse_dns'] = socket.gethostbyaddr(target_host)[0]
            except:
                analysis['reverse_dns'] = 'Not available'
            
            # Network latency test
            start_time = time.time()
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            try:
                sock.connect((target_host, 80))
                latency = (time.time() - start_time) * 1000
                analysis['network_latency'] = f"{latency:.2f}ms"
            except:
                analysis['network_latency'] = 'Timeout'
            finally:
                sock.close()
            
        except Exception as e:
            analysis['error'] = str(e)
        
        self.scan_results['network_analysis'] = analysis
        return analysis
    
    def generate_security_report(self):
        """Generate comprehensive security assessment report"""
        print("[v0] Generating security assessment report...")
        
        # Calculate overall security score
        port_score = max(0, 100 - len(self.scan_results['port_scan'].get('open_ports', [])) * 5)
        vuln_score = max(0, 100 - self.scan_results['vulnerability_scan'].get('risk_score', 0) * 5)
        overall_score = (port_score + vuln_score) / 2
        
        assessment = {
            'overall_security_score': round(overall_score, 2),
            'security_grade': 'A' if overall_score >= 90 else 'B' if overall_score >= 80 else 'C' if overall_score >= 70 else 'D' if overall_score >= 60 else 'F',
            'critical_issues': len([v for v in self.scan_results['vulnerability_scan'].get('vulnerabilities', []) if v['risk_level'] == 'Critical']),
            'high_issues': len([v for v in self.scan_results['vulnerability_scan'].get('vulnerabilities', []) if v['risk_level'] == 'High']),
            'medium_issues': len([v for v in self.scan_results['vulnerability_scan'].get('vulnerabilities', []) if v['risk_level'] == 'Medium']),
            'low_issues': len([v for v in self.scan_results['vulnerability_scan'].get('vulnerabilities', []) if v['risk_level'] == 'Low']),
            'scan_duration': 'Completed',
            'next_scan_recommended': (datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + 
                                    timedelta(days=7)).isoformat()
        }
        
        self.scan_results['security_assessment'] = assessment
        
        # Save detailed report
        with open('security_scan_report.json', 'w') as f:
            json.dump(self.scan_results, f, indent=2)
        
        return assessment

def main():
    """Main scanning pipeline"""
    print("[v0] Starting Advanced Security Scanner...")
    
    scanner = AdvancedSecurityScanner()
    target = "127.0.0.1"  # Localhost for demo
    
    # Perform comprehensive scan
    open_ports = scanner.port_scan(target, (20, 1000))
    vulnerabilities, risk_score = scanner.vulnerability_assessment(target, open_ports)
    network_info = scanner.network_analysis(target)
    assessment = scanner.generate_security_report()
    
    print(f"[v0] Security scan completed!")
    print(f"[v0] Open ports found: {len(open_ports)}")
    print(f"[v0] Vulnerabilities detected: {len(vulnerabilities)}")
    print(f"[v0] Risk score: {risk_score}")
    print(f"[v0] Overall security grade: {assessment['security_grade']}")
    
    return scanner.scan_results

if __name__ == "__main__":
    main()
