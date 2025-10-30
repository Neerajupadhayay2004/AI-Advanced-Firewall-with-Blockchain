import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// DeFi protocol configurations
const DEFI_PROTOCOLS = {
  uniswap_v3: {
    name: "Uniswap V3",
    category: "DEX",
    risk_level: "low",
    contract_addresses: ["0x1F98431c8aD98523631AE4a59f267346ea31F984"],
    tvl_threshold: 1000000, // $1M USD
  },
  compound: {
    name: "Compound",
    category: "Lending",
    risk_level: "low",
    contract_addresses: ["0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B"],
    tvl_threshold: 500000,
  },
  aave: {
    name: "Aave",
    category: "Lending",
    risk_level: "low",
    contract_addresses: ["0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"],
    tvl_threshold: 2000000,
  },
}

// DeFi risk assessment
function assessDeFiRisk(
  protocol: string,
  transactionData: any,
): {
  risk_score: number
  risk_factors: string[]
  recommendations: string[]
} {
  const risk_factors: string[] = []
  const recommendations: string[] = []
  let risk_score = 0

  const protocolConfig = DEFI_PROTOCOLS[protocol as keyof typeof DEFI_PROTOCOLS]

  if (!protocolConfig) {
    risk_factors.push("unknown_protocol")
    risk_score += 40
    recommendations.push("Verify protocol legitimacy and audit status")
  } else {
    // Base risk from protocol configuration
    switch (protocolConfig.risk_level) {
      case "high":
        risk_score += 30
        break
      case "medium":
        risk_score += 15
        break
      case "low":
        risk_score += 5
        break
    }
  }

  // Check transaction value against protocol TVL
  const transactionValue = Number.parseFloat(transactionData.value || "0") * 2000 // Approximate USD

  if (protocolConfig && transactionValue > protocolConfig.tvl_threshold * 0.1) {
    risk_factors.push("large_transaction_relative_to_tvl")
    risk_score += 25
    recommendations.push("Monitor for potential market manipulation")
  }

  // Check for flash loan patterns
  if (transactionData.gas_used > 500000) {
    risk_factors.push("complex_transaction_flash_loan_potential")
    risk_score += 20
    recommendations.push("Analyze for flash loan attack patterns")
  }

  // Check for sandwich attack patterns
  if (transactionData.gas_price && Number.parseFloat(transactionData.gas_price) > 50) {
    risk_factors.push("high_gas_price_mev_potential")
    risk_score += 15
    recommendations.push("Monitor for MEV extraction activities")
  }

  return {
    risk_score: Math.min(risk_score, 100),
    risk_factors,
    recommendations,
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      protocol,
      transaction_hash,
      action_type, // 'swap', 'lend', 'borrow', 'stake', 'unstake'
      token_in,
      token_out,
      amount_in,
      amount_out,
      user_address,
      contract_address,
    } = body

    // Perform DeFi risk assessment
    const riskAssessment = assessDeFiRisk(protocol, body)

    // Store DeFi transaction analysis
    const { data: analysis, error } = await supabase
      .from("security_events")
      .insert({
        event_type: "data_access",
        details: {
          type: "defi_transaction",
          protocol,
          transaction_hash,
          action_type,
          token_in,
          token_out,
          amount_in: Number.parseFloat(amount_in || "0"),
          amount_out: Number.parseFloat(amount_out || "0"),
          user_address,
          contract_address,
          risk_assessment: riskAssessment,
          timestamp: new Date().toISOString(),
        },
        risk_score: riskAssessment.risk_score,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Create alert for high-risk DeFi activities
    if (riskAssessment.risk_score > 60) {
      await supabase.from("threat_logs").insert({
        threat_type: "anomaly",
        severity: riskAssessment.risk_score > 80 ? "critical" : "high",
        source_ip: "0.0.0.0", // DeFi transactions don't have traditional IPs
        payload: {
          type: "defi_high_risk",
          protocol,
          transaction_hash,
          risk_factors: riskAssessment.risk_factors,
        },
        ai_confidence: riskAssessment.risk_score / 100,
        status: "detected",
      })
    }

    return NextResponse.json({
      success: true,
      analysis_id: analysis.id,
      risk_assessment: riskAssessment,
      alert_created: riskAssessment.risk_score > 60,
    })
  } catch (error) {
    console.error("DeFi Monitor Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    // Get DeFi activity statistics
    const { data: defiEvents, error } = await supabase
      .from("security_events")
      .select("details, risk_score, created_at")
      .eq("event_type", "data_access")
      .like("details->>type", "defi_%")
      .order("created_at", { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    // Process statistics
    const protocolStats = defiEvents?.reduce((acc: any, event) => {
      const protocol = event.details?.protocol || "unknown"
      if (!acc[protocol]) {
        acc[protocol] = {
          total_transactions: 0,
          high_risk_transactions: 0,
          total_volume: 0,
          avg_risk_score: 0,
        }
      }

      acc[protocol].total_transactions += 1
      if (event.risk_score > 60) {
        acc[protocol].high_risk_transactions += 1
      }

      const amountIn = event.details?.amount_in || 0
      acc[protocol].total_volume += amountIn
      acc[protocol].avg_risk_score += event.risk_score

      return acc
    }, {})

    // Calculate averages
    Object.keys(protocolStats || {}).forEach((protocol) => {
      protocolStats[protocol].avg_risk_score =
        protocolStats[protocol].avg_risk_score / protocolStats[protocol].total_transactions
    })

    return NextResponse.json({
      protocol_statistics: protocolStats,
      recent_activities: defiEvents?.slice(0, 20),
      total_protocols: Object.keys(protocolStats || {}).length,
      total_transactions: defiEvents?.length || 0,
    })
  } catch (error) {
    console.error("Error fetching DeFi statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
