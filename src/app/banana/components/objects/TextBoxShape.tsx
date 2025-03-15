import React, { useRef } from 'react';
import ShapeBase, { ShapeProps, getBaseStyles, GroupIndicator } from './ShapeBase';
import { GridItem } from '../../types';

interface TextBoxProps extends ShapeProps {
  handleContentChange: (itemId: string, newContent: string) => void;
  textboxContentRef: React.MutableRefObject<{[key: string]: string}>;
  isTextStyleMenuOpen?: boolean;
}

export default function TextBoxShape({ 
  item, 
  isBeingDragged, 
  isFocused,
  isHovered,
  shadowClasses, 
  handleContentChange,
  textboxContentRef,
  isTextStyleMenuOpen = false
}: TextBoxProps) {
  const baseStyles = getBaseStyles(item);
  
  // Get text style classes based on the textStyle property
  const getTextStyleClasses = () => {
    switch (item.textStyle) {
      case 'heading-1':
        return 'text-3xl font-bold';
      case 'heading-2':
        return 'text-2xl font-semibold';
      case 'heading-3':
        return 'text-xl font-medium';
      case 'paragraph-2':
        return 'text-base';
      case 'paragraph-1':
      default:
        return 'text-sm';
    }
  };
  
  // Apply custom styles from the item properties
  const getCustomStyles = () => {
    return {
      display: 'block', // Override flex display for proper text alignment
      textAlign: item.textAlign || 'left',
      fontWeight: item.fontWeight || 'normal',
      fontStyle: item.fontStyle || 'normal',
      textDecoration: item.textDecoration || 'none',
      lineHeight: item.lineHeight ? `${item.lineHeight}` : 'normal',
      letterSpacing: item.letterSpacing ? `${item.letterSpacing}px` : 'normal',
      fontFamily: item.fontFamily || 'inherit',
      fontSize: item.fontSize ? `${item.fontSize}px` : 'inherit',
      color: item.textColor || 'inherit',
      cursor: isTextStyleMenuOpen ? 'text' : 'inherit', // Change cursor to text when TextStyleMenu is open
    };
  };
  
  return (
    <ShapeBase 
      item={item} 
      isBeingDragged={isBeingDragged} 
      isFocused={isFocused}
      isHovered={isHovered}
      shadowClasses={shadowClasses}
      isDraggingDisabled={isTextStyleMenuOpen}
    >
      <div 
        contentEditable
        suppressContentEditableWarning
        className={`h-full w-full focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:opacity-70 ${getTextStyleClasses()} ${isTextStyleMenuOpen ? 'editing-with-menu' : ''}`}
        style={getCustomStyles()}
        ref={(el) => {
          // Set initial content only once when the element is first rendered
          if (el && !el.innerHTML && item.content) {
            // Use innerHTML to preserve formatting
            el.innerHTML = item.content;
          }
        }}
        onFocus={() => {
          // Store the current content when focusing
          const element = document.getElementById(item.i)?.querySelector('[contenteditable]');
          if (element) {
            textboxContentRef.current[item.i] = element.innerHTML || '';
          }
        }}
        onBlur={(e) => {
          // Get the HTML content to preserve formatting
          const newContent = e.currentTarget.innerHTML || '';
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