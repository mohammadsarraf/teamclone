import React from 'react';

interface GridProps {
  gridSize: number; // Size of each grid cell
  showGrid: boolean; // Whether to show the grid or not
}

const Grid: React.FC<GridProps> = ({ gridSize, showGrid }) => {
  if (!showGrid) return null;

  return (
    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(auto-fill, ${gridSize}px)`, gridTemplateRows: `repeat(auto-fill, ${gridSize}px)` }}>
      {Array.from({ length: (window.innerWidth / gridSize) * (window.innerHeight / gridSize) }).map((_, index) => (
        <div key={index} className="border border-gray-500"></div>
      ))}
    </div>
  );
};

export default Grid;
