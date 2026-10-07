'use client'

import { useFrame } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { MathUtils, Vector3, type Group, type PerspectiveCamera } from 'three'
import Model, { useShipModel } from '../model/Model'
import CameraRig from './Camera'
import { debugProbe, type DebugFlags } from '@/lib/experience/debug'
import { composedRect } from '@/lib/experience/director'
import { Engine, type FrameInput } from '@/lib/experience/engine'
import { toShipLocal } from '@/lib/experience/geometry'
import { input, installInputListeners } from '@/lib/experience/input'
import { motionConfig } from '@/lib/experience/motionConfig'
import { getScrollBlend, type ScrollBlend } from '@/lib/experience/sections'

const DebugShipHelpers = dynamic(() => import('./DebugHud').then((m) => m.DebugShipHelpers))
const DebugFocusHelpers = dynamic(() => import('./DebugHud').then((m) => m.DebugFocusHelpers))

/**
 * The only place that writes 3D transforms each frame:
 *
 *   input (scroll, pointer) → director (targets) → fixed-step simulation → interpolate → transforms
 *
 * Bones belong to the animation mixer; DOM belongs to GSAP. Nothing else moves the ship or camera.
 */
export default function Experience({ debug }: { debug: DebugFlags }) {
  const { scene, ship, clipRef } = useShipModel()

  const shipRoot = useRef<Group>(null)
  const swing = useRef<Group>(null)
  const focus = useRef<Group>(null)
  const yaw = useRef<Group>(null)
  const pitch = useRef<Group>(null)
  const camera = useRef<PerspectiveCamera>(null)
  // Per-frame mutable state lives in refs: it never triggers a React render.
  const engineRef = useRef<Engine | null>(null)
  const frameInput = useRef<FrameInput>({ scroll: 0, viewportHeight: 1, aspect: 1, pointerX: 0, pointerY: 0, reducedMotion: false })

  useEffect(() => installInputListeners(), [])

  useFrame((state, delta) => {
    if (engineRef.current?.sim.ship !== ship) engineRef.current = new Engine(ship, getScrollBlend)
    const engine = engineRef.current
    const root = shipRoot.current
    const cam = camera.current
    if (!root || !swing.current || !focus.current || !yaw.current || !pitch.current || !cam) return

    const { width, height } = state.size
    const f = frameInput.current
    f.scroll = input.scrollY
    f.viewportHeight = height
    f.aspect = width / height
    f.pointerX = input.pointerX
    f.pointerY = input.pointerY
    f.reducedMotion = input.reducedMotion
    if (!engine.frame(delta, f, debug.snap)) return
    const render = engine.render

    // Ship body: position + heading. Swing: bank/pitch about the centre of buoyancy.
    root.position.copy(render.shipPosition)
    root.rotation.set(0, render.heading, 0)
    swing.current.rotation.set(render.bank, 0, render.pitch)

    // Camera rig: focus → yaw → pitch → dolly. The camera looks down −Z at the focus by construction.
    focus.current.position.copy(render.focus)
    yaw.current.rotation.y = render.cameraYaw
    pitch.current.rotation.x = -render.cameraPitch
    cam.position.set(0, 0, render.distance)
    cam.fov = render.fov
    // Lens shift puts the focus at (shiftX, shiftY) in NDC without rotating the camera.
    // (setViewOffset also updates the projection matrix.)
    cam.setViewOffset(width, height, (-render.shiftX * width) / 2, (render.shiftY * height) / 2, width, height)

    // Propellers and wings run faster with airspeed.
    const clip = clipRef.current
    if (clip) clip.timeScale = MathUtils.lerp(motionConfig.ship.clipSpeed.cruise, motionConfig.ship.clipSpeed.max, render.throttle)

    if (debug.enabled) writeProbe(engine, delta, cam, f.aspect)
  })

  return (
    <>
      <Model scene={scene} ship={ship} rootRef={shipRoot} swingRef={swing}>
        {debug.enabled && <DebugShipHelpers ship={ship} />}
      </Model>
      <CameraRig focusRef={focus} yawRef={yaw} pitchRef={pitch} cameraRef={camera}>
        {debug.enabled && <DebugFocusHelpers />}
      </CameraRig>
    </>
  )
}

const _camPos = new Vector3()
const _up = new Vector3()
const _blend = {} as ScrollBlend

function writeProbe(engine: Engine, delta: number, cam: PerspectiveCamera, aspect: number) {
  const { sim, render } = engine
  const p = debugProbe
  getScrollBlend(input.scrollY, _blend)
  p.frame++
  p.frameDt = delta
  p.steps = engine.stepper.lastSteps
  p.alpha = engine.alpha
  p.from = _blend.from.key
  p.to = _blend.to.key
  p.t = _blend.t
  p.scrollSpeed = sim.input.scrollSpeed
  p.airspeed = render.airspeed
  p.shipPosition.copy(render.shipPosition)
  p.shipVelocity.copy(sim.shipPos.velocity)
  p.shipAcceleration.copy(sim.acceleration)
  p.heading = MathUtils.radToDeg(render.heading)
  p.yawRate = MathUtils.radToDeg(sim.heading.velocity)
  p.bank = MathUtils.radToDeg(render.bank)
  p.pitch = MathUtils.radToDeg(render.pitch)
  p.focus.copy(render.focus)
  p.cameraYaw = MathUtils.radToDeg(render.cameraYaw)
  p.cameraPitch = MathUtils.radToDeg(render.cameraPitch)
  p.distance = render.distance
  p.fov = render.fov
  p.shiftX = render.shiftX
  p.shiftY = render.shiftY
  p.composedRect = composedRect(_blend.t < 0.5 ? _blend.from : _blend.to, sim.ship, aspect)

  cam.updateWorldMatrix(true, false) // the rig groups were just moved this frame
  cam.getWorldPosition(_camPos)
  p.cameraPosition.copy(_camPos)
  p.cameraUpY = _up.set(0, 1, 0).transformDirection(cam.matrixWorld).y
  // Is the camera inside the hull or envelope? (ship-local, swing ignored)
  toShipLocal(_camPos, p.cameraPosition, render.shipPosition, render.heading)
  p.insideShip = sim.ship.obstacles.some((b) => b.containsPoint(_camPos))
}
