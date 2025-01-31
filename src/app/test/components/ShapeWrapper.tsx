import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import TextDesignMenu from "./menus/TextDesignMenu";
import ShapeDesignMenu from "./menus/ShapeDesignMenu";

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
  isText?: boolean;
  onShapeChange?: (type: "triangle" | "circle" | "square") => void;
  onColorChange?: (color: string) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  currentShape?: string;
  onOpacityChange?: (opacity: number) => void;
  onRotationChange?: (rotation: number) => void;
  onBorderChange?: (options: { width: number; color: string }) => void;
  currentOpacity?: number;
  currentRotation?: number;
  currentBorder?: { width: number; color: string };
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onShadowChange?: (hasShadow: boolean) => void;
  currentShadow?: boolean;
  currentFlipH?: boolean;
  currentFlipV?: boolean;
  currentColor?: string;
  totalShapes: number;
  index: number;
  menuVisible: boolean;
  className?: string;
  onFontChange?: (font: string) => void;
  currentFont?: string;
  onFontSize?: (size: number) => void;
  currentFontSize?: number;
  onTextAlign?: (align: 'left' | 'center' | 'right') => void;
  currentTextAlign?: 'left' | 'center' | 'right';
  onBold?: () => void;
  isBold?: boolean;
  onItalic?: () => void;
  isItalic?: boolean;
  onUnderline?: () => void;
  isUnderline?: boolean;
  onLineHeight?: (height: number) => void;
  currentLineHeight?: number;
  onLetterSpacing?: (spacing: number) => void;
  currentLetterSpacing?: number;
}

const ShapeWrapper: React.FC<ShapeWrapperProps> = ({
  children,
  isActive,
  onSelect,
  menuVisible,
  isText,
  currentShape = "",
  onShapeChange,
  onColorChange,
  onDelete = () => {},
  onDuplicate = () => {},
  onOpacityChange = () => {},
  onRotationChange = () => {},
  onBorderChange,
  currentOpacity = 100,
  currentRotation = 0,
  currentBorder,
  onFlipHorizontal = () => {},
  onFlipVertical = () => {},
  onShadowChange,
  currentShadow = false,
  currentFlipH = false,
  currentFlipV = false,
  currentColor = "#3b82f6",
  totalShapes,
  index,
  className = '',
  onFontChange,
  currentFont,
  onFontSize,
  currentFontSize,
  onTextAlign,
  currentTextAlign,
  onBold,
  isBold,
  onItalic,
  isItalic,
  onUnderline,
  isUnderline,
  onLineHeight,
  currentLineHeight,
  onLetterSpacing,
  currentLetterSpacing,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [shapeColor, setShapeColor] = useState(currentColor || "#3b82f6");

  useEffect(() => {
    if (menuVisible && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.top,
        right: window.innerWidth - rect.right,
      });
    }
  }, [menuVisible]);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag="true"]')) {
      return;
    }

    if (menuRef.current?.contains(e.target as Node)) {
      return;
    }

    onSelect?.();
  };

  const handleFocus = () => {
    // No need to handle focus as menuVisible is controlled from parent
  };

  const handleBlur = (e: React.FocusEvent) => {
    // No need to handle blur as menuVisible is controlled from parent
  };

  const handleColorChange = (color: string) => {
    setShapeColor(color);
    onColorChange?.(color);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only stop propagation if clicking on a no-drag element
    if ((e.target as HTMLElement).closest('[data-no-drag="true"]')) {
      e.stopPropagation();
      return;
    }
  };

  return (
    <div
      className={`group relative size-full ${className}`}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      style={{ 
        zIndex: menuVisible ? 10000 : index,
      }}
    >
      {/* Content area */}
      <div
        ref={contentRef}
        className={`size-full ${!isText && "cursor-move"}`}
      >
        {children}
      </div>

      {/* Selection outline */}
      <div
        className={`absolute inset-0 rounded border-2 border-transparent transition-colors pointer-events-none ${
          menuVisible 
            ? isText 
              ? "border-blue-500 bg-gray-800/5" 
              : "border-blue-500"
            : "group-hover:border-blue-500/50"
        }`}
      />

      {/* Render menu in a portal */}
      {menuVisible && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[99999] menu-content"
          style={{
            top: menuPosition.top,
            right: menuPosition.right,
            transform: 'translateX(100%)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {isText ? (
            <TextDesignMenu
              selectedColor={currentColor}
              onColorChange={onColorChange || (() => {})}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onOpacityChange={onOpacityChange}
              currentOpacity={currentOpacity}
              onFontChange={onFontChange}
              currentFont={currentFont}
              onFontSize={onFontSize}
              currentFontSize={currentFontSize}
              onTextAlign={onTextAlign}
              currentTextAlign={currentTextAlign}
              onBold={onBold}
              isBold={isBold}
              onItalic={onItalic}
              isItalic={isItalic}
              onUnderline={onUnderline}
              isUnderline={isUnderline}
              onLineHeight={onLineHeight}
              currentLineHeight={currentLineHeight}
              onLetterSpacing={onLetterSpacing}
              currentLetterSpacing={currentLetterSpacing}
            />
          ) : (
            <ShapeDesignMenu
              selectedColor={currentColor}
              onColorChange={onColorChange || (() => {})}
              currentShape={currentShape}
              onShapeChange={onShapeChange || (() => {})}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onOpacityChange={onOpacityChange}
              onRotationChange={onRotationChange}
              currentOpacity={currentOpacity}
              currentRotation={currentRotation}
              onFlipHorizontal={onFlipHorizontal}
              onFlipVertical={onFlipVertical}
              currentFlipH={currentFlipH}
              currentFlipV={currentFlipV}
              onBorderChange={onBorderChange}
              currentBorder={currentBorder}
              onShadowChange={onShadowChange}
              currentShadow={currentShadow}
            />
          )}

          {/* Arrow pointer */}
          <div className="absolute -left-2 top-3 size-4">
            <div className="size-4 rotate-45 bg-[#f8fafc]"></div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ShapeWrapper;
