import React from 'react';

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
}

const ShapeWrapper = ({ children, isActive, onSelect }: ShapeWrapperProps) => {
  return (
    <div 
      className={`h-full w-full cursor-move`}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

export default ShapeWrapper; 