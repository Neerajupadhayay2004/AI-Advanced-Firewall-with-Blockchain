import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"
import { createClient } from "@/lib/supabase/server"

// Interface for Python ML analysis
interface MLAnalysisRequest {
  payload?: string
  user_agent?: string
  request_path?: string
  source_ip?: string
  method?: string
  headers?: Record<string, string>
}

interface MLAnalysisResponse {
  is_threat: boolean
  threat_type: string
  severity: "low" | "medium" | "high" | "critical"
  risk_score: number
  confidence: number
  ensemble_votes: number
  model_predictions: any
  timestamp: string
  model_version: string
}

// Execute Python ML analysis
function executePythonAnalysis(data: MLAnalysisRequest): Promise<MLAnalysisResponse> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["scripts/advanced_ml_engine.py", "predict"], {
      stdio: ["pipe", "pipe", "pipe"],
    })

    let output = ""
    let errorOutput = ""

    // Send data to Python process
    pythonProcess.stdin.write(JSON.stringify(data))
    pythonProcess.stdin.end()

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          // Parse the last JSON output from Python
          const lines = output.trim().split("\n")
          const jsonLine = lines.find((line) => line.startsWith("{"))

          if (jsonLine) {
            const result = JSON.parse(jsonLine)
            resolve(result)
          } else {
            reject(new Error("No valid JSON output from Python process"))
          }
        } catch (error) {
          reject(new Error(`Failed to parse Python output: ${error}`))
        }
      } else {
        reject(new Error(`Python process failed with code ${code}: ${errorOutput}`))
      }
    })

    pythonProcess.on("error", (error) => {
      reject(new Error(`Failed to start Python process: ${error}`))
    })
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: MLAnalysisRequest = await request.json()

    console.log("[v0] Starting Python ML analysis...")

    // Execute Python ML analysis
    const mlResult = await executePythonAnalysis(body)

    console.log(`[v0] ML Analysis complete: ${mlResult.threat_type} (${mlResult.risk_score}% risk)`)

    // Store analysis result in database
    const { data: analysisRecord, error } = await supabase
      .from("threat_logs")
      .insert({
        threat_type: mlResult.threat_type,
        severity: mlResult.severity,
        source_ip: body.source_ip || "0.0.0.0",
        user_agent: body.user_agent,
        request_path: body.request_path,
        payload: body.payload
          ? {
              raw: body.payload,
              ml_analysis: mlResult.model_predictions,
            }
          : null,
        ai_confidence: mlResult.confidence,
        status: mlResult.is_threat ? "detected" : "allowed",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error storing ML analysis:", error)
    }

    // Create security event for significant threats
    if (mlResult.risk_score > 60) {
      await supabase.from("security_events").insert({
        event_type: "system_alert",
        source_ip: body.source_ip,
        details: {
          type: "ml_threat_detection",
          ml_analysis: mlResult,
          request_data: body,
          analysis_id: analysisRecord?.id,
        },
        risk_score: mlResult.risk_score,
      })
    }

    return NextResponse.json({
      success: true,
      analysis: mlResult,
      stored: !error,
      analysis_id: analysisRecord?.id,
    })
  } catch (error) {
    console.error("[v0] Python ML Analysis Error:", error)
    return NextResponse.json(
      {
        error: "ML analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "status"

    if (action === "train") {
      // Trigger model training
      console.log("[v0] Starting ML model training...")

      const trainingProcess = spawn("python3", ["scripts/advanced_ml_engine.py", "train"])

      return new Promise((resolve) => {
        let output = ""

        trainingProcess.stdout.on("data", (data) => {
          output += data.toString()
          console.log(`[v0] Training: ${data.toString().trim()}`)
        })

        trainingProcess.on("close", (code) => {
          resolve(
            NextResponse.json({
              success: code === 0,
              message: code === 0 ? "Model training completed" : "Training failed",
              output: output,
              exit_code: code,
            }),
          )
        })
      })
    }

    if (action === "metrics") {
      // Get model performance metrics
      const supabase = createClient()

      const { data: metrics, error } = await supabase
        .from("ai_model_metrics")
        .select("*")
        .eq("model_name", "advanced_ml_ensemble")
        .order("evaluation_date", { ascending: false })
        .limit(1)
        .single()

      if (error) {
        return NextResponse.json({ error: "No metrics available" }, { status: 404 })
      }

      return NextResponse.json({ metrics })
    }

    // Default: return status
    return NextResponse.json({
      status: "Python ML Engine Ready",
      version: "v2.0",
      capabilities: [
        "Advanced Anomaly Detection",
        "Multi-Model Threat Classification",
        "Neural Network Analysis",
        "Gradient Boosting Detection",
        "Ensemble Prediction",
        "Real-time Learning",
      ],
    })
  } catch (error) {
    console.error("[v0] Error in Python ML API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
