import { createTargets, direct } from './director'
import { motionConfig } from './motionConfig'
import type { ScrollBlend } from './sections'
import { Simulation, createRenderState } from './simulation'
import type { ShipData } from './types'
import { FixedStepper } from '@/lib/motion/fixedStep'

export interface FrameInput {
  /** Scroll position (any unit, consistent with `resolveBlend` and `viewportHeight`). */
  scroll: number
  viewportHeight: number
  aspect: number
  pointerX: number
  pointerY: number
  reducedMotion: boolean
}

/** Fills `out` with the shot blend at a scroll position; false if there are no sections yet. */
export type BlendResolver = (scroll: number, out: ScrollBlend) => boolean

/**
 * Drives the simulation from per-frame input.
 *
 * Input arrives once per rendered frame, but the simulation steps at a fixed 120 Hz. Rather than
 * holding the newest scroll value for every sub-step (a staircase whose shape depends on the frame
 * rate), the scroll position is reconstructed linearly across the frame and the targets are
 * re-blended on every sub-step. The simulation therefore sees nearly the same input at 30, 60 or
 * 144 fps.
 */
export class Engine {
  readonly sim: Simulation
  readonly stepper = new FixedStepper(motionConfig.sim.step, motionConfig.sim.maxFrameTime)
  readonly render = createRenderState()
  /** Interpolation factor of the last frame (debug). */
  alpha = 0

  private readonly resolveBlend: BlendResolver
  private readonly blend = {} as ScrollBlend
  private aspect = 1
  private scrollFrom = 0
  private scrollTo = 0

  constructor(ship: ShipData, resolveBlend: BlendResolver) {
    this.sim = new Simulation(ship, createTargets())
    this.resolveBlend = resolveBlend
  }

  /** Advances one rendered frame. Returns false while there is nothing to show (no sections yet). */
  frame(dt: number, input: FrameInput, snap = false): boolean {
    if (!this.resolveBlend(input.scroll, this.blend)) return false
    const sim = this.sim
    this.aspect = input.aspect
    sim.input.pointerX = input.pointerX
    sim.input.pointerY = input.pointerY
    sim.input.reducedMotion = input.reducedMotion

    if (!sim.initialized || snap) {
      direct(this.blend, sim.ship, input.aspect, sim.targets)
      sim.input.scrollSpeed = 0
      sim.reset(!input.reducedMotion && !snap)
      this.stepper.reset()
      this.scrollFrom = this.scrollTo = input.scroll
      this.alpha = 0
    } else {
      this.scrollFrom = this.scrollTo
      this.scrollTo = input.scroll
      sim.input.scrollSpeed = dt > 0 ? (this.scrollTo - this.scrollFrom) / input.viewportHeight / dt : 0
      this.alpha = this.stepper.advance(dt, this.step)
    }
    sim.interpolate(this.alpha, this.render)
    return true
  }

  /** One fixed step, with the scroll input reconstructed at that step's moment within the frame. */
  private readonly step = (dt: number, frameProgress: number): void => {
    const scroll = this.scrollFrom + (this.scrollTo - this.scrollFrom) * frameProgress
    if (this.resolveBlend(scroll, this.blend)) direct(this.blend, this.sim.ship, this.aspect, this.sim.targets)
    this.sim.tick(dt)
  }
}
