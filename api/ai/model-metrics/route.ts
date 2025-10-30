import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// AI Model Performance Tracking
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      model_name,
      model_version,
      accuracy,
      precision_score,
      recall,
      f1_score,
      false_positive_rate,
      false_negative_rate,
    } = body

    // Update model metrics
    const { data, error } = await supabase
      .from("ai_model_metrics")
      .upsert({
        model_name,
        model_version,
        accuracy,
        precision_score,
        recall,
        f1_score,
        false_positive_rate,
        false_negative_rate,
        evaluation_date: new Date().toISOString(),
        is_active: true,
      })
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      metrics: data,
    })
  } catch (error) {
    console.error("Error updating model metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    const { data: metrics, error } = await supabase
      .from("ai_model_metrics")
      .select("*")
      .eq("is_active", true)
      .order("evaluation_date", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("Error fetching model metrics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
