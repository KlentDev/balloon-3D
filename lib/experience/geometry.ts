import { Vector3, type Box3, type Quaternion } from 'three'
import { motionConfig } from './motionConfig'

/**
 * Ship-space geometry shared by framing, simulation and debugging: the camera orbit convention,
 * the world → ship transform, and collision queries against the hull and envelope.
 *
 * Orbit convention: the camera rig is Ry(azimuth) · Rx(−pitch), so relative to the ship the camera
 * sits along `back` and looks down −back, with `right` horizontal (no roll).
 */
export function orbitBasis(azimuth: number, pitch: number, right: Vector3, up: Vector3, back: Vector3): void {
  const ca = Math.cos(azimuth)
  const sa = Math.sin(azimuth)
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  right.set(ca, 0, -sa)
  up.set(-sp * sa, cp, -sp * ca)
  back.set(cp * sa, sp, cp * ca)
}

/** Unit direction from the focus to the camera, in ship-local space. */
export function orbitDirection(azimuth: number, pitch: number, out: Vector3): Vector3 {
  const cp = Math.cos(pitch)
  return out.set(cp * Math.sin(azimuth), Math.sin(pitch), cp * Math.cos(azimuth))
}

const Y_AXIS = new Vector3(0, 1, 0)

/** World point → ship-local space (body frame: position and heading, swing ignored). */
export function toShipLocal(out: Vector3, point: Vector3, shipPosition: Vector3, heading: number): Vector3 {
  return out.copy(point).sub(shipPosition).applyAxisAngle(Y_AXIS, -heading)
}

/** Ship-local vector → world orientation (heading only). */
export function rotateToWorld(out: Vector3, heading: number): Vector3 {
  return out.applyAxisAngle(Y_AXIS, heading)
}

const _dir = new Vector3()
const _o = new Vector3()
const _p = new Vector3()

/**
 * If the camera at `distance` would sit inside an obstacle grown by `margin`, returns the distance
 * where the view ray leaves it; otherwise returns `distance` unchanged.
 *
 * `swingInverse` (optional) maps the body frame into the swung ship's frame, so the test follows
 * the hull and envelope as they actually sway.
 */
export function clearDistance(
  obstacles: readonly Box3[],
  focus: Vector3,
  azimuth: number,
  pitch: number,
  distance: number,
  margin: number = motionConfig.camera.collisionMargin,
  swingInverse?: Quaternion,
): number {
  orbitDirection(azimuth, pitch, _dir)
  _o.copy(focus)
  if (swingInverse) {
    _dir.applyQuaternion(swingInverse)
    _o.applyQuaternion(swingInverse)
  }
  let d = distance
  // Two passes: pushing out of one volume can land inside the other.
  for (let pass = 0; pass < 2; pass++) {
    for (const box of obstacles) {
      const hit = rayBoxSpan(_o, _dir, box, margin)
      if (hit && d >= hit.enter && d < hit.exit) d = hit.exit
    }
  }
  return d
}

/**
 * How deep the camera at `distance` is inside any obstacle grown by `margin` (0 when clear), as the
 * distance to the nearest face. Unlike the exit distance along the view ray, this is continuous
 * wherever the camera enters, so a contact force built on it never jolts the camera.
 */
export function penetrationDepth(
  obstacles: readonly Box3[],
  focus: Vector3,
  azimuth: number,
  pitch: number,
  distance: number,
  margin: number,
  swingInverse?: Quaternion,
): number {
  _p.copy(focus).addScaledVector(orbitDirection(azimuth, pitch, _dir), distance)
  if (swingInverse) _p.applyQuaternion(swingInverse)
  let depth = 0
  for (const b of obstacles) {
    const d = Math.min(
      _p.x - b.min.x + margin,
      b.max.x + margin - _p.x,
      _p.y - b.min.y + margin,
      b.max.y + margin - _p.y,
      _p.z - b.min.z + margin,
      b.max.z + margin - _p.z,
    )
    depth = Math.max(depth, d)
  }
  return depth
}

const _span = { enter: 0, exit: 0 }
let tmin = 0
let tmax = 0

/** Clips [tmin, tmax] against one slab; false once the interval is empty. */
function slab(o: number, d: number, lo: number, hi: number): boolean {
  if (Math.abs(d) < 1e-9) return o >= lo && o <= hi
  let t1 = (lo - o) / d
  let t2 = (hi - o) / d
  if (t1 > t2) {
    const t = t1
    t1 = t2
    t2 = t
  }
  if (t1 > tmin) tmin = t1
  if (t2 < tmax) tmax = t2
  return tmin <= tmax
}

/** Where a ray from `o` along unit `d` enters and leaves `box` grown by `m` (null if it misses). */
function rayBoxSpan(o: Vector3, d: Vector3, box: Box3, m: number): { enter: number; exit: number } | null {
  tmin = -Infinity
  tmax = Infinity
  const { min, max } = box
  if (
    !slab(o.x, d.x, min.x - m, max.x + m) ||
    !slab(o.y, d.y, min.y - m, max.y + m) ||
    !slab(o.z, d.z, min.z - m, max.z + m) ||
    tmax <= 0
  )
    return null
  _span.enter = Math.max(tmin, 0)
  _span.exit = tmax
  return _span
}
