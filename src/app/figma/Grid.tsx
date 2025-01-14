import GridLayout from 'react-grid-layout';
import ContentEditable from 'react-contenteditable';
import ActiveBlock from "./activeBlock";

interface GridProps {
  layout: any[];
  activeBlock: string | null;
  isEditing: boolean;
  handleBlockClick: (blockId: string) => void;
  handleTextChange: (index: number, event: React.ChangeEvent<HTMLInputElement> | any) => void;
  handleLayoutChange: (newLayout: any[]) => void;
  handleColorChange: (color: string) => void;
  handleHeadingClick: (size: string) => void;
  handleItalicClick: () => void;
  handleBoldClick: () => void;
  handleMaximizeClick: () => void;
  handleFormatColorTextClick: () => void;
  handleLinkClick: () => void;
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
  handleItalicClick,
  handleBoldClick,
  handleMaximizeClick,
  handleFormatColorTextClick,
  handleLinkClick,
  handleAlignClick
}: GridProps) {
  return (
    <GridLayout
      className="grid w-full h-full"
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
      onLayoutChange={handleLayoutChange}
    >
      {layout.map((block, index) => (
        <div key={block.i} className="bg-transparent drag-handle" onClick={() => handleBlockClick(block.i)}>
          {activeBlock === block.i && (
            <div className='z-20 no-drag'>
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
                handleItalicClick={handleItalicClick}
                handleBoldClick={handleBoldClick}
                handleMaximizeClick={handleMaximizeClick}
                handleFormatColorTextClick={handleFormatColorTextClick}
                handleLinkClick={handleLinkClick}
                handleAlignClick={handleAlignClick}
              />
            </div>
          )}
          <ContentEditable
            html={block.text}
            disabled={!isEditing || activeBlock !== block.i}
            onChange={(event) => handleTextChange(index, event)}
            className={`${block.fontSize} ${block.color} ${block.textAlign}`}
          />
        </div>
      ))}
    </GridLayout>
  );
}