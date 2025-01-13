import React from "react";

interface GridProps {
  gridSize: number; // Size of each grid cell
  showGrid: boolean; // Whether to show the grid or not
  gap?: number; // Gap between each grid cell
}

const Grid: React.FC<GridProps> = ({ gridSize, showGrid, gap = 10 }) => {
  if (!showGrid) return null;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;
  const numCols = Math.floor(containerWidth / (gridSize + gap));
  const numRows = Math.floor(containerHeight / (gridSize / 2 + gap));
  const gridWidth = numCols * (gridSize + gap) - gap;
  const gridHeight = numRows * (gridSize / 2 + gap) - gap;

  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${numCols}, ${gridSize}px)`,
        gridTemplateRows: `repeat(${numRows}, ${gridSize / 2}px)`, // Rectangles with height half of the width
        gap: `${gap}px`,
        width: `${gridWidth}px`,
        height: `${gridHeight}px`,
        margin: "auto",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {Array.from({ length: numCols * numRows }).map((_, index) => (
        <div key={index} className="border border-gray-500"></div>
      ))}
    </div>
  );
};

export default Grid;
