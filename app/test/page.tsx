"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import Three.js components to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then(mod => mod.Canvas), { ssr: false })
const SimpleTest = dynamic(() => import("@/components/simple-test").then(mod => mod.SimpleTest), { ssr: false })
const RaymarchingSphere = dynamic(() => import("@/components/raymarching-sphere").then(mod => mod.RaymarchingSphere), { ssr: false })
const MandelbulbTest = dynamic(() => import("@/components/mandelbulb-test").then(mod => mod.MandelbulbTest), { ssr: false })
const SimpleScene = dynamic(() => import("@/components/simple-scene").then(mod => mod.SimpleScene), { ssr: false })
const VolumeRenderer = dynamic(() => import("@/components/volume-renderer").then(mod => mod.VolumeRenderer), { ssr: false })

import { Button } from "@/components/ui/button"
import { Play, Square } from "lucide-react"

export default function TestPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [fps, setFps] = useState(0)
  const [frameTime, setFrameTime] = useState(0)
  const [mode, setMode] = useState<"test" | "raymarch" | "mandelbulb" | "simple" | "original">("test")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Volume Shader Test</h1>
        
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Stop" : "Start"}
          </Button>
          
          <Button
            onClick={() => {
              if (mode === "test") setMode("raymarch")
              else if (mode === "raymarch") setMode("mandelbulb")
              else if (mode === "mandelbulb") setMode("simple")
              else if (mode === "simple") setMode("original")
              else setMode("test")
            }}
            variant="outline"
          >
            Switch to {
              mode === "test" ? "Raymarch" : 
              mode === "raymarch" ? "Mandelbulb" :
              mode === "mandelbulb" ? "Simple" :
              mode === "simple" ? "Original" : "Test"
            }
          </Button>
          
          <div className="text-sm flex items-center gap-4">
            FPS: <span className="font-mono">{fps.toFixed(1)}</span>
            Frame: <span className="font-mono">{frameTime.toFixed(2)}ms</span>
          </div>
        </div>
        
        <div className="h-[600px] border rounded-lg overflow-hidden">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.25]}
          >
            {mode === "test" ? (
              <SimpleTest />
            ) : mode === "raymarch" ? (
              <RaymarchingSphere />
            ) : mode === "mandelbulb" ? (
              <MandelbulbTest />
            ) : mode === "simple" ? (
              <SimpleScene
                isRunning={isRunning}
                onPerformanceUpdate={(f, ft) => {
                  setFps(f)
                  setFrameTime(ft)
                }}
              />
            ) : (
              <VolumeRenderer
                isRunning={isRunning}
                quality="medium"
                onPerformanceUpdate={(f, ft) => {
                  setFps(f)
                  setFrameTime(ft)
                }}
              />
            )}
          </Canvas>
        </div>
      </div>
    </div>
  )
}