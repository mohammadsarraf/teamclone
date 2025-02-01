"use client";
import React, { useState, useEffect, useMemo } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import dynamic from "next/dynamic";
import { useWindowSize } from "./hooks/useWindowSize";
import { GridOverlay } from "./components/GridOverlay";
import { GridContainer } from "./components/GridContainer";
import ShapeWrapper from "./components/ShapeWrapper";
import ShapeItem from "./components/ShapeItem";
import { Layout } from "react-grid-layout";
import { ShapeManager } from "./class";
import { Block } from "./types";
import { AiOutlineSearch } from "react-icons/ai";
import { RiText } from "react-icons/ri";
import { FaShapes } from "react-icons/fa6";
import { MdAdd, MdEdit, MdSettings, MdStyle } from "react-icons/md";
import { EditBar } from "./components/EditBar";

// Dynamically import Zdog components with no SSR
const ZdogComponents = dynamic(() => import("./components/ZdogComponents"), {
  ssr: false,
});

// Dynamically import Three components with no SSR
const ShapeComponents = dynamic(() => import("./components/ShapeComponents"), {
  ssr: false,
});

const TextBox = dynamic(() => import("./components/TextBox"), { ssr: false });

const initialLayout: Block[] = [];

// Make sure to export the interface
export interface TestPageProps {
  className?: string;
  containerClassName?: string;
  initialCols?: number;
  initialRows?: number;
  onHeightChange?: (height: number) => void;
  showMenuButton?: boolean;
}

const TestPage = ({
  className = "",
  containerClassName = "",
  initialCols = 36,
  initialRows = 12,
  onHeightChange,
  showMenuButton = true,
}: TestPageProps) => {
  const [layout, setLayout] = useState<Block[]>(initialLayout);
  const [activeShape, setActiveShape] = useState<string | null>(null);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number; w: number; h: number };
  }>({});
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cols, setCols] = useState(initialCols);
  const [rows, setRows] = useState(initialRows);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [showShapesSubmenu, setShowShapesSubmenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showEditBar, setShowEditBar] = useState(false);

  const containerWidth = useWindowSize();
  const unitSize = containerWidth / cols;

  // Create ShapeManager instance
  const shapeManager = useMemo(
    () =>
      new ShapeManager(
        layout,
        setLayout,
        positions,
        setPositions,
        activeShape,
        setActiveShape,
      ),
    [layout, positions, activeShape],
  );

  // Add useEffect for click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        activeMenu &&
        !(e.target as HTMLElement).closest(".menu-content") &&
        !(e.target as HTMLElement).closest(".shape-wrapper")
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  // Calculate and notify parent of actual grid height
  useEffect(() => {
    const gridHeight = rows * unitSize;
    onHeightChange?.(gridHeight);
  }, [rows, unitSize, onHeightChange]);

  // Handle row changes from MenuBar
  const handleRowsChange = (newRows: number) => {
    setRows(newRows);
    const newHeight = newRows * unitSize;
    onHeightChange?.(newHeight);
  };

  const handleStartEdit = (blockId: string) => {
    setActiveShape(blockId);
    setActiveMenu(blockId);
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setActiveMenu(null);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
    setActiveMenu(null);
  };

  // Function to handle shape addition
  const handleAddShape = (type: "triangle" | "circle" | "square") => {
    shapeManager.addShape(type);
    setIsMenuVisible(false);
    setShowShapesSubmenu(false);
  };

  // Function to handle text addition
  const handleAddText = () => {
    shapeManager.addTextBox();
    setIsMenuVisible(false);
  };

  // Function to handle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // If we're exiting edit mode, close any open menus
      setIsMenuVisible(false);
      setShowShapesSubmenu(false);
      setActiveMenu(null);
    }
  };

  // Function to handle design click
  const handleDesignClick = () => {
    // Add your design menu logic here
    console.log("Design clicked");
  };

  // Function to handle settings click
  const handleSettingsClick = () => {
    // Remove console.log and leave it empty since we're handling the UI in EditBar
  };

  // Function to handle clicking outside menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.add-block-menu') && !target.closest('.edit-bar-button')) {
        setIsMenuVisible(false);
        setShowShapesSubmenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddBlock = (text: string, type?: string) => {
    if (type) {
      handleAddShape(type as "triangle" | "circle" | "square");
    } else {
      handleAddText();
    }
  };

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className={`relative flex-1 ${containerClassName}`}>
        <GridOverlay
          show={isDragging || isResizing}
          cols={cols}
          rows={rows}
          unitSize={unitSize}
        />

        <div 
          className="relative size-full"
          onMouseEnter={() => setShowEditBar(true)}
          onMouseLeave={() => !isEditing && setShowEditBar(false)}
        >
          <GridContainer
            key={`grid-${cols}-${rows}`}
            cols={cols}
            rows={rows}
            unitSize={unitSize}
            layout={layout}
            onLayoutChange={shapeManager.handleLayoutChange}
            onResizeStop={(layout, oldItem, newItem) => {
              shapeManager.handleLayoutChange(layout);
              shapeManager.handleResizeStop(layout, oldItem, newItem);
              setIsResizing(false);
            }}
            onResizeStart={() => setIsResizing(true)}
            onDragStart={() => setIsDragging(true)}
            onDragStop={(layout: Layout[]) => {
              setIsDragging(false);
              shapeManager.handleLayoutChange(layout);
            }}
            preventCollision={false}
            allowOverlap={true}
            verticalCompact={false}
            compactType={null}
            isDraggable={true}
            isResizable={true}
            isResizing={isResizing}
            resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
            transformScale={1}
            margin={[0, 0]}
            containerPadding={[0, 0]}
            style={{ height: "100%", width: "100%" }}
            draggableHandle="[data-drag-handle]"
          >
            {layout.map((block, index) => (
              <div
                key={block.i}
                style={{
                  position: "relative",
                  width: block.w,
                  height: block.h,
                  transform: `translate(${block.x}px, ${block.y}px)`,
                }}
              >
                <ShapeWrapper
                  onSelect={() => setActiveMenu(block.i)}
                  menuVisible={activeMenu === block.i}
                  isText={block.shape === "text"}
                  currentShape={block.shape}
                  onShapeChange={(type) =>
                    shapeManager.handleShapeChange(block.i, type)
                  }
                  onColorChange={(color) =>
                    shapeManager.handleColorChange(block.i, color)
                  }
                  onDelete={() => shapeManager.handleDelete(block.i)}
                  onDuplicate={() => shapeManager.handleDuplicate(block.i)}
                  onOpacityChange={(opacity) =>
                    shapeManager.handleOpacityChange(block.i, opacity)
                  }
                  onRotationChange={(rotation) =>
                    shapeManager.handleRotationChange(block.i, rotation)
                  }
                  onBorderChange={shapeManager.handleBorderChange}
                  currentOpacity={block.opacity}
                  currentRotation={block.rotation || 0}
                  currentBorder={block.border}
                  onFlipHorizontal={() => shapeManager.handleFlipH(block.i)}
                  onFlipVertical={() => shapeManager.handleFlipV(block.i)}
                  onShadowChange={shapeManager.handleShadowChange}
                  currentShadow={block.shadow}
                  currentFlipH={block.flipH || false}
                  currentFlipV={block.flipV || false}
                  currentColor={block.color}
                  totalShapes={layout.length}
                  index={layout.length - index}
                  className="shape-wrapper"
                  onFontChange={(font) =>
                    shapeManager.handleFontChange(block.i, font)
                  }
                  currentFont={block.font}
                  onFontSize={(size) =>
                    shapeManager.handleFontSizeChange(block.i, size)
                  }
                  currentFontSize={block.fontSize}
                  onTextAlign={(align) =>
                    shapeManager.handleTextAlignChange(block.i, align)
                  }
                  currentTextAlign={block.textAlign}
                  onBold={() => shapeManager.handleBoldChange(block.i)}
                  isBold={block.isBold}
                  onItalic={() => shapeManager.handleItalicChange(block.i)}
                  isItalic={block.isItalic}
                  onUnderline={() => shapeManager.handleUnderlineChange(block.i)}
                  isUnderline={block.isUnderline}
                  onLineHeight={(height) =>
                    shapeManager.handleLineHeightChange(block.i, height)
                  }
                  currentLineHeight={block.lineHeight}
                  onLetterSpacing={(spacing) =>
                    shapeManager.handleLetterSpacingChange(block.i, spacing)
                  }
                  currentLetterSpacing={block.letterSpacing}
                  onEnterPress={() => shapeManager.handleEnterPress(block.i)}
                  onHeightChange={(height) =>
                    shapeManager.handleHeightChange(block.i, height)
                  }
                  unitSize={unitSize}
                >
                  <ShapeItem
                    type={block.shape}
                    color={block.color}
                    text={block.text}
                    onTextChange={(newText) =>
                      shapeManager.handleTextChange(block.i, newText)
                    }
                    isActive={activeShape === block.i}
                    onStartEdit={() => handleStartEdit(block.i)}
                    opacity={block.opacity}
                    rotation={block.rotation || 0}
                    flipH={block.flipH || false}
                    flipV={block.flipV || false}
                    font={block.font}
                    fontSize={block.fontSize}
                    textAlign={block.textAlign}
                    isBold={block.isBold}
                    isItalic={block.isItalic}
                    isUnderline={block.isUnderline}
                    lineHeight={block.lineHeight}
                    letterSpacing={block.letterSpacing}
                    onEnterPress={() => shapeManager.handleEnterPress(block.i)}
                    onHeightChange={(height) =>
                      shapeManager.handleHeightChange(block.i, height)
                    }
                    unitSize={unitSize}
                  />
                </ShapeWrapper>
              </div>
            ))}
          </GridContainer>

          <EditBar 
            isEditing={isEditing}
            showEditBar={showEditBar}
            handleEditClick={handleEditClick}
            handleDesignClick={handleDesignClick}
            onSettingsClick={handleSettingsClick}
            handleAddBlock={handleAddBlock}
            cols={cols}
            rows={rows}
            onColsChange={setCols}
            onRowsChange={handleRowsChange}
          />
        </div>
      </div>
    </div>
  );
};

// Export both the interface and the component
const Test = (props: TestPageProps) => {
  return <TestPage {...props} />;
};

export default Test;
