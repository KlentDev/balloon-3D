import { create } from 'zustand'

interface ModelState {
  rotationY: number
  scale: number
  positionY: number
  positionZ: number
  positionX: number
  shouldRotate: boolean
  setRotation: (y: number) => void
  setScale: (scale: number) => void
  setPositionY: (y: number) => void
  setPositionZ: (z: number) => void
  setPositionX: (x: number) => void
  setShouldRotate: (shouldRotate: boolean) => void
}

export const useModelStore = create<ModelState>((set) => ({
  rotationY: 0,
  scale: 0.006,
  positionY: -7,
  positionZ: -15,
  positionX: 0,
  shouldRotate: true,
  setRotation: (y) => set({ rotationY: y }),
  setScale: (scale) => set({ scale }),
  setPositionY: (y) => set({ positionY: y }),
  setPositionZ: (z) => set({ positionZ: z }),
  setPositionX: (x) => set({ positionX: x }),
  setShouldRotate: (shouldRotate) => set({ shouldRotate }),
}))
