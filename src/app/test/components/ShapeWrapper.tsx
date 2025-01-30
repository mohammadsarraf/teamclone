import React from "react";

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
  isText?: boolean;
}

const ShapeWrapper = ({ children, isActive, onSelect, isText }: ShapeWrapperProps) => {
  return (
    <div 
      className={`size-full ${isText ? '' : 'cursor-move'}`}
      onClick={(e) => {
        if (!isText) {
          onSelect?.();
        }
      }}
    >
      {children}
    </div>
  );
};

export default ShapeWrapper;
