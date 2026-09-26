import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Dynamic 3D Cursor Light that illuminates the sphere from the mouse position
function CursorSpotlight({ mousePos }) {
  const lightRef = useRef();
  const pointerOrbRef = useRef();

  useFrame(() => {
    const targetX = mousePos.x * 3.8;
    const targetY = mousePos.y * 2.8;

    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, 0.15);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, 0.15);
      lightRef.current.position.z = 2.4;
    }

    if (pointerOrbRef.current) {
      pointerOrbRef.current.position.x = THREE.MathUtils.lerp(pointerOrbRef.current.position.x, targetX, 0.15);
      pointerOrbRef.current.position.y = THREE.MathUtils.lerp(pointerOrbRef.current.position.y, targetY, 0.15);
    }
  });

  return (
    <group>
      {/* High-intensity Light shining onto the sphere wherever the cursor goes */}
      <pointLight ref={lightRef} color="#38bdf8" intensity={40} distance={9} decay={1.8} />
      <pointLight position={[0, 0, 3]} color="#c77dff" intensity={20} distance={8} />

      {/* Luminous cursor orb in 3D that shines light */}
      <mesh ref={pointerOrbRef} position={[0, 0, 2]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function TrackingSphere({ mousePos }) {
  const mainGroupRef = useRef();
  const wireframeRef = useRef();
  const innerCoreRef = useRef();
  const irisGroupRef = useRef();

  useFrame((state, delta) => {
    // 1. PHYSICAL MOVEMENT: The sphere physically moves toward the mouse cursor coordinates
    const targetPosX = mousePos.x * 1.5;
    const targetPosY = mousePos.y * 1.1;
    const targetPosZ = Math.sin(state.clock.elapsedTime * 1.5) * 0.2 + (mousePos.isHovered ? 0.3 : 0);

    if (mainGroupRef.current) {
      mainGroupRef.current.position.x = THREE.MathUtils.lerp(
        mainGroupRef.current.position.x,
        targetPosX,
        0.08
      );
      mainGroupRef.current.position.y = THREE.MathUtils.lerp(
        mainGroupRef.current.position.y,
        targetPosY,
        0.08
      );
      mainGroupRef.current.position.z = THREE.MathUtils.lerp(
        mainGroupRef.current.position.z,
        targetPosZ,
        0.08
      );
    }

    // 2. ROTATION & TILT: Turns toward the cursor
    const targetRotY = mousePos.x * 1.6;
    const targetRotX = -mousePos.y * 1.4;

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = THREE.MathUtils.lerp(
        wireframeRef.current.rotation.y,
        targetRotY + state.clock.elapsedTime * 0.2,
        0.09
      );
      wireframeRef.current.rotation.x = THREE.MathUtils.lerp(
        wireframeRef.current.rotation.x,
        targetRotX,
        0.09
      );
      wireframeRef.current.rotation.z = mousePos.x * 0.2;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = THREE.MathUtils.lerp(
        innerCoreRef.current.rotation.y,
        -targetRotY * 1.4,
        0.1
      );
      innerCoreRef.current.rotation.x = THREE.MathUtils.lerp(
        innerCoreRef.current.rotation.x,
        -targetRotX * 1.4,
        0.1
      );
    }

    // 3. IRIS & PUPIL: Directly gazes and aims at the cursor
    if (irisGroupRef.current) {
      irisGroupRef.current.position.x = THREE.MathUtils.lerp(
        irisGroupRef.current.position.x,
        mousePos.x * 0.7,
        0.14
      );
      irisGroupRef.current.position.y = THREE.MathUtils.lerp(
        irisGroupRef.current.position.y,
        mousePos.y * 0.7,
        0.14
      );
    }
  });

  return (
    <group ref={mainGroupRef}>
      {/* Outer Holographic Wireframe Geosphere */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.45, 3]} />
        <meshStandardMaterial
          color="#c77dff"
          emissive="#7b2cbf"
          emissiveIntensity={2.8}
          roughness={0.1}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Inner Glowing Crystal Core */}
      <mesh ref={innerCoreRef} scale={0.78}>
        <icosahedronGeometry args={[1.35, 4]} />
        <meshStandardMaterial
          color="#e0aaff"
          emissive="#9d4edd"
          emissiveIntensity={3.2}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Glowing Iris & Pupil looking directly at cursor */}
      <group ref={irisGroupRef} position={[0, 0, 0.75]}>
        <mesh>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 0, 0.2]}>
          <ringGeometry args={[0.12, 0.28, 32]} />
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.22]}>
          <circleGeometry args={[0.08, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <pointLight color="#38bdf8" intensity={25} distance={5} />
      </group>

      {/* Central Heart Reactor */}
      <pointLight color="#ca72ff" intensity={22} distance={6} />
    </group>
  );
}

function DynamicOrbitNode({ radius, speed, offset, mousePos }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed + offset;
      const x = Math.cos(t) * radius + mousePos.x * 0.6;
      const y = Math.sin(t * 1.2) * (radius * 0.6) + mousePos.y * 0.5;
      const z = Math.sin(t) * radius;
      ref.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.11, 16, 16]} />
      <meshBasicMaterial color="#38bdf8" />
      <pointLight color="#38bdf8" intensity={4} distance={2} />
    </mesh>
  );
}

export default function InteractiveSphere({ score = "78%", label = "AI MASTERY" }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates (-1 to 1) based on container & viewport
      const x = Math.max(-1.4, Math.min(1.4, (e.clientX - centerX) / (rect.width / 1.2)));
      const y = Math.max(-1.4, Math.min(1.4, -(e.clientY - centerY) / (rect.height / 1.2)));

      setMousePos((prev) => ({ ...prev, x, y }));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`interactive-sphere-wrapper ${mousePos.isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setMousePos((p) => ({ ...p, isHovered: true }))}
      onMouseLeave={() => setMousePos((p) => ({ ...p, isHovered: false }))}
    >
      <div className="sphere-canvas-container">
        <Canvas camera={{ position: [0, 0, 4.2], fov: 46 }} dpr={[1, 1.8]}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 5, 4]} intensity={2.5} color="#e0aaff" />

          {/* Cursor Spotlight that lights up where mouse goes */}
          <CursorSpotlight mousePos={mousePos} />

          {/* Tracking Sphere that physically translates towards cursor */}
          <TrackingSphere mousePos={mousePos} />

          {/* Orbiting energy nodes */}
          <DynamicOrbitNode radius={2.1} speed={1.3} offset={0} mousePos={mousePos} />
          <DynamicOrbitNode radius={2.3} speed={-1.0} offset={Math.PI / 2} mousePos={mousePos} />

          <Sparkles count={90} scale={6} size={2.6} speed={0.45} color="#e0aaff" />
        </Canvas>
      </div>

      {/* Floating HUD Telemetry Badge that magnetically moves with the sphere */}
      <div
        className="sphere-hud-overlay"
        style={{
          transform: `translate(${mousePos.x * 24}px, ${-mousePos.y * 20}px)`,
        }}
      >
        <div className="hud-ring-center">
          <span className="hud-score">{score}</span>
          <span className="hud-label">{label}</span>
          <span className="hud-tracking-pill">
            <span className="hud-blip" /> CURSOR TRACKING • ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
}
