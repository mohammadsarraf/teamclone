"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout, { Layout as RGLLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import React from 'react';
import { 
  SquareShape, 
  CircleShape, 
  TriangleShape, 
  TextBoxShape, 
  SectionShape,
  LayoutIndicators,
  ItemActionMenu
} from './objects';
import { GridItem } from '../types';

interface GridSettings {
  rows: number;
  columns: number;
  margin: number; // For backward compatibility
  horizontalMargin: number;
  verticalMargin: number;
  padding: number;
  fillScreen?: boolean;
  heightSetting?: 'small' | 'medium' | 'large' | 'custom';
  customHeight?: number;
}

// Define Layout as an array of GridItem
type Layout = GridItem[];

interface BananaContentProps {
  className?: string;
  layout: Layout;
  onLayoutChange?: (layout: Layout) => void;
  gridSettings: GridSettings;
  onItemClick?: (itemId: string, e?: React.MouseEvent) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  onFocusChange?: (focusedItemId: string | null) => void;
  isEditing?: boolean;
  isInteracting?: boolean;
}

const defaultGridSettings: GridSettings = {
  rows: 20,
  columns: 12,
  margin: 8, // For backward compatibility
  horizontalMargin: 8,
  verticalMargin: 8,
  padding: 16,
  fillScreen: false,
  heightSetting: 'medium',
  customHeight: 50
};

export default function BananaContent({ 
  className = "", 
  layout: externalLayout,
  onLayoutChange: externalOnLayoutChange,
  gridSettings = defaultGridSettings,
  onItemClick,
  onDragStateChange,
  onFocusChange,
  isEditing = false,
  isInteracting = false
}: BananaContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const mouseStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [internalIsInteracting, setIsInteracting] = useState(false);
  
  // Ref to track textbox content to prevent duplicate updates
  const textboxContentRef = useRef<{[key: string]: string}>({});
  
  // Alignment guides state
  const [currentDragItem, setCurrentDragItem] = useState<string | null>(null);
  const [currentResizeItem, setCurrentResizeItem] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showCenterGuides, setShowCenterGuides] = useState<{horizontal: boolean, vertical: boolean}>({horizontal: false, vertical: false});
  const [edgeAlignments, setEdgeAlignments] = useState<{top: boolean, right: boolean, bottom: boolean, left: boolean}>({
    top: false, right: false, bottom: false, left: false
  });
  const [proximityHighlights, setProximityHighlights] = useState<{itemId: string}[]>([]);
  
  // State for same size indicators
  const [sameSizeItems, setSameSizeItems] = useState<string[]>([]);
  
  // Calculate square size based on container width
  const calculateSquareSize = (width: number) => {
    const totalHorizontalMargins = (gridSettings.columns - 1) * gridSettings.horizontalMargin;
    const totalPadding = gridSettings.padding * 2;
    const availableWidth = width - totalHorizontalMargins - totalPadding;
    return Math.floor(availableWidth / gridSettings.columns);
  };

  const squareSize = containerWidth ? calculateSquareSize(containerWidth) : 0;

  // Calculate total grid height
  let totalHeight = (gridSettings.rows * squareSize) + // Height of all rows
                   ((gridSettings.rows - 1) * gridSettings.verticalMargin) + // Height of margins between squares
                   (2 * gridSettings.padding); // Container padding top and bottom
  
  // If fillScreen is enabled, adjust the height based on the heightSetting
  if (gridSettings.fillScreen) {
    const viewportHeight = window.innerHeight;
    const heightPercentage = gridSettings.customHeight || 50; // Default to 50% if not specified
    
    // Calculate height based on the percentage of viewport height
    const fillScreenHeight = (viewportHeight * heightPercentage) / 100;
    
    // Use the larger of the calculated heights to ensure content fits
    totalHeight = Math.max(totalHeight, fillScreenHeight);
  }

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

  // Initialize textbox content ref when layout changes
  useEffect(() => {
    // Update the textboxContentRef with the current content of all textboxes
    layout.forEach(item => {
      if (item.type === 'textbox') {
        textboxContentRef.current[item.i] = item.content || '';
      }
    });

    // Clean up any references to items that no longer exist
    Object.keys(textboxContentRef.current).forEach(key => {
      if (!layout.some(item => item.i === key)) {
        delete textboxContentRef.current[key];
      }
    });
  }, [layout]);

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

  const handleLayoutChange = (newLayout: RGLLayout[]) => {
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
          shadow: 'none' as const,
          layer: layout.length // Default layer for new items
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
    }) as Layout;

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

  // Helper functions for alignment guides
  const calculateCenterGuides = (draggedItem: GridItem) => {
    // Calculate the center of the grid
    const gridCenterX = Math.floor(gridSettings.columns / 2);
    const gridCenterY = Math.floor(gridSettings.rows / 2);
    
    // Calculate the center of the dragged item
    const itemCenterX = draggedItem.x + (draggedItem.w / 2);
    const itemCenterY = draggedItem.y + (draggedItem.h / 2);
    
    // Check if the item's center is aligned with the grid's center
    const isHorizontalCentered = Math.abs(itemCenterY - gridCenterY) < 0.5;
    const isVerticalCentered = Math.abs(itemCenterX - gridCenterX) < 0.5;
    
    return { horizontal: isHorizontalCentered, vertical: isVerticalCentered };
  };
  
  const calculateEdgeAlignments = (draggedItem: GridItem, otherItems: GridItem[]) => {
    // Initialize alignment flags
    let alignments = { top: false, right: false, bottom: false, left: false };
    
    // Calculate edges of dragged item
    const draggedTop = draggedItem.y;
    const draggedRight = draggedItem.x + draggedItem.w;
    const draggedBottom = draggedItem.y + draggedItem.h;
    const draggedLeft = draggedItem.x;
    
    // Check alignment with other items
    for (const item of otherItems) {
      if (item.i === draggedItem.i) continue; // Skip the dragged item itself
      
      // Calculate edges of other item
      const itemTop = item.y;
      const itemRight = item.x + item.w;
      const itemBottom = item.y + item.h;
      const itemLeft = item.x;
      
      // Check for edge alignments (with a small tolerance)
      if (Math.abs(draggedTop - itemTop) < 0.2) alignments.top = true;
      if (Math.abs(draggedRight - itemRight) < 0.2) alignments.right = true;
      if (Math.abs(draggedBottom - itemBottom) < 0.2) alignments.bottom = true;
      if (Math.abs(draggedLeft - itemLeft) < 0.2) alignments.left = true;
    }
    
    return alignments;
  };
  
  const calculateProximityHighlights = (draggedItem: GridItem, otherItems: GridItem[]) => {
    const highlights: {itemId: string}[] = [];
    
    // Calculate edges of dragged item
    const draggedTop = draggedItem.y;
    const draggedRight = draggedItem.x + draggedItem.w;
    const draggedBottom = draggedItem.y + draggedItem.h;
    const draggedLeft = draggedItem.x;
    
    // Check proximity with other items (exactly 1 grid cell apart)
    for (const item of otherItems) {
      if (item.i === draggedItem.i) continue; // Skip the dragged item itself
      
      // Calculate edges of other item
      const itemTop = item.y;
      const itemRight = item.x + item.w;
      const itemBottom = item.y + item.h;
      const itemLeft = item.x;
      
      // Check if any edge is exactly 1 grid cell apart
      const isTopProximity = Math.abs(draggedTop - itemBottom) === 1;
      const isRightProximity = Math.abs(draggedRight - itemLeft) === 1;
      const isBottomProximity = Math.abs(draggedBottom - itemTop) === 1;
      const isLeftProximity = Math.abs(draggedLeft - itemRight) === 1;
      
      // If any edge is exactly 1 grid cell apart, highlight the object
      if (isTopProximity || isRightProximity || isBottomProximity || isLeftProximity) {
        highlights.push({ itemId: item.i });
      }
    }
    
    return highlights;
  };

  // Helper function to find items with the same size
  const findSameSizeItems = (currentItem: GridItem, otherItems: GridItem[]) => {
    if (!currentItem) return [];
    
    return otherItems
      .filter(item => 
        item.i !== currentItem.i && 
        item.w === currentItem.w && 
        item.h === currentItem.h
      )
      .map(item => item.i);
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
    const isBeingDragged = currentDragItem === item.i;
    const isFocused = focusedItem === item.i;
    const isHovered = hoveredItem === item.i;

    // Render triangle shape
    if (item.type === 'square' && item.shapeType === 'triangle') {
      return (
        <TriangleShape 
          item={item} 
          isBeingDragged={isBeingDragged}
          isFocused={isFocused}
          isHovered={isHovered}
          shadowClasses={shadowClasses} 
        />
      );
    }

    switch (item.type) {
      case 'square':
        if (item.shapeType === 'circle') {
          return (
            <CircleShape 
              item={item} 
              isBeingDragged={isBeingDragged}
              isFocused={isFocused}
              isHovered={isHovered}
              shadowClasses={shadowClasses} 
            />
          );
        }
        return (
          <SquareShape 
            item={item} 
            isBeingDragged={isBeingDragged}
            isFocused={isFocused}
            isHovered={isHovered}
            shadowClasses={shadowClasses} 
          />
        );
      case 'textbox':
        return (
          <TextBoxShape 
            item={item} 
            isBeingDragged={isBeingDragged}
            isFocused={isFocused}
            isHovered={isHovered}
            shadowClasses={shadowClasses}
            handleContentChange={handleContentChange}
            textboxContentRef={textboxContentRef}
          />
        );
      default: // 'section'
        return (
          <SectionShape 
            item={item} 
            isBeingDragged={isBeingDragged}
            isFocused={isFocused}
            isHovered={isHovered}
            shadowClasses={shadowClasses} 
          />
        );
    }
  };

  // Add a click handler to the container to clear focus when clicking outside items
  const handleContainerClick = () => {
    if (isEditing) {
      console.log("Container clicked, clearing focus");
      setFocusedItem(null);
      onFocusChange?.(null);
    }
  };

  // Action menu handlers
  const handleEditItem = (item: GridItem) => {
    console.log("Edit item clicked:", item.i);
    // Open the style menu by calling onItemClick with the correct event
    if (onItemClick && item) {
      // Get the element position for the context menu
      const itemElement = document.querySelector(`[data-item-id="${item.i}"]`);
      if (itemElement) {
        const rect = itemElement.getBoundingClientRect();
        // Create a synthetic event with the position for the context menu
        const syntheticEvent = {
          clientX: rect.right + 8, // Position to the right of the item
          clientY: rect.top,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as React.MouseEvent;
        
        console.log("Calling onItemClick with synthetic event");
        // Pass both the item ID and the synthetic event
        onItemClick(item.i, syntheticEvent);
      } else {
        // Fallback if element not found
        console.log("Item element not found, calling onItemClick without position");
        // Create a default position in the center of the screen
        const syntheticEvent = {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as React.MouseEvent;
        onItemClick(item.i, syntheticEvent);
      }
    } else {
      console.warn("onItemClick is not defined or item is null");
    }
  };

  const handleDuplicateItem = (item: GridItem) => {
    console.log("Duplicate item clicked:", item.i);
    
    // Find the highest layer number and add 1 to put new block on top
    const maxLayer = layout.length > 0 
      ? Math.max(...layout.map(item => item.layer || 0))
      : 0;
    
    // Create a duplicate with a new ID
    const duplicatedItem: GridItem = {
      ...item,
      i: `${item.type}-${Date.now()}`, // Generate a unique ID
      x: item.x + 1, // Offset slightly
      y: item.y + 1,
      layer: maxLayer + 1, // Place on top
    };
    
    console.log("Created duplicated item:", duplicatedItem.i);
    
    // Add the duplicated item to the layout
    const updatedLayout = [...layout, duplicatedItem];
    
    // Update layout
    if (!externalLayout) {
      setInternalLayout(updatedLayout);
    }
    
    if (externalOnLayoutChange) {
      console.log("Calling externalOnLayoutChange with updated layout");
      externalOnLayoutChange(updatedLayout);
    } else {
      console.warn("externalOnLayoutChange is not defined");
    }
  };

  const handleDeleteItem = (item: GridItem) => {
    console.log("Delete item clicked:", item.i);
    
    // Remove the item from the layout
    const updatedLayout = layout.filter(layoutItem => layoutItem.i !== item.i);
    
    console.log("Created updated layout without deleted item");
    
    // Update layout
    if (!externalLayout) {
      setInternalLayout(updatedLayout);
    }
    
    if (externalOnLayoutChange) {
      console.log("Calling externalOnLayoutChange with updated layout");
      externalOnLayoutChange(updatedLayout);
    } else {
      console.warn("externalOnLayoutChange is not defined");
    }
    
    // Clear focus
    setFocusedItem(null);
    onFocusChange?.(null);
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
      onClick={handleContainerClick}
    >
      {/* Grid Overlay */}
      {(internalIsInteracting || isInteracting) && (
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSettings.columns}, 1fr)`,
            columnGap: `${gridSettings.horizontalMargin}px`,
            rowGap: `${gridSettings.verticalMargin}px`,
            padding: `${gridSettings.padding}px`,
            minHeight: gridSettings.fillScreen ? `${totalHeight}px` : 'auto',
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

      {/* Center Alignment Guides */}
      {currentDragItem && (
        <>
          {/* Horizontal center guide */}
          {showCenterGuides.horizontal && (
            <div 
              className="absolute z-50 pointer-events-none"
              style={{
                height: '2px',
                width: `calc(100% - ${2 * gridSettings.padding}px)`,
                left: `${gridSettings.padding}px`,
                top: `${gridSettings.padding + Math.floor(gridSettings.rows / 2) * (squareSize + gridSettings.verticalMargin)}px`,
                opacity: 0.9,
                backgroundColor: '#3B82F6', // Blue-500
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.7)'
              }}
            />
          )}
          
          {/* Vertical center guide */}
          {showCenterGuides.vertical && (
            <div 
              className="absolute z-50 pointer-events-none"
              style={{
                width: '2px',
                height: `calc(100% - ${2 * gridSettings.padding}px)`,
                top: `${gridSettings.padding}px`,
                left: `${gridSettings.padding + Math.floor(gridSettings.columns / 2) * (squareSize + gridSettings.horizontalMargin)}px`,
                opacity: 0.9,
                backgroundColor: '#3B82F6', // Blue-500
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.7)'
              }}
            />
          )}
        </>
      )}

      {/* Edge Alignment Indicators */}
      {currentDragItem && layout.find(item => item.i === currentDragItem) && (
        (() => {
          const draggedItem = layout.find(item => item.i === currentDragItem)!;
          const draggedTop = draggedItem.y * (squareSize + gridSettings.verticalMargin) + gridSettings.padding;
          const draggedLeft = draggedItem.x * (squareSize + gridSettings.horizontalMargin) + gridSettings.padding;
          const draggedRight = draggedLeft + draggedItem.w * squareSize + (draggedItem.w - 1) * gridSettings.horizontalMargin;
          const draggedBottom = draggedTop + draggedItem.h * squareSize + (draggedItem.h - 1) * gridSettings.verticalMargin;
          
          return (
            <>
              {/* Top edge alignment */}
              {edgeAlignments.top && (
                <div 
                  className="absolute z-50 pointer-events-none"
                  style={{
                    height: '2px',
                    width: `calc(100% - ${2 * gridSettings.padding}px)`,
                    left: `${gridSettings.padding}px`,
                    top: `${draggedTop}px`,
                    opacity: 0.9,
                    backgroundColor: '#10B981', // Green-500
                    boxShadow: '0 0 4px rgba(16, 185, 129, 0.7)'
                  }}
                />
              )}
              
              {/* Right edge alignment */}
              {edgeAlignments.right && (
                <div 
                  className="absolute z-50 pointer-events-none"
                  style={{
                    width: '2px',
                    height: `calc(100% - ${2 * gridSettings.padding}px)`,
                    top: `${gridSettings.padding}px`,
                    left: `${draggedRight}px`,
                    opacity: 0.9,
                    backgroundColor: '#10B981', // Green-500
                    boxShadow: '0 0 4px rgba(16, 185, 129, 0.7)'
                  }}
                />
              )}
              
              {/* Bottom edge alignment */}
              {edgeAlignments.bottom && (
                <div 
                  className="absolute z-50 pointer-events-none"
                  style={{
                    height: '2px',
                    width: `calc(100% - ${2 * gridSettings.padding}px)`,
                    left: `${gridSettings.padding}px`,
                    top: `${draggedBottom}px`,
                    opacity: 0.9,
                    backgroundColor: '#10B981', // Green-500
                    boxShadow: '0 0 4px rgba(16, 185, 129, 0.7)'
                  }}
                />
              )}
              
              {/* Left edge alignment */}
              {edgeAlignments.left && (
                <div 
                  className="absolute z-50 pointer-events-none"
                  style={{
                    width: '2px',
                    height: `calc(100% - ${2 * gridSettings.padding}px)`,
                    top: `${gridSettings.padding}px`,
                    left: `${draggedLeft}px`,
                    opacity: 0.9,
                    backgroundColor: '#10B981', // Green-500
                    boxShadow: '0 0 4px rgba(16, 185, 129, 0.7)'
                  }}
                />
              )}
            </>
          );
        })()
      )}

      {/* Proximity Highlights */}
      {currentDragItem && proximityHighlights.length > 0 && (
        <>
          {proximityHighlights.map(highlight => {
            const item = layout.find(i => i.i === highlight.itemId);
            if (!item) return null;
            
            const itemTop = item.y * (squareSize + gridSettings.verticalMargin) + gridSettings.padding;
            const itemLeft = item.x * (squareSize + gridSettings.horizontalMargin) + gridSettings.padding;
            const itemWidth = item.w * squareSize + (item.w - 1) * gridSettings.horizontalMargin;
            const itemHeight = item.h * squareSize + (item.h - 1) * gridSettings.verticalMargin;
            
            return (
              <div 
                key={`proximity-${highlight.itemId}`}
                className="absolute z-40 pointer-events-none border-2 border-dashed"
                style={{
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  left: `${itemLeft}px`,
                  top: `${itemTop}px`,
                  opacity: 0.9,
                  boxSizing: 'border-box',
                  borderColor: '#8B5CF6', // Purple-600
                  backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.3)'
                }}
              />
            );
          })}
        </>
      )}

      {/* Same Size Indicators */}
      <LayoutIndicators 
        gridSettings={gridSettings}
        squareSize={squareSize}
        layout={layout}
        currentResizeItem={currentResizeItem}
        sameSizeItems={sameSizeItems}
        isSquare={false}
      />

      {/* Alignment Legend */}
      {(currentDragItem || currentResizeItem) && (
        <div className="absolute bottom-4 right-4 z-50 rounded-lg bg-gray-800/80 p-3 text-xs text-white backdrop-blur-sm">
          <div className="mb-2 font-medium">Alignment Guides</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#3B82F6' }}></div>
              <span>Center alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: '#10B981' }}></div>
              <span>Edge alignment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm border-2 border-dashed" style={{ borderColor: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.08)' }}></div>
              <span>Adjacent items (1 cell apart)</span>
            </div>
            {currentResizeItem && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ borderColor: '#EC4899', backgroundColor: 'rgba(236, 72, 153, 0.08)', border: '2px solid #EC4899' }}></div>
                  <span>Same size items</span>
                </div>
              </>
            )}
          </div>
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
          margin={[gridSettings.horizontalMargin, gridSettings.verticalMargin]}
          onLayoutChange={handleLayoutChange}
          allowOverlap={true}
          compactType={null}
          preventCollision={false}
          useCSSTransforms={true}
          style={{ height: `${totalHeight}px`, position: 'relative' }}
          onDragStart={(layout, oldItem, newItem) => {
            if (!isEditing) return;
            isDraggingRef.current = true;
            setIsInteracting(true);
            onDragStateChange?.(true);
            setCurrentDragItem(newItem.i);
            // Set focus to the dragged item
            console.log("Setting focus to dragged item:", newItem.i);
            setFocusedItem(newItem.i);
            onFocusChange?.(newItem.i);
          }}
          onDrag={(layout, oldItem, newItem) => {
            if (!isEditing || !currentDragItem) return;
            
            // Calculate center guides
            const centerGuides = calculateCenterGuides(newItem as GridItem);
            setShowCenterGuides(centerGuides);
            
            // Calculate edge alignments with other items
            const otherItems = layout.filter(item => item.i !== newItem.i) as GridItem[];
            const alignments = calculateEdgeAlignments(newItem as GridItem, otherItems);
            setEdgeAlignments(alignments);
            
            // Calculate proximity highlights
            const highlights = calculateProximityHighlights(newItem as GridItem, otherItems);
            setProximityHighlights(highlights);
          }}
          onDragStop={(layout) => {
            if (!isEditing) return;
            isDraggingRef.current = false;
            setIsInteracting(false);
            onDragStateChange?.(false);
            handleLayoutChange(layout);
            
            // Reset alignment guides
            setCurrentDragItem(null);
            setShowCenterGuides({horizontal: false, vertical: false});
            setEdgeAlignments({top: false, right: false, bottom: false, left: false});
            setProximityHighlights([]);
            
            // Keep focus on the item that was being dragged
            console.log("Drag stopped, focus remains on:", focusedItem);
          }}
          onResizeStart={(layout, oldItem, newItem) => {
            if (!isEditing) return;
            setIsInteracting(true);
            onDragStateChange?.(true);
            setCurrentResizeItem(newItem.i);
            
            // Initialize same size items
            const otherItems = layout.filter(item => item.i !== newItem.i) as GridItem[];
            const sameSize = findSameSizeItems(newItem as GridItem, otherItems);
            setSameSizeItems(sameSize);
          }}
          onResize={(layout, oldItem, newItem) => {
            if (!isEditing || !currentResizeItem) return;
            
            // Update same size items during resize
            const otherItems = layout.filter(item => item.i !== newItem.i) as GridItem[];
            const sameSize = findSameSizeItems(newItem as GridItem, otherItems);
            setSameSizeItems(sameSize);
          }}
          onResizeStop={(layout) => {
            if (!isEditing) return;
            setIsInteracting(false);
            onDragStateChange?.(false);
            handleLayoutChange(layout);
            
            // Reset resize indicators
            setCurrentResizeItem(null);
            setSameSizeItems([]);
          }}
        >
          {layout.map((item) => (
            <div 
              key={item.i} 
              className={`h-full w-full ${!isEditing ? 'pointer-events-none' : ''}`}
              style={{ position: 'absolute', zIndex: layout.findIndex(i => i.i === item.i) }}
              data-item-id={item.i}
              onMouseEnter={() => {
                if (isEditing) {
                  setHoveredItem(item.i);
                }
              }}
              onClick={(e) => {
                if (!isEditing) return;
                // Set focus on click without triggering drag
                if (!isDraggingRef.current) {
                  console.log("Setting focus to item:", item.i);
                  setFocusedItem(item.i);
                  if (onFocusChange) {
                    console.log("Calling onFocusChange with:", item.i);
                    onFocusChange(item.i);
                  } else {
                    console.error("onFocusChange is not defined");
                  }
                  e.stopPropagation();
                }
              }}
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
                  // Get the clicked element's position
                  const rect = e.currentTarget.getBoundingClientRect();
                  // Position the menu to the right of the item
                  const menuX = rect.right + 8; // 8px offset
                  const menuY = rect.top;
                  // Create a synthetic event with the calculated position
                  const syntheticEvent = {
                    ...e,
                    clientX: menuX,
                    clientY: menuY,
                    preventDefault: e.preventDefault.bind(e),
                    stopPropagation: e.stopPropagation.bind(e)
                  };
                  onItemClick(item.i);
                }
                mouseStartPosRef.current = null;
              }}
              onMouseLeave={() => {
                if (!isEditing) return;
                mouseStartPosRef.current = null;
                setHoveredItem(null);
              }}
              onContextMenu={(e) => {
                if (!isEditing) return;
                e.preventDefault();
                if (onItemClick) {
                  // Get the clicked element's position
                  const rect = e.currentTarget.getBoundingClientRect();
                  // Position the menu to the right of the item
                  const menuX = rect.right + 8; // 8px offset
                  const menuY = rect.top;
                  // Create a synthetic event with the calculated position
                  const syntheticEvent = {
                    ...e,
                    clientX: menuX,
                    clientY: menuY,
                    preventDefault: e.preventDefault.bind(e),
                    stopPropagation: e.stopPropagation.bind(e)
                  };
                  onItemClick(item.i);
                }
              }}
            >
              {renderGridItem(item)}
              {/* Add action menu directly inside the item when focused but not during drag or resize */}
              {focusedItem === item.i && isEditing && !currentDragItem && !currentResizeItem && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  onMouseDown={(e) => e.stopPropagation()}
                  className="pointer-events-auto"
                >
                  <ItemActionMenu
                    onEdit={() => handleEditItem(item)}
                    onDuplicate={() => handleDuplicateItem(item)}
                    onDelete={() => handleDeleteItem(item)}
                    isFirstRow={item.y === 0}
                  />
                </div>
              )}
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  );
}
