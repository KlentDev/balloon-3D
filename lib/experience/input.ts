/**
 * Raw user input, sampled by the render loop. Listeners only record values; they never touch the
 * scene or React state, and the render loop never reads the DOM (which could force a style recalc).
 */
export const input = {
  scrollY: 0,
  /** Pointer position in [−1, 1] (y up). Stays 0 on touch-only devices. */
  pointerX: 0,
  pointerY: 0,
  reducedMotion: false,
}

/** Installs the input listeners; returns the cleanup. */
export function installInputListeners(): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  // Only a real hovering pointer gets parallax; touch input is reserved for scrolling.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

  const onScroll = () => {
    input.scrollY = window.scrollY
  }
  const onReduced = () => {
    input.reducedMotion = reduced.matches
  }
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch' || !finePointer.matches) return
    input.pointerX = (e.clientX / window.innerWidth) * 2 - 1
    input.pointerY = 1 - (e.clientY / window.innerHeight) * 2
  }
  const onLeave = () => {
    input.pointerX = 0
    input.pointerY = 0
  }
  const onOut = (e: PointerEvent) => {
    if (!e.relatedTarget) onLeave()
  }

  onScroll()
  onReduced()
  window.addEventListener('scroll', onScroll, { passive: true })
  reduced.addEventListener('change', onReduced)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerout', onOut)
  window.addEventListener('blur', onLeave)
  return () => {
    window.removeEventListener('scroll', onScroll)
    reduced.removeEventListener('change', onReduced)
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerout', onOut)
    window.removeEventListener('blur', onLeave)
  }
}
