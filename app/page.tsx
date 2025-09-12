"use client"

import { useState } from "react"
import { VolumeRenderer } from "@/components/volume-renderer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Square, Zap } from "lucide-react"

export default function HomePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium")
  const [score, setScore] = useState(0)
  const [grade, setGrade] = useState("Basic")
  const [frameTime, setFrameTime] = useState(0)

  const handleStart = () => {
    setIsRunning(true)
    setScore(0)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary neon-glow" />
              <h1 className="text-2xl font-bold neon-text">Volume Shader Benchmark</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-bold mb-4 text-white neon-text">Volume Shader Test</h2>
            <p className="text-xl text-muted-foreground">Real-time GPU Performance Benchmark</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                {/* Quality Selector - Left */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Quality:</span>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((q) => (
                      <Button
                        key={q}
                        variant={quality === q ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuality(q)}
                        disabled={isRunning}
                        className={quality === q ? "neon-glow" : ""}
                      >
                        {q.charAt(0).toUpperCase() + q.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Score and Grade - Center */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary neon-text">{Math.round(score)}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary neon-text">{grade}</div>
                    <div className="text-xs text-muted-foreground">Grade</div>
                  </div>
                </div>

                {/* Start Button - Right */}
                <Button
                  onClick={isRunning ? handleStop : handleStart}
                  className={`${isRunning ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"} neon-glow`}
                >
                  {isRunning ? (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Stop Test
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <div className="h-[500px] rounded-lg overflow-hidden border border-border">
                <VolumeRenderer
                  isRunning={isRunning}
                  quality={quality}
                  onPerformanceUpdate={(fps, frameTime) => {
                    setFrameTime(frameTime)
                    // Calculate score based on performance
                    const newScore = Math.min(100, Math.max(0, (fps / 60) * 100))
                    setScore(newScore)

                    // Update grade
                    if (newScore >= 90) setGrade("Platinum")
                    else if (newScore >= 75) setGrade("Gold")
                    else if (newScore >= 60) setGrade("Silver")
                    else if (newScore >= 45) setGrade("Bronze")
                    else setGrade("Basic")
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
