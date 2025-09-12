"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

interface SimpleSceneProps {
  isRunning: boolean
  onPerformanceUpdate: (fps: number, frameTime: number) => void
}

// Simple sphere with ray marching
const fragmentShader = /* glsl */ `
  precision highp float;
  
  uniform vec2 iResolution;
  uniform float iTime;
  uniform int iRunning;
  uniform vec3 iCamPos;
  uniform vec3 iCamForward;
  uniform float iFovY;

  // Simple sphere DE
  float sphereDE(vec3 p) {
    return length(p) - 1.0;
  }

  vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0);
    return normalize(vec3(
      sphereDE(p + e.xyy) - sphereDE(p - e.xyy),
      sphereDE(p + e.yxy) - sphereDE(p - e.yxy),
      sphereDE(p + e.yyx) - sphereDE(p - e.yyx)
    ));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy;
    
    if (iRunning == 0) {
      // Simple gradient when paused
      vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
      gl_FragColor = vec4(col, 1.0);
      return;
    }

    // Camera setup - look at origin
    vec3 ro = iCamPos;
    vec3 target = vec3(0.0);
    vec3 forward = normalize(target - ro);
    
    // Calculate ray direction
    vec2 ndc = (uv / iResolution) * 2.0 - 1.0;
    ndc.y *= -1.0;
    
    float aspect = iResolution.x / iResolution.y;
    float tanHalfFov = tan(iFovY * 0.5);
    
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, forward));
    
    vec3 rd = normalize(forward + right * (ndc.x * tanHalfFov * aspect) + up * (ndc.y * tanHalfFov));

    // Ray march
    float t = 0.0;
    bool hit = false;
    
    for (int i = 0; i < 128; i++) {
      vec3 p = ro + rd * t;
      float dist = sphereDE(p);
      
      if (dist < 0.001) {
        hit = true;
        break;
      }
      
      t += dist * 0.8; // Step scale
      
      if (t > 10.0) break;
    }

    vec3 col;
    
    if (hit) {
      vec3 p = ro + rd * t;
      vec3 normal = calcNormal(p);
      
      // Simple lighting
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Blue sphere
      col = vec3(0.2, 0.5, 1.0) * (0.3 + 0.7 * diff);
    } else {
      // Background
      col = vec3(0.1, 0.1, 0.2);
    }

    gl_FragColor = vec4(col, 1.0);
  }
`

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

// Simple Shader Component - must be used inside Canvas
function SimpleShader({ isRunning }: { isRunning: boolean }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const vertices = new Float32Array([-1,-1,0, 3,-1,0, -1,3,0])
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    return g
  }, [])
  
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size, gl } = useThree()
  
  const uniforms = useMemo(() => ({
    iResolution: { value: new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio()) },
    iTime: { value: 0 },
    iRunning: { value: isRunning ? 1 : 0 },
    iCamPos: { value: camera.position.clone() },
    iCamForward: { value: new THREE.Vector3(0, 0, -1) },
    iFovY: { value: (camera as THREE.PerspectiveCamera).fov * Math.PI / 180 }
  }), [camera, gl, size, isRunning])

  useFrame((state) => {
    if (!matRef.current) return
    
    const dpr = gl.getPixelRatio()
    matRef.current.uniforms.iResolution.value.set(size.width * dpr, size.height * dpr)
    matRef.current.uniforms.iTime.value = state.clock.elapsedTime
    matRef.current.uniforms.iRunning.value = isRunning ? 1 : 0
    
    const cam = camera as THREE.PerspectiveCamera
    matRef.current.uniforms.iCamPos.value.copy(cam.position)
    cam.getWorldDirection(matRef.current.uniforms.iCamForward.value)
    matRef.current.uniforms.iFovY.value = cam.fov * Math.PI / 180
  })

  return (
    <mesh geometry={geom}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

// Performance monitor
function PerformanceMonitor({ onUpdate, isRunning }: { onUpdate: (fps: number, frameTime: number) => void; isRunning: boolean }) {
  const frameCount = useRef(0)
  const lastTime = useRef(typeof performance !== "undefined" ? performance.now() : 0)

  useFrame(() => {
    if (!isRunning) return
    frameCount.current++
    const now = performance.now()
    const dt = now - lastTime.current
    if (dt >= 1000) {
      const fps = (frameCount.current * 1000) / dt
      const frameTime = dt / frameCount.current
      onUpdate(fps, frameTime)
      frameCount.current = 0
      lastTime.current = now
    }
  })

  return null
}

// Main scene component
export function SimpleScene({ isRunning, onPerformanceUpdate }: SimpleSceneProps) {
  return (
    <>
      <SimpleShader isRunning={isRunning} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true} 
        minDistance={2} 
        maxDistance={50}
      />
      <PerformanceMonitor onUpdate={onPerformanceUpdate} isRunning={isRunning} />
      
      {/* Add a debug grid */}
      <gridHelper args={[20, 20]} />
      <axesHelper args={[5]} />
    </>
  )
}