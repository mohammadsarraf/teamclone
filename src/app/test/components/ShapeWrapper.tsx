import React, { useState } from "react";

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
  isText?: boolean;
}

const ShapeWrapper = ({ children, isActive, onSelect, isText }: ShapeWrapperProps) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleFocus = () => {
    setMenuVisible(true);
  };

  const handleBlur = () => {
    setMenuVisible(false);
  };

  return (
    <div 
      className={`size-full ${isText ? '' : 'cursor-move'}`}
      tabIndex={0} // Make the div focusable
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={() => {
        if (!isText) {
          onSelect?.();
        }
      }}
    >
      {children}
      {menuVisible && (
        <div className="menu">
          <ul>
            <li onClick={() => console.log('Edit')}>Edit</li>
            <li onClick={() => console.log('Delete')}>Delete</li>
            <li onClick={() => console.log('Duplicate')}>Duplicate</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShapeWrapper;
