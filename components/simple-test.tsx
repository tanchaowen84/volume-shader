"use client"

import { useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Simple working shader - minimal version
const fragmentShader = /* glsl */ `
  precision highp float;
  
  uniform vec2 uResolution;
  uniform float uTime;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Create a simple circle in the center
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    
    vec3 color = vec3(0.0);
    
    if (dist < 0.2) {
      // Blue circle
      color = vec3(0.2, 0.5, 1.0);
      
      // Add some simple shading
      float shade = 1.0 - (dist / 0.2);
      color *= shade;
    } else {
      // Dark background
      color = vec3(0.1, 0.1, 0.2);
    }
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`

// Create fullscreen triangle geometry
const geometry = new THREE.BufferGeometry()
const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0])
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))

export function SimpleTest() {
  const { size, gl } = useThree()
  
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
  
  // Update time
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })
  
  return (
    <mesh geometry={geometry} material={material} />
  )
}