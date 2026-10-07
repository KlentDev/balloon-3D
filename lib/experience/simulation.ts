import { Euler, MathUtils, Quaternion, Vector3 } from 'three'
import { noise1 } from '@/lib/motion/noise'
import {
  createSpring,
  nearestAngle,
  resetSpring,
  stepSpring,
  stepSpringVec3,
  type SpringVec3,
} from '@/lib/motion/spring'
import type { Targets } from './director'
import { clearDistance, penetrationDepth, rotateToWorld, toShipLocal } from './geometry'
import { motionConfig } from './motionConfig'
import type { ShipData } from './types'

/** Everything the renderer needs from one simulation step. Interpolated between steps. */
export interface RenderState {
  shipPosition: Vector3
  /** Ship heading (yaw about +Y), radians, unwrapped. */
  heading: number
  /** Gondola swing: roll about the ship's forward axis (+X) and pitch about its starboard axis (+Z). */
  bank: number
  pitch: number
  /** Camera focus, world. */
  focus: Vector3
  /** Camera orbit around the focus (including pointer offset), radians. */
  cameraYaw: number
  cameraPitch: number
  distance: number
  fov: number
  shiftX: number
  shiftY: number
  airspeed: number
  /** 0 at cruise, 1 at max airspeed: drives the speed FOV and the propeller/wing clip speed. */
  throttle: number
}

export function createRenderState(): RenderState {
  return {
    shipPosition: new Vector3(),
    heading: 0,
    bank: 0,
    pitch: 0,
    focus: new Vector3(),
    cameraYaw: 0,
    cameraPitch: 0,
    distance: 0,
    fov: 0,
    shiftX: 0,
    shiftY: 0,
    airspeed: 0,
    throttle: 0,
  }
}

/** Per-frame inputs to the simulation, held constant across the frame's sub-steps. */
export interface SimInput {
  /** Scroll speed, viewport heights per second (signed). */
  scrollSpeed: number
  pointerX: number
  pointerY: number
  reducedMotion: boolean
}

const springVec3 = (): SpringVec3<Vector3> => ({ value: new Vector3(), velocity: new Vector3() })
const DEG = MathUtils.DEG2RAD

/**
 * The motion system. One fixed-timestep `tick` advances, in causal order:
 *
 *   ship body (position, heading, airspeed) → its acceleration → gondola swing
 *   → camera focus (follows the body, not the swing) → camera orbit, distance, lens.
 *
 * Every animated value is a spring toward a target supplied by the director, so changing targets
 * mid-transition never breaks velocity continuity.
 */
export class Simulation {
  readonly targets: Targets
  readonly input: SimInput = { scrollSpeed: 0, pointerX: 0, pointerY: 0, reducedMotion: false }
  /** The last two steps' states; swapped each step, interpolated for rendering. */
  prev = createRenderState()
  curr = createRenderState()
  time = 0
  initialized = false

  // Ship body
  readonly shipPos = springVec3()
  readonly heading = createSpring()
  airspeed: number = motionConfig.ship.cruiseSpeed
  throttle = 0
  readonly acceleration = new Vector3()
  readonly bank = createSpring()
  readonly pitch = createSpring()

  // Camera rig
  readonly focus = springVec3()
  readonly cameraYaw = createSpring()
  readonly cameraPitch = createSpring()
  readonly distance = createSpring()
  readonly fov = createSpring()
  readonly shiftX = createSpring()
  readonly shiftY = createSpring()
  readonly pointerYaw = createSpring()
  readonly pointerPitch = createSpring()

  readonly ship: ShipData
  private readonly prevVelocity = new Vector3()
  private readonly shipTarget = new Vector3()
  private readonly focusTarget = new Vector3()
  private readonly localFocus = new Vector3()

  constructor(ship: ShipData, targets: Targets) {
    this.ship = ship
    this.targets = targets
  }

  /** Starts at rest on the current targets. With `intro`, the ship starts low and rises in. */
  reset(intro: boolean): void {
    const t = this.targets
    this.time = 0
    this.shipPos.value.copy(t.shipPosition)
    if (intro) this.shipPos.value.y -= motionConfig.ship.introDrop
    this.shipPos.velocity.set(0, 0, 0)
    this.prevVelocity.set(0, 0, 0)
    this.acceleration.set(0, 0, 0)
    resetSpring(this.heading, t.heading)
    this.airspeed = motionConfig.ship.cruiseSpeed
    this.throttle = 0
    resetSpring(this.bank, 0)
    resetSpring(this.pitch, 0)

    this.computeFocusTarget(this.focusTarget)
    this.focus.value.copy(this.focusTarget)
    this.focus.velocity.set(0, 0, 0)
    resetSpring(this.cameraYaw, t.cameraYaw)
    resetSpring(this.cameraPitch, t.cameraPitch)
    resetSpring(this.distance, t.distance)
    resetSpring(this.fov, t.fov)
    resetSpring(this.shiftX, t.shiftX)
    resetSpring(this.shiftY, t.shiftY)
    resetSpring(this.pointerYaw, 0)
    resetSpring(this.pointerPitch, 0)

    this.capture(this.curr)
    this.capture(this.prev)
    this.initialized = true
  }

  /** One fixed step. Bound once so the stepper can call it without allocating. */
  readonly tick = (dt: number): void => {
    this.time += dt
    this.stepShip(dt)
    this.stepCamera(dt)
    const prev = this.prev
    this.prev = this.curr
    this.curr = prev
    this.capture(this.curr)
  }

  private stepShip(dt: number) {
    const cfg = motionConfig.ship
    const t = this.targets
    const reduced = this.input.reducedMotion

    // Wind: smooth noise displacing the target is identical to applying the force ω²·offset.
    this.shipTarget.copy(t.shipPosition)
    if (!reduced) {
      const f = this.time * cfg.turbulence.frequency
      const a = cfg.turbulence.amplitude
      this.shipTarget.x += a * noise1(f, 11)
      this.shipTarget.y += a * 0.6 * noise1(f, 23)
      this.shipTarget.z += a * noise1(f, 37)
    }
    this.prevVelocity.copy(this.shipPos.velocity)
    stepSpringVec3(this.shipPos, this.shipTarget, cfg.position, dt)
    this.acceleration.copy(this.shipPos.velocity).sub(this.prevVelocity).divideScalar(dt)

    stepSpring(this.heading, nearestAngle(this.heading.value, t.heading), cfg.heading, dt)
    const yawRate = this.heading.velocity

    // Scrolling is the throttle: scroll speed raises airspeed through a first-order lag.
    const speed = reduced ? 0 : Math.min(Math.abs(this.input.scrollSpeed), motionConfig.scroll.maxSpeed)
    const targetAirspeed = Math.min(cfg.cruiseSpeed + cfg.throttleGain * speed, cfg.maxAirspeed)
    const airAccel = (targetAirspeed - this.airspeed) / cfg.throttleLag
    this.airspeed += airAccel * dt
    this.throttle = MathUtils.clamp((this.airspeed - cfg.cruiseSpeed) / (cfg.maxAirspeed - cfg.cruiseSpeed), 0, 1)

    // Acceleration in the ship's frame. Nose = Ry(h)·(+X), starboard = Ry(h)·(+Z).
    const h = this.heading.value
    const ch = Math.cos(h)
    const sh = Math.sin(h)
    const a = this.acceleration
    const aForward = a.x * ch - a.z * sh + airAccel
    // A turn at airspeed v and yaw rate ω has centripetal acceleration v·ω toward the inside
    // of the turn. Positive yaw turns to port (−Z), hence the minus sign.
    const aStarboard = a.x * sh + a.z * ch - this.airspeed * yawRate

    // Pendulum under the envelope: the top leans toward the acceleration.
    const g = cfg.swingGravity
    const swingScale = reduced ? motionConfig.reducedMotion.swingScale : 1
    const climb = cfg.climbPitch * Math.atan2(this.shipPos.velocity.y, this.airspeed)
    const bankEq = softClamp(Math.atan2(aStarboard, g), cfg.maxBank * DEG) * swingScale
    const pitchEq = softClamp(-Math.atan2(aForward, g) + climb, cfg.maxPitch * DEG) * swingScale
    stepSpring(this.bank, bankEq, cfg.swing, dt)
    stepSpring(this.pitch, pitchEq, cfg.swing, dt)
  }

  private stepCamera(dt: number) {
    const cam = motionConfig.camera
    const t = this.targets
    const reduced = this.input.reducedMotion

    this.computeFocusTarget(this.focusTarget)
    stepSpringVec3(this.focus, this.focusTarget, cam.focus, dt)

    stepSpring(this.cameraYaw, nearestAngle(this.cameraYaw.value, t.cameraYaw), cam.orbit, dt)
    stepSpring(this.cameraPitch, t.cameraPitch, cam.orbit, dt)

    const p = motionConfig.pointer
    const px = reduced ? 0 : this.input.pointerX
    const py = reduced ? 0 : this.input.pointerY
    stepSpring(this.pointerYaw, px * p.maxYaw * DEG, p.spring, dt)
    stepSpring(this.pointerPitch, py * p.maxPitch * DEG, p.spring, dt)

    // Collision with the hull and envelope, evaluated for the camera's current orbit direction.
    const h = this.heading.value
    const local = toShipLocal(this.localFocus, this.focus.value, this.shipPos.value, h)
    const azimuth = this.cameraYaw.value + this.pointerYaw.value - h
    const pitch = this.totalPitch()
    const obstacles = this.ship.obstacles
    // Test against the hull and envelope as they actually hang (swing rotates about the body origin).
    const swingInverse = _swingInverse.setFromEuler(_euler.set(this.swungBank(), 0, this.swungPitch())).invert()
    // Penalty contact inside the safety margin: a push-out force proportional to penetration depth
    // (zero at the margin's edge, so it never jolts), with damping that ramps in the same way…
    const depth = penetrationDepth(obstacles, local, azimuth, pitch, this.distance.value, cam.collisionMargin, swingInverse)
    if (depth > 0) {
      const omega = 2 * Math.PI * cam.collision.frequency
      const ramp = Math.min(depth / (0.25 * cam.collisionMargin), 1)
      this.distance.velocity += (omega * omega * depth - 2 * cam.collision.damping * omega * ramp * this.distance.velocity) * dt
    }
    stepSpring(this.distance, t.distance, cam.distance, dt)
    // …and the solid surface itself is a hard limit, as a last resort.
    const hard = clearDistance(obstacles, local, azimuth, pitch, this.distance.value, 0, swingInverse)
    if (this.distance.value < hard) {
      this.distance.value = hard
      this.distance.velocity = Math.max(this.distance.velocity, 0)
    }

    stepSpring(this.fov, t.fov + cam.speedFov * this.throttle, cam.lens, dt)
    stepSpring(this.shiftX, t.shiftX, cam.lens, dt)
    stepSpring(this.shiftY, t.shiftY, cam.lens, dt)
  }

  /**
   * The camera aims at the subject on the ship *body* (heading applied, swing not), following
   * only part of the body's deviation from its rest pose, plus a short look-ahead along its velocity.
   */
  private computeFocusTarget(out: Vector3) {
    const cam = motionConfig.camera
    const t = this.targets
    out.copy(this.shipPos.value).sub(t.shipPosition).multiplyScalar(cam.follow).add(t.shipPosition)
    out.add(rotateToWorld(_tmp.copy(t.focusLocal), this.heading.value))
    _tmp.copy(this.shipPos.velocity).multiplyScalar(cam.lookAhead).clampLength(0, cam.maxLookAhead)
    out.add(_tmp)
  }

  // The swing spring may overshoot its (already limited) equilibrium; saturate smoothly so the
  // configured limits always hold without a hard clip.
  private swungBank() {
    return softClamp(this.bank.value, motionConfig.ship.maxBank * DEG)
  }

  private swungPitch() {
    return softClamp(this.pitch.value, motionConfig.ship.maxPitch * DEG)
  }

  private totalPitch() {
    const [lo, hi] = motionConfig.camera.pitchLimits
    return MathUtils.clamp(this.cameraPitch.value + this.pointerPitch.value, lo * DEG, hi * DEG)
  }

  private capture(s: RenderState) {
    s.shipPosition.copy(this.shipPos.value)
    s.heading = this.heading.value
    s.bank = this.swungBank()
    s.pitch = this.swungPitch()
    s.focus.copy(this.focus.value)
    s.cameraYaw = this.cameraYaw.value + this.pointerYaw.value
    s.cameraPitch = this.totalPitch()
    s.distance = this.distance.value
    s.fov = this.fov.value
    s.shiftX = this.shiftX.value
    s.shiftY = this.shiftY.value
    s.airspeed = this.airspeed
    s.throttle = this.throttle
  }

  /** Render state between the last two steps; `alpha` comes from the fixed stepper. */
  interpolate(alpha: number, out: RenderState): RenderState {
    const a = this.prev
    const b = this.curr
    const lerp = MathUtils.lerp
    out.shipPosition.lerpVectors(a.shipPosition, b.shipPosition, alpha)
    out.heading = lerp(a.heading, b.heading, alpha)
    out.bank = lerp(a.bank, b.bank, alpha)
    out.pitch = lerp(a.pitch, b.pitch, alpha)
    out.focus.lerpVectors(a.focus, b.focus, alpha)
    out.cameraYaw = lerp(a.cameraYaw, b.cameraYaw, alpha)
    out.cameraPitch = lerp(a.cameraPitch, b.cameraPitch, alpha)
    out.distance = lerp(a.distance, b.distance, alpha)
    out.fov = lerp(a.fov, b.fov, alpha)
    out.shiftX = lerp(a.shiftX, b.shiftX, alpha)
    out.shiftY = lerp(a.shiftY, b.shiftY, alpha)
    out.airspeed = lerp(a.airspeed, b.airspeed, alpha)
    out.throttle = lerp(a.throttle, b.throttle, alpha)
    return out
  }
}

const _tmp = new Vector3()
const _euler = new Euler()
const _swingInverse = new Quaternion()

/** Saturates smoothly toward ±limit instead of hitting a hard wall. */
function softClamp(x: number, limit: number): number {
  return limit * Math.tanh(x / limit)
}
