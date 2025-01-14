import GridLayout from "react-grid-layout";
import ContentEditable from "react-contenteditable";
import ActiveBlock from "./activeBlock";
import { useState } from "react";

interface GridProps {
  layout: any[];
  activeBlock: string | null;
  isEditing: boolean;
  handleBlockClick: (blockId: string) => void;
  handleTextChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement> | any,
  ) => void;
  handleLayoutChange: (newLayout: any[]) => void;
  handleColorChange: (color: string) => void;
  handleHeadingClick: (size: string) => void;
  // handleItalicClick: () => void;
  // handleBoldClick: () => void;
  // handleMaximizeClick: () => void;
  // handleFormatColorTextClick: () => void;
  // handleLinkClick: () => void;
  handleAlignClick: (align: string) => void;
}

export default function Grid({
  layout,
  activeBlock,
  isEditing,
  handleBlockClick,
  handleTextChange,
  handleLayoutChange,
  handleColorChange,
  handleHeadingClick,
  // handleItalicClick,
  // handleBoldClick,
  // handleMaximizeClick,
  // handleFormatColorTextClick,
  // handleLinkClick,
  handleAlignClick,
}: GridProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  return (
    <GridLayout
      className="grid size-full"
      cols={12}
      rowHeight={30}
      width={window.innerWidth}
      isDraggable
      isResizable
      useCSSTransforms
      layout={layout}
      draggableHandle=".drag-handle"
      draggableCancel=".no-drag"
      verticalCompact={false}
      preventCollision
      allowOverlap={true} // Enable overlapping
      onLayoutChange={handleLayoutChange}
    >
      {layout.map((block, index) => (
        <div
          key={block.i}
          className="drag-handle relative bg-transparent hover:border"
          onClick={() => handleBlockClick(block.i)}
          onMouseEnter={() => setHoveredBlock(block.i)}
          onMouseLeave={() => setHoveredBlock(null)}
        >
          {(activeBlock === block.i || hoveredBlock === block.i) && (
            <div className="no-drag absolute -top-12 left-0 z-20 w-full">
              <ActiveBlock
                block={block}
                index={index}
                isEditing={true}
                activeBlock={activeBlock}
                handleBlockClick={handleBlockClick}
                handleTextChange={handleTextChange}
                color={block.color}
                handleColorChange={handleColorChange}
                handleHeadingClick={handleHeadingClick}
                // handleItalicClick={handleItalicClick}
                // handleBoldClick={handleBoldClick}
                // handleMaximizeClick={handleMaximizeClick}
                // handleFormatColorTextClick={handleFormatColorTextClick}
                // handleLinkClick={handleLinkClick}
                handleAlignClick={handleAlignClick}
              />
            </div>
          )}
          <ContentEditable
            html={block.text}
            disabled={!isEditing || activeBlock !== block.i}
            onChange={(event) => handleTextChange(index, event)}
            className={`${block.fontSize} ${block.color} ${block.textAlign} size-full`}
          />
        </div>
      ))}
    </GridLayout>
  );
}
