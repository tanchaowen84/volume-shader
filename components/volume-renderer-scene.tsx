"use client"

import { Scene } from "./three-scene"

type Quality = "low" | "medium" | "high"

interface VolumeRendererSceneProps {
  quality: Quality
  isRunning: boolean
  onPerformanceUpdate: (fps: number, frameTime: number) => void
}

export function VolumeRendererScene({ quality, isRunning, onPerformanceUpdate }: VolumeRendererSceneProps) {
  return (
    <Scene 
      quality={quality} 
      isRunning={isRunning} 
      onPerformanceUpdate={onPerformanceUpdate} 
    />
  )
}