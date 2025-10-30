import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Web3 threat patterns and indicators
const WEB3_THREAT_PATTERNS = {
  suspicious_addresses: [
    "0x0000000000000000000000000000000000000000", // Null address
    "0x000000000000000000000000000000000000dead", // Burn address
    // Add known malicious addresses
  ],
  high_risk_contracts: [
    // Known scam contract patterns
    /0x[a-fA-F0-9]{40}/, // Generic contract pattern for analysis
  ],
  suspicious_amounts: {
    min_suspicious: 1000, // ETH
    max_normal: 10000, // ETH
  },
}

// DeFi protocol risk assessment
const DEFI_PROTOCOLS = {
  uniswap: { risk_level: "low", category: "dex" },
  compound: { risk_level: "low", category: "lending" },
  aave: { risk_level: "low", category: "lending" },
  curve: { risk_level: "medium", category: "dex" },
  yearn: { risk_level: "medium", category: "yield" },
  unknown: { risk_level: "high", category: "unknown" },
}

// Smart contract security analysis
function analyzeSmartContract(
  contractAddress: string,
  transactionData: any,
): {
  risk_score: number
  threats: string[]
  recommendations: string[]
} {
  const threats: string[] = []
  const recommendations: string[] = []
  let risk_score = 0

  // Check for known malicious addresses
  if (WEB3_THREAT_PATTERNS.suspicious_addresses.includes(contractAddress.toLowerCase())) {
    threats.push("known_malicious_address")
    risk_score += 50
  }

  // Check for suspicious transaction patterns
  if (transactionData.gas_used > 1000000) {
    threats.push("high_gas_consumption")
    risk_score += 20
    recommendations.push("Review contract complexity and gas optimization")
  }

  // Check for unusual value transfers
  const value = Number.parseFloat(transactionData.value || "0")
  if (value > WEB3_THREAT_PATTERNS.suspicious_amounts.max_normal) {
    threats.push("large_value_transfer")
    risk_score += 30
    recommendations.push("Verify legitimacy of large value transfer")
  }

  // Check for contract creation with suspicious patterns
  if (!transactionData.to_address || transactionData.to_address === "0x") {
    threats.push("contract_creation")
    risk_score += 15
    recommendations.push("Analyze newly created contract for security vulnerabilities")
  }

  return { risk_score: Math.min(risk_score, 100), threats, recommendations }
}

// Blockchain transaction risk assessment
function assessTransactionRisk(transaction: any): {
  risk_level: "low" | "medium" | "high" | "critical"
  risk_score: number
  threat_indicators: string[]
  analysis: any
} {
  let risk_score = 0
  const threat_indicators: string[] = []

  // Analyze smart contract interaction
  const contractAnalysis = analyzeSmartContract(transaction.to_address, transaction)

  risk_score += contractAnalysis.risk_score
  threat_indicators.push(...contractAnalysis.threats)

  // Check transaction frequency (potential bot activity)
  if (transaction.nonce && transaction.nonce > 1000) {
    threat_indicators.push("high_frequency_transactions")
    risk_score += 15
  }

  // Check for MEV (Maximal Extractable Value) patterns
  if (transaction.gas_price && Number.parseFloat(transaction.gas_price) > 100) {
    threat_indicators.push("high_gas_price_mev")
    risk_score += 10
  }

  // Determine risk level
  let risk_level: "low" | "medium" | "high" | "critical"
  if (risk_score >= 80) risk_level = "critical"
  else if (risk_score >= 60) risk_level = "high"
  else if (risk_score >= 30) risk_level = "medium"
  else risk_level = "low"

  return {
    risk_level,
    risk_score,
    threat_indicators,
    analysis: {
      contract_analysis: contractAnalysis,
      transaction_patterns: {
        gas_analysis: {
          gas_used: transaction.gas_used,
          gas_price: transaction.gas_price,
          efficiency_score: Math.max(0, 100 - (transaction.gas_used / 21000) * 10),
        },
        value_analysis: {
          value_eth: transaction.value,
          value_usd: Number.parseFloat(transaction.value || "0") * 2000, // Approximate ETH price
          is_suspicious: Number.parseFloat(transaction.value || "0") > 1000,
        },
      },
    },
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      transaction_hash,
      blockchain,
      from_address,
      to_address,
      value,
      gas_used,
      gas_price,
      transaction_fee,
      block_number,
      nonce,
    } = body

    // Perform risk assessment
    const riskAssessment = assessTransactionRisk(body)

    // Check if transaction already exists
    const { data: existingTx } = await supabase
      .from("web3_transactions")
      .select("id")
      .eq("transaction_hash", transaction_hash)
      .single()

    if (existingTx) {
      return NextResponse.json({
        success: false,
        error: "Transaction already analyzed",
      })
    }

    // Store transaction analysis
    const { data: transaction, error } = await supabase
      .from("web3_transactions")
      .insert({
        transaction_hash,
        blockchain: blockchain || "ethereum",
        from_address,
        to_address,
        value: Number.parseFloat(value || "0"),
        gas_used: Number.parseInt(gas_used || "0"),
        gas_price: Number.parseFloat(gas_price || "0"),
        transaction_fee: Number.parseFloat(transaction_fee || "0"),
        block_number: Number.parseInt(block_number || "0"),
        risk_assessment: riskAssessment.analysis,
        threat_indicators: riskAssessment.threat_indicators,
        is_suspicious: riskAssessment.risk_level === "high" || riskAssessment.risk_level === "critical",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Create security event for high-risk transactions
    if (riskAssessment.risk_level === "high" || riskAssessment.risk_level === "critical") {
      await supabase.from("security_events").insert({
        event_type: "system_alert",
        details: {
          type: "web3_suspicious_transaction",
          transaction_hash,
          blockchain,
          risk_level: riskAssessment.risk_level,
          risk_score: riskAssessment.risk_score,
          threat_indicators: riskAssessment.threat_indicators,
          from_address,
          to_address,
          value,
        },
        risk_score: riskAssessment.risk_score,
      })
    }

    return NextResponse.json({
      success: true,
      transaction_id: transaction.id,
      risk_assessment: {
        risk_level: riskAssessment.risk_level,
        risk_score: riskAssessment.risk_score,
        threat_indicators: riskAssessment.threat_indicators,
        is_suspicious: riskAssessment.risk_level === "high" || riskAssessment.risk_level === "critical",
      },
      analysis: riskAssessment.analysis,
      recommendations: riskAssessment.analysis.contract_analysis.recommendations,
    })
  } catch (error) {
    console.error("Web3 Transaction Analysis Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const blockchain = searchParams.get("blockchain")
    const suspicious_only = searchParams.get("suspicious") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase.from("web3_transactions").select("*").order("created_at", { ascending: false }).limit(limit)

    if (blockchain) {
      query = query.eq("blockchain", blockchain)
    }

    if (suspicious_only) {
      query = query.eq("is_suspicious", true)
    }

    const { data: transactions, error } = await query

    if (error) {
      throw error
    }

    // Get Web3 statistics
    const { data: allTransactions } = await supabase
      .from("web3_transactions")
      .select("blockchain, is_suspicious, threat_indicators, value")

    const statistics = {
      total: allTransactions?.length || 0,
      suspicious: allTransactions?.filter((t) => t.is_suspicious).length || 0,
      by_blockchain:
        allTransactions?.reduce((acc: any, tx) => {
          acc[tx.blockchain] = (acc[tx.blockchain] || 0) + 1
          return acc
        }, {}) || {},
      total_value: allTransactions?.reduce((sum, tx) => sum + (tx.value || 0), 0) || 0,
      threat_types:
        allTransactions?.reduce((acc: any, tx) => {
          tx.threat_indicators?.forEach((threat: string) => {
            acc[threat] = (acc[threat] || 0) + 1
          })
          return acc
        }, {}) || {},
    }

    return NextResponse.json({
      transactions,
      statistics,
    })
  } catch (error) {
    console.error("Error fetching Web3 transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
