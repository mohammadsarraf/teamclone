"use client";
import React, { useState, useEffect, useMemo } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import dynamic from "next/dynamic";
import { useWindowSize } from "./hooks/useWindowSize";
import { MenuBar } from "./components/MenuBar";
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

// Modify TestPage to accept props for customization
interface TestPageProps {
  className?: string;
  containerClassName?: string;
  initialCols?: number;
  initialRows?: number;
}

const TestPage = ({
  className = "",
  containerClassName = "",
  initialCols = 36,
  initialRows = 12,
}: TestPageProps) => {
  const [layout, setLayout] = useState<Block[]>(initialLayout);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cols, setCols] = useState(initialCols);
  const [rows, setRows] = useState(initialRows);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number; w: number; h: number };
  }>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
      <MenuBar
        cols={cols}
        rows={rows}
        setCols={setCols}
        setRows={setRows}
        onReset={() => {
          localStorage.removeItem("shapeLayout");
          setLayout([]);
        }}
        onAddShape={shapeManager.addShape}
        onAddTextBox={shapeManager.addTextBox}
      />
      <div className={`relative flex-1 overflow-hidden ${containerClassName}`}>
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
          onResizeStart={handleResizeStart}
          onDragStart={handleDragStart}
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
          resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
          transformScale={1}
          margin={[0, 0]}
          containerPadding={[0, 0]}
          style={{ height: "100%" }}
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

export default TestPage;
