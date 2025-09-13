<div align="center">

# 🔮 Volume Shader Benchmark

Real‑time, browser‑based Mandelbulb volume shader benchmark with multi‑quality presets, live FPS, and a simple scoring tier system.

[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-149ECA?logo=react&logoColor=fff)](https://react.dev/)
[![three.js](https://img.shields.io/badge/three.js-0.165-000?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel&logoColor=fff)](https://vercel.com/)

</div>

> Caution: This benchmark is intentionally compute‑intensive. Ensure adequate cooling and power, especially on mobile devices.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Rendering & Benchmark Internals](#rendering--benchmark-internals)
- [Project Structure](#project-structure)
- [SEO & Sitemap/Robots](#seo--sitemaprobots)
- [Analytics](#analytics)
- [Safety, Performance & Compatibility](#safety-performance--compatibility)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Legal](#legal)

## Overview

Volume Shader Benchmark runs a Mandelbulb Signed Distance Field (SDF) ray‑marching shader in your browser to stress test GPU/driver pipelines beyond simple surface rendering. It tracks real‑time FPS and computes a score tier to quickly compare devices.

![screenshot](public/placeholder.jpg)

## Features

- Multi‑quality presets: Low / Medium / High
  - Controls marching steps, epsilon, binary search refinement
  - Optional single‑bounce and glossy reflections, ambient occlusion, soft shadows
- Live metrics: on‑screen FPS and frame time; score tiers
  - Platinum (≥90), Gold (≥75), Silver (≥60), Bronze (≥45), Basic (<45)
- Device‑aware DPR: scales devicePixelRatio per preset for fairer comparisons
- Fully client‑side rendering using three.js + @react-three/fiber
- Modern, responsive UI (shadcn/ui + Tailwind v4)

## Demo

- Local: see Getting Started below
- Production: deploy to Vercel (recommended) and open `/`

## Tech Stack

- Framework: Next.js 14 (App Router), React 18, TypeScript
- 3D/GL: three.js, @react-three/fiber, @react-three/drei
- UI/Styling: Tailwind CSS v4, shadcn/ui, Geist fonts
- Analytics: Vercel Analytics (built‑in), optional Google Analytics / Plausible

> Note: `expo`/`react-native` packages exist in `package.json` but are not used by the current web app. They can be safely removed if you do not plan a native target.

## Getting Started

Prerequisites

- Node.js 18+ (or 20+ recommended)
- pnpm (recommended) or npm/yarn

Install & run

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

Production build

```bash
pnpm build
pnpm start
```

## Environment Variables

Create `.env` from `.env.example` and set at least your site URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Volume Shader Benchmark
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Analytics (optional; set to enable)
# GA4: when NEXT_PUBLIC_GA_ID is set, GA scripts are injected via next/script
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=... (managed by Vercel platform)
# Plausible: when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, Plausible script is injected
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
# Optional overrides (e.g., self-hosted Plausible)
NEXT_PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js
NEXT_PUBLIC_PLAUSIBLE_API=

# GitHub (optional override; footer defaults to this repo if unset)
NEXT_PUBLIC_GITHUB_URL=https://github.com/tanchaowen84/volume-shader
```

## Rendering & Benchmark Internals

- Fullscreen triangle + custom fragment shader (see `components/three-scene.tsx`).
- SDF ray marching of the Mandelbulb with up to 1024 steps and optional 6–8 step binary search refinement.
- Normal from central differences; directional lighting + simple tone mapping and gamma.
- Optional effects per preset:
  - Reflections: off / single bounce / glossy single bounce (Schlick Fresnel, roughness jitter)
  - Ambient occlusion (sample count, radius, intensity)
  - Soft shadow (step count, softness factor)
- Preset parameters: `getQualityParams(q)` in `components/three-scene.tsx`.
- Device DPR scaling per preset: see `components/volume-renderer.tsx`.
- Scoring: `score = clamp(FPS / 60 * 100, 0..100)`; tiers map to labels (Basic → Platinum).

## Project Structure

```
app/
  layout.tsx        # Global layout, SEO, JSON-LD, analytics, footer
  page.tsx          # Homepage + benchmark canvas
  privacy/          # Privacy Policy page
  terms/            # Terms of Use page
  cookies/          # Cookies Policy page
components/
  footer.tsx        # Site footer with policy links and GitHub
  volume-renderer.tsx
  volume-renderer-scene.tsx
  three-scene.tsx   # Core shader + R3F wiring
  ui/*              # shadcn/ui primitives
content/
  home.en.json      # Homepage copy + JSON-LD
public/
  sitemap.xml       # Static sitemap (single source of truth)
  robots.txt        # Static robots.txt (Sitemap: /sitemap.xml)
```

## SEO & Sitemap/Robots

- The project uses a static `public/robots.txt` and a static `public/sitemap.xml`.
- Before launch, replace `https://your-domain.com` in `public/sitemap.xml` with your real domain.
- Open Graph/Twitter tags come from `lib/seo.ts` and `content/home.en.json` (JSON‑LD).

## Analytics

- Vercel Analytics is included via `@vercel/analytics` in `app/layout.tsx`.
- Google Analytics (GA4): enable by setting `NEXT_PUBLIC_GA_ID`.
- Plausible: enable by setting `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optionally override `NEXT_PUBLIC_PLAUSIBLE_SRC` and `NEXT_PUBLIC_PLAUSIBLE_API`).

See our policy pages for details:

- Privacy: `/privacy`
- Terms: `/terms`
- Cookies: `/cookies`

## Safety, Performance & Compatibility

- Intended to be compute‑intensive; monitor thermals and battery.
- Works on modern browsers with WebGL 2.0 and hardware acceleration enabled.
- If you see a blank screen: update drivers/browsers and verify GPU acceleration.

## Roadmap

- Shareable benchmark report (export/share links)
- Batch runs across presets with summary
- Better device heuristics (mobile DPR/throttling hints)
- Pluggable scene profiles beyond Mandelbulb
- Optional results submission leaderboard

## Contributing

Issues and PRs are welcome. Please open an issue to discuss significant changes first.

Development notes

- `next.config.mjs` currently ignores TypeScript and ESLint build errors for fast iteration. Consider tightening these for production CI.
- Expo/React‑Native deps are currently unused and can be removed to slim the install, unless you plan a native target.

## Legal

- © 2025 Volume Shader Benchmark. All rights reserved.
- Use at your own risk. The benchmark may increase device temperature and power usage.
- Policies: see `/privacy`, `/terms`, and `/cookies`.
