export const sections = {
  hero: {
    camera: { x: 8, y: 0, z: 30 },
    lookAt: { x: 0, y: 0, z: 0 },
    model: { rotationY: 0, positionY: -7, scale: 0.008 },
  },
  steering: {
    camera: { x: -5, y: 7, z: 12 },
    lookAt: { x: 0, y: 7, z: 0 },
    model: { rotationY: 0.5, positionY: -5, scale: 0.1, positionX: 0 },
  },
  propeller: {
    camera: { x: -8, y: 0, z: 8 },
    lookAt: { x: 0, y: 0, z: 0 },
    model: { rotationY: 0.6, positionY: -1, scale: 0.012 },
  },
  envelope: {
    camera: { x: 0, y: 0, z: 30 },
    lookAt: { x: 0, y: 7, z: 0 },
    model: { rotationY: -0.3, positionY: -8, scale: 0.016 },
  },
  telescope: {
    camera: { x: 0, y: -8, z: 25 },
    lookAt: { x: 0, y: 5, z: 0 },
    model: { rotationY: 0, positionY: -8, scale: 0.016 },
  },
  wings: {
    camera: { x: -8, y: 0, z: 6 },
    lookAt: { x: 0, y: 0, z: 0 },
    model: { rotationY: 0.6, positionY: -1, scale: 0.012 },
  },
  footer: {
    camera: { x: 0, y: 0, z: 30 },
    lookAt: { x: 0, y: 0, z: 0 },
    model: { rotationY: 0, positionY: -7, scale: 0.008 },
  },
}
