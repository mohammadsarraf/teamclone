import { ReactNode } from 'react';
import GridLayout from "react-grid-layout";
import { Block } from '../types';

interface GridContainerProps {
  cols: number;
  rows: number;
  unitSize: number;
  layout: Block[];
  children: ReactNode;
  onLayoutChange: (layout: any[]) => void;
  onResizeStop: (layout: any[], oldItem: any, newItem: any) => void;
  onResizeStart: () => void;
  onDragStart: () => void;
  onDragStop: () => void;
  preventCollision: boolean;
  allowOverlap: boolean;
  verticalCompact: boolean;
  compactType: any;
  resizeHandles: string[];
  transformScale: number;
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
    <div className="min-h-full min-w-full" style={{ 
      width: `${cols * unitSize}px`,
      height: `${rows * unitSize}px` 
    }}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={unitSize}
        width={cols * unitSize}
        margin={[0, 0]}
        containerPadding={[0, 0]}
        isDraggable={true}
        isResizable={true}
        {...props}
      >
        {children}
      </GridLayout>
    </div>
  );
}; 