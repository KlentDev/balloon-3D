import { useEffect, useRef } from 'react'
import { sections, type SectionKey } from '@/components/sections/sectionConfig'
import { registerSection } from '@/lib/experience/sections'

/**
 * Registers a page section as a 3D shot. The camera blends between the shots of consecutive
 * sections as the page scrolls (see lib/experience/sections.ts); the shot itself lives in
 * sectionConfig.ts. Mark the section's text column with `data-scene-reserve` so the camera keeps
 * the airship clear of it.
 */
export function useSectionTimeline(key: SectionKey) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    return registerSection(key, sections[key], sectionRef.current)
  }, [key])

  return sectionRef
}
