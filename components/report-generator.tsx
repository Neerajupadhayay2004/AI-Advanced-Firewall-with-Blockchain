"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Download,
  BarChart3,
  Shield,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
} from "lucide-react"

interface ReportData {
  id: string
  title: string
  type: "security" | "compliance" | "incident" | "executive" | "custom"
  status: "generating" | "completed" | "failed"
  createdAt: string
  generatedBy: string
  size: string
  format: "pdf" | "json" | "csv" | "html"
  data: any
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  sections: string[]
  estimatedTime: string
}

export function ReportGenerator() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [reportTitle, setReportTitle] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [selectedSections, setSelectedSections] = useState<string[]>([])
  const [reportFormat, setReportFormat] = useState<"pdf" | "json" | "csv" | "html">("pdf")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })

  const reportTemplates: ReportTemplate[] = [
    {
      id: "security-summary",
      name: "Security Summary Report",
      description: "Comprehensive overview of security posture and threat landscape",
      type: "security",
      sections: [
        "Executive Summary",
        "Threat Analysis",
        "Incident Overview",
        "Firewall Performance",
        "Vulnerability Assessment",
        "Recommendations",
      ],
      estimatedTime: "2-3 minutes",
    },
    {
      id: "compliance-audit",
      name: "Compliance Audit Report",
      description: "Detailed compliance status against security frameworks",
      type: "compliance",
      sections: [
        "Compliance Overview",
        "NIST Framework Status",
        "ISO 27001 Assessment",
        "SOC 2 Compliance",
        "GDPR Compliance",
        "Remediation Plan",
      ],
      estimatedTime: "3-4 minutes",
    },
    {
      id: "incident-response",
      name: "Incident Response Report",
      description: "Detailed analysis of security incidents and response actions",
      type: "incident",
      sections: [
        "Incident Timeline",
        "Impact Assessment",
        "Response Actions",
        "Root Cause Analysis",
        "Lessons Learned",
        "Prevention Measures",
      ],
      estimatedTime: "4-5 minutes",
    },
    {
      id: "executive-dashboard",
      name: "Executive Dashboard Report",
      description: "High-level security metrics and KPIs for leadership",
      type: "executive",
      sections: [
        "Security Posture Overview",
        "Key Performance Indicators",
        "Risk Assessment",
        "Budget Impact",
        "Strategic Recommendations",
      ],
      estimatedTime: "1-2 minutes",
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence Report",
      description: "Advanced threat analysis and intelligence briefing",
      type: "security",
      sections: [
        "Threat Landscape",
        "Attack Vectors",
        "Threat Actor Analysis",
        "IOCs and TTPs",
        "Predictive Analysis",
        "Mitigation Strategies",
      ],
      estimatedTime: "5-6 minutes",
    },
  ]

  useEffect(() => {
    // Load existing reports
    const sampleReports: ReportData[] = [
      {
        id: "rpt_001",
        title: "Weekly Security Summary",
        type: "security",
        status: "completed",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        generatedBy: "System Admin",
        size: "2.4 MB",
        format: "pdf",
        data: { threats: 47, incidents: 3, compliance: 94 },
      },
      {
        id: "rpt_002",
        title: "Q4 Compliance Audit",
        type: "compliance",
        status: "completed",
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        generatedBy: "Compliance Officer",
        size: "5.1 MB",
        format: "pdf",
        data: { nist: 89, iso27001: 92, soc2: 96 },
      },
      {
        id: "rpt_003",
        title: "Critical Incident Analysis",
        type: "incident",
        status: "generating",
        createdAt: new Date().toISOString(),
        generatedBy: "Security Analyst",
        size: "Calculating...",
        format: "html",
        data: { severity: "high", affected_systems: 12 },
      },
    ]
    setReports(sampleReports)
  }, [])

  const generateReport = async () => {
    if (!selectedTemplate || !reportTitle) {
      alert("Please select a template and enter a report title")
      return
    }

    console.log("[v0] Starting report generation...")
    setIsGenerating(true)

    const template = reportTemplates.find((t) => t.id === selectedTemplate)
    const newReport: ReportData = {
      id: `rpt_${Date.now()}`,
      title: reportTitle,
      type: (template?.type as any) || "custom",
      status: "generating",
      createdAt: new Date().toISOString(),
      generatedBy: "Current User",
      size: "Generating...",
      format: reportFormat,
      data: {
        template: selectedTemplate,
        sections: selectedSections,
        dateRange,
        description: reportDescription,
      },
    }

    setReports((prev) => [newReport, ...prev])

    // Simulate report generation process
    try {
      // Simulate API call to Python backend
      await simulateReportGeneration(newReport)

      // Update report status
      setReports((prev) =>
        prev.map((report) =>
          report.id === newReport.id
            ? {
                ...report,
                status: "completed" as const,
                size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
                data: {
                  ...report.data,
                  generatedSections: selectedSections.length || template?.sections.length || 0,
                  totalPages: Math.floor(Math.random() * 50) + 20,
                  charts: Math.floor(Math.random() * 10) + 5,
                  tables: Math.floor(Math.random() * 8) + 3,
                },
              }
            : report,
        ),
      )

      console.log("[v0] Report generation completed successfully")
    } catch (error) {
      console.error("[v0] Report generation failed:", error)
      setReports((prev) =>
        prev.map((report) => (report.id === newReport.id ? { ...report, status: "failed" as const } : report)),
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const simulateReportGeneration = async (report: ReportData): Promise<void> => {
    const template = reportTemplates.find((t) => t.id === selectedTemplate)
    const sections = selectedSections.length > 0 ? selectedSections : template?.sections || []

    console.log(`[v0] Generating report: ${report.title}`)
    console.log(`[v0] Template: ${template?.name}`)
    console.log(`[v0] Sections: ${sections.join(", ")}`)
    console.log(`[v0] Format: ${reportFormat}`)

    // Simulate processing time
    const processingTime = Math.random() * 3000 + 2000 // 2-5 seconds
    await new Promise((resolve) => setTimeout(resolve, processingTime))

    // Simulate calling Python backend for data analysis
    console.log("[v0] Calling Python backend for threat analysis...")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Generating charts and visualizations...")
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Compiling final report...")
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const downloadReport = (report: ReportData) => {
    console.log(`[v0] Downloading report: ${report.title}`)
    // In a real implementation, this would trigger a file download
    alert(`Downloading ${report.title} (${report.size})`)
  }

  const deleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((report) => report.id !== reportId))
    console.log(`[v0] Deleted report: ${reportId}`)
  }

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = reportTemplates.find((t) => t.id === templateId)
    if (template) {
      setReportTitle(template.name)
      setReportDescription(template.description)
      setSelectedSections(template.sections)
    }
  }

  const handleSectionToggle = (section: string, checked: boolean) => {
    if (checked) {
      setSelectedSections((prev) => [...prev, section])
    } else {
      setSelectedSections((prev) => prev.filter((s) => s !== section))
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "generating":
        return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "generating":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4" />
      case "compliance":
        return <CheckCircle className="h-4 w-4" />
      case "incident":
        return <AlertTriangle className="h-4 w-4" />
      case "executive":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="cyber-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Security Report Generator</CardTitle>
                <p className="text-sm text-muted-foreground">Generate comprehensive security and compliance reports</p>
              </div>
            </div>
            <Badge variant="outline" className="text-primary">
              {reports.length} Reports Generated
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="reports">Report Library</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Configuration */}
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Report Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report template" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(template.type)}
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Report Title</Label>
                  <Input
                    id="title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="Enter report title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Enter report description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-date">From Date</Label>
                    <Input
                      id="from-date"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-date">To Date</Label>
                    <Input
                      id="to-date"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={reportFormat} onValueChange={(value: any) => setReportFormat(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="html">HTML Report</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                      <SelectItem value="csv">CSV Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateReport}
                  disabled={isGenerating || !selectedTemplate || !reportTitle}
                  className="w-full cyber-glow"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Report Sections */}
            <Card className="cyber-glow">
              <CardHeader>
                <CardTitle>Report Sections</CardTitle>
                <p className="text-sm text-muted-foreground">Select which sections to include in your report</p>
              </CardHeader>
              <CardContent>
                {selectedTemplate && (
                  <div className="space-y-3">
                    {reportTemplates
                      .find((t) => t.id === selectedTemplate)
                      ?.sections.map((section) => (
                        <div key={section} className="flex items-center space-x-2">
                          <Checkbox
                            id={section}
                            checked={selectedSections.includes(section)}
                            onCheckedChange={(checked) => handleSectionToggle(section, checked as boolean)}
                          />
                          <Label htmlFor={section} className="text-sm">
                            {section}
                          </Label>
                        </div>
                      ))}
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center justify-between mb-1">
                          <span>Estimated Generation Time:</span>
                          <span className="font-medium">
                            {reportTemplates.find((t) => t.id === selectedTemplate)?.estimatedTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Selected Sections:</span>
                          <span className="font-medium">{selectedSections.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!selectedTemplate && (
                  <div className="text-center py-8 text-muted-foreground">Select a template to configure sections</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="cyber-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Report Library
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reports generated yet. Create your first report to get started.
                  </div>
                ) : (
                  reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg cyber-glow">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(report.type)}
                          {getStatusIcon(report.status)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                            <span>By: {report.generatedBy}</span>
                            <span>Size: {report.size}</span>
                            <Badge variant="outline" className={getStatusColor(report.status)}>
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {report.status === "completed" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => downloadReport(report)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Preview
                            </Button>
                          </>
                        )}
                        {report.status === "generating" && (
                          <div className="flex items-center space-x-2 text-sm text-yellow-400">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteReport(report.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cyber-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(template.type)}
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{template.type.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Included Sections:</h4>
                    <div className="space-y-1">
                      {template.sections.map((section) => (
                        <div key={section} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Estimated Time: {template.estimatedTime}</span>
                    <Button variant="outline" size="sm" onClick={() => handleTemplateChange(template.id)}>
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
