"use client"

import { ContactShadows, OrbitControls, RoundedBox, useGLTF } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { Component, Suspense, useMemo, useRef, type ReactNode } from "react"
import type { Group, Material, Mesh } from "three"
import type { ProductKind } from "@/lib/types"

function Sofa({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[2.15, 0.34, 0.82]} radius={0.06} position={[0, 0.42, 0]}>
        <meshStandardMaterial color={color} roughness={0.78} />
      </RoundedBox>
      <RoundedBox args={[2.15, 0.42, 0.16]} radius={0.04} position={[0, 0.72, -0.34]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.32, 0.82]} radius={0.04} position={[-1.05, 0.58, 0]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.32, 0.82]} radius={0.04} position={[1.05, 0.58, 0]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </RoundedBox>
      {[-0.55, 0.15, 0.7].map((x) => (
        <RoundedBox key={x} args={[0.52, 0.16, 0.42]} radius={0.05} position={[x, 0.68, 0.05]}>
          <meshStandardMaterial color="#f4efe8" roughness={0.9} />
        </RoundedBox>
      ))}
    </group>
  )
}

function Chair({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[0.72, 0.12, 0.72]} radius={0.04} position={[0, 0.48, 0]}>
        <meshStandardMaterial color={color} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[0.72, 0.7, 0.1]} radius={0.05} position={[0, 0.86, -0.3]}>
        <meshStandardMaterial color={color} roughness={0.78} />
      </RoundedBox>
      {[
        [-0.28, 0.24, 0.26],
        [0.28, 0.24, 0.26],
        [-0.28, 0.24, -0.26],
        [0.28, 0.24, -0.26],
      ].map((position) => (
        <mesh key={position.join()} position={position as [number, number, number]}>
          <cylinderGeometry args={[0.035, 0.03, 0.48, 12]} />
          <meshStandardMaterial color="#4a3426" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Table({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[1.5, 0.08, 0.72]} radius={0.02} position={[0, 0.72, 0]}>
        <meshStandardMaterial color={color} roughness={0.55} />
      </RoundedBox>
      {[
        [-0.62, 0.36, 0.26],
        [0.62, 0.36, 0.26],
        [-0.62, 0.36, -0.26],
        [0.62, 0.36, -0.26],
      ].map((position) => (
        <mesh key={position.join()} position={position as [number, number, number]}>
          <cylinderGeometry args={[0.035, 0.04, 0.7, 12]} />
          <meshStandardMaterial color="#3d2c22" />
        </mesh>
      ))}
    </group>
  )
}

function Bed({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[1.9, 0.28, 2.05]} radius={0.05} position={[0, 0.36, 0]}>
        <meshStandardMaterial color="#f7f3ee" roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[1.95, 0.7, 0.12]} radius={0.04} position={[0, 0.7, -0.98]}>
        <meshStandardMaterial color={color} roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.12, 0.38]} radius={0.04} position={[-0.4, 0.58, -0.55]}>
        <meshStandardMaterial color="#fffaf5" />
      </RoundedBox>
    </group>
  )
}

function Lamp({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 24]} />
        <meshStandardMaterial color="#d9cfc3" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.4, 8]} />
        <meshStandardMaterial color={color} metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.28, 0.36, 24, 1, true]} />
        <meshStandardMaterial color="#f4efe8" side={2} roughness={0.85} />
      </mesh>
    </group>
  )
}

function Storage({ color }: { color: string }) {
  return (
    <group>
      <RoundedBox args={[1.35, 0.72, 0.42]} radius={0.03} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={color} roughness={0.62} />
      </RoundedBox>
      <mesh position={[0, 0.5, 0.22]}>
        <boxGeometry args={[0.01, 0.62, 0.01]} />
        <meshStandardMaterial color="#f7f3ee" />
      </mesh>
    </group>
  )
}

function Decor({ color }: { color: string }) {
  return (
    <mesh position={[0, 0.42, 0]}>
      <sphereGeometry args={[0.28, 32, 24]} />
      <meshStandardMaterial color={color} roughness={0.45} />
    </mesh>
  )
}

export function Furniture({ kind, color }: { kind: ProductKind; color: string }) {
  if (kind === "sofa") return <Sofa color={color} />
  if (kind === "chair") return <Chair color={color} />
  if (kind === "table") return <Table color={color} />
  if (kind === "bed") return <Bed color={color} />
  if (kind === "lamp") return <Lamp color={color} />
  if (kind === "storage") return <Storage color={color} />
  return <Decor color={color} />
}

function Turntable({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.28) * 0.38
  })
  return <group ref={ref}>{children}</group>
}

function RoomPieces() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[4.4, 48]} />
        <meshStandardMaterial color="#e7d9c8" />
      </mesh>
      <mesh position={[0, 1.25, -1.55]}>
        <planeGeometry args={[5.4, 2.7]} />
        <meshStandardMaterial color="#f6f1ea" />
      </mesh>
      <mesh position={[-1.35, 1.15, -1.5]}>
        <planeGeometry args={[1.05, 1.25]} />
        <meshStandardMaterial color="#fbf8f4" emissive="#f4e7cf" emissiveIntensity={0.28} />
      </mesh>
      <group position={[0, 0, 0.05]} scale={0.78}>
        <Furniture kind="sofa" color="#6d4c35" />
      </group>
      <group position={[0.02, 0, 0.95]} scale={0.62}>
        <Furniture kind="table" color="#8a6244" />
      </group>
      <group position={[1.15, 0, 0.15]} scale={0.5}>
        <Lamp color="#a6845a" />
      </group>
      <mesh position={[-1.2, 0.28, -0.15]}>
        <cylinderGeometry args={[0.05, 0.07, 0.55, 8]} />
        <meshStandardMaterial color="#5c6b52" />
      </mesh>
    </group>
  )
}

function LookAt() {
  useFrame((state) => {
    state.camera.lookAt(0, 0.55, 0.15)
  })
  return null
}

function Stage({ children, auto, look = false }: { children: ReactNode; auto?: boolean; look?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.25} />
      <directionalLight position={[-3, 2, 1]} intensity={0.3} color="#f3e2c8" />
      {look ? <LookAt /> : null}
      {auto ? <Turntable>{children}</Turntable> : <group>{children}</group>}
      <ContactShadows position={[0, 0, 0]} opacity={0.25} scale={7} blur={2.4} far={3} />
    </>
  )
}

export function HeroCanvas() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0.15, 1.45, 4.15], fov: 34 }} gl={{ antialias: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#f3ece3"]} />
      <Suspense fallback={null}>
        <Stage auto look>
          <RoomPieces />
        </Stage>
      </Suspense>
    </Canvas>
  )
}

export function RoomCanvas() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0.2, 1.7, 4.6], fov: 34 }}>
      <color attach="background" args={["#f6f1ea"]} />
      <Suspense fallback={null}>
        <Stage>
          <RoomPieces />
        </Stage>
        <OrbitControls target={[0, 0.55, 0.15]} enablePan={false} minDistance={3} maxDistance={8} maxPolarAngle={Math.PI / 2.05} />
      </Suspense>
    </Canvas>
  )
}

class ModelBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function GltfPiece({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => {
    const next = scene.clone(true)
    next.traverse((node) => {
      const mesh = node as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        const material = mesh.material as Material
        material.needsUpdate = true
      }
    })
    const box = next
    box.scale.setScalar(1.15)
    return box
  }, [scene])
  return <primitive object={clone} position={[0, 0.15, 0]} />
}

export function ProductCanvas({
  kind,
  color,
  modelUrl,
  showModel,
}: {
  kind: ProductKind
  color: string
  modelUrl: string | null
  showModel: boolean
}) {
  const procedural = (
    <group position={[0, -0.15, 0]}>
      <Furniture kind={kind} color={color} />
    </group>
  )
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [2.4, 1.5, 2.8], fov: 35 }}>
      <color attach="background" args={["#f7f3ee"]} />
      <Suspense fallback={null}>
        <Stage auto={!showModel}>
          {showModel && modelUrl ? (
            <ModelBoundary fallback={procedural}>
              <Suspense fallback={procedural}>
                <GltfPiece url={modelUrl} />
              </Suspense>
            </ModelBoundary>
          ) : (
            procedural
          )}
        </Stage>
        <OrbitControls target={[0, 0.45, 0]} enablePan={false} minDistance={1.8} maxDistance={6} maxPolarAngle={Math.PI / 1.9} />
      </Suspense>
    </Canvas>
  )
}
