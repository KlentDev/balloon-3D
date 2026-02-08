export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, 3, -5]} intensity={0.8} />
      <hemisphereLight intensity={0.6} groundColor="#ffffff" />
    </>
  )
}
