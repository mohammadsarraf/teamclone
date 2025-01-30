import React, { useState } from "react";
import GridLayout from "react-grid-layout";
import ContentEditable from "react-contenteditable";
import ActiveBlock from "./activeBlock";
import Triangle from "./shapes/Triangle";

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

interface BlockProps {
  block: any;
  index: number;
  isActive: boolean;
  isEditing: boolean;
  onBlockClick: (id: string) => void;
  onTextChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleColorChange: (color: string) => void;
  handleHeadingClick: (size: string) => void;
  handleAlignClick: (align: string) => void;
  isHovered: boolean;
  activeBlock: string | null;
}

interface BlockWrapperProps {
  children: React.ReactNode;
  isActive: boolean;
  isEditing: boolean;
  isHovered: boolean;
  onEdit?: () => void;
  menuContent?: React.ReactNode;
}

const BlockWrapper = ({
  children,
  isActive,
  isEditing,
  isHovered,
  onEdit,
  menuContent,
}: BlockWrapperProps) => {
  return (
    <div
      className={`relative size-full rounded-lg border-2 transition-all duration-200 ${
        isActive ? "border-blue-500 shadow-lg" : "border-transparent"
      } ${isEditing ? "hover:border-gray-600" : ""}`}
      onClick={() => isEditing && onEdit?.()}
    >
      {(isActive || isHovered) && menuContent && (
        <div className="absolute -top-12 left-0 z-20 w-full">{menuContent}</div>
      )}
      {children}
    </div>
  );
};

const ShapeBlock = ({ ...props }: BlockProps) => {
  // Convert color class to actual color
  const colorMap: { [key: string]: string } = {
    "text-white": "border-white",
    "text-blue-500": "border-blue-500",
    "text-red-500": "border-red-500",
    // Add more color mappings as needed
  };

  return (
    <BlockWrapper
      isActive={props.isActive}
      isEditing={props.isEditing}
      isHovered={props.isHovered}
      onEdit={() => props.onBlockClick(props.block.i)}
      menuContent={
        <ActiveBlock
          block={props.block}
          index={props.index}
          isEditing={props.isEditing}
          activeBlock={props.activeBlock}
          handleBlockClick={props.onBlockClick}
          handleTextChange={props.onTextChange}
          color={props.block.color}
          handleColorChange={props.handleColorChange}
          handleHeadingClick={props.handleHeadingClick}
          handleAlignClick={props.handleAlignClick}
        />
      }
    >
      <div className="size-full p-4">
        <Triangle color={colorMap[props.block.color] || "border-white"} />
      </div>
    </BlockWrapper>
  );
};

const Block = ({ ...props }: BlockProps) => {
  if (props.block.type === "triangle") {
    return <ShapeBlock {...props} />;
  }

  return (
    <BlockWrapper
      isActive={props.isActive}
      isEditing={props.isEditing}
      isHovered={props.isHovered}
      onEdit={() => props.onBlockClick(props.block.i)}
      menuContent={
        <ActiveBlock
          block={props.block}
          index={props.index}
          isEditing={props.isEditing}
          activeBlock={props.activeBlock}
          handleBlockClick={props.onBlockClick}
          handleTextChange={props.onTextChange}
          color={props.block.color}
          handleColorChange={props.handleColorChange}
          handleHeadingClick={props.handleHeadingClick}
          handleAlignClick={props.handleAlignClick}
        />
      }
    >
      <ContentEditable
        html={props.block.text}
        disabled={!props.isEditing || props.activeBlock !== props.block.i}
        onChange={(event) => props.onTextChange(props.index, event)}
        className={`size-full min-h-[40px] overflow-auto rounded-lg p-4
          ${props.block.fontSize} ${props.block.color} ${props.block.italic} ${props.block.textAlign}
          ${props.isEditing ? "cursor-text" : "cursor-default"}
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
        style={{
          transition: "all 0.2s ease-in-out",
          display: "flex",
          alignItems: "center",
        }}
      />
    </BlockWrapper>
  );
};

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
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  return (
    <div className="relative size-full p-4">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={windowWidth}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={handleLayoutChange}
        margin={[0, 0]}
        containerPadding={[0, 0]}
        preventCollision={false}
        allowOverlap={true}
        verticalCompact={false}
        compactType={null}
        useCSSTransforms={true}
      >
        {layout.map((block, index) => (
          <div
            key={block.i}
            onMouseEnter={() => setHoveredBlock(block.i)}
            onMouseLeave={() => setHoveredBlock(null)}
            className="absolute"
            style={{
              zIndex:
                hoveredBlock === block.i || activeBlock === block.i ? 10 : 1,
            }}
          >
            <Block
              block={block}
              index={index}
              isActive={activeBlock === block.i}
              isEditing={isEditing}
              onBlockClick={handleBlockClick}
              onTextChange={handleTextChange}
              handleColorChange={handleColorChange}
              handleHeadingClick={handleHeadingClick}
              handleAlignClick={handleAlignClick}
              isHovered={hoveredBlock === block.i}
              activeBlock={activeBlock}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
