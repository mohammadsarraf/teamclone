"use client";
import React, { useState, useEffect, Suspense } from 'react';
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { BsFillTriangleFill } from "react-icons/bs";
import { FaCircle, FaSquare } from "react-icons/fa";
import dynamic from 'next/dynamic';

// Dynamically import Zdog components with no SSR
const ZdogComponents = dynamic(() => import('./components/ZdogComponents'), {
  ssr: false
});

// Dynamically import Three components with no SSR
const ShapeComponents = dynamic(() => import('./components/ShapeComponents'), {
  ssr: false
});

interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: 'triangle' | 'circle' | 'square' | string;
  color: string;
  maintainRatio?: boolean;
}

interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
}

const ShapeItem = ({ type, color }: { type: Block['shape'], color: string }) => {
  if (!type) return null;
  
  return (
    <Suspense fallback={<div className="w-full h-full bg-gray-700" />}>
      <div className="w-full h-full">
        <ShapeComponents type={type} color={color} />
      </div>
    </Suspense>
  );
};

const initialLayout: Block[] = [
  {
    i: 'triangle',
    x: 0,
    y: 0,
    w: 2,
    h: 2,
    shape: 'triangle',
    color: 'bg-blue-500',
    maintainRatio: true,
  },
  {
    i: 'circle',
    x: 3,
    y: 0,
    w: 2,
    h: 2,
    shape: 'circle',
    color: 'bg-red-500',
    maintainRatio: true,
  },
  {
    i: 'square',
    x: 6,
    y: 0,
    w: 2,
    h: 2,
    shape: 'square',
    color: 'bg-green-500',
    maintainRatio: true,
  },
];

const ShapeWrapper = ({ children, isActive, onSelect }: ShapeWrapperProps) => {
  return (
    <div 
      className={`h-full w-full cursor-move flex items-center justify-center`}
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

export default function TestPage() {
  const [layout, setLayout] = useState<Block[]>(initialLayout);
  const [mounted, setMounted] = useState(false);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200); // Default width

  // Handle initial load from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('shapeLayout');
    if (saved) {
      setLayout(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when layout changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('shapeLayout', JSON.stringify(layout));
    }
  }, [layout, mounted]);

  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
    };

    // Initial width
    updateWidth();

    // Update width on resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate unit size based on container width
  const cols = 12;
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
    const block = layout.find(item => item.i === newItem.i);
    if (block?.maintainRatio) {
      const updatedLayout = layout.map(item => {
        if (item.i === newItem.i) {
          return {
            ...item,
            h: newItem.w
          };
        }
        return item;
      });
      setLayout(updatedLayout);
    }
  };

  if (!mounted) return null; // Prevent hydration issues

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      {/* Menu Bar */}
      <div className="h-14 bg-gray-800 border-b border-gray-700 px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-bold">Shape Editor</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                localStorage.removeItem('shapeLayout');
                setLayout(initialLayout);
              }}
              className="px-3 py-1.5 bg-red-500 text-sm text-white rounded hover:bg-red-600 transition-colors"
            >
              Reset Layout
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add more menu items here if needed */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {(isDragging || isResizing) && (
          <div 
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${unitSize}px)`,
              gridTemplateRows: `repeat(auto-fill, ${unitSize}px)`,
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',  // Changed to 100%
              height: '100%'
            }}
          >
            {Array.from({ length: cols * (Math.ceil(window.innerHeight/unitSize)) }).map((_, i) => (
              <div 
                key={i}
                className="border border-blue-500/20 bg-blue-500/5"
                style={{
                  margin: 0,
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        <div className="h-full w-full">
          <GridLayout
            className="layout"
            layout={layout}
            cols={cols}
            rowHeight={unitSize}
            width={containerWidth}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            isDraggable={true}
            isResizable={true}
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
            resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
            transformScale={1}
          >
            {layout.map((block) => (
              <div
                key={block.i}
                style={{ 
                  zIndex: activeShape === block.i ? 10 : 1,
                  padding: 0,
                  margin: 0
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
          </GridLayout>
        </div>
      </div>
    </div>
  );
} 