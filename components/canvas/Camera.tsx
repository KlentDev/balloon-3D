import { useThree } from '@react-three/fiber'
import { useLayoutEffect, type ReactNode, type RefObject } from 'react'
import type { Group, PerspectiveCamera } from 'three'
import { motionConfig } from '@/lib/experience/motionConfig'

interface CameraRigProps {
  focusRef: RefObject<Group | null>
  yawRef: RefObject<Group | null>
  pitchRef: RefObject<Group | null>
  cameraRef: RefObject<PerspectiveCamera | null>
  /** Rendered at the focus point, e.g. debug helpers. */
  children?: ReactNode
}

/**
 * Camera rig: focus → yaw → pitch → dolly (camera.position.z).
 *
 * The camera sits on the pitch pivot's +Z axis and looks down −Z, so it always faces the focus by
 * construction: no lookAt(), no roll, and with pitch clamped it can never flip. All values are
 * written by the Experience render loop; this component only builds the hierarchy.
 */
export default function CameraRig({ focusRef, yawRef, pitchRef, cameraRef, children }: CameraRigProps) {
  const set = useThree((s) => s.set)
  const get = useThree((s) => s.get)

  // Make this the default camera (without drei's PerspectiveCamera, which always allocates an FBO).
  useLayoutEffect(() => {
    const camera = cameraRef.current
    if (!camera) return
    const previous = get().camera
    set({ camera })
    return () => set({ camera: previous })
  }, [cameraRef, get, set])

  return (
    <group ref={focusRef}>
      {children}
      <group ref={yawRef}>
        <group ref={pitchRef}>
          <perspectiveCamera ref={cameraRef} near={motionConfig.camera.near} far={motionConfig.camera.far} />
        </group>
      </group>
    </group>
  )
}
