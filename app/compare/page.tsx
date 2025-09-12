"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import all renderers
const VolumeRenderer = dynamic(() => import("@/components/volume-renderer").then(mod => mod.VolumeRenderer), { ssr: false })
const VolumeRendererScene = dynamic(() => import("@/components/volume-renderer-scene").then(mod => mod.VolumeRendererScene), { ssr: false })
const SimpleTest = dynamic(() => import("@/components/simple-test").then(mod => mod.SimpleTest), { ssr: false })
const RaymarchingSphere = dynamic(() => import("@/components/raymarching-sphere").then(mod => mod.RaymarchingSphere), { ssr: false })
const MandelbulbTest = dynamic(() => import("@/components/mandelbulb-test").then(mod => mod.MandelbulbTest), { ssr: false })

import { Canvas } from "@react-three/fiber"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Square, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"

type RendererType = "original" | "simple" | "raymarch" | "mandelbulb"

const rendererNames = {
  original: "Original Mandelbulb",
  simple: "Simple Test",
  raymarch: "Raymarching Sphere", 
  mandelbulb: "Simple Mandelbulb"
}

const rendererDescriptions = {
  original: "Full-featured Mandelbulb with quality settings and performance scoring",
  simple: "Basic blue circle to verify rendering pipeline",
  raymarch: "Uses distance fields to render a 3D sphere",
  mandelbulb: "8th power Mandelbulb fractal with optimized parameters"
}

export default function ComparePage() {
  const [isRunning, setIsRunning] = useState(false)
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium")
  const [rendererType, setRendererType] = useState<RendererType>("simple")
  const [score, setScore] = useState(0)
  const [grade, setGrade] = useState("Basic")

  const handleStart = () => {
    setIsRunning(true)
    setScore(0)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Renderer Comparison</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Mode: <span className="font-medium text-foreground">{rendererNames[rendererType]}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Renderer Selector */}
          <Card className="p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Renderer:</span>
                <div className="flex gap-2">
                  {Object.entries(rendererNames).map(([key, name]) => (
                    <Button
                      key={key}
                      variant={rendererType === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRendererType(key as RendererType)}
                    >
                      {name.split(' ')[0]}
                    </Button>
                  ))}
                </div>
              </div>

              {rendererType === "original" && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quality:</span>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((q) => (
                      <Button
                        key={q}
                        variant={quality === q ? "default" : "outline"}
                        size="sm"
                        onClick={() => setQuality(q)}
                        disabled={isRunning}
                      >
                        {q.charAt(0).toUpperCase() + q.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {rendererType === "original" && (
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{Math.round(score)}</div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-secondary">{grade}</div>
                    <div className="text-xs text-muted-foreground">Grade</div>
                  </div>
                </div>
              )}

              <Button
                onClick={isRunning ? handleStop : handleStart}
                variant={isRunning ? "destructive" : "default"}
              >
                {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? "Stop" : "Start"}
              </Button>
            </div>
          </Card>

          {/* Canvas */}
          <Card className="p-6">
            <div className="h-[600px] rounded-lg overflow-hidden border">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                dpr={[1, 1.25]}
              >
                {rendererType === "original" && (
                  <VolumeRendererScene
                    isRunning={isRunning}
                    quality={quality}
                    onPerformanceUpdate={(fps, frameTime) => {
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
                )}
                
                {rendererType === "simple" && <SimpleTest />}
                {rendererType === "raymarch" && <RaymarchingSphere />}
                {rendererType === "mandelbulb" && <MandelbulbTest />}
              </Canvas>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-4 mt-4">
            <p className="text-sm text-muted-foreground">
              {rendererDescriptions[rendererType]}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}