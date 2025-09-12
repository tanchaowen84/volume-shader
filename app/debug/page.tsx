"use client"

import { useState } from "react"
import { VolumeRendererDebug } from "@/components/volume-renderer-debug"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square, RotateCcw, Eye, EyeOff } from "lucide-react"

export default function DebugPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [fps, setFps] = useState(0)
  const [frameTime, setFrameTime] = useState(0)
  
  // Shader parameters
  const [params, setParams] = useState({
    // Mandelbulb parameters
    bailout: 4.0,
    power: 8,
    maxIterations: 12,
    
    // Ray marching parameters
    maxSteps: 512,
    stepScale: 0.75,
    maxDistance: 50.0,
    epsilon: 0.0012,
    doBinarySearch: true,
    
    // Camera parameters
    cameraX: 3,
    cameraY: 2,
    cameraZ: 6,
    
    // Visual options
    showDistance: false,
    showNormals: false,
    showIterations: false,
    enableRotation: true,
    
    // Performance
    quality: "medium" as "low" | "medium" | "high"
  })

  const updateParam = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    setParams({
      bailout: 4.0,
      power: 8,
      maxIterations: 12,
      maxSteps: 512,
      stepScale: 0.75,
      maxDistance: 50.0,
      epsilon: 0.0012,
      doBinarySearch: true,
      cameraX: 3,
      cameraY: 2,
      cameraZ: 6,
      showDistance: false,
      showNormals: false,
      showIterations: false,
      enableRotation: true,
      quality: "medium"
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Volume Shader Debug</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                FPS: <span className="font-mono">{fps.toFixed(1)}</span> | 
                Frame: <span className="font-mono">{frameTime.toFixed(2)}ms</span>
              </div>
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
              >
                {isRunning ? <Square className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? "Stop" : "Start"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Mandelbulb Parameters
                  <Button variant="ghost" size="sm" onClick={resetToDefaults}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Bailout: {params.bailout}</Label>
                  <Slider
                    value={[params.bailout]}
                    onValueChange={(v) => updateParam('bailout', v[0])}
                    min={1}
                    max={10}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Power: {params.power}</Label>
                  <Slider
                    value={[params.power]}
                    onValueChange={(v) => updateParam('power', v[0])}
                    min={2}
                    max={16}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Max Iterations: {params.maxIterations}</Label>
                  <Slider
                    value={[params.maxIterations]}
                    onValueChange={(v) => updateParam('maxIterations', v[0])}
                    min={4}
                    max={32}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ray Marching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm">Max Steps: {params.maxSteps}</Label>
                  <Slider
                    value={[params.maxSteps]}
                    onValueChange={(v) => updateParam('maxSteps', v[0])}
                    min={64}
                    max={1024}
                    step={32}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Step Scale: {params.stepScale.toFixed(2)}</Label>
                  <Slider
                    value={[params.stepScale]}
                    onValueChange={(v) => updateParam('stepScale', v[0])}
                    min={0.1}
                    max={2}
                    step={0.05}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Max Distance: {params.maxDistance}</Label>
                  <Slider
                    value={[params.maxDistance]}
                    onValueChange={(v) => updateParam('maxDistance', v[0])}
                    min={5}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Epsilon: {params.epsilon.toFixed(4)}</Label>
                  <Slider
                    value={[params.epsilon]}
                    onValueChange={(v) => updateParam('epsilon', v[0])}
                    min={0.0001}
                    max={0.01}
                    step={0.0001}
                    className="mt-2"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Binary Search</Label>
                  <Switch
                    checked={params.doBinarySearch}
                    onCheckedChange={v => updateParam('doBinarySearch', v)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Camera Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">X</Label>
                  <Input
                    type="number"
                    value={params.cameraX}
                    onChange={e => updateParam('cameraX', parseFloat(e.target.value))}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label className="text-sm">Y</Label>
                  <Input
                    type="number"
                    value={params.cameraY}
                    onChange={e => updateParam('cameraY', parseFloat(e.target.value))}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label className="text-sm">Z</Label>
                  <Input
                    type="number"
                    value={params.cameraZ}
                    onChange={e => updateParam('cameraZ', parseFloat(e.target.value))}
                    step={0.5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visual Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Distance Field</Label>
                  <Switch
                    checked={params.showDistance}
                    onCheckedChange={v => updateParam('showDistance', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Normals</Label>
                  <Switch
                    checked={params.showNormals}
                    onCheckedChange={v => updateParam('showNormals', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Show Iterations</Label>
                  <Switch
                    checked={params.showIterations}
                    onCheckedChange={v => updateParam('showIterations', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Rotation</Label>
                  <Switch
                    checked={params.enableRotation}
                    onCheckedChange={v => updateParam('enableRotation', v)}
                  />
                </div>
                
                <div>
                  <Label className="text-sm">Quality Preset</Label>
                  <Select value={params.quality} onValueChange={v => updateParam('quality', v)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-0">
                <div className="h-[800px]">
                  <VolumeRendererDebug
                    isRunning={isRunning}
                    params={params}
                    onPerformanceUpdate={(f, ft) => {
                      setFps(f)
                      setFrameTime(ft)
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}