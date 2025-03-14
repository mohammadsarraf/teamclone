import React from 'react';
import ShapeBase, { ShapeProps, GroupIndicator } from './ShapeBase';

export default function TriangleShape({ item, isBeingDragged, isFocused, isHovered, shadowClasses }: ShapeProps) {
  return (
    <ShapeBase 
      item={item} 
      isBeingDragged={isBeingDragged} 
      isFocused={isFocused}
      isHovered={isHovered}
      shadowClasses={shadowClasses}
      customStyles={{
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        padding: 0 // Remove padding to maximize space
      }}
    />
  );
} 