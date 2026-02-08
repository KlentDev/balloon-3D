import { useEffect, useRef } from 'react'
import { sections } from '@/components/sections/sectionConfig'
import { useCameraStore } from './useCameraStore'
import { useModelStore } from './useModelStore'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function useSectionTimeline(key: keyof typeof sections) {
  const sectionRef = useRef<HTMLElement>(null)
  const setTarget = useCameraStore((s) => s.setTarget)
  const setRotation = useModelStore((s) => s.setRotation)
  const setScale = useModelStore((s) => s.setScale)
  const setPositionY = useModelStore((s) => s.setPositionY)
  const setPositionZ = useModelStore((s) => s.setPositionZ)
  const setPositionX = useModelStore((s) => s.setPositionX)
  const setShouldRotate = useModelStore((s) => s.setShouldRotate)

  useEffect(() => {
    if (!sectionRef.current) return

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        setTarget(sections[key].camera, sections[key].lookAt)
        setRotation(sections[key].model.rotationY)
        setPositionY(sections[key].model.positionY)
        setPositionZ(sections[key].model.positionZ || -15)
        setPositionX(sections[key].model.positionX || 0)
        setScale(sections[key].model.scale)
        // Disable rotation for all sections
        setShouldRotate(false)
      },
      onEnterBack: () => {
        setTarget(sections[key].camera, sections[key].lookAt)
        setRotation(sections[key].model.rotationY)
        setPositionY(sections[key].model.positionY)
        setPositionZ(sections[key].model.positionZ || -15)
        setPositionX(sections[key].model.positionX || 0)
        setScale(sections[key].model.scale)
        // Disable rotation for all sections
        setShouldRotate(false)
      },
    })

    return () => trigger.kill()
  }, [key, setTarget, setRotation, setScale, setPositionY, setPositionZ, setPositionX, setShouldRotate])

  return sectionRef
}
