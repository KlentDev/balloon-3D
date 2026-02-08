import { create } from 'zustand'

interface CameraState {
  targetPosition: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
  setTarget: (pos: { x: number; y: number; z: number }, lookAt: { x: number; y: number; z: number }) => void
}

export const useCameraStore = create<CameraState>((set) => ({
  targetPosition: { x: 0, y: 0, z: 30 },
  lookAt: { x: 0, y: 0, z: 0 },
  setTarget: (pos, lookAt) => set({ targetPosition: pos, lookAt }),
}))
