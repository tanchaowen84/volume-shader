"use client"

import { useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Ray marching shader with sphere
const fragmentShader = /* glsl */ `
  precision highp float;
  
  uniform vec2 uResolution;
  uniform float uTime;
  
  // Sphere distance function
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }
  
  // Calculate normal
  vec3 calcNormal(vec3 p) {
    float eps = 0.001;
    return normalize(vec3(
      sdSphere(p + vec3(eps, 0, 0), 1.0) - sdSphere(p - vec3(eps, 0, 0), 1.0),
      sdSphere(p + vec3(0, eps, 0), 1.0) - sdSphere(p - vec3(0, eps, 0), 1.0),
      sdSphere(p + vec3(0, 0, eps), 1.0) - sdSphere(p - vec3(0, 0, eps), 1.0)
    ));
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Camera setup
    vec3 ro = vec3(0, 0, 5); // Camera position
    vec3 rd = normalize(vec3((uv - 0.5) * 2.0, -1)); // Ray direction
    
    // Ray marching
    float t = 0.0;
    bool hit = false;
    
    for (int i = 0; i < 64; i++) {
      vec3 p = ro + rd * t;
      float d = sdSphere(p, 1.0);
      
      if (d < 0.001) {
        hit = true;
        break;
      }
      
      t += d;
      
      if (t > 10.0) break;
    }
    
    vec3 col;
    
    if (hit) {
      vec3 p = ro + rd * t;
      vec3 normal = calcNormal(p);
      
      // Lighting
      vec3 lightDir = normalize(vec3(1, 1, 1));
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Blue sphere with shading
      col = vec3(0.2, 0.5, 1.0) * (0.3 + 0.7 * diff);
    } else {
      // Background gradient
      col = mix(vec3(0.1, 0.1, 0.2), vec3(0.2, 0.2, 0.3), uv.y);
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

export function RaymarchingSphere() {
  const { size, gl } = useThree()
  
  // Create fullscreen triangle geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    return geom
  }, [])
  
  // Create shader material
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uResolution: { value: new THREE.Vector2(size.width * gl.getPixelRatio(), size.height * gl.getPixelRatio()) },
      uTime: { value: 0 }
    },
    depthTest: false,
    depthWrite: false
  }), [size, gl])
  
  // Update resolution
  useFrame(() => {
    const dpr = gl.getPixelRatio()
    material.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr)
  })
  
  // Update time
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })
  
  return (
    <mesh geometry={geometry} material={material} />
  )
}