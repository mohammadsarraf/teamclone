"use client";
import React, { useState, useEffect, Suspense } from "react";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BsFillTriangleFill } from "react-icons/bs";
import { FaCircle, FaSquare } from "react-icons/fa";
import dynamic from "next/dynamic";
import { useWindowSize } from "./hooks/useWindowSize";
import { MenuBar } from "./components/MenuBar";
import { GridOverlay } from "./components/GridOverlay";
import { GridContainer } from "./components/GridContainer";
import ShapeWrapper from "./components/ShapeWrapper";

// Dynamically import Zdog components with no SSR
const ZdogComponents = dynamic(() => import("./components/ZdogComponents"), {
  ssr: false,
});

// Dynamically import Three components with no SSR
const ShapeComponents = dynamic(() => import("./components/ShapeComponents"), {
  ssr: false,
});

const TextBox = dynamic(() => import("./components/TextBox"), { ssr: false });

interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "triangle" | "circle" | "square" | "text" | string;
  color: string;
  maintainRatio?: boolean;
  text?: string;
}

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
  isText?: boolean;
}

const ShapeItem = ({
  type,
  color,
  text,
  onTextChange,
  isActive,
}: {
  type: Block["shape"];
  color: string;
  text?: string;
  onTextChange?: (newText: string) => void;
  isActive?: boolean;
}) => {
  if (!type) return null;

  if (type === "text") {
    return <TextBox text={text || ""} onTextChange={onTextChange!} isActive={isActive} />;
  }

  return (
    <Suspense fallback={<div className="size-full bg-gray-700" />}>
      <div className="size-full">
        <ShapeComponents type={type} color={color} />
      </div>
    </Suspense>
  );
};

const initialLayout: Block[] = [
  {
    i: "triangle",
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    shape: "triangle",
    color: "bg-blue-500",
    maintainRatio: true,
  },
  {
    i: "circle",
    x: 3,
    y: 0,
    w: 2,
    h: 2,
    shape: "circle",
    color: "bg-red-500",
    maintainRatio: true,
  },
  {
    i: "square",
    x: 6,
    y: 0,
    w: 2,
    h: 2,
    shape: "square",
    color: "bg-green-500",
    maintainRatio: true,
  },
  {
    i: "text1",
    x: 0,
    y: 3,
    w: 2,
    h: 1,
    shape: "text",
    color: "bg-gray-500",
    text: "Edit this text",
  },
];



export default function TestPage() {
  const [layout, setLayout] = useState<Block[]>(initialLayout);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [cols, setCols] = useState(12);
  const [rows, setRows] = useState(12);

  const containerWidth = useWindowSize();
  const unitSize = containerWidth / cols;

  const handleLayoutChange = (newLayout: any[]) => {
    const updatedLayout = newLayout.map((item) => {
      const existingBlock = layout.find((block) => block.i === item.i)!;
      return {
        ...existingBlock,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      };
    });
    setLayout(updatedLayout);
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
        block.i === blockId ? { ...block, text: newText } : block
      )
    );
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-900" style={{ zIndex: 0 }}>
      <MenuBar
        cols={cols}
        rows={rows}
        setCols={setCols}
        setRows={setRows}
        onReset={() => {
          localStorage.removeItem("shapeLayout");
          setLayout(initialLayout);
        }}
      />

      <div className="relative flex-1 overflow-auto">
        <GridOverlay
          show={isDragging || isResizing}
          cols={cols}
          rows={rows}
          unitSize={unitSize}
        />

        <GridContainer
          cols={cols}
          rows={rows}
          unitSize={unitSize}
          layout={layout}
          onLayoutChange={handleLayoutChange}
          onResizeStop={(layout, oldItem, newItem) => {
            handleResizeStop(layout, oldItem, newItem);
            setIsResizing(false);
          }}
          onResizeStart={() => setIsResizing(true)}
          onDragStart={() => setIsDragging(true)}
          onDragStop={() => setIsDragging(false)}
          preventCollision={false}
          allowOverlap={true}
          verticalCompact={false}
          compactType={null}
          resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
          transformScale={1}
        >
          {layout.map((block, index) => (
            <div
              key={block.i}
              style={{
                zIndex: 2 + index,
                padding: 0,
                margin: 0,
                position: 'relative',
              }}
            >
              <ShapeWrapper
                onSelect={() => setActiveShape(block.i)}
                isText={block.shape === 'text'}
              >
                <ShapeItem
                  type={block.shape}
                  color={block.color}
                  text={block.text}
                  onTextChange={(newText) => handleTextChange(block.i, newText)}
                />
              </ShapeWrapper>
            </div>
          ))}
        </GridContainer>
      </div>
    </div>
  );
}
