import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import type { AnimationAction, Group, Object3D } from 'three'
import { measureShip } from '@/lib/experience/shipModel'
import type { ShipData } from '@/lib/experience/types'

const MODEL_URL = '/balloon.glb'

/**
 * Loads the airship, measures it once and starts its baked animation (propellers, wings, idle
 * rock). The playing action is exposed through a ref so the render loop can set its speed.
 */
export function useShipModel() {
  const { scene, animations } = useGLTF(MODEL_URL)
  const { actions, names } = useAnimations(animations, scene)
  const ship = measureShip(scene) // measured once, then cached on the scene
  const clip = actions[names[0]] ?? null
  const clipRef = useRef<AnimationAction | null>(null)

  useEffect(() => {
    clipRef.current = clip
    clip?.play()
    return () => {
      clip?.stop()
      clipRef.current = null
    }
  }, [clip])

  return { scene, ship, clipRef }
}

interface ModelProps {
  scene: Object3D
  ship: ShipData
  /** Physics body: position and heading. Written only by the Experience render loop. */
  rootRef: RefObject<Group | null>
  /** Gondola swing about the centre of buoyancy. Written only by the Experience render loop. */
  swingRef: RefObject<Group | null>
  /** Rendered in the body's frame (unaffected by the swing), e.g. debug helpers. */
  children?: ReactNode
}

/**
 * The airship's transform hierarchy:
 *
 *   body (position, heading) → swing (bank, pitch) → visual (static normalisation) → GLB scene
 *
 * The visual group scales the centimetre-authored model to SHIP_LENGTH and moves its centre of
 * buoyancy onto the body origin, so heading and swing rotate about the physically right point.
 */
export default function Model({ scene, ship, rootRef, swingRef, children }: ModelProps) {
  const { scale, pivot } = ship
  return (
    <group ref={rootRef}>
      {children}
      <group ref={swingRef}>
        <group scale={scale} position={[-pivot.x * scale, -pivot.y * scale, -pivot.z * scale]}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URL)
