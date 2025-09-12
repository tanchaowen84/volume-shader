"use client"

import { useEffect, useMemo, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

type Quality = "low" | "medium" | "high"

interface SceneProps {
  quality: Quality
  isRunning: boolean
  onPerformanceUpdate: (fps: number, frameTime: number) => void
}

// Minimal performance monitor (FPS averaged每秒)
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

function getQualityParams(q: Quality) {
  if (q === "low")
    return {
      iMaxSteps: 320,
      iStepScale: 1.0,
      iMaxDist: 20.0,
      iEpsilon: 0.0018,
      iDoBinarySearch: 0,
      // reflections
      uReflectMode: 0,            // off
      uReflectStrength: 0.0,
      uRoughness: 0.0,
      uReflMaxSteps: 0,
      uReflDoBinarySearch: 0,
      uF0: 0.05,
    }
  if (q === "medium")
    return {
      iMaxSteps: 512,
      iStepScale: 0.75,
      iMaxDist: 35.0,
      iEpsilon: 0.0012,
      iDoBinarySearch: 1,
      // reflections
      uReflectMode: 1,            // single reflection ray
      uReflectStrength: 0.3,
      uRoughness: 0.0,
      uReflMaxSteps: 96,
      uReflDoBinarySearch: 0,
      uF0: 0.06,
    }
  return {
    iMaxSteps: 768,
    iStepScale: 0.6,
    iMaxDist: 50.0,
    iEpsilon: 0.0009,
    iDoBinarySearch: 1,
    // reflections
    uReflectMode: 2,              // glossy single bounce
    uReflectStrength: 0.5,
    uRoughness: 0.2,
    uReflMaxSteps: 192,
    uReflDoBinarySearch: 1,
    uF0: 0.06,
  }
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
  uniform float iFovY;        // radians

  uniform int   iMaxSteps;
  uniform float iStepScale;
  uniform float iMaxDist;
  uniform float iEpsilon;
  uniform float iBailout;
  uniform int   iPower;
  uniform int   iDoBinarySearch;

  // Reflection controls
  uniform int   uReflectMode;        // 0=off,1=single,2=glossy single
  uniform float uReflectStrength;    // mix factor scalar (multiplies Fresnel)
  uniform float uRoughness;          // glossy perturbation magnitude
  uniform int   uReflMaxSteps;       // max steps for reflection march
  uniform int   uReflDoBinarySearch; // 0/1
  uniform float uF0;                 // base reflectance

  // Hash for tiny dithering
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  // Mandelbulb Distance Estimator with iteration out parameter
  float mandelbulbDE(vec3 pos, out float iterCount) {
    vec3 z = pos;
    float dr = 1.0;
    float r = 0.0;
    iterCount = 0.0;
    const int MAX_ITER = 12; // constant upper bound for GLSL
    for (int i = 0; i < MAX_ITER; i++) {
      r = length(z);
      if (r > iBailout) { iterCount = float(i); break; }
      // Spherical coordinates
      float theta = acos(z.z / max(r, 1e-6));
      float phi   = atan(z.y, z.x);
      // Correct derivative term: r^(power-1) * power * dr + 1
      float rPow  = pow(r, float(iPower) - 1.0);
      float zr    = rPow * r; // r^power
      dr = rPow * float(iPower) * dr + 1.0;
      theta *= float(iPower);
      phi   *= float(iPower);
      z = zr * vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));
      z += pos;
      if (i == MAX_ITER - 1) iterCount = float(MAX_ITER);
    }
    return 0.5 * log(max(r, 1e-6)) * r / max(dr, 1e-6);
  }

  // March helper with configurable step limit (breaks early by uniform)
  float marchWithLimit(vec3 ro, vec3 rd, int limitSteps, out float tHit, out float iterAtHit) {
    float t = 0.0;
    float hit = 0.0;
    float iterCount = 0.0;
    const int MAX_STEPS = 1024;
    for (int i = 0; i < MAX_STEPS; i++) {
      if (i >= limitSteps) break;
      if (t > iMaxDist) break;
      vec3 p = ro + rd * t;
      float dist = mandelbulbDE(p, iterCount);
      if (dist < iEpsilon) {
        hit = 1.0;
        if (uReflDoBinarySearch == 1) {
          float t0 = max(t - iStepScale * 0.5, 0.0);
          float t1 = t;
          for (int j = 0; j < 6; j++) {
            float it2; vec3 pm = ro + rd * ((t0 + t1) * 0.5);
            float dm = mandelbulbDE(pm, it2);
            if (dm < iEpsilon) t1 = (t0 + t1) * 0.5; else t0 = (t0 + t1) * 0.5;
          }
          t = (t0 + t1) * 0.5;
        }
        break;
      }
      t += max(dist, iEpsilon) * iStepScale;
    }
    tHit = t; iterAtHit = iterCount; return hit;
  }

  // Estimate normal via central differences
  vec3 calcNormal(vec3 p) {
    float dummy; // unused out param
    vec2 e = vec2(1.0, -1.0) * max(iEpsilon * 0.5, 0.001);
    return normalize(
      e.xyy * mandelbulbDE(p + e.xyy, dummy) +
      e.yyx * mandelbulbDE(p + e.yyx, dummy) +
      e.yxy * mandelbulbDE(p + e.yxy, dummy) +
      e.xxx * mandelbulbDE(p + e.xxx, dummy)
    );
  }

  // Simple directional lighting with ambient
  vec3 shade(vec3 p, vec3 N, float iterNorm) {
    vec3 L = normalize(vec3(0.7, 0.6, 0.5));
    float diff = clamp(dot(N, L), 0.0, 1.0);
    float amb  = 0.15;
    // vivid palette from iteration ratio (no nested function per GLSL ES)
    vec3 base = vec3(0.5) + 0.5 * cos(6.28318 * (vec3(iterNorm) + vec3(0.00, 0.15, 0.33)));
    vec3 col = base * (amb + diff * 0.9);
    return col;
  }

  vec3 skyColor(vec3 dir) {
    float g = 0.06 + 0.1 * pow(1.0 - dir.y * 0.5, 2.0);
    return vec3(g);
  }

  // Ray direction from camera basis + fov
  vec3 rayDir(vec2 fragCoord) {
    vec2 ndc = (fragCoord / iResolution) * 2.0 - 1.0;
    float sy = tan(0.5 * iFovY);
    float sx = sy * (iResolution.x / max(iResolution.y, 1.0));
    vec3 dir = normalize(iCamForward + iCamRight * (ndc.x * sx) + iCamUp * (ndc.y * sy));
    return dir;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy;
    if (iRunning == 0) {
      // lightweight gradient when paused
      vec2 p = uv / max(iResolution, vec2(1.0));
      gl_FragColor = vec4(mix(vec3(0.02), vec3(0.08, 0.1, 0.15), p.y), 1.0);
      return;
    }

    vec3 ro = iCamPos;
    vec3 rd = rayDir(uv);

    float t = 0.0;
    float hit = 0.0;
    float iterAtHit = 0.0;

    // tiny dither to reduce banding
    float dith = (hash12(uv) - 0.5) * iEpsilon;

    const int MAX_STEPS = 1024; // constant loop bound
    for (int i = 0; i < MAX_STEPS; i++) {
      if (i >= iMaxSteps) break;
      if (t > iMaxDist) break;
      vec3 p = ro + rd * t;
      float iterCount;
      float dist = mandelbulbDE(p, iterCount);
      if (dist < iEpsilon) {
        hit = 1.0;
        iterAtHit = iterCount;
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

    // Fallback ray: fixed camera looking at origin to guarantee visibility
    if (hit < 0.5) {
      vec3 roAlt = vec3(0.0, 0.0, 6.0);
      vec3 f = normalize(vec3(0.0) - roAlt);
      vec3 r = normalize(cross(vec3(0.0,1.0,0.0), f));
      vec3 u = cross(f, r);
      float sy2 = tan(0.5 * iFovY);
      float sx2 = sy2 * (iResolution.x / max(iResolution.y, 1.0));
      vec2 ndc = (uv / iResolution) * 2.0 - 1.0;
      vec3 rdAlt = normalize(f + r * (ndc.x * sx2) + u * (ndc.y * sy2));
      float t2 = 0.0; float it2 = 0.0; float hit2 = 0.0;
      for (int k = 0; k < MAX_STEPS; k++) {
        if (k >= iMaxSteps) break;
        if (t2 > iMaxDist) break;
        vec3 p2 = roAlt + rdAlt * t2;
        float itc; float d2 = mandelbulbDE(p2, itc);
        if (d2 < iEpsilon) { hit2 = 1.0; it2 = itc; break; }
        t2 += max(d2 + dith, iEpsilon) * iStepScale;
      }
      if (hit2 > 0.5) {
        hit = hit2; t = t2; iterAtHit = it2; ro = roAlt; rd = rdAlt;
      }
    }

    if (hit < 0.5) {
      // background
      float g = 0.06 + 0.1 * pow(1.0 - rd.y * 0.5, 2.0);
      gl_FragColor = vec4(vec3(g), 1.0);
      return;
    }

    vec3 pos = ro + rd * t;
    vec3 N = calcNormal(pos);
    float iterNorm = clamp(iterAtHit / 12.0, 0.0, 1.0);
    vec3 col = shade(pos, N, iterNorm);

    // Single-bounce reflections
    if (uReflectMode > 0) {
      // Fresnel (Schlick)
      float cosTheta = clamp(dot(N, -rd), 0.0, 1.0);
      float F = uF0 + (1.0 - uF0) * pow(1.0 - cosTheta, 5.0);
      float reflW = clamp(F * uReflectStrength, 0.0, 1.0);
      if (reflW > 1e-3) {
        vec3 R = reflect(rd, N);
        if (uReflectMode == 2 && uRoughness > 0.0) {
          // Build basis around R and jitter
          vec3 T = normalize(cross(abs(R.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0), R));
          vec3 B = cross(R, T);
          vec2 xi = vec2(hash12(uv), hash12(uv + 37.0));
          vec3 jitter = (xi.x - 0.5) * T + (xi.y - 0.5) * B;
          R = normalize(R + uRoughness * jitter);
        }

        // Start a bit off the surface to avoid self-intersection
        vec3 ro2 = pos + N * (iEpsilon * 2.0);
        float tR = 0.0; float itR = 0.0;
        float hitR = marchWithLimit(ro2, R, uReflMaxSteps, tR, itR);
        vec3 reflCol;
        if (hitR > 0.5) {
          vec3 pR = ro2 + R * tR;
          vec3 nR = calcNormal(pR);
          float inR = clamp(itR / 12.0, 0.0, 1.0);
          reflCol = shade(pR, nR, inR);
        } else {
          reflCol = skyColor(R);
        }
        col = mix(col, reflCol, reflW);
      }
    }
    // simple tone mapping
    col = col / (1.0 + col);
    // gamma
    col = pow(col, vec3(1.0/2.2));
    gl_FragColor = vec4(col, 1.0);
  }
`

function ScreenShader({ quality, isRunning }: { quality: Quality; isRunning: boolean }) {
  const geom = useScreenTriangle()
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size, gl } = useThree()
  const initialUniforms = useMemo(() => ({
    iResolution: { value: new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio()) },
    iTime: { value: 0 },
    iRunning: { value: isRunning ? 1 : 0 },
    iCamPos: { value: new THREE.Vector3() },
    iCamRight: { value: new THREE.Vector3(1, 0, 0) },
    iCamUp: { value: new THREE.Vector3(0, 1, 0) },
    iCamForward: { value: new THREE.Vector3(0, 0, -1) },
    iFovY: { value: (camera as THREE.PerspectiveCamera).fov * Math.PI / 180 },
    iMaxSteps: { value: 512 },
    iStepScale: { value: 0.75 },
    iMaxDist: { value: 12.0 },
    iEpsilon: { value: 0.0012 },
    iBailout: { value: 2.7 },
    iPower: { value: 8 },
    iDoBinarySearch: { value: 1 },
    // reflections defaults (will be overridden per quality in useFrame)
    uReflectMode: { value: 0 },
    uReflectStrength: { value: 0.0 },
    uRoughness: { value: 0.0 },
    uReflMaxSteps: { value: 0 },
    uReflDoBinarySearch: { value: 0 },
    uF0: { value: 0.05 },
  }), [camera, gl, size.height, size.width])

  useFrame((state) => {
    if (!matRef.current) return
    const m = matRef.current

    // Resolution (respect dpr clamp from Canvas)
    const dpr = gl.getPixelRatio()
    m.uniforms.iResolution.value.set(size.width * dpr, size.height * dpr)

    // Time gate
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

    // Quality mapping
    const qp = getQualityParams(quality)
    m.uniforms.iMaxSteps.value = qp.iMaxSteps
    m.uniforms.iStepScale.value = qp.iStepScale
    m.uniforms.iMaxDist.value = qp.iMaxDist
    m.uniforms.iEpsilon.value = qp.iEpsilon
    m.uniforms.iDoBinarySearch.value = qp.iDoBinarySearch
    // reflections
    m.uniforms.uReflectMode.value = qp.uReflectMode
    m.uniforms.uReflectStrength.value = qp.uReflectStrength
    m.uniforms.uRoughness.value = qp.uRoughness
    m.uniforms.uReflMaxSteps.value = qp.uReflMaxSteps
    m.uniforms.uReflDoBinarySearch.value = qp.uReflDoBinarySearch
    m.uniforms.uF0.value = qp.uF0
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

export function Scene({ quality, isRunning, onPerformanceUpdate }: SceneProps) {
  const { camera } = useThree()
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.position.set(1.25, 0.8, 2.0)
    cam.lookAt(0, 0, 0)
    cam.updateProjectionMatrix()
    cam.updateMatrixWorld()
  }, [camera])
  return (
    <>
      <ScreenShader quality={quality} isRunning={isRunning} />
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.25}
        minDistance={2}
        maxDistance={50}
      />
      <PerformanceMonitor onUpdate={onPerformanceUpdate} isRunning={isRunning} />
    </>
  )
}
