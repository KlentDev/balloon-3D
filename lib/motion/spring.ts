import { MathUtils } from 'three'

/**
 * Damped springs, tuned the way motion is described rather than by raw stiffness/damping:
 *
 *   frequency (Hz) – how quickly the value responds (natural frequency).
 *   damping (ζ)    – 1 = critically damped (fastest settle, no overshoot),
 *                    < 1 = overshoot / swing, > 1 = sluggish.
 *
 * Integration is semi-implicit Euler: a = ω²(target − x) − 2ζω·v; v += a·dt; x += v·dt.
 * It is only ever called from the fixed-timestep simulation, so behaviour is identical at
 * every display refresh rate. Velocity is part of the state, which is what keeps motion
 * continuous when the target changes mid-transition (the core flaw of re-starting tweens).
 */
export interface SpringParams {
  frequency: number
  damping: number
}

export interface Spring {
  value: number
  velocity: number
}

export interface Vec3Like {
  x: number
  y: number
  z: number
}

export interface SpringVec3<V extends Vec3Like = Vec3Like> {
  value: V
  velocity: V
}

export function createSpring(value = 0): Spring {
  return { value, velocity: 0 }
}

export function stepSpring(s: Spring, target: number, p: SpringParams, dt: number): void {
  const omega = 2 * Math.PI * p.frequency
  const accel = omega * omega * (target - s.value) - 2 * p.damping * omega * s.velocity
  s.velocity += accel * dt
  s.value += s.velocity * dt
}

export function stepSpringVec3(s: SpringVec3, target: Vec3Like, p: SpringParams, dt: number): void {
  const omega = 2 * Math.PI * p.frequency
  const k = omega * omega
  const c = 2 * p.damping * omega
  const v = s.velocity
  const x = s.value
  v.x += (k * (target.x - x.x) - c * v.x) * dt
  v.y += (k * (target.y - x.y) - c * v.y) * dt
  v.z += (k * (target.z - x.z) - c * v.z) * dt
  x.x += v.x * dt
  x.y += v.y * dt
  x.z += v.z * dt
}

/** Snap a spring to a value at rest. */
export function resetSpring(s: Spring, value: number): void {
  s.value = value
  s.velocity = 0
}

const TAU = Math.PI * 2

/** Wraps an angle to [−π, π). */
export function wrapAngle(a: number): number {
  return MathUtils.euclideanModulo(a + Math.PI, TAU) - Math.PI
}

/**
 * Re-expresses `to` as the equivalent angle closest to `from`, so a spring on an unwrapped
 * angle always turns the short way round and never unwinds accumulated revolutions.
 */
export function nearestAngle(from: number, to: number): number {
  return from + wrapAngle(to - from)
}

/** Interpolates two angles along the shortest arc. */
export function lerpAngle(a: number, b: number, t: number): number {
  return a + wrapAngle(b - a) * t
}
