"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

type DebugParams = {
  bailout: number
  power: number
  maxIterations: number
  maxSteps: number
  stepScale: number
  maxDistance: number
  epsilon: number
  doBinarySearch: boolean
  cameraX: number
  cameraY: number
  cameraZ: number
  showDistance: boolean
  showNormals: boolean
  showIterations: boolean
  enableRotation: boolean
  quality: "low" | "medium" | "high"
}

interface SceneDebugProps {
  params: DebugParams
  isRunning: boolean
  onPerformanceUpdate: (fps: number, frameTime: number) => void
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

// Fullscreen triangle geometry
function useScreenTriangle() {
  return useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      -1, -1, 0,
      3, -1, 0,
      -1, 3, 0,
    ])
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    return geom
  }, [])
}

const vertexShader = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  void main () {
    gl_Position = vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec2  iResolution;
  uniform float iTime;
  uniform int   iRunning;
  uniform vec3  iCamPos;
  uniform vec3  iCamRight;
  uniform vec3  iCamUp;
  uniform vec3  iCamForward;
  uniform float iFovY;

  uniform int   iMaxSteps;
  uniform float iStepScale;
  uniform float iMaxDist;
  uniform float iEpsilon;
  uniform float iBailout;
  uniform int   iPower;
  uniform int   iMaxIterations;
  uniform int   iDoBinarySearch;

  uniform bool  uShowDistance;
  uniform bool  uShowNormals;
  uniform bool  uShowIterations;
  uniform bool  uEnableRotation;

  // Y-axis rotation helper
  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z);
  }

  // Simple sphere for testing - definitely works
  float sphereDE(vec3 p) {
    return length(p) - 1.0;
  }

  // Simple box for testing
  float boxDE(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
  }

  // Mandelbulb Distance Estimator with iteration out parameter
  float mandelbulbDE(vec3 pos, out float iterCount) {
    if (uEnableRotation) {
      pos = rotY(pos, 0.2 * iTime);
    }
    vec3 z = pos;
    float dr = 1.0;
    float r = 0.0;
    iterCount = 0.0;
    for (int i = 0; i < 32; i++) {
      if (i >= iMaxIterations) break;
      r = length(z);
      if (r > iBailout) { iterCount = float(i); break; }
      // Spherical coordinates
      float theta = acos(z.z / max(r, 1e-6));
      float phi   = atan(z.y, z.x);
      float rPow  = pow(r, float(iPower) - 1.0);
      float zr    = rPow * r; // r^power
      dr = rPow * float(iPower) * dr + 1.0;
      theta *= float(iPower);
      phi   *= float(iPower);
      z = zr * vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));
      z += pos;
      if (i == iMaxIterations - 1) iterCount = float(iMaxIterations);
    }
    return 0.5 * log(max(r, 1e-6)) * r / max(dr, 1e-6);
  }

  // Hash for tiny dithering
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Estimate normal via central differences
  vec3 calcNormal(vec3 p) {
    float dummy;
    vec2 e = vec2(1.0, -1.0) * max(iEpsilon * 0.5, 0.001);
    return normalize(
      e.xyy * mandelbulbDE(p + e.xyy, dummy) +
      e.yyx * mandelbulbDE(p + e.yyx, dummy) +
      e.yxy * mandelbulbDE(p + e.yxy, dummy) +
      e.xxx * mandelbulbDE(p + e.xxx, dummy)
    );
  }

  // Ray direction from camera basis + fov
  vec3 rayDir(vec2 fragCoord) {
    vec2 ndc = (fragCoord / iResolution) * 2.0 - 1.0;
    ndc.y *= -1.0; // flip Y because screen coords origin is top-left
    float sy = tan(0.5 * iFovY);
    float sx = sy * (iResolution.x / max(iResolution.y, 1.0));
    vec3 dir = normalize(iCamForward + iCamRight * (ndc.x * sx) + iCamUp * (ndc.y * sy));
    return dir;
  }

  // Color palette for visualization
  vec3 heatmap(float t) {
    vec3 r = vec3(t * 2.0 - 1.0, 0.0, 0.0);
    vec3 g = vec3(0.0, t * 2.0 - 1.0, 0.0);
    vec3 b = vec3(0.0, 0.0, t * 2.0 - 1.0);
    return vec3(
      clamp(max(r.r, max(g.g, b.b)), 0.0, 1.0),
      clamp(max(r.g, g.r), 0.0, 1.0),
      clamp(max(g.b, b.g), 0.0, 1.0)
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy;
    if (iRunning == 0) {
      // Grid pattern when paused
      vec2 grid = floor(uv / 20.0);
      float checker = mod(grid.x + grid.y, 2.0);
      vec3 bg = mix(vec3(0.1, 0.1, 0.15), vec3(0.15, 0.15, 0.2), checker);
      gl_FragColor = vec4(bg, 1.0);
      return;
    }

    vec3 ro = iCamPos;
    vec3 rd = rayDir(uv);

    float t = 0.0;
    float hit = 0.0;
    float iterAtHit = 0.0;
    float distAtHit = 0.0;

    // tiny dither to reduce banding
    float dith = (hash12(uv) - 0.5) * iEpsilon;

    const int MAX_STEPS = 1024;
    for (int i = 0; i < MAX_STEPS; i++) {
      if (i >= iMaxSteps) break;
      if (t > iMaxDist) break;
      vec3 p = ro + rd * t;
      float iterCount;
      float dist = mandelbulbDE(p, iterCount);
      distAtHit = dist;
      
      if (dist < iEpsilon) {
        hit = 1.0;
        iterAtHit = 1.0; // For sphere
        // optional binary search refinement
        if (iDoBinarySearch == 1) {
          float t0 = max(t - iStepScale * 0.5, 0.0);
          float t1 = t;
          for (int j = 0; j < 8; j++) {
            vec3 pm = ro + rd * ((t0 + t1) * 0.5);
            float it2; float dm = mandelbulbDE(pm, it2);
            if (dm < iEpsilon) t1 = (t0 + t1) * 0.5; else t0 = (t0 + t1) * 0.5;
          }
          t = (t0 + t1) * 0.5;
        }
        break;
      }
      t += max(dist + dith, iEpsilon) * iStepScale;
    }

    // Debug visualizations
    if (uShowDistance && hit < 0.5) {
      // Show distance field
      vec3 p = ro + rd * t;
      float iterCount;
      float dist = mandelbulbDE(p, iterCount);
      vec3 color = heatmap(dist * 0.5);
      gl_FragColor = vec4(color, 1.0);
      return;
    }

    if (hit < 0.5) {
      // Background gradient
      float gradient = pow(1.0 - abs(rd.y), 2.0);
      vec3 bg = mix(vec3(0.05, 0.05, 0.1), vec3(0.1, 0.1, 0.2), gradient);
      gl_FragColor = vec4(bg, 1.0);
      return;
    }

    vec3 pos = ro + rd * t;
    vec3 N = calcNormal(pos);
    float iterNorm = clamp(iterAtHit / float(iMaxIterations), 0.0, 1.0);

    vec3 color = vec3(0.0);

    if (uShowNormals) {
      // Show normals as colors
      color = N * 0.5 + 0.5;
    } else if (uShowIterations) {
      // Show iteration count
      color = heatmap(iterNorm);
    } else {
      // Normal shading with lighting
      vec3 L = normalize(vec3(0.7, 0.6, 0.5));
      float diff = clamp(dot(N, L), 0.0, 1.0);
      float amb  = 0.15;
      
      // Base color from iteration ratio
      vec3 base = mix(vec3(0.2, 0.5, 0.9), vec3(1.0, 0.7, 0.4), iterNorm);
      color = base * (amb + diff * 0.9);
    }

    // simple tone mapping
    color = color / (1.0 + color);
    // gamma
    color = pow(color, vec3(1.0/2.2));
    gl_FragColor = vec4(color, 1.0);
  }
`

function ScreenShaderDebug({ params, isRunning }: { params: DebugParams; isRunning: boolean }) {
  const geom = useScreenTriangle()
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size, gl } = useThree()
  const initialUniforms = useMemo(() => ({
    iResolution: { value: new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio()) },
    iTime: { value: 0 },
    iRunning: { value: isRunning ? 1 : 0 },
    iCamPos: { value: new THREE.Vector3(params.cameraX, params.cameraY, params.cameraZ) },
    iCamRight: { value: new THREE.Vector3(1, 0, 0) },
    iCamUp: { value: new THREE.Vector3(0, 1, 0) },
    iCamForward: { value: new THREE.Vector3(0, 0, -1) },
    iFovY: { value: (camera as THREE.PerspectiveCamera).fov * Math.PI / 180 },
    iMaxSteps: { value: params.maxSteps },
    iStepScale: { value: params.stepScale },
    iMaxDist: { value: params.maxDistance },
    iEpsilon: { value: params.epsilon },
    iBailout: { value: params.bailout },
    iPower: { value: params.power },
    iMaxIterations: { value: params.maxIterations },
    iDoBinarySearch: { value: params.doBinarySearch ? 1 : 0 },
    uShowDistance: { value: params.showDistance },
    uShowNormals: { value: params.showNormals },
    uShowIterations: { value: params.showIterations },
    uEnableRotation: { value: params.enableRotation },
  }), [camera, gl, size, params, isRunning])

  useFrame((state) => {
    if (!matRef.current) return
    const m = matRef.current

    // Update resolution
    const dpr = gl.getPixelRatio()
    m.uniforms.iResolution.value.set(size.width * dpr, size.height * dpr)

    // Time and running state
    if (isRunning) m.uniforms.iTime.value = state.clock.elapsedTime
    m.uniforms.iRunning.value = isRunning ? 1 : 0

    // Camera basis
    const cam = camera as THREE.PerspectiveCamera
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0)
    const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion).normalize()
    m.uniforms.iCamPos.value.copy(cam.position)
    m.uniforms.iCamRight.value.copy(right)
    m.uniforms.iCamUp.value.copy(up)
    m.uniforms.iCamForward.value.copy(forward)
    m.uniforms.iFovY.value = cam.fov * Math.PI / 180

    // Update all parameters
    m.uniforms.iMaxSteps.value = params.maxSteps
    m.uniforms.iStepScale.value = params.stepScale
    m.uniforms.iMaxDist.value = params.maxDistance
    m.uniforms.iEpsilon.value = params.epsilon
    m.uniforms.iBailout.value = params.bailout
    m.uniforms.iPower.value = params.power
    m.uniforms.iMaxIterations.value = params.maxIterations
    m.uniforms.iDoBinarySearch.value = params.doBinarySearch ? 1 : 0
    m.uniforms.uShowDistance.value = params.showDistance
    m.uniforms.uShowNormals.value = params.showNormals
    m.uniforms.uShowIterations.value = params.showIterations
    m.uniforms.uEnableRotation.value = params.enableRotation
  })

  return (
    <mesh geometry={geom} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
        transparent={false}
        uniforms={initialUniforms}
      />
    </mesh>
  )
}

export function SceneDebug({ params, isRunning, onPerformanceUpdate }: SceneDebugProps) {
  return (
    <>
      <ScreenShaderDebug params={params} isRunning={isRunning} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true} 
        minDistance={1} 
        maxDistance={100}
        target={[0, 0, 0]}
      />
      <PerformanceMonitor onUpdate={onPerformanceUpdate} isRunning={isRunning} />
    </>
  )
}