"use client"

import { useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Mandelbulb shader with working parameters
const fragmentShader = /* glsl */ `
  precision highp float;
  
  uniform vec2 uResolution;
  uniform float uTime;
  
  // Rotation matrix
  mat2 rot(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }
  
  // Mandelbulb distance estimator
  float mandelbulb(vec3 p, out float iter) {
    vec3 z = p;
    float dr = 1.0;
    float r = 0.0;
    iter = 0.0;
    
    for (int i = 0; i < 8; i++) {
      r = length(z);
      if (r > 2.0) {
        iter = float(i);
        break;
      }
      
      // Convert to spherical coordinates
      float theta = acos(z.z / r);
      float phi = atan(z.y, z.x);
      
      // Scale and rotate the angle
      dr = pow(r, 7.0) * 8.0 * dr + 1.0;
      
      // Scale and rotate the angle
      theta = theta * 8.0;
      phi = phi * 8.0;
      
      // Convert back to cartesian coordinates
      float zr = pow(r, 8.0);
      z = zr * vec3(sin(theta) * cos(phi), sin(phi) * sin(theta), cos(theta));
      z += p;
      
      if (i == 7) iter = 8.0;
    }
    
    return 0.5 * log(r) * r / dr;
  }
  
  // Calculate normal
  vec3 calcNormal(vec3 p) {
    float iter;
    float eps = 0.001;
    return normalize(vec3(
      mandelbulb(p + vec3(eps, 0, 0), iter) - mandelbulb(p - vec3(eps, 0, 0), iter),
      mandelbulb(p + vec3(0, eps, 0), iter) - mandelbulb(p - vec3(0, eps, 0), iter),
      mandelbulb(p + vec3(0, 0, eps), iter) - mandelbulb(p - vec3(0, 0, eps), iter)
    ));
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Camera setup
    vec3 ro = vec3(0, 0, 4); // Camera position
    vec2 ndc = (uv - 0.5) * 2.0;
    ndc.y *= -1.0;
    vec3 rd = normalize(vec3(ndc, -1)); // Ray direction
    
    // Rotate camera for animation
    float angle = uTime * 0.2;
    ro.xz = rot(angle) * ro.xz;
    rd.xz = rot(angle) * rd.xz;
    
    // Ray marching
    float t = 0.0;
    bool hit = false;
    float iterAtHit = 0.0;
    
    for (int i = 0; i < 100; i++) {
      vec3 p = ro + rd * t;
      float iter;
      float d = mandelbulb(p, iter);
      
      if (d < 0.002) {
        hit = true;
        iterAtHit = iter;
        break;
      }
      
      t += d * 0.8; // Step scale
      
      if (t > 10.0) break;
    }
    
    vec3 col;
    
    if (hit) {
      vec3 p = ro + rd * t;
      vec3 normal = calcNormal(p);
      
      // Lighting
      vec3 lightDir = normalize(vec3(1, 1, 1));
      float diff = max(dot(normal, lightDir), 0.0);
      
      // Color based on iteration count
      float t = iterAtHit / 8.0;
      col = mix(vec3(1.0, 0.5, 0.2), vec3(0.2, 0.5, 1.0), t);
      col *= (0.3 + 0.7 * diff);
    } else {
      // Background gradient
      col = mix(vec3(0.05, 0.05, 0.1), vec3(0.1, 0.1, 0.2), uv.y);
    }
    
    gl_FragColor = vec4(col, 1.0);
  }
`

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

export function MandelbulbTest() {
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