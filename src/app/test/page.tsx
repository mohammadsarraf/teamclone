"use client";
import React, { useState, useEffect, useMemo } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import dynamic from "next/dynamic";
import { useWindowSize } from "./hooks/useWindowSize";
import { GridOverlay } from "./components/GridOverlay";
import { GridContainer } from "./components/GridContainer";
import ShapeWrapper from "./components/ShapeWrapper";
import ShapeItem from "./components/ShapeItem";
import { Layout } from "react-grid-layout";
import { ShapeManager } from "./class";
import { Block } from "./types";

// Dynamically import Zdog components with no SSR
const ZdogComponents = dynamic(() => import("./components/ZdogComponents"), {
  ssr: false,
});

// Dynamically import Three components with no SSR
const ShapeComponents = dynamic(() => import("./components/ShapeComponents"), {
  ssr: false,
});

const TextBox = dynamic(() => import("./components/TextBox"), { ssr: false });

const initialLayout: Block[] = [];

// Make sure to export the interface
export interface TestPageProps {
  className?: string;
  containerClassName?: string;
  initialCols?: number;
  initialRows?: number;
  onHeightChange?: (height: number) => void;
  showMenuButton?: boolean;
}

const TestPage = ({
  className = "",
  containerClassName = "",
  initialCols = 36,
  initialRows = 12,
  onHeightChange,
  showMenuButton = true,
}: TestPageProps) => {
  const [layout, setLayout] = useState<Block[]>(initialLayout);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number; w: number; h: number };
  }>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cols, setCols] = useState(initialCols);
  const [rows, setRows] = useState(initialRows);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const containerWidth = useWindowSize();
  const unitSize = containerWidth / cols;

  // Create ShapeManager instance
  const shapeManager = useMemo(
    () =>
      new ShapeManager(
        layout,
        setLayout,
        positions,
        setPositions,
        activeShape,
        setActiveShape,
      ),
    [layout, positions, activeShape],
  );

  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        activeMenu &&
        !(e.target as HTMLElement).closest(".menu-content") &&
        !(e.target as HTMLElement).closest(".shape-wrapper")
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Calculate and notify parent of actual grid height
  useEffect(() => {
    const gridHeight = rows * unitSize;
    onHeightChange?.(gridHeight);
  }, [rows, unitSize, onHeightChange]);

  // Handle row changes from MenuBar
  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
    const newHeight = newRows * unitSize;
    onHeightChange?.(newHeight);
  };

  const handleStartEdit = (blockId: string) => {
    setActiveShape(blockId);
    setActiveMenu(blockId);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setActiveMenu(null);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    setActiveMenu(null);
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Only show menu button when showMenuButton is true */}
      {showMenuButton && (
        <>
          <button
            onClick={() => setIsMenuVisible(!isMenuVisible)}
            className="absolute right-4 top-4 z-10 rounded-full bg-gray-800 p-2 text-white shadow-lg transition-all hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuVisible ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>

          {/* Floating menu */}
          {isMenuVisible && (
            <div className="absolute right-4 top-16 z-10 rounded-lg bg-gray-800 p-4 shadow-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      localStorage.removeItem("shapeLayout");
                      setLayout([]);
                    }}
                    className="rounded bg-red-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-600"
                  >
                    Reset Layout
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-1">
                      <label className="text-sm text-white">Cols:</label>
                      <input
                        type="number"
                        value={cols}
                        onChange={(e) => setCols(Number(e.target.value))}
                        min="1"
                        max="50"
                        className="w-16 rounded bg-gray-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center space-x-1">
                      <label className="text-sm text-white">Rows:</label>
                      <input
                        type="number"
                        value={rows}
                        onChange={(e) => {
                          const newRows = Math.max(1, Number(e.target.value));
                          handleRowsChange(newRows);
                        }}
                        min="1"
                        max="50"
                        className="w-16 rounded bg-gray-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => shapeManager.addShape("triangle")}
                    className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                  >
                    Add Triangle
                  </button>
                  <button
                    onClick={() => shapeManager.addShape("circle")}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Add Circle
                  </button>
                  <button
                    onClick={() => shapeManager.addShape("square")}
                    className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                  >
                    Add Square
                  </button>
                  <button
                    onClick={shapeManager.addTextBox}
                    className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                  >
                    Add Text
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className={`relative flex-1 ${containerClassName}`}>
        <GridOverlay
          show={isDragging || isResizing}
          cols={cols}
          rows={rows}
          unitSize={unitSize}
        />

        <GridContainer
          key={`grid-${cols}-${rows}`}
          cols={cols}
          rows={rows}
          unitSize={unitSize}
          layout={layout}
          onLayoutChange={shapeManager.handleLayoutChange}
          onResizeStop={(layout, oldItem, newItem) => {
            shapeManager.handleLayoutChange(layout);
            shapeManager.handleResizeStop(layout, oldItem, newItem);
            setIsResizing(false);
          }}
          onResizeStart={() => setIsResizing(true)}
          onDragStart={() => setIsDragging(true)}
          onDragStop={(layout: Layout[]) => {
            setIsDragging(false);
            shapeManager.handleLayoutChange(layout);
          }}
          preventCollision={false}
          allowOverlap={true}
          verticalCompact={false}
          compactType={null}
          isDraggable={true}
          isResizable={true}
          isResizing={isResizing}
          resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
          transformScale={1}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          style={{ height: "100%", width: "100%" }}
          draggableHandle="[data-drag-handle]"
        >
          {layout.map((block, index) => (
            <div
              key={block.i}
              style={{
                position: "relative",
                width: block.w,
                height: block.h,
                transform: `translate(${block.x}px, ${block.y}px)`,
              }}
            >
              <ShapeWrapper
                onSelect={() => setActiveMenu(block.i)}
                menuVisible={activeMenu === block.i}
                isText={block.shape === "text"}
                currentShape={block.shape}
                onShapeChange={(type) =>
                  shapeManager.handleShapeChange(block.i, type)
                }
                onColorChange={(color) =>
                  shapeManager.handleColorChange(block.i, color)
                }
                onDelete={() => shapeManager.handleDelete(block.i)}
                onDuplicate={() => shapeManager.handleDuplicate(block.i)}
                onOpacityChange={(opacity) =>
                  shapeManager.handleOpacityChange(block.i, opacity)
                }
                onRotationChange={(rotation) =>
                  shapeManager.handleRotationChange(block.i, rotation)
                }
                onBorderChange={shapeManager.handleBorderChange}
                currentOpacity={block.opacity}
                currentRotation={block.rotation || 0}
                currentBorder={block.border}
                onFlipHorizontal={() => shapeManager.handleFlipH(block.i)}
                onFlipVertical={() => shapeManager.handleFlipV(block.i)}
                onShadowChange={shapeManager.handleShadowChange}
                currentShadow={block.shadow}
                currentFlipH={block.flipH || false}
                currentFlipV={block.flipV || false}
                currentColor={block.color}
                totalShapes={layout.length}
                index={layout.length - index}
                className="shape-wrapper"
                onFontChange={(font) =>
                  shapeManager.handleFontChange(block.i, font)
                }
                currentFont={block.font}
                onFontSize={(size) =>
                  shapeManager.handleFontSizeChange(block.i, size)
                }
                currentFontSize={block.fontSize}
                onTextAlign={(align) =>
                  shapeManager.handleTextAlignChange(block.i, align)
                }
                currentTextAlign={block.textAlign}
                onBold={() => shapeManager.handleBoldChange(block.i)}
                isBold={block.isBold}
                onItalic={() => shapeManager.handleItalicChange(block.i)}
                isItalic={block.isItalic}
                onUnderline={() => shapeManager.handleUnderlineChange(block.i)}
                isUnderline={block.isUnderline}
                onLineHeight={(height) =>
                  shapeManager.handleLineHeightChange(block.i, height)
                }
                currentLineHeight={block.lineHeight}
                onLetterSpacing={(spacing) =>
                  shapeManager.handleLetterSpacingChange(block.i, spacing)
                }
                currentLetterSpacing={block.letterSpacing}
                onEnterPress={() => shapeManager.handleEnterPress(block.i)}
                onHeightChange={(height) =>
                  shapeManager.handleHeightChange(block.i, height)
                }
                unitSize={unitSize}
              >
                <ShapeItem
                  type={block.shape}
                  color={block.color}
                  text={block.text}
                  onTextChange={(newText) =>
                    shapeManager.handleTextChange(block.i, newText)
                  }
                  isActive={activeShape === block.i}
                  onStartEdit={() => handleStartEdit(block.i)}
                  opacity={block.opacity}
                  rotation={block.rotation || 0}
                  flipH={block.flipH || false}
                  flipV={block.flipV || false}
                  font={block.font}
                  fontSize={block.fontSize}
                  textAlign={block.textAlign}
                  isBold={block.isBold}
                  isItalic={block.isItalic}
                  isUnderline={block.isUnderline}
                  lineHeight={block.lineHeight}
                  letterSpacing={block.letterSpacing}
                  onEnterPress={() => shapeManager.handleEnterPress(block.i)}
                  onHeightChange={(height) =>
                    shapeManager.handleHeightChange(block.i, height)
                  }
                  unitSize={unitSize}
                />
              </ShapeWrapper>
            </div>
          ))}
        </GridContainer>
      </div>
    </div>
  );
};

// Export both the interface and the component
const Test = (props: TestPageProps) => {
  return <TestPage {...props} />;
};

export default Test;
