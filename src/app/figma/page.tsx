'use client'
import { useState } from 'react';
import Grid from './components/Grid';
import DraggableItem from './components/DraggableItem';

export default function Home() {
  const [showGrid, setShowGrid] = useState(false);
  const gridSize = 200; // Define grid size
  const colGap = 10; // Define column gap size
  const rowGap = 5; // Define row gap size

  return (
    <div className="w-screen h-screen bg-blue-900 relative">
      {/* Grid component */}
      <Grid gridSize={gridSize} showGrid={showGrid} colGap={colGap} rowGap={rowGap} />
      {/* DraggableItem component */}
      <DraggableItem text="Drag me" gridSize={gridSize} showGrid={showGrid} setShowGrid={setShowGrid} colGap={colGap} rowGap={rowGap} />
    </div>
  );
}