"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface ThreeProps {
  type: string;
  color: string;
}

const ThreeComponents = ({ type, color }: ThreeProps) => {
  const colorHex = color.includes('blue') ? '#3B82F6' : 
                  color.includes('red') ? '#EF4444' : 
                  color.includes('green') ? '#10B981' : '#FFFFFF';

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} />
      
      {type === 'square' && (
        <mesh rotation={[0, 0.5, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={colorHex} />
        </mesh>
      )}
      
      {type === 'circle' && (
        <mesh rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[1, 1, 0.2, 32]} />
          <meshStandardMaterial color={colorHex} />
        </mesh>
      )}
      
      {type === 'triangle' && (
        <mesh rotation={[0, 0.3, 0]}>
          <coneGeometry args={[1, 2, 3]} />
          <meshStandardMaterial color={colorHex} />
        </mesh>
      )}
    </Canvas>
  );
};

export default ThreeComponents; 