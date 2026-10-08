/**
 * Every tuning knob of the 3D motion system, in one place.
 *
 * Units: world units, where the airship is normalised so that its length (nose → tail) is
 * SHIP_LENGTH. Angles are degrees unless the name says otherwise. Spring `frequency` is in Hz,
 * `damping` is the damping ratio ζ (1 = no overshoot, < 1 = swing).
 */
export const SHIP_LENGTH = 10

export const motionConfig = {
  sim: {
    /** Fixed simulation step (s). */
    step: 1 / 120,
    /** Longest frame gap that is simulated (s); longer gaps (tab switch) are dropped. */
    maxFrameTime: 0.25,
  },

  scroll: {
    /**
     * Fraction of the scroll distance between two section rest points, at each end, during which
     * the shot holds still. 0.18 → the camera settles on a shot for the middle ~36 % of each section.
     */
    hold: 0.18,
    /** Scroll speed (viewport heights / s) beyond which extra speed is ignored. */
    maxSpeed: 4,
  },

  ship: {
    position: { frequency: 0.35, damping: 1 },
    heading: { frequency: 0.3, damping: 1 },
    /**
     * Notional forward airspeed (units/s). There is no world to fly through, so forward travel is not
     * integrated; airspeed only drives what would be visible: banking in turns, pitching on throttle
     * changes and propeller speed.
     */
    cruiseSpeed: 1 * SHIP_LENGTH,
    maxAirspeed: 2.5 * SHIP_LENGTH,
    /** Extra airspeed per (viewport height / s) of scrolling — scrolling is the throttle. */
    throttleGain: 0.6 * SHIP_LENGTH,
    /** Time constant of the airspeed response (s). */
    throttleLag: 0.6,
    /**
     * Gondola swing: the hull hangs under the envelope, so accelerations tilt the ship about the
     * centre of buoyancy — equilibrium tilt = atan(a / swingGravity), then an under-damped spring
     * toward it. Lower swingGravity = more lean per unit of acceleration.
     */
    swing: { frequency: 0.45, damping: 0.45 },
    swingGravity: 6 * SHIP_LENGTH,
    maxBank: 9,
    maxPitch: 6,
    /** How much of the climb angle (vertical vs forward speed) becomes nose-up pitch. */
    climbPitch: 0.5,
    /** Wind: smooth noise applied as a force, displacing the ship by about `amplitude`. */
    turbulence: { amplitude: 0.03 * SHIP_LENGTH, frequency: 0.08 },
    /** The ship starts this far below its first pose and rises into frame. */
    introDrop: 1.2 * SHIP_LENGTH,
    /** Animation clip speed (propellers, wings) at cruise and at max airspeed. */
    clipSpeed: { cruise: 1, max: 1.8 },
  },

  camera: {
    /** Point the camera aims at; follows the ship body (never its swing). */
    focus: { frequency: 1.0, damping: 1 },
    /**
     * Fraction of the ship's deviation from its rest pose the camera follows. < 1 lets the ship's
     * own motion (turbulence, the intro rise) read on screen instead of being cancelled out.
     */
    follow: 0.65,
    /** Aim ahead of the ship by its velocity × this time (s), clamped to maxLookAhead. */
    lookAhead: 0.4,
    maxLookAhead: 0.25 * SHIP_LENGTH,
    orbit: { frequency: 0.45, damping: 1 },
    distance: { frequency: 0.4, damping: 1 },
    /** FOV and lens-shift (composition) response. */
    lens: { frequency: 0.55, damping: 1 },
    pitchLimits: [-60, 70] as const,
    /** Extra FOV at max airspeed — a subtle sense of speed. */
    speedFov: 2.5,
    /** Portrait screens widen the vertical FOV until the horizontal FOV is at least this… */
    minHorizontalFov: 28,
    /** …but never beyond this vertical FOV. */
    maxFov: 55,
    /** Fraction of the free screen area the subject may fill. */
    fill: 0.92,
    /**
     * If the best free area beside the UI needs the camera this many times farther away than a
     * full-screen framing (small screens where cards cover most of it), frame on the full screen
     * instead, behind the translucent cards.
     */
    crowdedFallback: 2.5,
    /** Gap kept from the screen edges and the UI, as a fraction of the smaller screen side. */
    safeMargin: 0.03,
    /** Safety margin around the hull / envelope (units). Inside it, the camera is pushed back out… */
    collisionMargin: 0.04 * SHIP_LENGTH,
    /** …by a contact spring on the penetration depth, so collisions never jolt the camera. The solid surface is a hard limit. */
    collision: { frequency: 3, damping: 1 },
    near: 0.1,
    far: 500,
  },

  pointer: {
    spring: { frequency: 0.8, damping: 1 },
    /** Orbit offset at the screen edge. */
    maxYaw: 4,
    maxPitch: 2.5,
  },

  reducedMotion: {
    swingScale: 0.3,
  },
} as const

