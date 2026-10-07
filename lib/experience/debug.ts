import { Vector3 } from 'three'
import type { ScreenRect } from './types'

/**
 * Debug switches, read from the URL so production behaviour is untouched:
 *   ?debug          HUD + scene helpers
 *   ?debug&fps=30   cap the render loop to test low frame rates
 *   ?debug&snap     skip all smoothing (jump straight to the shot) — for authoring shots
 */
export interface DebugFlags {
  enabled: boolean
  fps: number | null
  snap: boolean
}

export function readDebugFlags(): DebugFlags {
  if (typeof window === 'undefined') return { enabled: false, fps: null, snap: false }
  const params = new URLSearchParams(window.location.search)
  const enabled = params.has('debug')
  const fps = Number(params.get('fps'))
  return { enabled, fps: enabled && fps > 0 ? fps : null, snap: enabled && params.has('snap') }
}

/** Live values written by the render loop when debugging; read by the HUD and by tests. */
export const debugProbe = {
  frameDt: 0,
  steps: 0,
  alpha: 0,
  from: '',
  to: '',
  t: 0,
  scrollSpeed: 0,
  airspeed: 0,
  shipPosition: new Vector3(),
  shipVelocity: new Vector3(),
  shipAcceleration: new Vector3(),
  heading: 0,
  yawRate: 0,
  bank: 0,
  pitch: 0,
  focus: new Vector3(),
  cameraPosition: new Vector3(),
  cameraUpY: 1,
  cameraYaw: 0,
  cameraPitch: 0,
  distance: 0,
  fov: 0,
  shiftX: 0,
  shiftY: 0,
  insideShip: false,
  /** Screen region the current subject is composed in. */
  composedRect: null as ScreenRect | null,
  frame: 0,
}

