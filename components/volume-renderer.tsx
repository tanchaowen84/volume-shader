"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { VolumeRendererScene } from "./volume-renderer-scene"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Square } from "lucide-react"

export function VolumeRenderer() {
  const [isRunning, setIsRunning] = useState(false)
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium")
  const [score, setScore] = useState(0)
  const [fps, setFps] = useState(0)
  const [grade, setGrade] = useState("Basic")

  const handleStart = () => {
    setIsRunning(true)
    setScore(0)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  return (
    <Card className="glass-card p-6">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
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
            <div className="text-2xl font-bold neon-text">{Math.round(fps)}</div>
            <div className="text-xs text-muted-foreground">FPS</div>
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

      {/* 3D Canvas */}
      <div className="h-[500px] rounded-lg overflow-hidden border border-border relative">
        {(() => {
          const dprRange = quality === 'low' ? [1, 1.25] : quality === 'medium' ? [1.5, 2] : [2, 2]
          return (
            <Canvas
              camera={{ position: [1.25, 0.8, 2.0], fov: 58 }}
              gl={{ antialias: true, alpha: true }}
              dpr={dprRange}
            >
              <VolumeRendererScene
                isRunning={isRunning}
                quality={quality}
                onPerformanceUpdate={(fpsVal, frameTime) => {
                  setFps(fpsVal)
                  const newScore = Math.min(100, Math.max(0, (fpsVal / 60) * 100))
                  setScore(newScore)
                  if (newScore >= 90) setGrade("Platinum")
                  else if (newScore >= 75) setGrade("Gold")
                  else if (newScore >= 60) setGrade("Silver")
                  else if (newScore >= 45) setGrade("Bronze")
                  else setGrade("Basic")
                }}
              />
            </Canvas>
          )
        })()}
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/volume-shader.png')" }}
            />
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            {/* Content */}
            <div className="relative text-center z-10">
              <p className="text-white/90 text-lg font-medium drop-shadow-lg">
                Click Start Test to begin real-time volume rendering
              </p>
              <p className="text-white/70 text-sm mt-2 drop-shadow-md">
                Experience the full Mandelbulb fractal animation
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}