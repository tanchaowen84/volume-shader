"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, Cpu } from "lucide-react"

interface QualityControlsProps {
  quality: "low" | "medium" | "high"
  onQualityChange: (quality: "low" | "medium" | "high") => void
  disabled: boolean
}

export function QualityControls({ quality, onQualityChange, disabled }: QualityControlsProps) {
  const qualitySettings = {
    low: {
      label: "Low (L)",
      description: "32 steps, 480p",
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    medium: {
      label: "Medium (M)",
      description: "64 steps, 720p",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
    high: {
      label: "High (H)",
      description: "128 steps, 1080p",
      color: "bg-red-500/20 text-red-400 border-red-500/30",
    },
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Quality Settings</h3>
      </div>

      <div className="space-y-3">
        {Object.entries(qualitySettings).map(([key, setting]) => (
          <Button
            key={key}
            variant={quality === key ? "default" : "outline"}
            className={`w-full justify-start h-auto p-4 ${quality === key ? "neon-glow bg-primary" : "glass-card"}`}
            onClick={() => onQualityChange(key as "low" | "medium" | "high")}
            disabled={disabled}
          >
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <div className="font-semibold">{setting.label}</div>
                <div className="text-xs text-muted-foreground">{setting.description}</div>
              </div>
              <Badge className={setting.color}>{key.toUpperCase()}</Badge>
            </div>
          </Button>
        ))}
      </div>

      <div className="mt-6 p-4 glass-card rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Current Settings</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>• Ray marching steps: {quality === "low" ? "32" : quality === "medium" ? "64" : "128"}</div>
          <div>• Internal resolution: {quality === "low" ? "480p" : quality === "medium" ? "720p" : "1080p"}</div>
          <div>• Lighting: {quality === "high" ? "Enhanced" : "Standard"}</div>
        </div>
      </div>
    </Card>
  )
}
