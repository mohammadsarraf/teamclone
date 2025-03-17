"use client";
import { useState, useEffect } from "react";
import HeaderEditMenu from "./BananaHeaderControls";
import ElementToolbar from "./menus/BananaElementPanel";
import DesignToolbar from "./menus/BananaDesignPanel";
import BananaHeader, { HeaderLayout } from "./BananaHeader";
import "../types";

interface HeaderEditProps {
  isFullscreen: boolean;
}

type MenuType = "none" | "element" | "design";

interface EnabledElements {
  isButton: boolean;
  isSocial: boolean;
  isCart: boolean;
  isAccount: boolean;
}

// Complete state of the header for history tracking
interface HeaderState {
  layout: HeaderLayout;
  height: number;
  linkSpacing: number;
  elementSpacing: number;
  enabledElements: EnabledElements;
  backgroundColor: string;
  gradientEndColor?: string;
  isGradient?: boolean;
  textColor: string;
}

export default function BananaHeaderEditor({ isFullscreen }: HeaderEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>("none");
  const [headerBgColor, setHeaderBgColor] = useState(`#000000`);
  const [headerBgOpacity, setHeaderBgOpacity] = useState(`bg-opacity-100 `)
  const [headerGradientEndColor, setHeaderGradientEndColor] = useState(`#4f46e5`);
  const [isGradient, setIsGradient] = useState(false);
  const [headerTextColor, setHeaderTextColor] = useState(`#ffffff`);
  // Current state
  const [enabledElements, setEnabledElements] = useState<EnabledElements>({
    isButton: false,
    isSocial: false,
    isCart: false,
    isAccount: false,
  });
  const [headerLayout, setHeaderLayout] = useState<HeaderLayout>("Option 1");
  const [headerHeight, setHeaderHeight] = useState(80);
  const [linkSpacing, setLinkSpacing] = useState(24);
  const [elementSpacing, setElementSpacing] = useState(16);

  // History management
  const [history, setHistory] = useState<HeaderState[]>([
    {
      layout: "Option 1",
      height: 80,
      linkSpacing: 12,
      elementSpacing: 16,
      enabledElements: {
        isButton: false,
        isSocial: false,
        isCart: false,
        isAccount: false,
      },
      backgroundColor: "#e30404",
      gradientEndColor: "#4f46e5",
      isGradient: false,
      textColor: "#ffffff",
    },
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Derived state for undo/redo availability
  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < history.length - 1;

  // Add a new state to history
  const addToHistory = (newState: HeaderState) => {
    // Remove any future states if we've gone back in history and then made a change
    const newHistory = history.slice(0, currentHistoryIndex + 1);

    // Add the new state
    newHistory.push(newState);

    // Update history and move pointer to the end
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  // Get current state as an object
  const getCurrentState = (): HeaderState => ({
    layout: headerLayout,
    height: headerHeight,
    linkSpacing: linkSpacing,
    elementSpacing: elementSpacing,
    enabledElements: { ...enabledElements },
    backgroundColor: headerBgColor,
    gradientEndColor: headerGradientEndColor,
    isGradient: isGradient,
    textColor: headerTextColor,
  });

  // Apply a state from history
  const applyState = (state: HeaderState) => {
    setHeaderLayout(state.layout);
    setHeaderHeight(state.height);
    setLinkSpacing(state.linkSpacing);
    setElementSpacing(state.elementSpacing);
    setEnabledElements(state.enabledElements);
    
    // Make sure we're storing just the hex color, not the Tailwind class
    let bgColor = state.backgroundColor;
    if (bgColor && bgColor.startsWith('bg-[') && bgColor.endsWith(']')) {
      bgColor = bgColor.substring(4, bgColor.length - 1);
    }
    setHeaderBgColor(bgColor);
    
    // Set gradient state if available
    if (state.gradientEndColor) {
      setHeaderGradientEndColor(state.gradientEndColor);
    }
    setIsGradient(state.isGradient || false);
    
    setHeaderTextColor(state.textColor);

    // Reset menu state when applying a state from history
    setActiveMenu("none");
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    if (canUndo && history[currentHistoryIndex - 1]) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      const stateToApply = history[newIndex];
      if (stateToApply) {
        applyState(stateToApply);
      }
    }
  };

  const handleRedo = () => {
    if (canRedo && history[currentHistoryIndex + 1]) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      const stateToApply = history[newIndex];
      if (stateToApply) {
        applyState(stateToApply);
      }
    }
  };

  const handleMenuClick = (menuType: MenuType) => {
    const newMenuType = menuType === activeMenu ? "none" : menuType;
    setActiveMenu(newMenuType);
  };

  const handleExitEdit = () => {
    setIsEditing(false);
    setActiveMenu("none");
  };

  const handleElementToggle = (elements: EnabledElements) => {
    // Only update if the elements have actually changed
    if (JSON.stringify(elements) !== JSON.stringify(enabledElements)) {
      setEnabledElements(elements);

      // Add to history
      const newState = {
        ...getCurrentState(),
        enabledElements: elements,
      };
      addToHistory(newState);
    }
  };

  const handleLayoutChange = (layout: HeaderLayout) => {
    // Only update if the layout has actually changed
    if (layout !== headerLayout) {
      setHeaderLayout(layout);

      // Add to history
      const newState = {
        ...getCurrentState(),
        layout,
      };
      addToHistory(newState);
    }
  };

  const handleHeightChange = (height: number) => {
    setHeaderHeight(height);

    // For slider changes, we don't want to add to history on every pixel change
    // We'll handle this in the design panel component
  };

  const handleHeightChangeComplete = (height: number) => {
    // Add to history when slider interaction is complete
    const newState = {
      ...getCurrentState(),
      height,
    };
    addToHistory(newState);
  };

  const handleLinkSpacingChange = (spacing: number) => {
    setLinkSpacing(spacing);
    // For slider changes, handled in design panel
  };

  const handleLinkSpacingChangeComplete = (spacing: number) => {
    const newState = {
      ...getCurrentState(),
      linkSpacing: spacing,
    };
    addToHistory(newState);
  };

  const handleElementSpacingChange = (spacing: number) => {
    setElementSpacing(spacing);
    // For slider changes, handled in design panel
  };

  const handleElementSpacingChangeComplete = (spacing: number) => {
    const newState = {
      ...getCurrentState(),
      elementSpacing: spacing,
    };
    addToHistory(newState);
  };

  const handleBackgroundColorChange = (color: string) => {
    // Check if it's a gradient format (gradient:color1:color2)
    if (color.startsWith('gradient:')) {
      const parts = color.split(':');
      if (parts.length === 3) {
        // Extract the two colors
        const startColor = parts[1];
        const endColor = parts[2];
        
        // Update state
        setHeaderBgColor(startColor);
        setHeaderGradientEndColor(endColor);
        setIsGradient(true);
        
        // Add to history
        const newState = {
          ...getCurrentState(),
          backgroundColor: startColor,
          gradientEndColor: endColor,
          isGradient: true,
        };
        addToHistory(newState);
      }
    } else if (color === 'adaptive') {
      // Handle adaptive background (not implemented yet)
      // For now, just use a default color
      setHeaderBgColor('#f8fafc');
      setIsGradient(false);
      
      // Add to history
      const newState = {
        ...getCurrentState(),
        backgroundColor: '#f8fafc',
        isGradient: false,
      };
      addToHistory(newState);
    } else {
      // Regular solid color
      // Store the color without the bg-[] wrapper
      setHeaderBgColor(color);
      setIsGradient(false);
      
      // Add to history
      const newState = {
        ...getCurrentState(),
        backgroundColor: color,
        isGradient: false,
      };
      addToHistory(newState);
    }
  };

  const handleTextColorChange = (color: string) => {
    setHeaderTextColor(color);
    
    // Add to history
    const newState = {
      ...getCurrentState(),
      textColor: color,
    };
    addToHistory(newState);
  };

  const handleBackgroundTypeChange = (type: 'solid' | 'gradient' | 'adaptive') => {
    // Update the background type
    if (type === 'solid') {
      setIsGradient(false);
    } else if (type === 'gradient') {
      setIsGradient(true);
    } else if (type === 'adaptive') {
      // For now, we're not handling adaptive
      setIsGradient(false);
    }
  };

  const handleOpacityChange = (opacity: number) => {
    // For now, we're not handling opacity
    // We can expand this later
  };

  const handleBlurBackgroundChange = (blur: boolean) => {
    // For now, we're not handling blur
    // We can expand this later
  };

  // Add keyboard event listener for undo/redo and expose functions to window
  useEffect(() => {
    // Expose undo/redo functions to window for the top buttons
    if (typeof window !== "undefined") {
      // Make sure we have a valid state to expose
      const currentState = history[currentHistoryIndex];

      window.bananaHeaderEditor = {
        undo: canUndo && history[currentHistoryIndex - 1] ? handleUndo : null,
        redo: canRedo && history[currentHistoryIndex + 1] ? handleRedo : null,
        canUndo: canUndo && !!history[currentHistoryIndex - 1],
        canRedo: canRedo && !!history[currentHistoryIndex + 1],
        currentState: currentState || null,
        currentHistoryIndex,
      };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in edit mode
      if (!isEditing) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd+Z or Ctrl+Z
      if (cmdOrCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo && history[currentHistoryIndex - 1]) {
          handleUndo();
        }
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y
      if (
        (cmdOrCtrl && e.key === "z" && e.shiftKey) ||
        (cmdOrCtrl && e.key === "y")
      ) {
        e.preventDefault();
        if (canRedo && history[currentHistoryIndex + 1]) {
          handleRedo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Clean up the window object when component unmounts
      if (typeof window !== "undefined") {
        delete window.bananaHeaderEditor;
      }
    };
  }, [
    isEditing,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    history,
    currentHistoryIndex,
  ]);

  return (
    <div className="relative">
      {/* Header Container with hover detection */}
      <div
        className={`relative ${isEditing ? "z-30" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Actual Header Content */}
        <BananaHeader
          isEditing={isEditing}
          enabledElements={enabledElements}
          layout={headerLayout}
          height={headerHeight}
          linkSpacing={linkSpacing}
          elementSpacing={elementSpacing}
          bgColor={headerBgColor}
          gradientEndColor={isGradient ? headerGradientEndColor : undefined}
          isGradient={isGradient}
          bgOpacity={headerBgOpacity}
          textColor={headerTextColor || '#ffffff'}
        />

        {/* Edit Overlay */}
        {isFullscreen && (isHovered || isEditing) && (
          <>
            {isHovered && !isEditing && (
              <div className="absolute inset-0 bg-black/20 transition-opacity" />
            )}
            <HeaderEditMenu
              isEditing={isEditing}
              onEditClick={() => setIsEditing(true)}
              isHovered={isHovered}
              onElementClick={() => handleMenuClick("element")}
              onDesignClick={() => handleMenuClick("design")}
              activeMenu={activeMenu}
            />
          </>
        )}
      </div>

      {/* Edit Mode UI */}
      {isEditing && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
            onClick={handleExitEdit}
          />

          {/* Toolbars */}
          {activeMenu === "element" && (
            <div className="absolute left-0 top-full z-40 mt-3">
              <ElementToolbar
                onClose={() => handleMenuClick("none")}
                onElementsChange={handleElementToggle}
                initialElements={enabledElements}
              />
            </div>
          )}
          {activeMenu === "design" && (
            <div className="absolute right-0 top-full z-40 mt-3">
              <DesignToolbar
                onClose={() => handleMenuClick("none")}
                onLayoutChange={handleLayoutChange}
                initialLayout={headerLayout}
                onHeightChange={handleHeightChange}
                initialHeight={headerHeight}
                onLinkSpacingChange={handleLinkSpacingChange}
                initialLinkSpacing={linkSpacing}
                onElementSpacingChange={handleElementSpacingChange}
                initialElementSpacing={elementSpacing}
                onHeightChangeComplete={handleHeightChangeComplete}
                onLinkSpacingChangeComplete={handleLinkSpacingChangeComplete}
                onElementSpacingChangeComplete={
                  handleElementSpacingChangeComplete
                }
                initialBackgroundColor={headerBgColor}
                initialTextColor={headerTextColor}
                initialBackgroundType="solid"
                initialOpacity={100}
                initialBlurBackground={false}
                onBackgroundColorChange={handleBackgroundColorChange}
                onTextColorChange={handleTextColorChange}
                onBackgroundTypeChange={handleBackgroundTypeChange}
                onOpacityChange={handleOpacityChange}
                onBlurBackgroundChange={handleBlurBackgroundChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
