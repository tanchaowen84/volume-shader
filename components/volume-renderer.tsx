"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import Three.js components to avoid SSR issues
const Canvas = dynamic(() => import("@react-three/fiber").then(mod => mod.Canvas), { ssr: false })
const Scene = dynamic(() => import("./three-scene").then(mod => mod.Scene), { ssr: false })

interface VolumeRendererProps {
  isRunning: boolean
  quality: "low" | "medium" | "high"
  onPerformanceUpdate: (fps: number, frameTime: number) => void
}

export function VolumeRenderer({ isRunning, quality, onPerformanceUpdate }: VolumeRendererProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-full bg-black/20 rounded-lg relative overflow-hidden flex items-center justify-center">
        <div className="text-white/60">Loading 3D renderer...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-black/20 rounded-lg relative overflow-hidden">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.25]}
      >
        <Scene 
          quality={quality} 
          isRunning={isRunning} 
          onPerformanceUpdate={onPerformanceUpdate} 
        />
      </Canvas>

      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-4xl mb-2">🔮</div>
            <p className="text-white/80">Click Start Test to begin volume rendering</p>
          </div>
        </div>
      )}
    </div>
  )
}
