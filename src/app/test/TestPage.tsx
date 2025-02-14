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
import {
  MdAdd,
  MdEdit,
  MdSettings,
  MdStyle,
  MdUndo,
  MdRedo,
} from "react-icons/md";
import { EditBar } from "./components/EditBar";
import { FooterDesignMenu } from "./components/menus/FooterDesignMenu";

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

// Update the state interface to include backgroundColor
interface SavedState {
  layout: Block[];
  positions: {
    [key: string]: { x: number; y: number; w: number; h: number };
  };
  cols: number;
  rows: number;
  backgroundColor: string;
}

// Make sure to export the interface
export interface TestPageProps {
  className?: string;
  containerClassName?: string;
  initialCols?: number;
  initialRows?: number;
  onHeightChange?: (height: number) => void;
  showMenuButton?: boolean;
  stateKey: string;
  editBarPosition?: "fixed" | "relative";
  editBarOffset?: number;
  onClose?: () => void;
  layout?: Block[];
  onLayoutChange?: (layout: Layout[]) => void;
  onAddBlock?: (text: string, type?: string) => void;
  isActiveInstance?: boolean;
}

const TestPage = ({
  className = "",
  containerClassName = "",
  initialCols = 36,
  initialRows = 12,
  onHeightChange,
  showMenuButton = true,
  stateKey,
  editBarPosition = "relative",
  editBarOffset = 0,
  onClose,
  layout,
  onLayoutChange,
  onAddBlock,
  isActiveInstance,
}: TestPageProps) => {
  const [layoutState, setLayoutState] = useState<Block[]>(
    layout || initialLayout,
  );
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
  const [showDesignMenu, setShowDesignMenu] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  const containerWidth = useWindowSize();
  const unitSize = containerWidth / cols;

  // Initialize history with the initial layout
  const [history, setHistory] = useState<Block[][]>([layout || initialLayout]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Update the updateLayoutWithHistory function with more detailed logging
  const updateLayoutWithHistory = (newLayout: Block[]) => {
    // Check if the new layout is actually different from the current one
    const currentLayout = history[historyIndex];
    const hasChanged =
      JSON.stringify(currentLayout) !== JSON.stringify(newLayout);

    console.log("History Update:", {
      action: "attempt",
      currentHistoryIndex: historyIndex,
      historyLength: history.length,
      hasChanged,
      currentLayout,
      newLayout,
      historyStack: history,
    });

    // Only update history if there's an actual change
    if (hasChanged) {
      setLayoutState(newLayout);

      // Remove any future history after current index
      const newHistory = history.slice(0, historyIndex + 1);

      // Add new layout to history
      const updatedHistory = [...newHistory, newLayout];
      setHistory(updatedHistory);
      setHistoryIndex(historyIndex + 1);

      console.log("History Update:", {
        action: "success",
        newHistoryIndex: historyIndex + 1,
        newHistoryLength: updatedHistory.length,
        historyStack: updatedHistory,
      });
    } else {
      console.log("History Update:", {
        action: "skipped",
        reason: "no changes detected",
        historyStack: history,
      });
    }
  };

  // Update the handleUndo function with logging
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const newLayout = history[newIndex];

      console.log("Undo:", {
        action: "start",
        currentIndex: historyIndex,
        newIndex,
        currentLayout: history[historyIndex],
        targetLayout: newLayout,
        historyStack: history,
      });

      setHistoryIndex(newIndex);
      setLayoutState(newLayout);
      if (onLayoutChange) {
        onLayoutChange(newLayout);
      }
    }
  };

  // Create ShapeManager instance with history-aware updates
  const shapeManager = useMemo(
    () =>
      new ShapeManager(
        layoutState,
        (newLayout: Block[] | ((prevLayout: Block[]) => Block[])) => {
          if (typeof newLayout === "function") {
            const updatedLayout = newLayout(layoutState);
            updateLayoutWithHistory(updatedLayout);
          } else {
            updateLayoutWithHistory(newLayout);
          }
        },
        positions,
        setPositions,
        activeShape,
        setActiveShape,
      ),
    [layoutState, positions, activeShape, updateLayoutWithHistory],
  );

  // Add undo/redo functions
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayoutState(history[historyIndex + 1]);
      if (onLayoutChange) {
        onLayoutChange(history[historyIndex + 1]);
      }
    }
  };

  // Update existing handleLayoutChange
  const handleLayoutChange = (newLayout: Layout[]) => {
    const updatedLayout = layoutState.map((block, index) => ({
      ...block,
      ...newLayout[index],
    }));

    updateLayoutWithHistory(updatedLayout);

    if (onLayoutChange) {
      onLayoutChange(updatedLayout);
    }
  };

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [historyIndex, history]);

  // Update the load state useEffect
  useEffect(() => {
    const savedState = localStorage.getItem(`${stateKey}State`);
    if (savedState) {
      try {
        const state: SavedState = JSON.parse(savedState);
        if (state.layout) setLayoutState(state.layout);
        if (state.positions) setPositions(state.positions);
        if (state.cols) setCols(state.cols);
        if (state.rows) setRows(state.rows);
        if (state.backgroundColor) setBackgroundColor(state.backgroundColor);
      } catch (error) {
        console.error(`Error loading ${stateKey} state:`, error);
        localStorage.removeItem(`${stateKey}State`);
      }
    }
  }, [stateKey]);

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
    // Close menu when toggling edit mode
    setActiveMenu(null);
  };

  // Function to handle design click
  const handleDesignClick = () => {
    setShowDesignMenu(!showDesignMenu);
    setActiveMenu(null);
  };

  // Function to handle settings click
  const handleSettingsClick = () => {
    setActiveMenu(activeMenu === "settings" ? null : "settings");
  };

  // Function to handle clicking outside menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".add-block-menu") &&
        !target.closest(".edit-bar-button")
      ) {
        setIsMenuVisible(false);
        setShowShapesSubmenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddBlock = (text: string, type?: string) => {
    if (type) {
      shapeManager.addShape(type as "triangle" | "circle" | "square");
    } else {
      shapeManager.addTextBox();
    }
    // Close menu after adding block
    setActiveMenu(null);
  };

  // Update the save changes handler
  const handleSaveChanges = () => {
    const state: SavedState = {
      layout: layoutState,
      positions,
      cols,
      rows,
      backgroundColor,
    };
    localStorage.setItem(`${stateKey}State`, JSON.stringify(state));
    setActiveMenu(null);
  };

  // Update the reset changes handler
  const handleResetChanges = () => {
    localStorage.removeItem(`${stateKey}State`);
    setLayoutState(initialLayout);
    setPositions({});
    setCols(initialCols);
    setRows(initialRows);
    setBackgroundColor("#ffffff");
    setActiveMenu(null);
  };

  // Add history buttons to EditBar
  const editBarProps = {
    onUndo: handleUndo,
    onRedo: handleRedo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };

  // Add color change handler
  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <div className="relative size-full">
      <div
        className={`relative size-full ${className}`}
        style={{
          backgroundColor: backgroundColor.startsWith("#")
            ? backgroundColor
            : "transparent",
          backgroundImage: backgroundColor.startsWith("linear-gradient")
            ? backgroundColor
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
            layout={layoutState}
            onLayoutChange={(layout) => {
              // Only handle layout changes that aren't from resize/drag operations
              if (!isResizing && !isDragging) {
                handleLayoutChange(layout);
              }
            }}
            onResizeStop={(layout, oldItem, newItem) => {
              // Handle resize completion
              handleLayoutChange(layout);
              shapeManager.handleResizeStop(layout, oldItem, newItem);
              setIsResizing(false);
            }}
            onResizeStart={() => {
              setIsResizing(true);
              setActiveMenu(null);
            }}
            onDragStart={() => {
              setIsDragging(true);
              setActiveMenu(null);
            }}
            onDragStop={(layout: Layout[]) => {
              // Handle drag completion
              handleLayoutChange(layout);
              setIsDragging(false);
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
            {layoutState.map((block, index) => (
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
                  totalShapes={layoutState.length}
                  index={layoutState.length - index}
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
                  onUnderline={() =>
                    shapeManager.handleUnderlineChange(block.i)
                  }
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

          {/* Add the design menu */}
          {showDesignMenu && (
            <FooterDesignMenu
              onColorChange={handleColorChange}
              handleClose={() => setShowDesignMenu(false)}
              currentColor={backgroundColor}
            />
          )}

          <div className="relative">
            <EditBar
              isEditing={isEditing}
              showEditBar={showMenuButton}
              handleEditClick={handleEditClick}
              handleDesignClick={handleDesignClick}
              onSettingsClick={handleSettingsClick}
              handleAddBlock={handleAddBlock}
              handleSaveChanges={handleSaveChanges}
              handleResetChanges={handleResetChanges}
              cols={cols}
              rows={rows}
              onColsChange={setCols}
              onRowsChange={handleRowsChange}
              stateKey={stateKey}
              position={editBarPosition}
              offset={editBarOffset}
              onClose={onClose}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
            />
          </div>
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
