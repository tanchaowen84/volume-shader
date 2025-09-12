"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Clock } from "lucide-react"

interface PerformancePanelProps {
  score: number
  grade: string
  frameTime: number
  isRunning: boolean
}

export function PerformancePanel({ score, grade, frameTime, isRunning }: PerformancePanelProps) {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "Platinum":
        return "bg-gradient-to-r from-gray-300 to-gray-100 text-black"
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-200 text-black"
      case "Silver":
        return "bg-gradient-to-r from-gray-400 to-gray-300 text-black"
      case "Bronze":
        return "bg-gradient-to-r from-orange-400 to-orange-300 text-black"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPerformanceLabel = (score: number) => {
    if (score >= 75) return { label: "流畅", color: "text-green-400" }
    if (score >= 45) return { label: "可用", color: "text-yellow-400" }
    return { label: "吃力", color: "text-red-400" }
  }

  const performanceLabel = getPerformanceLabel(score)

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Performance Metrics</h3>
      </div>

      <div className="space-y-6">
        {/* Cloud Score */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Cloud Score</span>
            <span className="text-2xl font-bold text-primary neon-text">{Math.round(score)}</span>
          </div>
          <Progress value={score} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">0-100 Scale</div>
        </div>

        {/* Grade */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Grade</span>
            <Badge className={`${getGradeColor(grade)} font-bold`}>{grade}</Badge>
          </div>
        </div>

        {/* Performance Label */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Smoothness</span>
            <span className={`font-semibold ${performanceLabel.color}`}>{performanceLabel.label}</span>
          </div>
        </div>

        {/* Frame Time */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Frame Time</span>
          </div>
          <div className="text-lg font-mono">{frameTime.toFixed(2)}ms</div>
        </div>

        {/* Status */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-sm text-muted-foreground">
              {isRunning ? "Testing in progress..." : "Ready to test"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
