/**
 * Fixed-timestep accumulator ("fix your timestep").
 *
 * The simulation always advances in identical `step`-sized increments, regardless of the display's
 * refresh rate; the leftover fraction is returned as `alpha` so the renderer can interpolate between
 * the previous and current simulation states. Result: the same motion at 30, 60 or 144 Hz.
 */
export class FixedStepper {
  readonly step: number
  /** Longest frame we will simulate. Longer gaps (tab switch, debugger) are dropped, not replayed. */
  readonly maxFrameTime: number
  /** Number of steps taken during the last `advance` (debug only). */
  lastSteps = 0
  private accumulator = 0

  constructor(step: number, maxFrameTime: number) {
    this.step = step
    this.maxFrameTime = maxFrameTime
  }

  /**
   * Runs `tick` as many times as fit in the elapsed time and returns the interpolation alpha in
   * [0, 1). Each tick also gets `frameProgress`: how far through this frame's time span that step
   * ends (0–1), so per-frame input can be reconstructed at each step's moment.
   */
  advance(frameDt: number, tick: (dt: number, frameProgress: number) => void): number {
    const dt = Math.min(Math.max(frameDt, 0), this.maxFrameTime)
    // The simulation lags the start of this frame by the leftover from the previous one.
    const lag = this.accumulator
    this.accumulator += dt
    let steps = 0
    while (this.accumulator >= this.step) {
      steps++
      tick(this.step, dt > 0 ? Math.min((steps * this.step - lag) / dt, 1) : 1)
      this.accumulator -= this.step
    }
    this.lastSteps = steps
    return this.accumulator / this.step
  }

  reset(): void {
    this.accumulator = 0
  }
}
