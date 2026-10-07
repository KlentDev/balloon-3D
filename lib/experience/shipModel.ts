import { Box3, Matrix4, Object3D, SkinnedMesh, Sphere, Vector3 } from 'three'
import { SHIP_LENGTH } from './motionConfig'
import type { PartName, ShipData, Subject } from './types'

/**
 * Which bones define each part. A part is the set of vertices whose dominant skin weight belongs to
 * that bone (and, with `subtree`, to any bone below it). This finds the parts from the geometry
 * itself instead of hand-placed coordinates. Names omit the exporter's numeric suffix (`_013`).
 */
const PART_BONES: Record<PartName, { bone: string; subtree: boolean }> = {
  hull: { bone: 'main', subtree: false },
  envelope: { bone: 'balloon', subtree: false },
  wheel: { bone: 'steering_wheel', subtree: false },
  telescope: { bone: 'telescope_base', subtree: true },
  propeller: { bone: 'front_prop_R', subtree: false },
  wings: { bone: 'wing__MAIN_R', subtree: true },
}
const PARTS = Object.keys(PART_BONES) as PartName[]
const boneName = (o: Object3D) => o.name.replace(/_\d+$/, '')

/** Evenly spread unit directions (Fibonacci sphere) used to sample silhouettes. */
const SILHOUETTE_SAMPLES = 64
const SILHOUETTE_DIRECTIONS = Array.from({ length: SILHOUETTE_SAMPLES }, (_, i) => {
  const y = 1 - (2 * (i + 0.5)) / SILHOUETTE_SAMPLES
  const r = Math.sqrt(1 - y * y)
  const phi = i * Math.PI * (3 - Math.sqrt(5))
  return new Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r)
})

/** Bounds plus the outermost point along each silhouette direction. */
class Extent {
  readonly box = new Box3()
  private readonly dots = new Float64Array(SILHOUETTE_SAMPLES).fill(-Infinity)
  private readonly points = SILHOUETTE_DIRECTIONS.map(() => new Vector3())

  add(v: Vector3) {
    this.box.expandByPoint(v)
    for (let d = 0; d < SILHOUETTE_SAMPLES; d++) {
      const dot = v.dot(SILHOUETTE_DIRECTIONS[d])
      if (dot > this.dots[d]) {
        this.dots[d] = dot
        this.points[d].copy(v)
      }
    }
  }

  /** Converts to ship-local world units: (p − pivot) · scale. */
  toLocal(pivot: Vector3, scale: number) {
    this.box.min.sub(pivot).multiplyScalar(scale)
    this.box.max.sub(pivot).multiplyScalar(scale)
    for (const p of this.points) p.sub(pivot).multiplyScalar(scale)
    return { center: this.box.getCenter(new Vector3()), silhouette: this.points }
  }
}

/**
 * Measures the airship once per loaded scene, in its rest pose (call on first render, before the
 * mixer moves any bone; the result is kept on the scene so later calls and hot reloads reuse it).
 *
 * The GLB is authored in centimetres with its origin near the bottom of the hull, so it is
 * normalised here: scaled to SHIP_LENGTH and re-pivoted on the centre of buoyancy (the envelope
 * centre). That is the point a balloon yaws and swings about, so rotations look physical.
 */
export function measureShip(scene: Object3D): ShipData {
  if (scene.userData.ship) return scene.userData.ship as ShipData

  const meshes: SkinnedMesh[] = []
  scene.traverse((o) => {
    if ((o as SkinnedMesh).isSkinnedMesh) meshes.push(o as SkinnedMesh)
  })
  scene.updateMatrixWorld(true)
  const rootInverse = scene.matrixWorld.clone().invert()

  const ship = new Extent()
  const parts = Object.fromEntries(PARTS.map((p) => [p, new Extent()])) as Record<PartName, Extent>
  const v = new Vector3()
  const rest = new Vector3()
  const term = new Vector3()

  for (const mesh of meshes) {
    const toRoot = rootInverse.clone().multiply(mesh.matrixWorld)
    // One skinning matrix per bone — what SkinnedMesh.getVertexPosition would rebuild per vertex.
    const { bones, boneInverses } = mesh.skeleton
    const skinning = bones.map((bone, b) =>
      new Matrix4()
        .multiplyMatrices(mesh.bindMatrixInverse, bone.matrixWorld)
        .multiply(boneInverses[b])
        .multiply(mesh.bindMatrix),
    )
    // For each bone, the parts whose vertices it dominates.
    const boneParts = mesh.skeleton.bones.map((bone) =>
      PARTS.filter((part) => {
        const { bone: name, subtree } = PART_BONES[part]
        for (let b: Object3D | null = bone; b; b = subtree ? b.parent : null) if (boneName(b) === name) return true
        return false
      }).map((part) => parts[part]),
    )

    const position = mesh.geometry.getAttribute('position')
    const skinIndex = mesh.geometry.getAttribute('skinIndex')
    const skinWeight = mesh.geometry.getAttribute('skinWeight')
    const meshBounds = new Box3()
    for (let i = 0; i < position.count; i++) {
      rest.fromBufferAttribute(position, i)
      v.set(0, 0, 0)
      let dominant = 0
      let dominantWeight = 0
      for (let k = 0; k < 4; k++) {
        const w = skinWeight.getComponent(i, k)
        if (w === 0) continue
        const bone = skinIndex.getComponent(i, k)
        v.addScaledVector(term.copy(rest).applyMatrix4(skinning[bone]), w)
        if (w > dominantWeight) {
          dominantWeight = w
          dominant = bone
        }
      }
      meshBounds.expandByPoint(v) // mesh-local, skinned rest pose
      v.applyMatrix4(toRoot)
      ship.add(v)
      for (const part of boneParts[dominant]) part.add(v)
    }
    // Hand three the same rest-pose bounds for frustum culling, sparing it a second full skinning
    // pass over every vertex on the first rendered frame.
    mesh.boundingBox = meshBounds
    mesh.boundingSphere = meshBounds.getBoundingSphere(new Sphere())
  }

  const scale = SHIP_LENGTH / ship.box.getSize(v).x
  const pivot = parts.envelope.box.getCenter(new Vector3())
  const subjects = { ship: ship.toLocal(pivot, scale) } as ShipData['subjects']
  for (const part of PARTS) subjects[part as Subject] = parts[part].toLocal(pivot, scale)

  const data: ShipData = {
    scale,
    pivot,
    bounds: ship.box,
    subjects,
    obstacles: [parts.hull.box, parts.envelope.box],
  }
  scene.userData.ship = data
  return data
}
