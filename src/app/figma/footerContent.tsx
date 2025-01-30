import React from 'react';
import { useState } from "react";
import AddBlock from "./addBlock";
import Grid from "./Grid"; // Import the Grid component
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import ActiveBlock from "./activeBlock";

interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fontSize: string;
  color: string;
  italic: string;
  textAlign: string;
  type: string;
}

// Edit Menu Component
const EditMenu = ({ onAdd, isEditing }: { onAdd: () => void, isEditing: boolean }) => {
  return (
    <div className="absolute -top-14 flex w-full justify-between px-4">
      <button
        onClick={onAdd}
        className="rounded-md bg-blue-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Add Block
      </button>
      <div className="rounded-md bg-gray-800 px-4 py-2 text-white shadow-lg">
        <p>Edit Section</p>
      </div>
    </div>
  );
};

// Edit Button Component
const EditButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-6 py-3 text-white opacity-0 shadow-lg transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group-hover:opacity-100"
    >
      Edit Footer
    </button>
  );
};

const GridLayout = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-8 w-8 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-8 w-8 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-8 w-8 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
          />
        ))}
      </div>
    </div>
  );
};

const FooterContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [layout, setLayout] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const handleColorChange = (color: string) => {
    if (activeBlock) {
      const newLayout = layout.map((block) =>
        block.i === activeBlock ? { ...block, color } : block,
      );
      setLayout(newLayout);
    }
  };

  const handleEditClick = () => setIsEditing(true);
  const handleAddClick = () => setIsAdding(true);
  const handleCloseAddMenu = () => {
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleAddBlock = (blockText: string, type: string = 'text') => {
    const newBlock: Block = {
      i: `block-${layout.length + 1}`,
      x: (layout.length * 2) % 12,
      y: Infinity,
      w: 4,
      h: 2,
      text: blockText,
      fontSize: "text-base",
      color: "text-white",
      italic: "non-italic",
      textAlign: "text-left",
      type: type,
    };
    setLayout([...layout, newBlock]);
    setIsAdding(false);
  };

  const handleTextChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement> | any,
  ) => {
    const newLayout = [...layout];
    newLayout[index] = {
      ...newLayout[index],
      text: event.target.value,
    };
    setLayout(newLayout);
  };

  const handleLayoutChange = (newLayout: any[]) => {
    const updatedLayout = newLayout.map((item) => ({
      ...item,
      ...layout.find((block) => block.i === item.i),
    }));
    setLayout(updatedLayout);
  };

  const handleBlockClick = (blockId: string) => {
    setActiveBlock(blockId);
    setIsEditing(true);
  };

  const handleHeadingClick = (size: string) => {
    if (activeBlock) {
      const newLayout = layout.map((block) =>
        block.i === activeBlock ? { ...block, fontSize: size } : block,
      );
      setLayout(newLayout);
    }
  };

  const handleAlignClick = (align: string) => {
    if (activeBlock) {
      const newLayout = layout.map((block) =>
        block.i === activeBlock ? { ...block, textAlign: align } : block,
      );
      setLayout(newLayout);
    }
  };

  return (
    <footer className="group relative flex h-80 flex-col bg-gradient-to-b from-gray-900 to-black text-white shadow-xl">
      <div className="relative h-full w-full">
        <Grid
          layout={layout}
          activeBlock={activeBlock}
          isEditing={isEditing}
          handleBlockClick={handleBlockClick}
          handleTextChange={handleTextChange}
          handleLayoutChange={handleLayoutChange}
          handleColorChange={handleColorChange}
          handleHeadingClick={handleHeadingClick}
          handleAlignClick={handleAlignClick}
        />

        {!isEditing && <EditButton onClick={handleEditClick} />}
        
        {isEditing && !isAdding && (
          <EditMenu onAdd={handleAddClick} isEditing={isEditing} />
        )}

        {isAdding && (
          <AddBlock
            handleClose={handleCloseAddMenu}
            handleAddBlock={handleAddBlock}
          />
        )}
      </div>
    </footer>
  );
};

export default FooterContent;
