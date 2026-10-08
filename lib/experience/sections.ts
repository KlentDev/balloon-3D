import { MathUtils } from 'three'
import { ScrollTrigger } from '@/lib/gsap'
import { motionConfig } from './motionConfig'
import type { ScreenRect, Shot } from './types'

/**
 * Registry of the page sections that drive the 3D shots.
 *
 * Each section registers one ScrollTrigger ("top center" → "bottom center"). Its midpoint is the
 * section's rest point: the scroll position where the section fills the viewport. The camera
 * blends between consecutive rest points, ordered by where the sections actually sit on the page
 * (DOM order), not by the order of keys in the config.
 *
 * This is input only: it reports where the UI is; the director decides how to frame around it.
 * Nothing here writes React state: the render loop samples it each frame.
 */
export interface SectionEntry {
  key: string
  shot: Shot
  element: HTMLElement
  trigger: ScrollTrigger
  /** The section's `data-scene-reserve` UI, padded, as viewport fractions at its rest point. */
  reserves: ScreenRect[]
  /** Bumped whenever the layout is re-measured, so cached framing can be invalidated. */
  layoutVersion: number
}

export interface ScrollBlend {
  from: SectionEntry
  to: SectionEntry
  /** 0 = at `from`'s shot, 1 = at `to`'s shot (already eased with the hold). */
  t: number
}

const registry: SectionEntry[] = []
let refreshListener = false

export function registerSection(key: string, shot: Shot, element: HTMLElement): () => void {
  const trigger = ScrollTrigger.create({ trigger: element, start: 'top center', end: 'bottom center' })
  const entry: SectionEntry = { key, shot, element, trigger, reserves: [], layoutVersion: 0 }
  measureReserves(entry)
  // Reserves can change size without a ScrollTrigger refresh (web fonts swapping in, content).
  const observer = new ResizeObserver(() => measureReserves(entry))
  element.querySelectorAll('[data-scene-reserve]').forEach((el) => observer.observe(el))
  registry.push(entry)
  sortRegistry()

  if (!refreshListener) {
    // Layout changes (resize, fonts, breakpoints) re-measure everything.
    ScrollTrigger.addEventListener('refresh', () => {
      registry.forEach(measureReserves)
      sortRegistry()
    })
    refreshListener = true
  }

  return () => {
    observer.disconnect()
    trigger.kill()
    const i = registry.indexOf(entry)
    if (i >= 0) registry.splice(i, 1)
  }
}

/** Writes where the scroll position sits between section shots into `out`; false if no sections exist yet. */
export function getScrollBlend(scrollY: number, out: ScrollBlend): boolean {
  const n = registry.length
  if (n === 0) return false
  out.t = 0
  if (scrollY <= restPoint(registry[0])) {
    out.from = out.to = registry[0]
    return true
  }
  for (let i = 0; i < n - 1; i++) {
    const a = restPoint(registry[i])
    const b = restPoint(registry[i + 1])
    if (scrollY < b) {
      out.from = registry[i]
      out.to = registry[i + 1]
      out.t = holdEase(b > a ? (scrollY - a) / (b - a) : 1)
      return true
    }
  }
  out.from = out.to = registry[n - 1]
  return true
}

/**
 * Maps linear progress between two rest points to shot blend: holds still near each rest point,
 * then smootherstep (zero velocity and acceleration at both ends) through the middle.
 */
export function holdEase(raw: number): number {
  const { hold } = motionConfig.scroll
  return MathUtils.smootherstep(raw, hold, 1 - hold)
}

function restPoint(e: SectionEntry): number {
  return (e.trigger.start + e.trigger.end) / 2
}

function sortRegistry() {
  registry.sort((a, b) => a.trigger.start - b.trigger.start)
}

/**
 * Layout position relative to the document, ignoring CSS transforms. Reserve elements are
 * animated (scroll parallax, reveal tweens), so transforms are deliberately not measured: position
 * `data-scene-reserve` elements with layout, not with transforms.
 */
function documentOffset(el: HTMLElement): { x: number; y: number } {
  let x = 0
  let y = 0
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft
    y += node.offsetTop
  }
  return { x, y }
}

function measureReserves(entry: SectionEntry) {
  const section = entry.element
  const w = section.clientWidth
  const h = section.clientHeight
  if (!w || !h) return
  const origin = documentOffset(section)
  const pad = motionConfig.camera.safeMargin * Math.min(w, h)

  entry.reserves = Array.from(section.querySelectorAll<HTMLElement>('[data-scene-reserve]'))
    .filter((el) => el.offsetWidth > 0 && el.offsetHeight > 0)
    .map((el) => {
      const o = documentOffset(el)
      const x = o.x - origin.x
      const y = o.y - origin.y
      return { x0: (x - pad) / w, x1: (x + el.offsetWidth + pad) / w, y0: (y - pad) / h, y1: (y + el.offsetHeight + pad) / h }
    })
  entry.layoutVersion++
}
