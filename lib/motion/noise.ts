import { MathUtils } from 'three'

/**
 * Deterministic 1-D value noise in [−1, 1] with C² continuity (quintic fade).
 * Used as a slowly varying wind field: smooth enough to be applied as a force without jitter,
 * and deterministic so the simulation is reproducible.
 */
function hash(i: number, seed: number): number {
  const s = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453123
  return s - Math.floor(s)
}

export function noise1(x: number, seed = 0): number {
  const i = Math.floor(x)
  const f = x - i
  const u = MathUtils.smootherstep(f, 0, 1)
  const a = hash(i, seed)
  const b = hash(i + 1, seed)
  return (a + (b - a) * u) * 2 - 1
}
