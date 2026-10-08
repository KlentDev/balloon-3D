'use client'

import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { debugProbe } from '@/lib/experience/debug'
import { SHIP_LENGTH } from '@/lib/experience/motionConfig'
import type { ShipData } from '@/lib/experience/types'

/**
 * Development-only tooling, loaded on demand with ?debug. Nothing here runs in production.
 */
declare global {
  interface Window {
    __experienceDebug?: typeof debugProbe
  }
}

const fmt = (n: number, d = 2) => (n >= 0 ? ' ' : '') + n.toFixed(d)
const vec = (v: { x: number; y: number; z: number }, d = 2) => `${fmt(v.x, d)} ${fmt(v.y, d)} ${fmt(v.z, d)}`

/** DOM overlay: live numbers, the subject's safe rect, and where the focus actually lands. */
export function DebugHud() {
  const text = useRef<HTMLPreElement>(null)
  const rect = useRef<HTMLDivElement>(null)
  const cross = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.__experienceDebug = debugProbe
    let raf = 0
    let last = 0
    let fps = 60
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const p = debugProbe
      if (p.frameDt > 0) fps += (1 / p.frameDt - fps) * 0.1
      const r = p.composedRect
      if (rect.current && r) {
        Object.assign(rect.current.style, {
          left: `${r.x0 * 100}%`,
          width: `${(r.x1 - r.x0) * 100}%`,
          top: `${r.y0 * 100}%`,
          height: `${(r.y1 - r.y0) * 100}%`,
        })
      }
      if (cross.current) {
        cross.current.style.left = `${((p.shiftX + 1) / 2) * 100}%`
        cross.current.style.top = `${((1 - p.shiftY) / 2) * 100}%`
      }
      if (now - last < 100 || !text.current) return
      last = now
      text.current.textContent = [
        `fps ${fps.toFixed(0)}  dt ${(p.frameDt * 1000).toFixed(1)}ms  steps ${p.steps}  alpha ${p.alpha.toFixed(2)}`,
        `shot ${p.from} → ${p.to}  t ${p.t.toFixed(2)}`,
        `scroll ${fmt(p.scrollSpeed)} vh/s  airspeed ${p.airspeed.toFixed(1)}`,
        `ship pos ${vec(p.shipPosition)}`,
        `     vel ${vec(p.shipVelocity)}`,
        `     acc ${vec(p.shipAcceleration)}`,
        `heading ${fmt(p.heading, 1)}°  yawRate ${fmt(p.yawRate, 1)}°/s`,
        `bank ${fmt(p.bank, 2)}°  pitch ${fmt(p.pitch, 2)}°`,
        `cam focus ${vec(p.focus)}`,
        `    pos   ${vec(p.cameraPosition)}`,
        `    yaw ${fmt(p.cameraYaw, 1)}°  elev ${fmt(p.cameraPitch, 1)}°  dist ${p.distance.toFixed(2)} (${(p.distance / SHIP_LENGTH).toFixed(2)} L)`,
        `    fov ${p.fov.toFixed(1)}°  shift ${fmt(p.shiftX)} ${fmt(p.shiftY)}  up.y ${p.cameraUpY.toFixed(3)}`,
        p.insideShip ? '!! CAMERA INSIDE SHIP VOLUME' : 'camera clear of hull/envelope',
      ].join('\n')
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div ref={rect} className="absolute border border-dashed border-cyan-400/80" />
      <div ref={cross} className="absolute w-6 h-6 -ml-3 -mt-3">
        <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-300" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-cyan-300" />
      </div>
      <pre
        ref={text}
        className="absolute left-2 top-2 m-0 p-2 rounded bg-black/75 text-[11px] leading-4 text-lime-300 font-mono whitespace-pre"
      />
    </div>
  )
}

/** In the ship body's frame: axes, whole-ship bounds, and the collision volumes. */
export function DebugShipHelpers({ ship }: { ship: ShipData }) {
  return (
    <>
      <axesHelper args={[SHIP_LENGTH * 0.4]} />
      <box3Helper args={[ship.bounds, '#ffd400']} />
      {ship.obstacles.map((box, i) => (
        <box3Helper key={i} args={[box, '#ff3b3b']} />
      ))}
    </>
  )
}

/** At the camera focus. */
export function DebugFocusHelpers() {
  return (
    <mesh>
      <sphereGeometry args={[SHIP_LENGTH * 0.003, 12, 8]} />
      <meshBasicMaterial color="#00e5ff" depthTest={false} />
    </mesh>
  )
}

/** Drives a `frameloop="demand"` canvas at a fixed rate, to test low frame rates. */
export function FpsCap({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    const id = setInterval(() => invalidate(), 1000 / fps)
    return () => clearInterval(id)
  }, [fps, invalidate])
  return null
}
