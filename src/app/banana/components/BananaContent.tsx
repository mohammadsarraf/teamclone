"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface GridSettings {
  rows: number;
  columns: number;
  margin: number;
  padding: number;
}

interface ContentProps {
  className?: string;
  layout?: GridItem[];
  onLayoutChange?: (layout: GridItem[]) => void;
  gridSettings?: GridSettings;
  onItemClick?: (item: GridItem) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  isEditing?: boolean;
  showGridSettings?: boolean;
}

export interface GridItem extends Layout {
  title: string;
  type: 'section' | 'square' | 'textbox';
  content?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontWeight?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  layer?: number;
  group?: string;
}

const defaultGridSettings: GridSettings = {
  rows: 20,
  columns: 12,
  margin: 8,
  padding: 16
};

export default function BananaContent({ 
  className = "", 
  layout: externalLayout,
  onLayoutChange: externalOnLayoutChange,
  gridSettings = defaultGridSettings,
  onItemClick,
  onDragStateChange,
  isEditing = false,
  showGridSettings = false
}: ContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const mouseStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);
  
  // Calculate square size based on container width
  const calculateSquareSize = (width: number) => {
    const totalMargins = (gridSettings.columns - 1) * gridSettings.margin;
    const totalPadding = gridSettings.padding * 2;
    const availableWidth = width - totalMargins - totalPadding;
    return Math.floor(availableWidth / gridSettings.columns);
  };

  const squareSize = containerWidth ? calculateSquareSize(containerWidth) : 0;

  // Calculate total grid height
  const totalHeight = (gridSettings.rows * squareSize) + // Height of all rows
                     ((gridSettings.rows - 1) * gridSettings.margin) + // Height of margins between squares
                     (2 * gridSettings.padding); // Container padding top and bottom

  // Initial layout configuration
  const initialLayout: GridItem[] = Array.from({ length: 6 }, (_, index) => ({
    i: `section-${index + 1}`,
    x: (index % 2) * 4,  // Position in the grid using square units
    y: Math.floor(index / 2) * 4,  // Position in the grid using square units
    w: 4,  // Width in square units
    h: 4,  // Height in square units
    title: `Section ${index + 1}`,
    type: 'section',
    layer: index // Initialize with sequential layer numbers
  }));

  const [internalLayout, setInternalLayout] = useState<GridItem[]>(initialLayout);
  
  // Use external layout if provided, otherwise use internal layout
  const layout = externalLayout || internalLayout;

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Initial calculation
    updateWidth();

    // Create ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also handle window resize events
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const handleLayoutChange = (newLayout: Layout[]) => {
    // First, prevent any items from being placed beyond available rows
    const adjustedLayout = newLayout.map(item => {
      const maxPossibleY = gridSettings.rows - item.h;
      return {
        ...item,
        // Clamp Y position between 0 and maxPossibleY
        y: Math.min(Math.max(0, item.y), maxPossibleY)
      };
    });

    // Then preserve all properties from existing items
    const updatedLayout = adjustedLayout.map(item => {
      const existingItem = layout.find(existing => existing.i === item.i);
      if (!existingItem) {
        return {
          ...item,
          title: `Section ${item.i.split('-')[1]}`,
          type: 'section' as const,
          backgroundColor: 'transparent',
          textColor: '#FFFFFF',
          borderRadius: 8,
          padding: 16,
          fontSize: 16,
          fontWeight: 'normal',
          shadow: 'none' as const
        };
      }
      return {
        ...existingItem,
        // Only update position and size properties
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h
      };
    });

    // Update internal state if no external layout is provided
    if (!externalLayout) {
      setInternalLayout(updatedLayout);
    }

    // Call external handler if provided
    if (externalOnLayoutChange) {
      externalOnLayoutChange(updatedLayout);
    }
  };

  const handleContentChange = (itemId: string, newContent: string) => {
    const updatedLayout = layout.map(item => 
      item.i === itemId ? { ...item, content: newContent } : item
    );

    if (!externalLayout) {
      setInternalLayout(updatedLayout);
    }

    if (externalOnLayoutChange) {
      externalOnLayoutChange(updatedLayout);
    }
  };

  const renderGridItem = (item: GridItem) => {
    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };

    const itemIndex = layout.findIndex(i => i.i === item.i);

    const baseStyles = {
      height: '100%',
      width: '100%',
      backgroundColor: item.type === 'textbox' ? 'transparent' : (item.backgroundColor || '#3B82F6'),
      color: item.textColor || '#FFFFFF',
      borderRadius: `${item.borderRadius || 8}px`,
      padding: `${item.padding || 16}px`,
      fontSize: `${item.fontSize || 16}px`,
      fontWeight: item.fontWeight || 'normal',
      position: 'relative' as const,
      zIndex: itemIndex
    };

    // Add group indicator if item is grouped
    const groupIndicator = item.group ? (
      <div className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
        G
      </div>
    ) : null;

    switch (item.type) {
      case 'square':
        return (
          <div
            className={`relative transition-shadow hover:shadow-lg ${shadowClasses[item.shadow || 'none']} ${item.group ? 'ring-2 ring-purple-500' : ''}`}
            style={baseStyles}
          >
            {groupIndicator}
          </div>
        );
      case 'textbox':
        return (
          <div 
            contentEditable
            suppressContentEditableWarning
            className={`relative focus:outline-none focus:ring-2 ${shadowClasses[item.shadow || 'none']} ${item.group ? 'ring-2 ring-purple-500' : ''}`}
            style={baseStyles}
            onBlur={(e) => handleContentChange(item.i, e.currentTarget.textContent || '')}
          >
            {groupIndicator}
            {item.content}
          </div>
        );
      default: // 'section'
        return (
          <div
            className={`relative transition-shadow hover:shadow-lg ${shadowClasses[item.shadow || 'none']} ${item.group ? 'ring-2 ring-purple-500' : ''}`}
            style={baseStyles}
          >
            {groupIndicator}
            <p className="mt-2 opacity-80">Content goes here</p>
          </div>
        );
    }
  };

  return (
    <div 
      className={`relative w-full ${className}`} 
      ref={containerRef}
      style={{
        height: `${totalHeight}px`,
        maxHeight: `${totalHeight}px`,
        overflow: 'hidden'
      }}
    >
      {/* Grid Overlay */}
      {(isInteracting || showGridSettings) && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSettings.columns}, 1fr)`,
            gap: `${gridSettings.margin}px`,
            padding: `${gridSettings.padding}px`,
          }}
        >
          {Array.from({ length: gridSettings.columns * gridSettings.rows }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 rounded-sm"
            />
          ))}
        </div>
      )}

      {containerWidth > 0 && squareSize > 0 && (
        <GridLayout
          className="layout"
          layout={layout}
          cols={gridSettings.columns}
          maxRows={gridSettings.rows}
          rowHeight={squareSize}
          width={containerWidth}
          isDraggable={isEditing}
          isResizable={isEditing}
          containerPadding={[gridSettings.padding, gridSettings.padding]}
          margin={[gridSettings.margin, gridSettings.margin]}
          onLayoutChange={handleLayoutChange}
          allowOverlap={true}
          compactType={null}
          preventCollision={false}
          useCSSTransforms={true}
          style={{ height: `${totalHeight}px`, position: 'relative' }}
          onDragStart={() => {
            if (!isEditing) return;
            isDraggingRef.current = true;
            setIsInteracting(true);
            onDragStateChange?.(true);
          }}
          onDragStop={(layout) => {
            if (!isEditing) return;
            isDraggingRef.current = false;
            setIsInteracting(false);
            onDragStateChange?.(false);
            handleLayoutChange(layout);
          }}
          onResizeStart={() => {
            if (!isEditing) return;
            setIsInteracting(true);
            onDragStateChange?.(true);
          }}
          onResizeStop={(layout) => {
            if (!isEditing) return;
            setIsInteracting(false);
            onDragStateChange?.(false);
            handleLayoutChange(layout);
          }}
        >
          {layout.map((item) => (
            <div 
              key={item.i} 
              className={`h-full w-full ${!isEditing ? 'pointer-events-none' : ''}`}
              style={{ position: 'absolute', zIndex: layout.findIndex(i => i.i === item.i) }}
              onMouseDown={(e) => {
                if (!isEditing) return;
                mouseStartPosRef.current = { x: e.clientX, y: e.clientY };
                isDraggingRef.current = false;
              }}
              onMouseMove={(e) => {
                if (!isEditing) return;
                if (mouseStartPosRef.current) {
                  const dx = Math.abs(e.clientX - mouseStartPosRef.current.x);
                  const dy = Math.abs(e.clientY - mouseStartPosRef.current.y);
                  if (dx > 5 || dy > 5) {
                    isDraggingRef.current = true;
                  }
                }
              }}
              onMouseUp={(e) => {
                if (!isEditing) return;
                if (!isDraggingRef.current && onItemClick) {
                  e.stopPropagation();
                  onItemClick(item);
                }
                mouseStartPosRef.current = null;
              }}
              onMouseLeave={() => {
                if (!isEditing) return;
                mouseStartPosRef.current = null;
              }}
              onContextMenu={(e) => {
                if (!isEditing) return;
                e.preventDefault();
                if (onItemClick) {
                  onItemClick(item);
                }
              }}
            >
              {renderGridItem(item)}
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
}
