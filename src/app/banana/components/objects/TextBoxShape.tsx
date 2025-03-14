import React, { useRef } from 'react';
import ShapeBase, { ShapeProps, getBaseStyles, GroupIndicator } from './ShapeBase';
import { GridItem } from '../../types';

interface TextBoxProps extends ShapeProps {
  handleContentChange: (itemId: string, newContent: string) => void;
  textboxContentRef: React.MutableRefObject<{[key: string]: string}>;
}

export default function TextBoxShape({ 
  item, 
  isBeingDragged, 
  isFocused,
  isHovered,
  shadowClasses, 
  handleContentChange,
  textboxContentRef
}: TextBoxProps) {
  const baseStyles = getBaseStyles(item);
  
  return (
    <ShapeBase 
      item={item} 
      isBeingDragged={isBeingDragged} 
      isFocused={isFocused}
      isHovered={isHovered}
      shadowClasses={shadowClasses}
    >
      <div 
        contentEditable
        suppressContentEditableWarning
        className={`h-full w-full focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:opacity-70`}
        style={{
          display: 'block', // Override flex display for proper text alignment
          textAlign: item.textAlign || 'left',
        }}
        ref={(el) => {
          // Set initial content only once when the element is first rendered
          if (el && !el.textContent && item.content) {
            el.textContent = item.content;
          }
        }}
        onFocus={() => {
          // Store the current content when focusing
          textboxContentRef.current[item.i] = item.content || '';
        }}
        onBlur={(e) => {
          const newContent = e.currentTarget.textContent || '';
          const oldContent = textboxContentRef.current[item.i] || '';
          
          // Only update if content has actually changed
          if (newContent !== oldContent) {
            handleContentChange(item.i, newContent);
            textboxContentRef.current[item.i] = newContent;
          }
        }}
        data-placeholder={item.placeholder || 'Click to edit text'}
      >
        {/* Content is managed by the ref and contentEditable */}
      </div>
    </ShapeBase>
  );
} 