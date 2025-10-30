"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  Brain,
  Cpu,
  Database,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Activity,
  BarChart3,
} from "lucide-react"

interface TrainingJob {
  id: string
  modelName: string
  type: "neural_network" | "random_forest" | "svm" | "deep_learning"
  status: "queued" | "training" | "completed" | "failed"
  progress: number
  accuracy: number
  datasetSize: string
  startTime: string
  estimatedTime: string
  gpuUsage: number
}

interface Dataset {
  id: string
  name: string
  size: string
  type: "threat_samples" | "network_traffic" | "malware_signatures" | "behavioral_patterns"
  lastUpdated: string
  quality: number
}

export function MLTrainingCenter() {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([
    {
      id: "JOB-001",
      modelName: "Advanced Threat Detector v4.0",
      type: "deep_learning",
      status: "training",
      progress: 67,
      accuracy: 97.8,
      datasetSize: "2.3TB",
      startTime: "2024-01-15T10:00:00Z",
      estimatedTime: "2 hours",
      gpuUsage: 89,
    },
    {
      id: "JOB-002",
      modelName: "Behavioral Analysis Engine",
      type: "random_forest",
      status: "completed",
      progress: 100,
      accuracy: 95.4,
      datasetSize: "1.8TB",
      startTime: "2024-01-14T08:00:00Z",
      estimatedTime: "Completed",
      gpuUsage: 0,
    },
  ])

  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "DS-001",
      name: "Global Threat Intelligence",
      size: "4.2TB",
      type: "threat_samples",
      lastUpdated: "2024-01-15T12:00:00Z",
      quality: 98.5,
    },
    {
      id: "DS-002",
      name: "Network Traffic Patterns",
      size: "3.1TB",
      type: "network_traffic",
      lastUpdated: "2024-01-14T16:30:00Z",
      quality: 96.2,
    },
    {
      id: "DS-003",
      name: "Malware Signature Database",
      size: "1.9TB",
      type: "malware_signatures",
      lastUpdated: "2024-01-13T14:15:00Z",
      quality: 99.1,
    },
  ])

  const [systemMetrics, setSystemMetrics] = useState({
    totalGPUs: 8,
    activeGPUs: 6,
    totalMemory: "512GB",
    usedMemory: "347GB",
    trainingQueue: 3,
    completedJobs: 47,
    avgAccuracy: 97.2,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainingJobs((prev) =>
        prev.map((job) => {
          if (job.status === "training") {
            const newProgress = Math.min(100, job.progress + Math.random() * 2)
            const newAccuracy = Math.min(99.9, job.accuracy + Math.random() * 0.1)
            const newGpuUsage = Math.max(70, Math.min(95, job.gpuUsage + (Math.random() - 0.5) * 5))

            return {
              ...job,
              progress: newProgress,
              accuracy: newAccuracy,
              gpuUsage: newGpuUsage,
              status: newProgress >= 100 ? "completed" : "training",
            }
          }
          return job
        }),
      )

      setSystemMetrics((prev) => ({
        ...prev,
        usedMemory: `${Math.floor(Math.random() * 100) + 300}GB`,
        activeGPUs: Math.floor(Math.random() * 2) + 6,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const startTraining = async (modelType: string) => {
    const newJob: TrainingJob = {
      id: `JOB-${Date.now()}`,
      modelName: `${modelType} Model v${Math.floor(Math.random() * 10) + 1}.0`,
      type: modelType as any,
      status: "training",
      progress: 0,
      accuracy: 85 + Math.random() * 10,
      datasetSize: `${(Math.random() * 3 + 1).toFixed(1)}TB`,
      startTime: new Date().toISOString(),
      estimatedTime: `${Math.floor(Math.random() * 6) + 2} hours`,
      gpuUsage: Math.floor(Math.random() * 20) + 75,
    }

    setTrainingJobs((prev) => [newJob, ...prev])
    console.log(`[v0] Started training job: ${newJob.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "training":
        return "text-blue-400 bg-blue-400/10"
      case "completed":
        return "text-green-400 bg-green-400/10"
      case "failed":
        return "text-red-400 bg-red-400/10"
      case "queued":
        return "text-yellow-400 bg-yellow-400/10"
      default:
        return "text-gray-400 bg-gray-400/10"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Brain className="h-8 w-8 text-primary cyber-glow" />
          <div>
            <h2 className="text-2xl font-bold">ML Training Center</h2>
            <p className="text-muted-foreground">Advanced machine learning model training and optimization</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-400">
            <Activity className="h-3 w-3 mr-1" />
            {systemMetrics.activeGPUs}/{systemMetrics.totalGPUs} GPUs Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Training Jobs</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {trainingJobs.filter((j) => j.status === "training").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPU Utilization</CardTitle>
            <Cpu className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {Math.floor((systemMetrics.activeGPUs / systemMetrics.totalGPUs) * 100)}%
            </div>
            <Progress value={(systemMetrics.activeGPUs / systemMetrics.totalGPUs) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{systemMetrics.usedMemory}</div>
            <p className="text-xs text-muted-foreground">of {systemMetrics.totalMemory}</p>
          </CardContent>
        </Card>

        <Card className="cyber-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Model Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{systemMetrics.avgAccuracy}%</div>
            <p className="text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="training" className="space-y-4">
        <TabsList>
          <TabsTrigger value="training">Training Jobs</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="models">Model Library</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Training Jobs</h3>
            <div className="flex space-x-2">
              <Button onClick={() => startTraining("deep_learning")} className="cyber-glow">
                <Play className="h-4 w-4 mr-2" />
                Start Deep Learning
              </Button>
              <Button onClick={() => startTraining("neural_network")} variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Start Neural Network
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {trainingJobs.map((job) => (
              <Card key={job.id} className="cyber-glow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{job.modelName}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {job.type.replace("_", " ")} • Dataset: {job.datasetSize}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(job.status)}>{job.status.toUpperCase()}</Badge>
                      {job.status === "training" && (
                        <Badge variant="outline" className="text-blue-400">
                          GPU: {job.gpuUsage}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>{job.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Accuracy: </span>
                        <span className="font-medium text-green-400">{job.accuracy.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Started: </span>
                        <span className="font-medium">{new Date(job.startTime).toLocaleTimeString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ETA: </span>
                        <span className="font-medium">{job.estimatedTime}</span>
                      </div>
                    </div>

                    {job.status === "training" && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    )}

                    {job.status === "completed" && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download Model
                        </Button>
                        <Button variant="outline" size="sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="datasets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Training Datasets</h3>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="cyber-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{dataset.name}</CardTitle>
                    <Badge variant="outline" className="text-blue-400 capitalize">
                      {dataset.type.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Size</span>
                    <span className="font-medium">{dataset.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quality Score</span>
                    <span className="font-medium text-green-400">{dataset.quality}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated: {new Date(dataset.lastUpdated).toLocaleDateString()}
                  </div>
                  <Progress value={dataset.quality} className="h-2" />
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Update
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle>Model Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p>Model library management interface</p>
                <p className="text-sm">Deploy, version, and manage trained models</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Training Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { epoch: 1, accuracy: 85.2, loss: 0.45 },
                        { epoch: 5, accuracy: 89.1, loss: 0.32 },
                        { epoch: 10, accuracy: 92.4, loss: 0.24 },
                        { epoch: 15, accuracy: 94.8, loss: 0.18 },
                        { epoch: 20, accuracy: 96.2, loss: 0.14 },
                        { epoch: 25, accuracy: 97.1, loss: 0.11 },
                        { epoch: 30, accuracy: 97.8, loss: 0.09 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="epoch" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981" }}
                      />
                      <Line type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={2} dot={{ fill: "#EF4444" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { time: "00:00", gpu: 45, memory: 62, cpu: 34 },
                        { time: "04:00", gpu: 67, memory: 71, cpu: 45 },
                        { time: "08:00", gpu: 89, memory: 85, cpu: 67 },
                        { time: "12:00", gpu: 92, memory: 88, cpu: 72 },
                        { time: "16:00", gpu: 87, memory: 82, cpu: 65 },
                        { time: "20:00", gpu: 75, memory: 76, cpu: 54 },
                        { time: "24:00", gpu: 68, memory: 69, cpu: 48 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="gpu"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="memory"
                        stackId="1"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="cpu"
                        stackId="1"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
