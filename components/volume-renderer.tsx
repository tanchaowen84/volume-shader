"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Box } from "@react-three/drei"
import * as THREE from "three"

interface VolumeRendererProps {
  isRunning: boolean
  quality: "low" | "medium" | "high"
  onPerformanceUpdate: (fps: number, frameTime: number) => void
}

// Volume shader material
const volumeVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const volumeFragmentShader = `
  uniform float time;
  uniform float quality;
  uniform vec3 cameraPos;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  // Noise function for cloud density
  float noise(vec3 p) {
    return sin(p.x * 4.0 + time * 0.5) * sin(p.y * 4.0 + time * 0.3) * sin(p.z * 4.0 + time * 0.7) * 0.5 + 0.5;
  }
  
  // Ray marching function
  vec4 rayMarch(vec3 rayOrigin, vec3 rayDirection) {
    float stepSize = 0.02 / quality;
    int maxSteps = int(64.0 * quality);
    
    vec3 currentPos = rayOrigin;
    vec4 color = vec4(0.0);
    float transmittance = 1.0;
    
    for (int i = 0; i < 128; i++) {
      if (i >= maxSteps) break;
      
      // Check if we're inside the box
      if (abs(currentPos.x) > 1.0 || abs(currentPos.y) > 1.0 || abs(currentPos.z) > 1.0) {
        currentPos += rayDirection * stepSize;
        continue;
      }
      
      // Sample density
      float density = noise(currentPos * 2.0 + time * 0.1) * 0.3;
      
      if (density > 0.1) {
        // Cloud color with some variation
        vec3 cloudColor = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.8, 0.6), noise(currentPos * 3.0));
        
        // Simple lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float lighting = max(0.3, dot(normalize(vNormal), lightDir));
        
        // Beer-Lambert law for light attenuation
        float alpha = density * stepSize * 10.0;
        vec3 lightContribution = cloudColor * lighting * alpha * transmittance;
        
        color.rgb += lightContribution;
        transmittance *= exp(-alpha);
        
        if (transmittance < 0.01) break;
      }
      
      currentPos += rayDirection * stepSize;
    }
    
    color.a = 1.0 - transmittance;
    return color;
  }
  
  void main() {
    vec3 rayDirection = normalize(vPosition - cameraPos);
    vec4 volumeColor = rayMarch(cameraPos, rayDirection);
    
    // Add some glow effect
    float glow = 1.0 - length(vPosition) * 0.3;
    volumeColor.rgb += vec3(0.1, 0.2, 0.4) * glow * 0.2;
    
    gl_FragColor = volumeColor;
  }
`

function VolumeCloud({ quality, isRunning }: { quality: "low" | "medium" | "high"; isRunning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { camera } = useThree()

  const qualityMap = { low: 0.5, medium: 1.0, high: 2.0 }

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime
      materialRef.current.uniforms.cameraPos.value = camera.position
      materialRef.current.uniforms.quality.value = qualityMap[quality]
    }
  })

  return (
    <mesh ref={meshRef} scale={2}>
      <boxGeometry args={[1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={volumeVertexShader}
        fragmentShader={volumeFragmentShader}
        uniforms={{
          time: { value: 0 },
          quality: { value: qualityMap[quality] },
          cameraPos: { value: new THREE.Vector3() },
        }}
        transparent
        side={THREE.BackSide}
      />
    </mesh>
  )
}

function WireframeBox() {
  return (
    <Box args={[2, 2, 2]} position={[0, 0, 0]}>
      <meshBasicMaterial color="#00ffff" wireframe opacity={0.3} transparent />
    </Box>
  )
}

function PerformanceMonitor({
  onUpdate,
  isRunning,
}: { onUpdate: (fps: number, frameTime: number) => void; isRunning: boolean }) {
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())

  useFrame(() => {
    if (!isRunning) return

    frameCount.current++
    const currentTime = performance.now()

    if (currentTime - lastTime.current >= 1000) {
      const fps = (frameCount.current * 1000) / (currentTime - lastTime.current)
      const frameTime = (currentTime - lastTime.current) / frameCount.current

      onUpdate(fps, frameTime)

      frameCount.current = 0
      lastTime.current = currentTime
    }
  })

  return null
}

export function VolumeRenderer({ isRunning, quality, onPerformanceUpdate }: VolumeRendererProps) {
  return (
    <div className="w-full h-full bg-black/20 rounded-lg relative overflow-hidden">
      <Canvas camera={{ position: [3, 3, 3], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <VolumeCloud quality={quality} isRunning={isRunning} />
        <WireframeBox />

        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={8} />

        <PerformanceMonitor onUpdate={onPerformanceUpdate} isRunning={isRunning} />
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
