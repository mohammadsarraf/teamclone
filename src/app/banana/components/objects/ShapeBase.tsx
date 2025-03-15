import React from 'react';
import { GridItem } from '../../types';

export interface ShapeProps {
  item: GridItem;
  isBeingDragged: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  shadowClasses: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  customStyles?: React.CSSProperties;
  isDraggingDisabled?: boolean;
}

export const getBaseStyles = (item: GridItem) => {
  return {
    height: '100%',
    width: '100%',
    backgroundColor: item.type === 'textbox' ? 'transparent' : (item.backgroundColor || '#3B82F6'),
    color: item.textColor || '#FFFFFF',
    borderRadius: item.shapeType === 'circle' ? '50%' : `${item.borderRadius || 8}px`,
    padding: `${item.padding || 16}px`,
    fontSize: `${item.fontSize || 16}px`,
    fontWeight: item.fontWeight || 'normal',
    position: 'relative' as const,
    zIndex: item.layer,
    textAlign: (item.textAlign as 'left' | 'center' | 'right') || 'left',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: item.textDecoration,
    fontFamily: item.fontFamily
  };
};

// Group indicator component that can be used by all shapes
export const GroupIndicator: React.FC = () => (
  <div className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
    G
  </div>
);

export default function ShapeBase({ 
  item, 
  isBeingDragged, 
  isFocused, 
  isHovered, 
  shadowClasses, 
  customStyles,
  children,
  isDraggingDisabled
}: ShapeProps & { children?: React.ReactNode }) {
  const baseStyles = getBaseStyles(item);
  
  // Get shape type name for display
  const getShapeTypeName = () => {
    switch (item.type) {
      case 'square':
        return item.shapeType || 'Square';
      case 'textbox':
        return 'Text';
      case 'section':
        return 'Section';
      default:
        return 'Shape';
    }
  };
  
  // Determine shadow class based on item's shadow property
  const shadowClass = item.shadow && typeof shadowClasses[item.shadow as keyof typeof shadowClasses] === 'string' 
    ? shadowClasses[item.shadow as keyof typeof shadowClasses] 
    : '';
  
  return (
    <div 
      id={item.i}
      className={`
        ${shadowClass}
        ${isBeingDragged ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isFocused ? 'ring-2 ring-blue-500' : ''}
        ${isHovered && !isFocused ? 'ring-1 ring-blue-300' : ''}
        ${isDraggingDisabled ? 'cursor-text ring-2 ring-yellow-400' : ''}
        transition-shadow duration-200
      `}
      style={{
        ...baseStyles,
        ...customStyles
      }}
    >
      {children}
    </div>
  );
} 