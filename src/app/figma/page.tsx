'use client'
import { useState } from 'react';
import Grid from './components/Grid';
import DraggableItem from './components/DraggableItem';

export default function Home() {
  const [showGrid, setShowGrid] = useState(false);
  const gridSize = 100; // Define grid size

  return (
    <div className="w-screen h-screen bg-blue-900 relative">
      {/* Grid component */}
      <Grid gridSize={gridSize} showGrid={showGrid} />
      {/* DraggableItem component */}
      <DraggableItem text="Drag me" gridSize={gridSize} showGrid={showGrid} setShowGrid={setShowGrid} />
    </div>
  );
}