"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Shield, Coins, Lock, AlertTriangle, Eye } from "lucide-react"

interface SmartContract {
  address: string
  name: string
  network: string
  risk_score: number
  vulnerabilities: number
  last_audit: string
  status: "Safe" | "Warning" | "Critical"
}

interface DeFiProtocol {
  name: string
  tvl: string
  risk_level: "Low" | "Medium" | "High"
  audit_status: string
  last_incident: string
  security_score: number
}

interface Web3Transaction {
  hash: string
  from: string
  to: string
  value: string
  gas_used: string
  risk_level: "Low" | "Medium" | "High" | "Critical"
  timestamp: string
  flags: string[]
}

export function Web3Security() {
  const [smartContracts] = useState<SmartContract[]>([
    {
      address: "0x1234...5678",
      name: "DeFi Lending Pool",
      network: "Ethereum",
      risk_score: 23,
      vulnerabilities: 2,
      last_audit: "2024-01-10",
      status: "Safe",
    },
    {
      address: "0xabcd...efgh",
      name: "NFT Marketplace",
      network: "Polygon",
      risk_score: 67,
      vulnerabilities: 5,
      last_audit: "2023-12-15",
      status: "Warning",
    },
    {
      address: "0x9876...5432",
      name: "Token Bridge",
      network: "BSC",
      risk_score: 89,
      vulnerabilities: 8,
      last_audit: "2023-11-20",
      status: "Critical",
    },
  ])

  const [defiProtocols] = useState<DeFiProtocol[]>([
    {
      name: "Uniswap V3",
      tvl: "$4.2B",
      risk_level: "Low",
      audit_status: "Multiple audits",
      last_incident: "None",
      security_score: 95,
    },
    {
      name: "Compound",
      tvl: "$2.8B",
      risk_level: "Low",
      audit_status: "Audited",
      last_incident: "2023-08-15",
      security_score: 88,
    },
    {
      name: "Yearn Finance",
      tvl: "$1.1B",
      risk_level: "Medium",
      audit_status: "Audited",
      last_incident: "2023-09-22",
      security_score: 82,
    },
  ])

  const [web3Transactions, setWeb3Transactions] = useState<Web3Transaction[]>([
    {
      hash: "0xabc123...def456",
      from: "0x1234...5678",
      to: "0x9876...5432",
      value: "10.5 ETH",
      gas_used: "21,000",
      risk_level: "Low",
      timestamp: "2024-01-15 14:23:45",
      flags: [],
    },
    {
      hash: "0xdef789...abc012",
      from: "0x5555...6666",
      to: "0x7777...8888",
      value: "1000 USDC",
      gas_used: "45,000",
      risk_level: "High",
      timestamp: "2024-01-15 14:22:12",
      flags: ["Suspicious Pattern", "High Value"],
    },
  ])

  const [web3Stats, setWeb3Stats] = useState({
    totalContracts: 1247,
    vulnerableContracts: 89,
    monitoredProtocols: 156,
    suspiciousTransactions: 23,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setWeb3Stats((prev) => ({
        ...prev,
        suspiciousTransactions: Math.max(0, prev.suspiciousTransactions + Math.floor(Math.random() * 3) - 1),
      }))

      // Simulate new suspicious transactions
      if (Math.random() > 0.8) {
        const newTx: Web3Transaction = {
          hash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 6)}`,
          from: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          to: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`,
          value: `${(Math.random() * 100).toFixed(1)} ETH`,
          gas_used: `${Math.floor(Math.random() * 100000).toLocaleString()}`,
          risk_level: ["Low", "Medium", "High", "Critical"][Math.floor(Math.random() * 4)] as any,
          timestamp: new Date().toLocaleString(),
          flags: Math.random() > 0.5 ? ["Automated Detection"] : [],
        }
        setWeb3Transactions((prev) => [newTx, ...prev.slice(0, 9)])
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "text-red-400"
      case "High":
        return "text-orange-400"
      case "Medium":
        return "text-yellow-400"
      case "Low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "default"
      case "Warning":
        return "secondary"
      case "Critical":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
            <Globe className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{web3Stats.totalContracts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monitored contracts</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{web3Stats.vulnerableContracts}</div>
            <p className="text-xs text-muted-foreground">Contracts with issues</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DeFi Protocols</CardTitle>
            <Coins className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{web3Stats.monitoredProtocols}</div>
            <p className="text-xs text-muted-foreground">Under surveillance</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Txns</CardTitle>
            <Eye className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{web3Stats.suspiciousTransactions}</div>
            <p className="text-xs text-muted-foreground">Flagged transactions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="defi">DeFi Protocols</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Smart Contract Security</CardTitle>
              <CardDescription>Monitored smart contracts and their security status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {smartContracts.map((contract, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getStatusColor(contract.status) as any}>{contract.status}</Badge>
                        <Badge variant="outline">{contract.network}</Badge>
                        <span className="text-sm text-muted-foreground">{contract.address}</span>
                      </div>
                      <div className="font-medium mb-1">{contract.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Risk Score: {contract.risk_score}/100 • Vulnerabilities: {contract.vulnerabilities} • Last
                        Audit: {contract.last_audit}
                      </div>
                      <Progress value={100 - contract.risk_score} className="mt-2 h-2" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Audit
                      </Button>
                      {contract.status === "Critical" && (
                        <Button variant="destructive" size="sm">
                          <Lock className="h-4 w-4 mr-2" />
                          Quarantine
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defi">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>DeFi Protocol Monitoring</CardTitle>
              <CardDescription>Security assessment of major DeFi protocols</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defiProtocols.map((protocol, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={getRiskColor(protocol.risk_level)}>
                          {protocol.risk_level} Risk
                        </Badge>
                        <span className="font-medium">{protocol.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        TVL: {protocol.tvl} • {protocol.audit_status} • Last Incident: {protocol.last_incident}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Security Score:</span>
                        <Progress value={protocol.security_score} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{protocol.security_score}%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Monitor
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Suspicious Transactions</CardTitle>
              <CardDescription>Real-time monitoring of Web3 transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {web3Transactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className={getRiskColor(tx.risk_level)}>
                          {tx.risk_level} Risk
                        </Badge>
                        {tx.flags.map((flag, flagIndex) => (
                          <Badge key={flagIndex} variant="destructive" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                      <div className="font-mono text-sm mb-1">{tx.hash}</div>
                      <div className="text-sm text-muted-foreground">
                        {tx.from} → {tx.to} • {tx.value} • Gas: {tx.gas_used} • {tx.timestamp}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Analyze
                      </Button>
                      {tx.risk_level === "High" || tx.risk_level === "Critical" ? (
                        <Button variant="destructive" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Flag
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Network Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Ethereum</span>
                    <span className="text-primary">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>Polygon</span>
                    <span className="text-green-400">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>BSC</span>
                    <span className="text-yellow-400">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span>Others</span>
                    <span className="text-muted-foreground">9%</span>
                  </div>
                  <Progress value={9} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Contracts Audited</span>
                  <span className="text-green-400">1,158 / 1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical Vulnerabilities</span>
                  <span className="text-red-400">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Security Score</span>
                  <span className="text-primary">87.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Incidents Prevented</span>
                  <span className="text-green-400">234</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
