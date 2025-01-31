"use client";
import React, { useState, Suspense, useEffect } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import dynamic from "next/dynamic";
import { useWindowSize } from "./hooks/useWindowSize";
import { MenuBar } from "./components/MenuBar";
import { GridOverlay } from "./components/GridOverlay";
import { GridContainer } from "./components/GridContainer";
import ShapeWrapper from "./components/ShapeWrapper";
import { Layout } from "react-grid-layout";

// Dynamically import Zdog components with no SSR
const ZdogComponents = dynamic(() => import("./components/ZdogComponents"), {
  ssr: false,
});

// Dynamically import Three components with no SSR
const ShapeComponents = dynamic(() => import("./components/ShapeComponents"), {
  ssr: false,
});

const TextBox = dynamic(() => import("./components/TextBox"), { ssr: false });

interface Block extends Layout {
  shape: "triangle" | "circle" | "square" | "text" | string;
  color: string;
  maintainRatio?: boolean;
  text?: string;
  rotation?: number;
  border?: { width: number; color: string };
  shadow?: boolean;
  flipH?: boolean;
  flipV?: boolean;
  opacity: number;
}

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
  isText?: boolean;
  currentShape?: string;
  onShapeChange?: (type: "triangle" | "circle" | "square") => void;
  onColorChange?: (color: string) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
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
  menuVisible?: boolean;
}

const ShapeItem = ({
  type,
  color,
  text,
  onTextChange,
  isActive,
  opacity,
  rotation,
  flipH,
  flipV,
  onStartEdit,
}: {
  type: Block["shape"];
  color: string;
  text?: string;
  onTextChange?: (newText: string) => void;
  isActive?: boolean;
  opacity: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  onStartEdit?: () => void;
}) => {
  if (!type) return null;

  if (type === "text") {
    return (
      <TextBox
        text={text || ""}
        onTextChange={onTextChange!}
        isActive={isActive}
        onStartEdit={onStartEdit}
      />
    );
  }

  return (
    <Suspense fallback={<div className="size-full bg-gray-700" />}>
      <div className="flex size-full items-center justify-center">
        <div className="size-full">
          <ShapeComponents
            type={type}
            color={color}
            opacity={opacity}
            rotation={rotation}
            flipH={flipH}
            flipV={flipV}
          />
        </div>
      </div>
    </Suspense>
  );
};

const initialLayout: Block[] = [];

const createNewShape = (
  type: "triangle" | "circle" | "square" | "text",
  layout: Block[],
) => {
  const id = `${type}${layout.length + 1}`;
  const defaultColor = "#3b82f6"; // Default blue color
  const colors = {
    triangle: defaultColor,
    circle: defaultColor,
    square: defaultColor,
    text: defaultColor,
  };

  return {
    i: id,
    x: 0,
    y: 0,
    w: type === "text" ? 2 : 2,
    h: type === "text" ? 1 : 2,
    shape: type,
    color: colors[type],
    maintainRatio: type !== "text",
    opacity: 100,
    ...(type === "text" && { text: "Edit this text" }),
  };
};

const TestPage = () => {
  const [layout, setLayout] = useState<Block[]>(initialLayout);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cols, setCols] = useState(12);
  const [rows, setRows] = useState(12);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number; w: number; h: number };
  }>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const containerWidth = useWindowSize();
  const unitSize = containerWidth / cols;

  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside of any menu and not on a shape
      if (
        activeMenu && 
        !(e.target as HTMLElement).closest('.menu-content') && 
        !(e.target as HTMLElement).closest('.shape-wrapper')
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  const handleLayoutChange = (newLayout: any[]) => {
    const newPositions = newLayout.reduce(
      (acc, item) => {
        acc[item.i] = {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        };
        return acc;
      },
      {} as { [key: string]: { x: number; y: number; w: number; h: number } },
    );

    setPositions(newPositions);

    setLayout((prevLayout) => {
      return prevLayout.map((block) => {
        const pos = newPositions[block.i];
        if (pos) {
          return {
            ...block,
            ...pos,
          };
        }
        return block;
      });
    });
  };

  const handleResizeStop = (layout: any[], oldItem: any, newItem: any) => {
    const block = layout.find((item) => item.i === newItem.i);
    if (block?.maintainRatio) {
      const updatedLayout = layout.map((item) => {
        if (item.i === newItem.i) {
          return {
            ...item,
            h: newItem.w,
          };
        }
        return item;
      });
      setLayout(updatedLayout);
    }
  };

  const handleTextChange = (blockId: string, newText: string) => {
    setLayout((prevLayout) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, text: newText } : block,
      ),
    );
  };

  const addShape = (type: "triangle" | "circle" | "square") => {
    const newShape = createNewShape(type, layout);
    setLayout([...layout, newShape]);
  };

  const addTextBox = () => {
    const newTextBox = createNewShape("text", layout);
    setLayout([...layout, newTextBox]);
  };

  const handleShapeChange = (
    blockId: string,
    type: "triangle" | "circle" | "square",
  ) => {
    setLayout((prevLayout) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, shape: type } : block,
      ),
    );
  };

  const handleColorChange = (blockId: string, color: string) => {
    setLayout((prevLayout) => {
      return prevLayout.map((block) => {
        if (block.i === blockId) {
          const pos = positions[block.i] || {
            x: block.x,
            y: block.y,
            w: block.w,
            h: block.h,
          };
          return {
            ...block,
            ...pos,
            color,
          };
        }
        return block;
      });
    });
  };

  const handleDelete = (blockId: string) => {
    setLayout(layout.filter((block) => block.i !== blockId));
    setActiveShape(null);
  };

  const handleDuplicate = (blockId: string) => {
    const blockToDuplicate = layout.find((block) => block.i === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        i: `${blockToDuplicate.shape}${layout.length + 1}`,
        x: blockToDuplicate.x + 1,
        y: blockToDuplicate.y + 1,
      };
      setLayout([...layout, newBlock]);
    }
  };

  const handleOpacityChange = (blockId: string, opacity: number) => {
    setLayout((prevLayout) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, opacity } : block,
      ),
    );
  };

  const handleRotationChange = (blockId: string, rotation: number) => {
    setLayout((prevLayout) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, rotation } : block,
      ),
    );
  };

  const handleBorderChange = (border: { width: number; color: string }) => {
    if (activeShape !== null) {
      setLayout(
        layout.map((block) =>
          block.i === activeShape ? { ...block, border } : block,
        ),
      );
    }
  };

  const handleFlipH = (blockId: string) => {
    setLayout((prevLayout) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, flipH: !block.flipH } : block,
      ),
    );
  };

  const handleFlipV = (blockId: string) => {
    setLayout((prevLayout) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, flipV: !block.flipV } : block,
      ),
    );
  };

  const handleShadowChange = (shadow: boolean) => {
    if (activeShape !== null) {
      setLayout(
        layout.map((block) =>
          block.i === activeShape ? { ...block, shadow } : block,
        ),
      );
    }
  };

  const handleStartEdit = (blockId: string) => {
    setActiveShape(blockId);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setActiveMenu(null); // Close all menus when dragging starts
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    setActiveMenu(null); // Close menu when resizing starts
  };

  return (
    <div
      className="flex h-screen w-screen flex-col bg-gray-900"
      style={{ zIndex: 0 }}
    >
      <MenuBar
        cols={cols}
        rows={rows}
        setCols={setCols}
        setRows={setRows}
        onReset={() => {
          localStorage.removeItem("shapeLayout");
          setLayout([]);
        }}
        onAddShape={addShape}
        onAddTextBox={addTextBox}
      />

      <div className="relative flex-1 overflow-auto">
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
          onLayoutChange={handleLayoutChange}
          onResizeStop={(layout, oldItem, newItem) => {
            handleLayoutChange(layout);
            handleResizeStop(layout, oldItem, newItem);
            setIsResizing(false);
          }}
          onResizeStart={handleResizeStart}
          onDragStart={handleDragStart}
          onDragStop={(layout: Layout[]) => {
            setIsDragging(false);
            handleLayoutChange(layout);
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
          style={{ height: '100%' }}
        >
          {layout.map((block, index) => (
            <div
              key={block.i}
              style={{
                ...block,
                position: "relative",
              }}
            >
              <ShapeWrapper
                onSelect={() => setActiveMenu(block.i)}
                menuVisible={activeMenu === block.i}
                isText={block.shape === "text"}
                currentShape={block.shape}
                onShapeChange={(type) => handleShapeChange(block.i, type)}
                onColorChange={(color) => handleColorChange(block.i, color)}
                onDelete={() => handleDelete(block.i)}
                onDuplicate={() => handleDuplicate(block.i)}
                onOpacityChange={(opacity) => handleOpacityChange(block.i, opacity)}
                onRotationChange={(rotation) => handleRotationChange(block.i, rotation)}
                onBorderChange={handleBorderChange}
                currentOpacity={block.opacity}
                currentRotation={block.rotation || 0}
                currentBorder={block.border}
                onFlipHorizontal={() => handleFlipH(block.i)}
                onFlipVertical={() => handleFlipV(block.i)}
                onShadowChange={handleShadowChange}
                currentShadow={block.shadow}
                currentFlipH={block.flipH || false}
                currentFlipV={block.flipV || false}
                currentColor={block.color}
                totalShapes={layout.length}
                index={layout.length - index}
                className="shape-wrapper"
              >
                <ShapeItem
                  type={block.shape}
                  color={block.color}
                  text={block.text}
                  onTextChange={(newText) => handleTextChange(block.i, newText)}
                  isActive={activeShape === block.i}
                  onStartEdit={() => handleStartEdit(block.i)}
                  opacity={block.opacity}
                  rotation={block.rotation || 0}
                  flipH={block.flipH || false}
                  flipV={block.flipV || false}
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
