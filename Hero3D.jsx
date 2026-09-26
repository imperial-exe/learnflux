import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Core() {
  const group = useRef();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 4]} />
        <meshStandardMaterial color="#9d4edd" emissive="#6a1b9a" emissiveIntensity={2.4} roughness={0.2} metalness={0.65} wireframe />
      </mesh>
      <mesh scale={0.72}>
        <icosahedronGeometry args={[1.35, 3]} />
        <meshStandardMaterial color="#d98cff" emissive="#9c36d6" emissiveIntensity={3} transparent opacity={0.7} />
      </mesh>
      <pointLight color="#b84cff" intensity={25} distance={8} />
    </group>
  );
}

function Node({ position, label }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#c77dff" emissive="#a855f7" emissiveIntensity={4} />
      </mesh>
      <pointLight color="#c77dff" intensity={3} distance={2} />

    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="hero-canvas">
      <Canvas camera={{ position: [0, 0.3, 5.2], fov: 42 }} dpr={[1, 1.7]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 3]} intensity={2} color="#e8d5ff" />
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.35}>
          <Core />
        </Float>
        <Node position={[-2.1, 1.15, 0]} label="CODE" />
        <Node position={[2.0, 1.0, 0]} label="MATH" />
        <Node position={[-2.2, -1.0, 0]} label="QUIZ" />
        <Node position={[2.1, -0.9, 0]} label="AI" />
        <Sparkles count={140} scale={7} size={2} speed={0.35} color="#d6a4ff" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
      </Canvas>
    </div>
  );
}