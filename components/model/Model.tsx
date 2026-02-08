import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { Group } from 'three'
import gsap from 'gsap'
import { useFrame } from '@react-three/fiber'
import { useModelStore } from '@/hooks/useModelStore'

export default function Model() {
  const { scene, animations } = useGLTF('/balloon.glb')
  const { actions } = useAnimations(animations, scene)
  const groupRef = useRef<Group>(null)
  const { rotationY, scale, positionY, positionZ, positionX, shouldRotate } = useModelStore()
  const rotationSpeedRef = useRef(0.015)
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    if (actions.Scene) {
      actions.Scene.play()
    }

    if (groupRef.current) {
      groupRef.current.scale.set(0, 0, 0)
      gsap.to(groupRef.current.scale, {
        x: 0.006,
        y: 0.006,
        z: 0.006,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0
      })
    }
  }, [actions])

  useEffect(() => {
    if (groupRef.current) {
      isAnimatingRef.current = true
      gsap.to(groupRef.current.rotation, {
        y: rotationY,
        duration: 1,
        ease: 'power2.inOut',
        onStart: () => {
          rotationSpeedRef.current = 0
        },
        onComplete: () => {
          isAnimatingRef.current = false
          // Only enable continuous rotation if shouldRotate is true
          if (shouldRotate) {
            rotationSpeedRef.current = 0.015
          }
        }
      })
      gsap.to(groupRef.current.scale, {
        x: scale,
        y: scale,
        z: scale,
        duration: 1,
        ease: 'power2.inOut'
      })
      gsap.to(groupRef.current.position, {
        x: positionX,
        y: positionY,
        z: positionZ,
        duration: 1,
        ease: 'power2.inOut'
      })
    }
  }, [rotationY, scale, positionY, positionZ, positionX, shouldRotate])

  useFrame(() => {
    if (groupRef.current && rotationSpeedRef.current > 0) {
      groupRef.current.rotation.y += rotationSpeedRef.current
    }
  })

  const handleNodeClick = (nodeName: string) => {
    const node = scene.getObjectByName(nodeName)
    if (node && groupRef.current) {
      gsap.to(node.scale, {
        x: 1.4,
        y: 1.4,
        z: 1.4,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
      })
    }
  }

  return (
    <group 
      ref={groupRef} 
      position={[0, -7, -15]}
    >
      <primitive 
        object={scene} 
        onClick={(e: any) => {
          e.stopPropagation()
          handleNodeClick(e.object.name)
        }}
      />
    </group>
  )
}

useGLTF.preload('/balloon.glb')
