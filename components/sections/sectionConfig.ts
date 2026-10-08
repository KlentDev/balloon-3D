import type { Shot } from '@/lib/experience/types'

/**
 * One camera shot per page section (keys match `useSectionTimeline(key)`). The fields and angle
 * conventions are documented on `Shot` in lib/experience/types.ts. Camera distance is never
 * authored: it is solved per viewport from the subject's silhouette and the section's UI.
 * Different headings between sections make every transition a real turn, which the ship banks into.
 */
export const sections = {
  hero: {
    // The whole airship, three-quarter view from slightly below.
    ship: { heading: 0 },
    camera: { subject: 'ship', azimuth: 18, elevation: -4, fov: 35 },
  },
  propeller: {
    // Close on the starboard propeller, from the side and a little ahead.
    ship: { heading: 20 },
    camera: { subject: 'propeller', azimuth: 25, elevation: 6, context: 2.2, fov: 35 },
  },
  envelope: {
    // Looking up at the envelope from below.
    ship: { heading: -15 },
    camera: { subject: 'envelope', azimuth: -10, elevation: -18, context: 1, fov: 38 },
  },
  steering: {
    // The captain's wheel at the stern, from above on the port side.
    ship: { heading: 30 },
    camera: { subject: 'wheel', azimuth: 160, elevation: 30, context: 2.6, fov: 35 },
  },
  telescope: {
    // The brass telescope on top of the envelope, from above and ahead.
    ship: { heading: 10 },
    camera: { subject: 'telescope', azimuth: 50, elevation: 25, context: 1.5, fov: 35 },
  },
  wings: {
    // The starboard wing spread, from ahead and slightly below.
    ship: { heading: 35 },
    camera: { subject: 'wings', azimuth: 55, elevation: -8, context: 0.8, fov: 35 },
  },
  footer: {
    // Pulling back: the whole ship sailing on, from the rear quarter.
    ship: { heading: -25 },
    camera: { subject: 'ship', azimuth: -40, elevation: 10, fov: 35 },
  },
} satisfies Record<string, Shot>

export type SectionKey = keyof typeof sections
