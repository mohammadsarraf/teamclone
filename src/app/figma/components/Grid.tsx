import React from "react";

interface GridProps {
  gridSize: number; // Size of each grid cell
  showGrid: boolean; // Whether to show the grid or not
  colGap: number; // Gap between columns
  rowGap: number; // Gap between rows
}

const Grid: React.FC<GridProps> = ({ gridSize, showGrid, colGap, rowGap }) => {
  if (!showGrid) return null;

  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize}px, 1fr))`,
        gridTemplateRows: `repeat(auto-fill, minmax(${gridSize / 2}px, 1fr))`,
        gap: `${rowGap}px ${colGap}px`,
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
    >
      {Array.from({
        length:
          Math.floor(window.innerWidth / gridSize) *
          Math.floor(window.innerHeight / (gridSize / 2)),
      }).map((_, index) => (
        <div key={index} className="border border-gray-500"></div>
      ))}
    </div>
  );
};

export default Grid;
