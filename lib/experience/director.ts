import { MathUtils, Vector3 } from 'three'
import { lerpAngle } from '@/lib/motion/spring'
import { clearDistance, orbitBasis } from './geometry'
import { SHIP_LENGTH, motionConfig } from './motionConfig'
import type { ScrollBlend, SectionEntry } from './sections'
import type { ScreenRect, ShipData, Shot } from './types'

/**
 * The director turns "where the user is on the page" into desired values for the simulation.
 * It holds no motion state: the simulation decides how to get there.
 */
export interface Targets {
  /** Ship heading, world, radians. */
  heading: number
  /** Ship body position, world units. */
  shipPosition: Vector3
  /** Point the camera aims at, in ship-local space. */
  focusLocal: Vector3
  /** Camera orbit angles around the focus (world yaw, elevation), radians. */
  cameraYaw: number
  cameraPitch: number
  distance: number
  /** Vertical FOV, degrees. */
  fov: number
  /** Where the focus sits on screen, NDC. Applied as lens shift. */
  shiftX: number
  shiftY: number
}

export function createTargets(): Targets {
  return {
    heading: 0,
    shipPosition: new Vector3(),
    focusLocal: new Vector3(),
    cameraYaw: 0,
    cameraPitch: 0,
    distance: 0,
    fov: 0,
    shiftX: 0,
    shiftY: 0,
  }
}

interface SolvedShot {
  targets: Targets
  /** The screen region the subject is composed in (debug display). */
  rect: ScreenRect
  ship: ShipData
  aspect: number
  layoutVersion: number
}

/**
 * Solved shots depend only on the section (shot + UI layout), the ship and the aspect ratio — not
 * on scroll — so they are solved once and reused until one of those changes.
 */
const solved = new WeakMap<SectionEntry, SolvedShot>()

function shotFor(entry: SectionEntry, ship: ShipData, aspect: number): SolvedShot {
  let s = solved.get(entry)
  if (!s || s.ship !== ship || s.aspect !== aspect || s.layoutVersion !== entry.layoutVersion) {
    s = s ?? { targets: createTargets(), rect: FULL_SCREEN, ship, aspect, layoutVersion: entry.layoutVersion }
    s.ship = ship
    s.aspect = aspect
    s.layoutVersion = entry.layoutVersion
    s.rect = solveShot(entry.shot, entry.reserves, ship, aspect, s.targets)
    solved.set(entry, s)
  }
  return s
}

/** The screen region the section's subject is composed in (debug display). */
export function composedRect(entry: SectionEntry, ship: ShipData, aspect: number): ScreenRect {
  return shotFor(entry, ship, aspect).rect
}

/** Blends the shots of the two sections around the scroll position. Writes into `out`. */
export function direct(blend: ScrollBlend, ship: ShipData, aspect: number, out: Targets): Targets {
  const t = blend.t
  if (t <= 0 || blend.from === blend.to) return copyTargets(out, shotFor(blend.from, ship, aspect).targets)
  if (t >= 1) return copyTargets(out, shotFor(blend.to, ship, aspect).targets)
  const a = shotFor(blend.from, ship, aspect).targets
  const b = shotFor(blend.to, ship, aspect).targets
  out.heading = lerpAngle(a.heading, b.heading, t)
  out.shipPosition.lerpVectors(a.shipPosition, b.shipPosition, t)
  out.focusLocal.lerpVectors(a.focusLocal, b.focusLocal, t)
  out.cameraYaw = lerpAngle(a.cameraYaw, b.cameraYaw, t)
  out.cameraPitch = MathUtils.lerp(a.cameraPitch, b.cameraPitch, t)
  // Zoom is perceived logarithmically: interpolate distance in log space for an even dolly.
  out.distance = Math.exp(MathUtils.lerp(Math.log(a.distance), Math.log(b.distance), t))
  out.fov = MathUtils.lerp(a.fov, b.fov, t)
  out.shiftX = MathUtils.lerp(a.shiftX, b.shiftX, t)
  out.shiftY = MathUtils.lerp(a.shiftY, b.shiftY, t)
  return out
}

const FULL_SCREEN: ScreenRect = { x0: 0, x1: 1, y0: 0, y1: 1 }

/**
 * Resolves one shot for the current viewport and returns the screen region it is composed in.
 *
 * Every free region around the UI is tried, and the one that lets the camera frame the subject
 * from closest (i.e. shows it largest) wins. If even that would shrink the subject well below its
 * full-screen size — the UI covers most of a small screen — the subject is framed on the whole
 * screen instead, behind the translucent cards, rather than becoming a speck.
 */
export function solveShot(
  shot: Shot,
  reserves: readonly ScreenRect[],
  ship: ShipData,
  aspect: number,
  out: Targets,
): ScreenRect {
  const cam = motionConfig.camera
  const heading = MathUtils.degToRad(shot.ship.heading)
  const azimuth = MathUtils.degToRad(shot.camera.azimuth)
  const pitch = MathUtils.degToRad(MathUtils.clamp(shot.camera.elevation, cam.pitchLimits[0], cam.pitchLimits[1]))
  const fov = portraitFov(shot.camera.fov, aspect)
  const subject = ship.subjects[shot.camera.subject]
  const context = shot.camera.context ?? 1
  const tanV = Math.tan(MathUtils.degToRad(fov / 2))
  const fit = (r: ScreenRect) =>
    silhouetteFitDistance(subject.silhouette, subject.center, context, azimuth, pitch,
      tanV * aspect * (r.x1 - r.x0) * cam.fill, tanV * (r.y1 - r.y0) * cam.fill)

  // Screen-edge margin: a fraction of the smaller screen side, on both axes.
  const mx = cam.safeMargin * Math.min(1, 1 / aspect)
  const my = cam.safeMargin * Math.min(1, aspect)
  const full = { x0: mx, x1: 1 - mx, y0: my, y1: 1 - my }
  let rect = full
  let distance = fit(full)
  if (reserves.length > 0) {
    let best: ScreenRect | null = null
    let bestDistance = Infinity
    for (const r of freeRegions(full, reserves)) {
      const d = fit(r)
      if (d < bestDistance) {
        best = r
        bestDistance = d
      }
    }
    if (best && bestDistance <= distance * cam.crowdedFallback) {
      rect = best
      distance = bestDistance
    }
  }

  out.heading = heading
  const o = shot.ship.offset
  out.shipPosition.set(o?.[0] ?? 0, o?.[1] ?? 0, o?.[2] ?? 0).multiplyScalar(SHIP_LENGTH)
  out.focusLocal.copy(subject.center)
  out.cameraYaw = heading + azimuth
  out.cameraPitch = pitch
  out.fov = fov
  // Composition: lens shift centres the subject in its region without rotating the camera.
  out.shiftX = rect.x0 + rect.x1 - 1
  out.shiftY = 1 - (rect.y0 + rect.y1)
  out.distance = clearDistance(ship.obstacles, out.focusLocal, azimuth, pitch, distance)
  return rect
}

/**
 * Vertical FOV policy: on narrow (portrait) screens the horizontal FOV collapses, so widen the
 * vertical FOV until the horizontal one reaches a minimum — capped so perspective stays natural.
 */
export function portraitFov(fov: number, aspect: number): number {
  const { minHorizontalFov, maxFov } = motionConfig.camera
  const needed = MathUtils.radToDeg(2 * Math.atan(Math.tan(MathUtils.degToRad(minHorizontalFov / 2)) / aspect))
  return MathUtils.clamp(needed, fov, Math.max(fov, maxFov))
}

/**
 * Maximal rectangles inside `bounds` that overlap none of the `blocks`. Brute force over the
 * blocks' edges — there are only ever a handful of them, and this runs once per layout.
 */
function freeRegions(bounds: ScreenRect, blocks: readonly ScreenRect[]): ScreenRect[] {
  const edges = (lo: number, hi: number, values: number[]) =>
    [...new Set([lo, hi, ...values.map((v) => MathUtils.clamp(v, lo, hi))])].sort((a, b) => a - b)
  const xs = edges(bounds.x0, bounds.x1, blocks.flatMap((b) => [b.x0, b.x1]))
  const ys = edges(bounds.y0, bounds.y1, blocks.flatMap((b) => [b.y0, b.y1]))
  const free = (r: ScreenRect) => !blocks.some((b) => b.x0 < r.x1 && b.x1 > r.x0 && b.y0 < r.y1 && b.y1 > r.y0)

  const regions: ScreenRect[] = []
  for (let i = 0; i < xs.length; i++)
    for (let j = i + 1; j < xs.length; j++)
      for (let k = 0; k < ys.length; k++)
        for (let l = k + 1; l < ys.length; l++) {
          const r = { x0: xs[i], x1: xs[j], y0: ys[k], y1: ys[l] }
          if (free(r)) regions.push(r)
        }
  // A region inside a larger free one can never fit the subject closer: keep only maximal ones.
  const inside = (a: ScreenRect, b: ScreenRect) => a !== b && a.x0 >= b.x0 && a.x1 <= b.x1 && a.y0 >= b.y0 && a.y1 <= b.y1
  return regions.filter((r) => !regions.some((o) => inside(r, o)))
}

const _right = new Vector3()
const _up = new Vector3()
const _back = new Vector3()
const _v = new Vector3()

/**
 * Exact perspective fit of a silhouette: the smallest camera distance at which every point projects
 * inside ±tx / ±ty (tangent half-extents). A point at view coordinates (x, y, z) sits at depth
 * d − z, so it fits when d ≥ z + |x| / tx and d ≥ z + |y| / ty. `context` scales the silhouette
 * about its centre. `azimuth` is relative to the ship, so heading does not matter.
 */
function silhouetteFitDistance(
  points: readonly Vector3[],
  center: Vector3,
  context: number,
  azimuth: number,
  pitch: number,
  tx: number,
  ty: number,
): number {
  orbitBasis(azimuth, pitch, _right, _up, _back)
  let d = 0
  for (const point of points) {
    _v.subVectors(point, center).multiplyScalar(context)
    const z = _v.dot(_back)
    d = Math.max(d, z + Math.abs(_v.dot(_right)) / tx, z + Math.abs(_v.dot(_up)) / ty)
  }
  return d
}

function copyTargets(dst: Targets, src: Targets): Targets {
  dst.heading = src.heading
  dst.shipPosition.copy(src.shipPosition)
  dst.focusLocal.copy(src.focusLocal)
  dst.cameraYaw = src.cameraYaw
  dst.cameraPitch = src.cameraPitch
  dst.distance = src.distance
  dst.fov = src.fov
  dst.shiftX = src.shiftX
  dst.shiftY = src.shiftY
  return dst
}
