// @ts-nocheck
"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface ThreeProps {
  type: string;
  color: string;
}

const ThreeComponents = ({ type, color }: ThreeProps) => {
  const Shape = () => {
    switch (type) {
      case "triangle":
        return <coneGeometry args={[1, 2, 3]} />;
      case "circle":
        return <sphereGeometry args={[1, 32, 32]} />;
      case "square":
        return <boxGeometry args={[1, 1, 1]} />;
      default:
        return null;
    }
  };

  return (
    <Canvas>
      <AmbientLight intensity={0.5} />
      <PointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} />
      <mesh>
        <Shape />
        <meshStandardMaterial color={color} />
      </mesh>
    </Canvas>
  );
};

// Define the light components
const AmbientLight = ({ intensity }: { intensity: number }) => {
  return <ambientLight intensity={intensity} />;
};

const PointLight = ({ position }: { position: [number, number, number] }) => {
  return <pointLight position={position} />;
};

export default ThreeComponents;
