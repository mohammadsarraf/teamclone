"use client";
import { useState, useEffect } from "react";
import HeaderEditMenu from "./BananaHeaderControls";
import ElementToolbar from "./menus/BananaElementPanel";
import DesignToolbar from "./menus/BananaDesignPanel";
import BananaHeader, { HeaderLayout } from "./BananaHeader";
import { GrRedo, GrUndo } from "react-icons/gr";
// Import types
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
}

export default function BananaHeaderEditor({ isFullscreen }: HeaderEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>("none");
  
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
      linkSpacing: 24,
      elementSpacing: 16,
      enabledElements: {
        isButton: false,
        isSocial: false,
        isCart: false,
        isAccount: false,
      }
    }
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  
  // Load saved state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('bananaHeaderState');
        const savedIndex = localStorage.getItem('bananaHeaderHistoryIndex');
        
        if (savedState) {
          const parsedState = JSON.parse(savedState) as HeaderState;
          
          // Apply the saved state
          applyState(parsedState);
          
          // Update history
          const newHistory = [...history];
          newHistory[0] = parsedState; // Replace initial state
          setHistory(newHistory);
          
          // Set history index if available
          if (savedIndex) {
            const index = parseInt(savedIndex, 10);
            if (!isNaN(index) && index >= 0) {
              setCurrentHistoryIndex(index);
            }
          }
          
          console.log('Loaded saved header state:', parsedState);
        }
      } catch (error) {
        console.error('Error loading saved header state:', error);
      }
    }
  }, []);
  
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
    enabledElements: { ...enabledElements }
  });

  // Apply a state from history
  const applyState = (state: HeaderState) => {
    setHeaderLayout(state.layout);
    setHeaderHeight(state.height);
    setLinkSpacing(state.linkSpacing);
    setElementSpacing(state.elementSpacing);
    setEnabledElements(state.enabledElements);
    
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
        enabledElements: elements
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
        layout
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
      height
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
      linkSpacing: spacing
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
      elementSpacing: spacing
    };
    addToHistory(newState);
  };

  // Add keyboard event listener for undo/redo and expose functions to window
  useEffect(() => {
    // Expose undo/redo functions to window for the top buttons
    if (typeof window !== 'undefined') {
      // Make sure we have a valid state to expose
      const currentState = history[currentHistoryIndex];
      
      window.bananaHeaderEditor = {
        undo: canUndo && history[currentHistoryIndex - 1] ? handleUndo : null,
        redo: canRedo && history[currentHistoryIndex + 1] ? handleRedo : null,
        canUndo: canUndo && !!history[currentHistoryIndex - 1],
        canRedo: canRedo && !!history[currentHistoryIndex + 1],
        currentState: currentState || null,
        currentHistoryIndex
      };
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in edit mode
      if (!isEditing) return;
      
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Undo: Cmd+Z or Ctrl+Z
      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo && history[currentHistoryIndex - 1]) {
          handleUndo();
        }
      }
      
      // Redo: Cmd+Shift+Z or Ctrl+Y
      if ((cmdOrCtrl && e.key === 'z' && e.shiftKey) || 
          (cmdOrCtrl && e.key === 'y')) {
        e.preventDefault();
        if (canRedo && history[currentHistoryIndex + 1]) {
          handleRedo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Clean up the window object when component unmounts
      if (typeof window !== 'undefined') {
        delete window.bananaHeaderEditor;
      }
    };
  }, [isEditing, canUndo, canRedo, handleUndo, handleRedo, history, currentHistoryIndex]);

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
          enabledElements={enabledElements} 
          layout={headerLayout}
          height={headerHeight}
          linkSpacing={linkSpacing}
          elementSpacing={elementSpacing}
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
                onElementSpacingChangeComplete={handleElementSpacingChangeComplete}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
