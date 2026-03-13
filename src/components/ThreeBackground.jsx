import { Canvas, useFrame } from "@react-three/fiber"
import { useRef, useMemo, useEffect } from "react"
import * as THREE from "three"

/* =========================
   AI DATA WAVE GRID
========================= */

function DataWaves() {

  const ref = useRef()

  const size = 80
  const divisions = 80

  const geometry = useMemo(() => {

    const geo = new THREE.PlaneGeometry(20, 12, divisions, divisions)

    return geo

  }, [])

  useFrame((state) => {

    const t = state.clock.elapsedTime
    const pos = geometry.attributes.position

    for (let i = 0; i < pos.count; i++) {

      const x = pos.getX(i)
      const y = pos.getY(i)

      const wave =
        Math.sin(x * 0.8 + t * 1.2) * 0.25 +
        Math.cos(y * 0.6 + t * 1.4) * 0.2

      pos.setZ(i, wave)

    }

    pos.needsUpdate = true

  })

  return (

    <mesh
      ref={ref}
      geometry={geometry}
      rotation={[-Math.PI / 2.2, 0, 0]}
      position={[0, -2, -2]}
    >

      <meshBasicMaterial
        color="#b14cff"
        wireframe
        transparent
        opacity={0.25}
      />

    </mesh>

  )

}

/* =========================
   FLOATING DATA PARTICLES
========================= */

function DataParticles() {

  const ref = useRef()

  const count = 600

  const positions = useMemo(() => {

    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {

      pos[i * 3] = (Math.random() - 0.5) * 25
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10

    }

    return pos

  }, [])

  useFrame((state) => {

    const t = state.clock.elapsedTime

    ref.current.rotation.y = t * 0.01

  })

  return (

    <points ref={ref}>

      <bufferGeometry>

        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />

      </bufferGeometry>

      <pointsMaterial
        color="#00fff2"
        size={0.03}
        transparent
        opacity={0.8}
      />

    </points>

  )

}

/* =========================
   MOUSE PARALLAX
========================= */

function MouseParallax({ children }) {

  const group = useRef()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {

    const move = (e) => {

      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2

    }

    window.addEventListener("mousemove", move)

    return () => window.removeEventListener("mousemove", move)

  }, [])

  useFrame(() => {

    if (!group.current) return

    group.current.rotation.y +=
      (mouse.current.x * 0.25 - group.current.rotation.y) * 0.02

    group.current.rotation.x +=
      (-mouse.current.y * 0.25 - group.current.rotation.x) * 0.02

  })

  return <group ref={group}>{children}</group>

}

/* =========================
   CAMERA FLOAT
========================= */

function CameraFloat() {

  useFrame((state) => {

    const t = state.clock.elapsedTime

    state.camera.position.x = Math.sin(t * 0.05) * 0.4
    state.camera.position.y = Math.cos(t * 0.04) * 0.2

    state.camera.lookAt(0, 0, 0)

  })

  return null

}

/* =========================
   MAIN BACKGROUND
========================= */

export default function ThreeBackground() {

  return (

    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none"
      }}
    >

      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
      >

        <ambientLight intensity={0.3} />

        <CameraFloat />

        <MouseParallax>

          <DataWaves />

          <DataParticles />

        </MouseParallax>

      </Canvas>

    </div>

  )

}