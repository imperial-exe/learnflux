import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";

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
        <meshStandardMaterial
          color="#9d4edd"
          emissive="#6a1b9a"
          emissiveIntensity={2.2}
          roughness={0.2}
          metalness={0.65}
          wireframe
        />
      </mesh>
      <mesh scale={0.72}>
        <icosahedronGeometry args={[1.35, 3]} />
        <meshStandardMaterial
          color="#d98cff"
          emissive="#9c36d6"
          emissiveIntensity={2.8}
          transparent
          opacity={0.75}
        />
      </mesh>
      <pointLight color="#b84cff" intensity={25} distance={8} />
    </group>
  );
}

function Node({ position, label, color = "#c77dff" }) {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.2 + position[0]) * 0.12;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.5} />
      </mesh>
      <pointLight color={color} intensity={4} distance={3} />
    </group>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="hero-fallback-graphic">
          <div className="pulsing-core">
            <div className="core-orbit"></div>
            <div className="core-center">✦ AI</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Hero3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="hero-canvas hero-loading">
        <div className="hero-fallback-graphic">
          <div className="pulsing-core">
            <div className="core-orbit"></div>
            <div className="core-center">✦ AI</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-canvas">
      <ErrorBoundary>
        <Canvas camera={{ position: [0, 0.3, 5.2], fov: 42 }} dpr={[1, 1.7]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 3]} intensity={2.2} color="#e8d5ff" />
          <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.35}>
            <Core />
          </Float>
          <Node position={[-2.1, 1.15, 0]} label="CODE" color="#c77dff" />
          <Node position={[2.0, 1.0, 0]} label="MATH" color="#70e000" />
          <Node position={[-2.2, -1.0, 0]} label="QUIZ" color="#38bdf8" />
          <Node position={[2.1, -0.9, 0]} label="AI" color="#ff70a6" />
          <Sparkles count={150} scale={7.5} size={2.2} speed={0.4} color="#d6a4ff" />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
