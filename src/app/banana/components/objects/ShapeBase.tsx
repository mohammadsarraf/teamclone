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
    border: item.borderWidth ? `${item.borderWidth}px solid ${item.borderColor || '#000000'}` : 'none',
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
  children 
}: ShapeProps & { children?: React.ReactNode }) {
  const baseStyles = getBaseStyles(item);
  
  // Get display name for the shape type
  const getShapeTypeName = () => {
    if (item.type === 'textbox') return 'Text';
    if (item.type === 'section') return 'Section';
    if (item.type === 'square') return 'Shape';
    return 'Shape';
  };
  
  return (
    <div className="relative h-full w-full">
      {/* Main shape content */}
      <div
        className={`relative h-full w-full transition-shadow ${shadowClasses[item.shadow || 'none']} ${item.group ? 'ring-2 ring-purple-500' : ''} ${isBeingDragged ? 'ring-2 ring-blue-500 ring-opacity-70' : ''}`}
        style={{
          ...baseStyles,
          ...customStyles
        }}
      >
        {item.group && !isFocused && <GroupIndicator />}
        {children}
      </div>
      
      {/* Hover border with type label - only show when not focused */}
      {isHovered && !isFocused && (
        <>
          <div 
            className="absolute inset-0 border-2 border-blue-500 pointer-events-none z-10"
            style={{ boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)' }}
          />
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs py-1 px-2 rounded-t-md pointer-events-none z-10">
            {getShapeTypeName()}
          </div>
        </>
      )}
      
      {/* Focus border with resize handles */}
      {isFocused && (
        <>
          <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none z-10" />
          
          {/* Resize handles - 8 points */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border-2 border-blue-500 rounded-sm pointer-events-none z-10" />
        </>
      )}
    </div>
  );
} 