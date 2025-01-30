import React from 'react';

interface TriangleProps {
  color?: string;
  className?: string;
}

const Triangle = ({ color = 'border-white', className = '' }: TriangleProps) => {
  return (
    <div className={`relative h-full w-full flex items-center justify-center ${className}`}>
      <div
        className={`absolute w-[70%] h-[70%]
          clip-path-triangle
          ${color}
          bg-current
          transition-all duration-200`}
        style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
      />
    </div>
  );
};

export default Triangle; 