import React, { useState, useRef } from "react";
import ShapeDesignMenu from "./ShapeDesignMenu";

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
}

const ShapeWrapper: React.FC<ShapeWrapperProps> = ({
  children,
  isActive,
  onSelect,
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
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [shapeColor, setShapeColor] = useState(currentColor || "#3b82f6"); // Default blue color

  const handleClick = (e: React.MouseEvent) => {
    if (menuRef.current?.contains(e.target as Node)) {
      return;
    }

    if (contentRef.current?.contains(e.target as Node)) {
      e.stopPropagation();
      onSelect?.();

      if (!isText) {
        setMenuVisible(true);
      }
    }
  };

  const handleFocus = () => {
    if (!isText) {
      setMenuVisible(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setMenuVisible(false);
    }
  };

  const handleColorChange = (color: string) => {
    setShapeColor(color);
    onColorChange?.(color);
  };

  return (
    <div
      className="group relative size-full"
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
    >
      {/* Content area */}
      <div
        ref={contentRef}
        className={`size-full ${!isText && "cursor-move"}`}
        onMouseDown={(e) => {
          if (!isText) {
            e.stopPropagation();
          }
        }}
      >
        {children}
      </div>

      {/* Design Menu */}
      {menuVisible && !isText && (
        <div
          ref={menuRef}
          className="absolute -right-1 top-0 z-50 translate-x-full"
          onMouseDown={(e) => e.stopPropagation()}
        >
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

          {/* Arrow pointer */}
          <div className="absolute -left-2 top-3 size-4">
            <div className="size-4 rotate-45 bg-[#f8fafc]"></div>
          </div>
        </div>
      )}

      {/* Selection outline */}
      <div
        className={`absolute inset-0 rounded border-2 border-transparent transition-colors ${menuVisible ? "border-blue-500" : "group-hover:border-blue-500/50"}`}
      />
    </div>
  );
};

export default ShapeWrapper;
