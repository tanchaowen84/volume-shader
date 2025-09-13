<div align="center">

# 🔮 Volume Shader Benchmark

Real‑time, browser‑based volume shader benchmark. One‑click start, live FPS, clear scoring tiers — a practical way to see how your device behaves under heavy volumetric workloads.

[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js)](https://nextjs.org/)
[![three.js](https://img.shields.io/badge/three.js-0.165-000?logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18-149ECA?logo=react)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com/)

</div>

> Heads‑up: this benchmark is intentionally demanding. Keep devices cool and powered, especially on mobile.

## Overview

Volume Shader Benchmark renders a Mandelbulb fractal using Signed Distance Field (SDF) ray marching directly in your browser. Compared with traditional surface shading, this volumetric workload stresses iterative math and precision under sustained load, revealing real performance ceilings of your GPU/driver stack.

Key use cases: graphics R&D, hardware comparisons, mobile/desktop tuning, demos and teaching.

## Why a Volume Shader Benchmark?

- Exercises ALU, cache, and branch behavior with many steps per pixel
- Serves as a “worst‑case” proxy for advanced effects and scientific visualization
- Produces easy‑to‑read scores and tiers for quick comparisons

## Features

- One‑click run/stop with live FPS, frame time, and score tiers (Basic → Bronze → Silver → Gold → Platinum)
- Three quality presets (Low / Medium / High): step counts, epsilon, optional binary search refinement
- Optional effects: single/glossy reflections, ambient occlusion, soft shadows
- Device‑aware DPR clamping; modern UI (shadcn/ui + Tailwind)
- 100% client‑side rendering with three.js + @react-three/fiber

## Try It & Deploy (Short)

- Online: https://volumeshader.app — open and click “Start Test”.
- Local dev: `pnpm install && pnpm dev`, then open `http://localhost:3000`.
- Deploy: import this repo to Vercel and deploy, or build/run on any Next.js 14 platform.

## Tech Stack

- Next.js 14 (App Router), React 18, TypeScript
- three.js, @react-three/fiber, @react-three/drei
- Tailwind CSS, shadcn/ui

## Safety & Privacy

- High compute load by design — watch thermals and battery; lower the quality preset if needed.
- See site policies: `/privacy`, `/cookies`, `/terms`.

## Support

- Website: https://volumeshader.app
- Repo: https://github.com/tanchaowen84/volume-shader
- Email: support@volumeshader.app

