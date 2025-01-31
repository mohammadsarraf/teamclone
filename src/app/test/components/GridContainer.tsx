import { ReactNode } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { Block } from "../types";

interface GridContainerProps {
  cols: number;
  rows: number;
  unitSize: number;
  layout: Block[];
  children: ReactNode;
  onLayoutChange: (layout: Layout[]) => void;
  onResizeStop: (layout: Layout[], oldItem: Layout, newItem: Layout) => void;
  onResizeStart: () => void;
  onDragStart: () => void;
  onDragStop: (layout: Layout[]) => void;
  preventCollision: boolean;
  allowOverlap: boolean;
  verticalCompact: boolean;
  compactType: any;
  resizeHandles: ("s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne")[];
  transformScale: number;
  margin: [number, number];
  containerPadding: [number, number];
  isDraggable: boolean;
  isResizable: boolean;
}

export const GridContainer = ({
  cols,
  rows,
  unitSize,
  layout,
  children,
  ...props
}: GridContainerProps) => {
  return (
    <div
      className="min-h-full min-w-full"
      style={{
        width: `${cols * unitSize}px`,
        height: `${rows * unitSize}px`,
      }}
    >
      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={unitSize}
        width={cols * unitSize}
        {...props}
      >
        {children}
      </GridLayout>
    </div>
  );
};
