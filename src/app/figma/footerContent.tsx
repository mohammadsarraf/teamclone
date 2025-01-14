import { useState } from "react";
import AddBlock from "./addBlock";
import Grid from "./Grid"; // Import the Grid component
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
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
}

export default function FooterContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [fontSize, setFontSize] = useState<string>("");
  const [layout, setLayout] = useState<Block[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [color, setColor] = useState<string>("text-white");
  const [italic, setItalic] = useState<string>("non-italic");
  const [textAlign, setTextAlign] = useState<string>("text-left");
  const handleColorChange = (color: string) => setColor(color);
  const handleEditClick = () => setIsEditing(true);
  const handleAddClick = () => setIsAdding(true);
  const handleCloseAddMenu = () => {
    setIsAdding(false);
    setIsEditing(false);
  };

  const handleAddBlock = (blockText: string) => {
    const newBlock: Block = {
      i: `block-${layout.length + 1}`,
      x: (layout.length * 2) % 12,
      y: Infinity,
      w: 4,
      h: 2,
      text: blockText,
      fontSize: "",
      color: "text-white",
      italic: "non-italic",
      textAlign: "text-left"
    };
    setLayout([...layout, newBlock]);
    setIsAdding(false);
  };

  const handleTextChange = (index: number, event: React.ChangeEvent<HTMLInputElement> | any) => {
    const newLayout = [...layout];
    newLayout[index] = {
      ...newLayout[index],
      text: event.target.value
    };
    setLayout(newLayout);
  };

  const handleLayoutChange = (newLayout: Layout[]) => {
    const updatedLayout = newLayout.map((item) => ({
      ...item,
      ...layout.find(block => block.i === item.i)
    }));
    setLayout(updatedLayout);
  };

  const handleBlockClick = (blockId: string) => {
    setActiveBlock(blockId);
    setIsEditing(true);
  };

  const handleHeadingClick = (size: string) => {
    if (activeBlock) {
      const newLayout = layout.map(block => 
        block.i === activeBlock ? { ...block, fontSize: size } : block
      );
      setLayout(newLayout);
    }
  };

  const handleAlignClick = (align: string) => {
    if (activeBlock) {
      const newLayout = layout.map(block => 
        block.i === activeBlock ? { ...block, textAlign: align } : block
      );
      setLayout(newLayout);
    }
  };

  return (
    <footer className="group relative flex h-80 flex-col bg-black text-white shadow-md">
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
      {!isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded bg-white px-4 py-2 text-blue-600 opacity-0 shadow-md transition-opacity hover:bg-gray-100 focus:outline-none group-hover:opacity-100"
        >
          Edit Footer
        </button>
      )}

      {isEditing && !isAdding && (
        <>
          <div className="absolute left-4 -top-14">
            <button
              onClick={handleAddClick}
              className="rounded bg-white px-4 py-2 text-blue-600 shadow-md hover:bg-gray-100"
            >
              Add Block
            </button>
          </div>
          <div className="absolute right-4 -top-14 rounded bg-white px-4 py-2 text-blue-600 shadow-md">
            <p>Edit Section</p>
          </div>
        </>
      )}

      {isAdding && <AddBlock handleClose={handleCloseAddMenu} handleAddBlock={handleAddBlock} />}
    </footer>
  );
}
