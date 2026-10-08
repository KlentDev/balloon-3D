import type { Box3, Vector3 } from 'three'

/** Parts of the airship a shot can be about. Positions are derived from the model (see shipModel.ts). */
export type PartName = 'hull' | 'envelope' | 'wheel' | 'telescope' | 'propeller' | 'wings'
export type Subject = 'ship' | PartName

/**
 * One camera "shot" per page section. All angles in degrees.
 *
 * Nothing here is a raw coordinate: the camera is placed by orbit angles around a named part of
 * the ship, and its distance is solved from the subject's measured silhouette, the viewport and
 * the page's UI (see director.ts).
 */
export interface Shot {
  ship: {
    /** World heading. 0 = nose toward +X; positive turns the nose to port (left). */
    heading: number
    /** Offset of the ship from the world origin, in ship lengths. Default [0, 0, 0]. */
    offset?: readonly [number, number, number]
  }
  camera: {
    /** What the shot frames: the whole ship, or one of its parts. */
    subject: Subject
    /**
     * Camera direction around the subject, measured from the ship's starboard beam:
     * 0 = starboard profile (nose to screen right), 90 = head-on, −90 = from behind, 180 = port side.
     */
    azimuth: number
    /** Positive = camera above the subject, looking down. */
    elevation: number
    /**
     * How much surroundings to include, as a multiple of the subject's size: 1 = the subject just
     * fills the free screen area, 2 = it fills about half of it, < 1 crops into it. Default 1.
     */
    context?: number
    /** Vertical field of view before the portrait policy is applied. */
    fov: number
  }
}

/** Measured, normalised description of the loaded airship (ship-local space, world units). */
export interface ShipData {
  /** GLB units → world units. */
  scale: number
  /** Centre of buoyancy (envelope centre) in GLB units; the ship body's origin. */
  pivot: Vector3
  /** Whole-ship bounds (debug display). */
  bounds: Box3
  /** Per subject: aim point, and its outermost vertices along many directions (its true silhouette). */
  subjects: Record<Subject, { center: Vector3; silhouette: Vector3[] }>
  /** Solid volumes the camera must stay out of (hull and envelope). */
  obstacles: Box3[]
}

/** A screen region as viewport fractions (y measured from the top). */
export interface ScreenRect {
  x0: number
  x1: number
  y0: number
  y1: number
}
