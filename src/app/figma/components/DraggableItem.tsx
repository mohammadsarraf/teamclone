import React, { useState, useEffect, useRef } from 'react';

interface DraggableItemProps {
  text: string; // Text to display inside the draggable item
  gridSize: number; // Size of each grid cell
  showGrid: boolean; // Whether to show the grid or not
  setShowGrid: (show: boolean) => void; // Function to toggle the grid visibility
  colGap?: number; // Gap between each column
  rowGap?: number; // Gap between each row
}

const DraggableItem: React.FC<DraggableItemProps> = ({ text, gridSize, showGrid, setShowGrid, colGap = 10, rowGap = 5 }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [size, setSize] = useState({ width: 100, height: 50 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const container = containerRef.current;
        const element = elementRef.current;
        if (container && element) {
          const newX = e.clientX - offset.x;
          const newY = e.clientY - offset.y;
          const maxX = container.clientWidth - element.clientWidth;
          const maxY = container.clientHeight - element.clientHeight;

          setPosition({
            x: Math.max(0, Math.min(newX, maxX)),
            y: Math.max(0, Math.min(newY, maxY)),
          });
        }
      } else if (resizing) {
        const container = containerRef.current;
        const element = elementRef.current;
        if (container && element) {
          let newWidth = size.width;
          let newHeight = size.height;
          let newX = position.x;
          let newY = position.y;

          if (resizeDirection.includes('right')) {
            newWidth = e.clientX - position.x;
          }
          if (resizeDirection.includes('bottom')) {
            newHeight = e.clientY - position.y;
          }
          if (resizeDirection.includes('left')) {
            newWidth = size.width + (position.x - e.clientX);
            newX = e.clientX;
          }
          if (resizeDirection.includes('top')) {
            newHeight = size.height + (position.y - e.clientY);
            newY = e.clientY;
          }

          setSize({
            width: Math.max(20, newWidth), // Minimum width of the item
            height: Math.max(20, newHeight), // Minimum height of the item
          });
          setPosition({
            x: newX,
            y: newY,
          });
        }
      }
    };

    const handleMouseUp = () => {
      if (dragging) {
        setDragging(false);
        setShowGrid(false);
        // Snap to grid
        const container = containerRef.current;
        if (container) {
          const offsetX = (container.clientWidth - (Math.floor(container.clientWidth / (gridSize + colGap)) * (gridSize + colGap) - colGap)) / 2;
          const offsetY = (container.clientHeight - (Math.floor(container.clientHeight / ((gridSize / 2) + rowGap)) * ((gridSize / 2) + rowGap) - rowGap)) / 2;
          setPosition((prev) => ({
            x: Math.round((prev.x - offsetX) / (gridSize + colGap)) * (gridSize + colGap) + offsetX,
            y: Math.round((prev.y - offsetY) / ((gridSize / 2) + rowGap)) * ((gridSize / 2) + rowGap) + offsetY,
          }));
        }
      }
      if (resizing) {
        setResizing(false);
        setResizeDirection('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, offset, position, size, resizeDirection, gridSize, colGap, rowGap]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setShowGrid(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.stopPropagation();
    setResizing(true);
    setResizeDirection(direction);
  };

  const container = containerRef.current;
  const offsetX = container ? (container.clientWidth - (Math.floor(container.clientWidth / (gridSize + colGap)) * (gridSize + colGap) - colGap)) / 2 : 0;
  const offsetY = container ? (container.clientHeight - (Math.floor(container.clientHeight / ((gridSize / 2) + rowGap)) * ((gridSize / 2) + rowGap) - rowGap)) / 2 : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div
        ref={elementRef}
        style={{ position: 'absolute', left: position.x, top: position.y, width: size.width, height: size.height, cursor: 'move', border: '1px dashed black', backgroundColor: 'transparent' }}
        onMouseDown={handleMouseDown}
      >
        <p style={{ margin: 0, padding: '10px' }}>{text}</p>
        {/* Resize handles */}
        <div
          style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, cursor: 'ew-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'left')}
        />
        <div
          style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 10, cursor: 'ew-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'right')}
        />
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, cursor: 'ns-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
        />
        <div
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, cursor: 'ns-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
        />
        <div
          style={{ position: 'absolute', left: 0, top: 0, width: 10, height: 10, cursor: 'nwse-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'top-left')}
        />
        <div
          style={{ position: 'absolute', right: 0, top: 0, width: 10, height: 10, cursor: 'nesw-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'top-right')}
        />
        <div
          style={{ position: 'absolute', left: 0, bottom: 0, width: 10, height: 10, cursor: 'nesw-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-left')}
        />
        <div
          style={{ position: 'absolute', right: 0, bottom: 0, width: 10, height: 10, cursor: 'nwse-resize' }}
          onMouseDown={(e) => handleResizeMouseDown(e, 'bottom-right')}
        />
      </div>
      {/* Visual indicator for snapping location */}
      {dragging && (
        <div
          style={{
            position: 'absolute',
            left: Math.round((position.x - offsetX) / (gridSize + colGap)) * (gridSize + colGap) + offsetX,
            top: Math.round((position.y - offsetY) / ((gridSize / 2) + rowGap)) * ((gridSize / 2) + rowGap) + offsetY,
            width: size.width,
            height: size.height,
            border: '2px dashed red',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};

export default DraggableItem;
