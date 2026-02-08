'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Preload } from '@react-three/drei'
import Camera from './Camera'
import Lights from './Lights'
import Model from '../model/Model'

export default function Scene() {
  return (
    <Canvas
      camera={{ fov: 35, position: [0, 0, 30] }}
      gl={{ 
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true,
      }}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Camera />
        <Lights />
        <Model />
      </Suspense>
    </Canvas>
  )
}
