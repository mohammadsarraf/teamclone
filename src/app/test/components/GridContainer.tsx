import React from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { Block } from "../types";

interface GridContainerProps {
  cols: number;
  rows: number;
  unitSize: number;
  layout: Block[];
  children: React.ReactNode;
  onLayoutChange: (layout: Layout[]) => void;
  onResizeStop: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
  onResizeStart: () => void;
  onDragStart: () => void;
  onDragStop: (layout: Layout[]) => void;
  style?: React.CSSProperties;
  preventCollision: boolean;
  allowOverlap: boolean;
  verticalCompact: boolean;
  compactType: any;
  resizeHandles: ("s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne")[];
  resizeHandle?: React.ReactNode;
  transformScale: number;
  margin: [number, number];
  containerPadding: [number, number];
  isDraggable: boolean;
  isResizable: boolean;
  draggableHandle?: string;
}

export const GridContainer: React.FC<GridContainerProps> = ({
  cols,
  rows,
  unitSize,
  layout,
  children,
  onLayoutChange,
  onResizeStop,
  onResizeStart,
  onDragStart,
  onDragStop,
  style,
  preventCollision,
  allowOverlap,
  verticalCompact,
  compactType,
  resizeHandles,
  resizeHandle,
  transformScale,
  margin,
  containerPadding,
  isDraggable,
  isResizable,
  draggableHandle,
}) => {
  return (
    <div className="relative size-full">
      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={unitSize}
        width={cols * unitSize}
        onLayoutChange={onLayoutChange}
        onResizeStop={onResizeStop}
        onResizeStart={onResizeStart}
        onDragStart={onDragStart}
        onDragStop={onDragStop}
        preventCollision={preventCollision}
        allowOverlap={allowOverlap}
        verticalCompact={verticalCompact}
        compactType={compactType}
        isDraggable={isDraggable}
        isResizable={isResizable}
        resizeHandles={resizeHandles}
        resizeHandle={resizeHandle}
        transformScale={transformScale}
        margin={margin}
        containerPadding={containerPadding}
        draggableHandle={draggableHandle}
        style={{
          ...style,
          minHeight: rows * unitSize,
        }}
      >
        {children}
      </GridLayout>
    </div>
  );
};
