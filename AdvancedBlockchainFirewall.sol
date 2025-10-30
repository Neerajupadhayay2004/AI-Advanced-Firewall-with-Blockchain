// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AdvancedAutoBlockchainFirewall
 * @dev Auto-Detection Blockchain Firewall with Continuous Monitoring
 * File Name: AdvancedAutoBlockchainFirewall.sol
 */
contract AdvancedAutoBlockchainFirewall {
    
    address public owner;
    uint256 public ruleCounter;
    uint256 public threatCounter;
    bool public isSystemActive;
    bool public autoDetectionEnabled;
    
    // Enums
    enum RuleAction { ALLOW, BLOCK, ALERT }
    enum Protocol { TCP, UDP, ICMP, HTTP, HTTPS, ALL }
    enum ThreatLevel { LOW, MEDIUM, HIGH, CRITICAL }
    
    // Structs
    struct FirewallRule {
        uint256 id;
        string name;
        string sourceIP;
        string destinationIP;
        uint256 sourcePort;
        uint256 destinationPort;
        Protocol protocol;
        RuleAction action;
        bool isActive;
        uint256 priority;
        uint256 createdAt;
        address createdBy;
    }
    
    struct ThreatLog {
        uint256 id;
        string sourceIP;
        string attackType;
        ThreatLevel level;
        uint256 timestamp;
        string description;
        bool isBlocked;
        uint256 connectionAttempts;
    }
    
    struct NetworkStats {
        uint256 totalPacketsScanned;
        uint256 threatsBlocked;
        uint256 alertsTriggered;
        uint256 autoBlockedIPs;
        uint256 lastUpdateTime;
    }
    
    struct IPTraffic {
        uint256 connectionCount;
        uint256 lastAccessTime;
        uint256 suspicionScore;
        bool isMonitored;
    }
    
    // Mappings
    mapping(uint256 => FirewallRule) public firewallRules;
    mapping(uint256 => ThreatLog) public threatLogs;
    mapping(address => bool) public authorizedAdmins;
    mapping(string => bool) public blacklistedIPs;
    mapping(string => bool) public whitelistedIPs;
    mapping(string => IPTraffic) public ipTrafficData;
    
    NetworkStats public networkStats;
    
    // Auto-detection thresholds
    uint256 public maxConnectionsPerMinute = 100;
    uint256 public suspicionThreshold = 500;
    uint256 public autoBlockThreshold = 1000;
    
    // Events
    event SystemStarted(address indexed admin, uint256 timestamp);
    event SystemStopped(address indexed admin, uint256 timestamp);
    event AutoDetectionEnabled(bool status);
    event RuleCreated(uint256 indexed ruleId, string name, RuleAction action);
    event RuleUpdated(uint256 indexed ruleId, bool isActive);
    event RuleDeleted(uint256 indexed ruleId);
    event ThreatDetected(uint256 indexed threatId, string sourceIP, ThreatLevel level, uint256 timestamp);
    event AutoBlocked(string ip, uint256 suspicionScore, uint256 timestamp);
    event IPBlacklisted(string ip, address admin);
    event IPWhitelisted(string ip, address admin);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event PacketScanned(string sourceIP, uint256 connectionCount, uint256 suspicionScore);
    event ThresholdUpdated(string thresholdType, uint256 newValue);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAdmin() {
        require(authorizedAdmins[msg.sender] || msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier systemActive() {
        require(isSystemActive, "System is not active");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        authorizedAdmins[msg.sender] = true;
        ruleCounter = 0;
        threatCounter = 0;
        isSystemActive = false;
        autoDetectionEnabled = true;
        networkStats = NetworkStats(0, 0, 0, 0, block.timestamp);
    }
    
    // ==================== SYSTEM CONTROL ====================
    
    function startSystem() external onlyAdmin {
        require(!isSystemActive, "System already running");
        isSystemActive = true;
        emit SystemStarted(msg.sender, block.timestamp);
    }
    
    function stopSystem() external onlyAdmin {
        require(isSystemActive, "System already stopped");
        isSystemActive = false;
        emit SystemStopped(msg.sender, block.timestamp);
    }
    
    function enableAutoDetection() external onlyAdmin {
        autoDetectionEnabled = true;
        emit AutoDetectionEnabled(true);
    }
    
    function disableAutoDetection() external onlyAdmin {
        autoDetectionEnabled = false;
        emit AutoDetectionEnabled(false);
    }
    
    // ==================== IP MANAGEMENT ====================
    
    function _addToBlacklist(string memory _ip) internal {
        blacklistedIPs[_ip] = true;
        networkStats.autoBlockedIPs++;
    }
    
    function manualBlacklist(string memory _ip) external onlyAdmin {
        blacklistedIPs[_ip] = true;
        emit IPBlacklisted(_ip, msg.sender);
    }
    
    function removeFromBlacklist(string memory _ip) external onlyAdmin {
        blacklistedIPs[_ip] = false;
    }
    
    function manualWhitelist(string memory _ip) external onlyAdmin {
        whitelistedIPs[_ip] = true;
        emit IPWhitelisted(_ip, msg.sender);
    }
    
    function removeFromWhitelist(string memory _ip) external onlyAdmin {
        whitelistedIPs[_ip] = false;
    }
    
    function isIPBlacklisted(string memory _ip) public view returns (bool) {
        return blacklistedIPs[_ip];
    }
    
    function isIPWhitelisted(string memory _ip) public view returns (bool) {
        return whitelistedIPs[_ip];
    }
    
    // ==================== AUTO DETECTION & SCANNING ====================
    
    function scanPacket(
        string memory _sourceIP,
        string memory _destinationIP,
        uint256 _port,
        Protocol _protocol
    ) external onlyAdmin systemActive returns (bool allowed) {
        networkStats.totalPacketsScanned++;
        
        // Check whitelist first
        if (whitelistedIPs[_sourceIP]) {
            return true;
        }
        
        // Check blacklist
        if (blacklistedIPs[_sourceIP]) {
            networkStats.threatsBlocked++;
            return false;
        }
        
        // Update traffic data
        IPTraffic storage traffic = ipTrafficData[_sourceIP];
        traffic.connectionCount++;
        traffic.lastAccessTime = block.timestamp;
        traffic.isMonitored = true;
        
        // Auto-detection logic
        if (autoDetectionEnabled) {
            // Calculate suspicion score based on connection patterns
            if (traffic.connectionCount > maxConnectionsPerMinute) {
                traffic.suspicionScore += 100;
            }
            
            // Check for rapid connections
            if (block.timestamp - traffic.lastAccessTime < 1) {
                traffic.suspicionScore += 50;
            }
            
            emit PacketScanned(_sourceIP, traffic.connectionCount, traffic.suspicionScore);
            
            // Auto-block if threshold exceeded
            if (traffic.suspicionScore >= autoBlockThreshold) {
                _autoBlockIP(_sourceIP, traffic.suspicionScore);
                return false;
            }
            
            // Generate alert if suspicious
            if (traffic.suspicionScore >= suspicionThreshold) {
                _generateAlert(_sourceIP, traffic.suspicionScore);
            }
        }
        
        return true;
    }
    
    function _autoBlockIP(string memory _ip, uint256 _score) internal {
        _addToBlacklist(_ip);
        
        threatCounter++;
        threatLogs[threatCounter] = ThreatLog({
            id: threatCounter,
            sourceIP: _ip,
            attackType: "Auto-Detected Suspicious Activity",
            level: ThreatLevel.HIGH,
            timestamp: block.timestamp,
            description: "Automatically blocked due to high suspicion score",
            isBlocked: true,
            connectionAttempts: ipTrafficData[_ip].connectionCount
        });
        
        networkStats.threatsBlocked++;
        emit AutoBlocked(_ip, _score, block.timestamp);
        emit ThreatDetected(threatCounter, _ip, ThreatLevel.HIGH, block.timestamp);
    }
    
    function _generateAlert(string memory _ip, uint256 _score) internal {
        threatCounter++;
        threatLogs[threatCounter] = ThreatLog({
            id: threatCounter,
            sourceIP: _ip,
            attackType: "Suspicious Activity Detected",
            level: ThreatLevel.MEDIUM,
            timestamp: block.timestamp,
            description: "High connection rate detected",
            isBlocked: false,
            connectionAttempts: ipTrafficData[_ip].connectionCount
        });
        
        networkStats.alertsTriggered++;
        emit ThreatDetected(threatCounter, _ip, ThreatLevel.MEDIUM, block.timestamp);
    }
    
    // ==================== MANUAL THREAT LOGGING ====================
    
    function logManualThreat(
        string memory _sourceIP,
        string memory _attackType,
        ThreatLevel _level,
        string memory _description,
        bool _shouldBlock
    ) external onlyAdmin returns (uint256) {
        threatCounter++;
        
        threatLogs[threatCounter] = ThreatLog({
            id: threatCounter,
            sourceIP: _sourceIP,
            attackType: _attackType,
            level: _level,
            timestamp: block.timestamp,
            description: _description,
            isBlocked: _shouldBlock,
            connectionAttempts: ipTrafficData[_sourceIP].connectionCount
        });
        
        if (_shouldBlock) {
            _addToBlacklist(_sourceIP);
            networkStats.threatsBlocked++;
        } else {
            networkStats.alertsTriggered++;
        }
        
        emit ThreatDetected(threatCounter, _sourceIP, _level, block.timestamp);
        return threatCounter;
    }
    
    // ==================== FIREWALL RULES ====================
    
    function createRule(
        string memory _name,
        string memory _sourceIP,
        string memory _destinationIP,
        uint256 _sourcePort,
        uint256 _destinationPort,
        Protocol _protocol,
        RuleAction _action,
        uint256 _priority
    ) external onlyAdmin returns (uint256) {
        ruleCounter++;
        
        firewallRules[ruleCounter] = FirewallRule({
            id: ruleCounter,
            name: _name,
            sourceIP: _sourceIP,
            destinationIP: _destinationIP,
            sourcePort: _sourcePort,
            destinationPort: _destinationPort,
            protocol: _protocol,
            action: _action,
            isActive: true,
            priority: _priority,
            createdAt: block.timestamp,
            createdBy: msg.sender
        });
        
        emit RuleCreated(ruleCounter, _name, _action);
        return ruleCounter;
    }
    
    function updateRuleStatus(uint256 _ruleId, bool _isActive) external onlyAdmin {
        require(_ruleId > 0 && _ruleId <= ruleCounter, "Invalid rule ID");
        firewallRules[_ruleId].isActive = _isActive;
        emit RuleUpdated(_ruleId, _isActive);
    }
    
    function deleteRule(uint256 _ruleId) external onlyAdmin {
        require(_ruleId > 0 && _ruleId <= ruleCounter, "Invalid rule ID");
        delete firewallRules[_ruleId];
        emit RuleDeleted(_ruleId);
    }
    
    function getRule(uint256 _ruleId) external view returns (FirewallRule memory) {
        require(_ruleId > 0 && _ruleId <= ruleCounter, "Invalid rule ID");
        return firewallRules[_ruleId];
    }
    
    // ==================== THRESHOLD MANAGEMENT ====================
    
    function updateMaxConnections(uint256 _newMax) external onlyAdmin {
        maxConnectionsPerMinute = _newMax;
        emit ThresholdUpdated("maxConnectionsPerMinute", _newMax);
    }
    
    function updateSuspicionThreshold(uint256 _newThreshold) external onlyAdmin {
        suspicionThreshold = _newThreshold;
        emit ThresholdUpdated("suspicionThreshold", _newThreshold);
    }
    
    function updateAutoBlockThreshold(uint256 _newThreshold) external onlyAdmin {
        autoBlockThreshold = _newThreshold;
        emit ThresholdUpdated("autoBlockThreshold", _newThreshold);
    }
    
    // ==================== ADMIN MANAGEMENT ====================
    
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        authorizedAdmins[_admin] = true;
        emit AdminAdded(_admin);
    }
    
    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner, "Cannot remove owner");
        authorizedAdmins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    // ==================== VIEW FUNCTIONS ====================
    
    function getThreatLog(uint256 _threatId) external view returns (ThreatLog memory) {
        require(_threatId > 0 && _threatId <= threatCounter, "Invalid threat ID");
        return threatLogs[_threatId];
    }
    
    function getIPTraffic(string memory _ip) external view returns (IPTraffic memory) {
        return ipTrafficData[_ip];
    }
    
    function getNetworkStats() external view returns (NetworkStats memory) {
        return networkStats;
    }
    
    function getRuleCount() external view returns (uint256) {
        return ruleCounter;
    }
    
    function getThreatCount() external view returns (uint256) {
        return threatCounter;
    }
    
    function isAdmin(address _address) external view returns (bool) {
        return authorizedAdmins[_address];
    }
    
    function getSystemStatus() external view returns (
        bool active,
        bool autoDetection,
        uint256 threats,
        uint256 blocked,
        uint256 rules
    ) {
        return (
            isSystemActive,
            autoDetectionEnabled,
            threatCounter,
            networkStats.threatsBlocked,
            ruleCounter
        );
    }
}