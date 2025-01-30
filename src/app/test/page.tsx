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

// Dynamically import Zdog components with no SSR
const ZdogComponents = dynamic(() => import("./components/ZdogComponents"), {
  ssr: false,
});

// Dynamically import Three components with no SSR
const ShapeComponents = dynamic(() => import("./components/ShapeComponents"), {
  ssr: false,
});

interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "triangle" | "circle" | "square" | string;
  color: string;
  maintainRatio?: boolean;
}

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
}

const ShapeItem = ({
  type,
  color,
}: {
  type: Block["shape"];
  color: string;
}) => {
  if (!type) return null;

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
];

const ShapeWrapper = ({ children, isActive, onSelect }: ShapeWrapperProps) => {
  return (
    <div
      className={`flex size-full cursor-move items-center justify-center`}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

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

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-900">
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
          {layout.map((block) => (
            <div
              key={block.i}
              style={{
                zIndex: activeShape === block.i ? 10 : 1,
                padding: 0,
                margin: 0,
              }}
            >
              <ShapeWrapper
                isActive={activeShape === block.i}
                onSelect={() => setActiveShape(block.i)}
              >
                <ShapeItem type={block.shape} color={block.color} />
              </ShapeWrapper>
            </div>
          ))}
        </GridContainer>
      </div>
    </div>
  );
}
