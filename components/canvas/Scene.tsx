'use client'

import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import Experience from './Experience'
import Lights from './Lights'
import { readDebugFlags } from '@/lib/experience/debug'

const DebugHud = dynamic(() => import('./DebugHud').then((m) => m.DebugHud))
const FpsCap = dynamic(() => import('./DebugHud').then((m) => m.FpsCap))

/** Upper DPR bound: sharp on HiDPI screens without paying for 3× pixels. */
const MAX_DPR = 1.75

export default function Scene() {
  const [debug] = useState(readDebugFlags)
  const [maxDpr] = useState(() => Math.min(window.devicePixelRatio || 1, MAX_DPR))
  const [dpr, setDpr] = useState(maxDpr)

  return (
    <>
      <Canvas
        dpr={dpr}
        // MSAA only where pixels are big enough to need it; HiDPI screens get density instead.
        gl={{ antialias: (window.devicePixelRatio || 1) < 2, alpha: true, powerPreference: 'high-performance' }}
        frameloop={debug.fps ? 'demand' : 'always'}
        style={{ background: 'transparent' }}
      >
        {/* Adaptive resolution: starts at full quality (factor 1 ⇔ maxDpr), steps down toward DPR 1
            while frames are slow and back up when they recover. Rounded to 0.25 steps to avoid churn. */}
        <PerformanceMonitor factor={1} onChange={({ factor }) => setDpr(Math.round((1 + (maxDpr - 1) * factor) * 4) / 4)} />
        {debug.fps && <FpsCap fps={debug.fps} />}
        <Suspense fallback={null}>
          <Lights />
          <Experience debug={debug} />
        </Suspense>
      </Canvas>
      {debug.enabled && <DebugHud />}
    </>
  )
}
