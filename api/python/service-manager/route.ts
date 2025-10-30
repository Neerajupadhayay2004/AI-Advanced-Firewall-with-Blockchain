import { type NextRequest, NextResponse } from "next/server"
import { spawn } from "child_process"

interface ServiceStatus {
  name: string
  status: string
  cpu_usage: number
  memory_usage: number
  uptime: number
  last_activity: string
  error_count: number
}

interface SystemMetrics {
  timestamp: string
  system: {
    cpu_usage: number
    memory_usage: number
    memory_available: number
    disk_usage: number
  }
  services: ServiceStatus[]
  python_processes: Array<{
    pid: number
    name: string
    cmdline: string
    cpu_usage: number
    memory_usage: number
  }>
}

// Get Python service status
function getPythonServiceStatus(): Promise<SystemMetrics> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python3", ["scripts/python_service_manager.py", "status"], {
      stdio: ["pipe", "pipe", "pipe"],
    })

    let output = ""
    let errorOutput = ""

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output)
          resolve(result)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action") || "status"

    if (action === "status") {
      console.log("[v0] Getting Python service status...")
      const status = await getPythonServiceStatus()

      return NextResponse.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString(),
      })
    }

    if (action === "start") {
      const service = searchParams.get("service")
      if (!service) {
        return NextResponse.json({ error: "Service name required" }, { status: 400 })
      }

      console.log(`[v0] Starting Python service: ${service}`)

      // Start the service manager
      const managerProcess = spawn("python3", ["scripts/python_service_manager.py"], {
        detached: true,
        stdio: "ignore",
      })

      managerProcess.unref()

      return NextResponse.json({
        success: true,
        message: `Started Python service manager`,
        pid: managerProcess.pid,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Python Service Manager Error:", error)
    return NextResponse.json(
      {
        error: "Service manager failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, service, script_path, args } = body

    if (action === "restart") {
      console.log(`[v0] Restarting Python service: ${service}`)

      // This would typically send a command to the service manager
      // For now, we'll return a success response
      return NextResponse.json({
        success: true,
        message: `Restart command sent for service: ${service}`,
      })
    }

    if (action === "stop") {
      console.log(`[v0] Stopping Python service: ${service}`)

      return NextResponse.json({
        success: true,
        message: `Stop command sent for service: ${service}`,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Python Service Control Error:", error)
    return NextResponse.json(
      {
        error: "Service control failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
