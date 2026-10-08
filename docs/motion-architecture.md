# 3D motion architecture

How the airship, the camera and the page scroll fit together, and where to change things.

## Pipeline

```
INPUT            scroll · section registry (+ measured UI) · pointer · prefers-reduced-motion
   │             lib/experience/sections.ts, lib/experience/input.ts   (record only, never write the scene)
   ▼
DIRECTOR         shots (sectionConfig.ts) × scroll blend × viewport × UI → targets
   │             lib/experience/director.ts                             (no motion state; solved shots cached)
   ▼
SIMULATION       fixed 120 Hz steps, springs with velocity state
   │             lib/experience/engine.ts → simulation.ts               (the only dynamic state)
   ▼
RENDER           interpolate the last two steps → write transforms once
                 components/canvas/Experience.tsx                       (the only per-frame writer)
```

Every frame: sample inputs → the engine re-blends the director's **targets** at each fixed step
(scroll is reconstructed across the frame, so the input looks the same at any frame rate) → the
simulation springs toward them → the renderer interpolates and writes the transforms. Nothing else
moves the ship or the camera. Shared geometry (orbit convention, ship-local transforms, collision
queries) lives in `lib/experience/geometry.ts`.

## Who owns what

| Property | Owner |
|---|---|
| `shipRoot` position + heading (the body) | Simulation → `Experience` |
| `swing` bank/pitch (gondola sway) | Simulation, derived from body acceleration |
| `visual` scale/offset (normalisation) | Static, measured once (`lib/experience/shipModel.ts`) |
| Bones (propellers, wings, idle rock) | Three.js `AnimationMixer`; `timeScale` follows airspeed |
| Camera rig (focus, yaw, pitch, dolly), FOV, lens shift | Simulation → `Experience` |
| DOM cards and headings | GSAP ScrollTrigger in each section (`gsap.context`, reverted on unmount) |
| Hero sidebar/column parallax | framer-motion |

## Scene graph

```
shipRoot   origin = centre of buoyancy (envelope centre); position + heading
 └ swing   bank about +X (forward), pitch about +Z (starboard) → pendulum about the same origin
    └ visual   scale → ship length 10 units; offset −pivot
       └ GLB scene (bones animated by the mixer)

focus → yaw → pitch → <perspectiveCamera position.z = distance>
```

The camera looks down its local −Z at the focus by construction: no `lookAt()`, no roll, and
pitch is clamped so it can never flip.

## The model

`public/balloon.glb` is authored in centimetres. Its origin is near the bottom of the hull and
its forward axis is **+X**, with starboard at +Z. `measureShip()` measures it once in its rest
pose. It scales the ship to `SHIP_LENGTH` (10 units) and re-pivots it on the centre of buoyancy.
It then finds each part (hull, envelope, wheel, telescope, propeller, wings) from the vertices
that the part's bone dominates, so shots aim at real geometry rather than at guessed coordinates.

## Motion model

- **Springs** (`lib/motion/spring.ts`) are tuned by frequency (Hz) and damping ratio ζ. Their
  state includes velocity, so a new target mid-transition never causes a jump. Angles always
  take the short way round.
- **Fixed timestep** (`lib/motion/fixedStep.ts`) runs 120 steps/s whatever the display rate,
  and the renderer interpolates. Motion is the same at 30, 60 and 144 Hz.
- **Ship body**: springs to its target position and heading. Wind is smooth noise acting as a
  force. Airspeed is notional: it's cruise speed plus throttle, and **scrolling is the
  throttle**.
- **Swing**: the hull hangs under the envelope, so the ship leans toward its acceleration. That
  includes the centripetal acceleration of a turn (`airspeed × yaw rate`) and throttle changes.
  An under-damped spring toward that lean produces the natural sway and settle.
- **Camera**: the focus follows the ship's *body* (not the sway) with lag, partial follow and a
  little look-ahead. Orbit, distance, FOV and lens shift each have their own spring.
- **Camera collision**: inside a safety margin around the (swaying) hull and envelope, a contact
  force proportional to penetration depth pushes the camera out — continuous, so it never jolts —
  and the solid surface itself is a hard limit.

## Shots and framing

Each section has one shot in `components/sections/sectionConfig.ts`:

```ts
steering: {
  ship: { heading: 30 },                       // deg, 0 = nose → +X, + = to port
  camera: {
    subject: 'wheel',                          // 'ship' or a part name
    azimuth: 160,                              // 0 starboard, 90 front, −90 behind, 180 port
    elevation: 30,                             // + = from above
    context: 2.6,                              // surroundings, × the subject's size (default 1)
    fov: 35,
  },
},
```

The full field reference is the `Shot` type in `lib/experience/types.ts`.

Camera **distance is solved, not authored**. Each section's text column carries
`data-scene-reserve`. The registry measures those columns on layout changes (ScrollTrigger
refresh, plus a ResizeObserver for font swaps and content). Position them with layout, not CSS
transforms: transforms are deliberately ignored because they are animated. For each section,
once per layout and viewport, the director:

1. fits the subject's measured silhouette exactly in every free region around the UI, using both
   the vertical and horizontal FOV, and keeps the region that frames it closest;
2. falls back to the full screen, behind the translucent cards, when even that region would
   shrink the subject too much (`camera.crowdedFallback`, e.g. phones in landscape);
3. centres the subject in its region with a lens shift (`camera.setViewOffset`), so the
   perspective isn't distorted;
4. widens the FOV on portrait screens, since a narrow horizontal FOV would otherwise crop the
   ship.

Consecutive shots are blended by scroll position. The blend holds still around each section and
interpolates distance in log space, for an even dolly.

Below `lg` (1024 px) the section cards stack at the bottom of the screen as swipeable rows. The
solver then puts the ship in the free area above them.

**To add a section:** add a shot to `sectionConfig.ts`, call `useSectionTimeline('key')` in the
section, and mark its text column with `data-scene-reserve`.

**To add a part to aim at:** add its bone to `PART_BONES` in `lib/experience/shipModel.ts`. Use
the bone name without the exporter's numeric suffix.

## Tuning

Every knob lives in `lib/experience/motionConfig.ts`, documented in place. The useful ones:

| Want | Change |
|---|---|
| Snappier or lazier transitions | `camera.orbit/distance.frequency`, `ship.heading.frequency` |
| More or less sway in turns | `ship.swingGravity` (lower = more), `ship.swing.damping` |
| Longer hold on each section | `scroll.hold` |
| Stronger reaction to fast scrolling | `ship.throttleGain`, `camera.speedFov` |
| Ship moves more or less within the frame | `camera.follow`, `ship.turbulence.amplitude` |
| Tighter or looser close-ups | the shot's `context`; globally `camera.fill` |

## Debugging

| URL | Shows |
|---|---|
| `?debug` | HUD (fps, dt, sub-steps, shot blend, ship/camera state), safe-rect and focus overlay, axes/bounds/collision boxes |
| `?debug&fps=30` | Caps rendering at 30 fps to check frame-rate independence |
| `?debug&snap` | Disables smoothing so the camera jumps straight to each shot (for authoring) |

`window.__experienceDebug` exposes the same values to the console and to automated tests. None of
this code loads without `?debug`.
