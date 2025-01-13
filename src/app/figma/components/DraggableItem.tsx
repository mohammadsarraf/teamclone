import React, { useState, useEffect, useRef } from 'react';

interface DraggableItemProps {
  text: string; // Text to display inside the draggable item
  gridSize: number; // Size of each grid cell
  showGrid: boolean; // Whether to show the grid or not
  setShowGrid: (show: boolean) => void; // Function to toggle the grid visibility
}

const DraggableItem: React.FC<DraggableItemProps> = ({ text, gridSize, showGrid, setShowGrid }) => {
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
        setPosition((prev) => ({
          x: Math.round(prev.x / gridSize) * gridSize,
          y: Math.round(prev.y / gridSize) * gridSize,
        }));
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
  }, [dragging, resizing, offset, position, size, resizeDirection]);

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
            left: Math.round(position.x / gridSize) * gridSize,
            top: Math.round(position.y / gridSize) * gridSize,
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
