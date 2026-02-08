import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'
import { useCameraStore } from '@/hooks/useCameraStore'

export default function Camera() {
  const { camera } = useThree()
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0))
  const targetPosition = useCameraStore((s) => s.targetPosition)
  const targetLookAt = useCameraStore((s) => s.lookAt)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z)
      initialized.current = true
      return
    }
    
    gsap.to(camera.position, {
      ...targetPosition,
      duration: 1.5,
      ease: 'power3.out',
    })
  }, [targetPosition, camera])

  useEffect(() => {
    gsap.to(lookAtTarget.current, {
      ...targetLookAt,
      duration: 1.5,
      ease: 'power3.out',
    })
  }, [targetLookAt])

  useFrame(() => {
    camera.lookAt(lookAtTarget.current)
  })

  return null
}
