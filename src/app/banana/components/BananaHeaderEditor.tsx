"use client";
import { useState, useEffect, useRef } from "react";
import HeaderEditMenu from "./BananaHeaderControls";
import ElementToolbar from "./menus/BananaElementPanel";
import DesignToolbar from "./menus/BananaDesignPanel";
import BananaHeader, { HeaderLayout } from "./BananaHeader";
import "../types";
import useHistory from "../hooks/useHistory";

interface HeaderEditProps {
  isFullscreen: boolean;
  onStateChange?: (state: HeaderState) => void;
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
  gradientStartColor: string;
  gradientEndColor?: string;
  isGradient?: boolean;
  textColor: string;
}

export default function BananaHeaderEditor({
  isFullscreen,
  onStateChange,
}: HeaderEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>("none");
  const hasInitialized = useRef(false);

  // Initial header state
  const initialState: HeaderState = {
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
    gradientStartColor: "#000000",
    gradientEndColor: "#4f46e5",
    isGradient: false,
    textColor: "#ffffff",
  };

  // Use the history hook
  const {
    state: headerState,
    addState,
    debouncedAddState,
    undo,
    redo,
    canUndo,
    canRedo,
    applyExternalState,
  } = useHistory<HeaderState>(initialState, {
    onStateChange, // Pass through to parent if provided
    debounceTime: 300,
    exposeToWindow: { key: "bananaHeaderEditor" },
  });

  // Wait for external state application before signaling we're initialized
  useEffect(() => {
    // Mark as initialized after a small delay
    // This prevents the initialState from overriding loaded state
    const timer = setTimeout(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        
        // Only call onStateChange with current state if we haven't been initialized with external state
        if (onStateChange && JSON.stringify(headerState) === JSON.stringify(initialState)) {
          onStateChange(headerState);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [headerState, initialState, onStateChange]);

  // Destructure current state values from headerState
  const {
    layout: headerLayout,
    height: headerHeight,
    linkSpacing,
    elementSpacing,
    enabledElements,
    gradientStartColor: headerStartColor,
    gradientEndColor: headerEndColor,
    isGradient,
    textColor: headerTextColor,
  } = headerState;

  // Header background opacity (not in history)
  const [headerBgOpacity, setHeaderBgOpacity] = useState(`bg-opacity-100`);

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
      addState({
        ...headerState,
        enabledElements: elements,
      });
    }
  };

  const handleLayoutChange = (layout: HeaderLayout) => {
    // Only update if the layout has actually changed
    if (layout !== headerLayout) {
      addState({
        ...headerState,
        layout,
      });
    }
  };

  const handleHeightChange = (height: number) => {
    // For continuous slider changes, use debounced version
    debouncedAddState({
      ...headerState,
      height,
    });
  };

  const handleHeightChangeComplete = (height: number) => {
    // On slider completion, add immediately to history
    addState({
      ...headerState,
      height,
    });
  };

  const handleLinkSpacingChange = (spacing: number) => {
    debouncedAddState({
      ...headerState,
      linkSpacing: spacing,
    });
  };

  const handleLinkSpacingChangeComplete = (spacing: number) => {
    addState({
      ...headerState,
      linkSpacing: spacing,
    });
  };

  const handleElementSpacingChange = (spacing: number) => {
    debouncedAddState({
      ...headerState,
      elementSpacing: spacing,
    });
  };

  const handleElementSpacingChangeComplete = (spacing: number) => {
    addState({
      ...headerState,
      elementSpacing: spacing,
    });
  };

  const handleBackgroundColorChange = (color: string) => {
    if (color.startsWith("gradient:")) {
      const parts = color.split(":");
      if (parts.length === 3) {
        const startColor = parts[1];
        const endColor = parts[2];

        addState({
          ...headerState,
          gradientStartColor: startColor,
          gradientEndColor: endColor,
          isGradient: true,
        });
      }
    } else if (color === "adaptive") {
      addState({
        ...headerState,
        gradientStartColor: "#f8fafc",
        isGradient: false,
      });
    } else {
      addState({
        ...headerState,
        gradientStartColor: color,
        isGradient: false,
      });
    }
  };

  const handleTextColorChange = (color: string) => {
    addState({
      ...headerState,
      textColor: color,
    });
  };

  const handleBackgroundTypeChange = (
    type: "solid" | "gradient" | "adaptive",
  ) => {
    if (type === "solid") {
      addState({
        ...headerState,
        isGradient: false,
      });
    } else if (type === "gradient") {
      addState({
        ...headerState,
        isGradient: true,
      });
    }
  };

  const handleOpacityChange = (opacity: number) => {
    // Not stored in history for now
  };

  const handleBlurBackgroundChange = (blur: boolean) => {
    // Not stored in history for now
  };

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in edit mode
      if (!isEditing) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd+Z or Ctrl+Z
      if (cmdOrCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y
      if (
        (cmdOrCtrl && e.key === "z" && e.shiftKey) ||
        (cmdOrCtrl && e.key === "y")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, undo, redo]);

  // Add keyframes for the fade-in animation
  useEffect(() => {
    // Insert the keyframes for the fadeIn animation
    const styleSheet = document.createElement("style");
    styleSheet.id = "banana-header-editor-styles";
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      // Clean up the style element when component unmounts
      const styleElement = document.getElementById(
        "banana-header-editor-styles",
      );
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  return (
    <div className="relative bg-white" onClick={() => {if (isFullscreen){setIsEditing(true)}}}>
      {/* Header Container with hover detection */}
      <div
        className={`relative ${isEditing ? "z-40" : "z-10"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Create a double highlight effect - an outer highlight container + inner ring */}
        <div
          className={`
          ${
            isEditing
              ? "rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 p-[4px] shadow-lg"
              : isHovered
                ? "rounded-md bg-indigo-200 p-[2px] shadow-md"
                : "p-0"
          } 
          relative transition-all duration-200
          ease-in-out
        `}
        >
          {/* Editing indicator label */}
          {isEditing && (
            <div className="absolute -top-6 right-2 z-50 rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-md">
              Editing Header
            </div>
          )}
          <div
            className={`
            relative overflow-hidden rounded-sm
          `}
          >
            {/* Actual Header Content */}
            <div
              className={`${
                isEditing
                  ? "ring-2 ring-indigo-500 ring-offset-2"
                  : isHovered
                    ? "ring-1 ring-indigo-300 ring-offset-1"
                    : ""
              } transition-all`}
            >
              <BananaHeader
                isEditing={isEditing}
                enabledElements={enabledElements}
                layout={headerLayout}
                height={headerHeight}
                linkSpacing={linkSpacing}
                elementSpacing={elementSpacing}
                bgColor={headerStartColor}
                gradientEndColor={isGradient ? headerEndColor : undefined}
                isGradient={isGradient}
                bgOpacity={headerBgOpacity}
                textColor={headerTextColor || "#ffffff"}
              />
            </div>
          </div>
        </div>

        {/* Edit Overlay */}
        {isFullscreen && (isHovered || isEditing) && (
          <HeaderEditMenu
            isEditing={isEditing}
            onEditClick={() => setIsEditing(true)}
            isHovered={isHovered}
            onElementClick={() => handleMenuClick("element")}
            onDesignClick={() => handleMenuClick("design")}
            activeMenu={activeMenu}
          />
        )}
      </div>

      {/* Edit Mode UI */}
      {isEditing && (
        <>
          {/* Page dimming overlay */}
          <div
            className="animate-in fade-in fixed inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
            style={{
              zIndex: 20,
              animation: "fadeIn 0.3s ease-out",
              top: "48px", // Start below the top toolbar
            }}
            onClick={(e) => {
              e.stopPropagation(); // Stop event from reaching parent container
              handleExitEdit();
            }}
          />

          {/* Toolbars */}
          {activeMenu === "element" && (
            <div className="absolute left-4 top-full z-40 mt-3">
              <div className="relative">
                <ElementToolbar
                  onClose={() => handleMenuClick("none")}
                  onElementsChange={handleElementToggle}
                  initialElements={enabledElements}
                />
              </div>
            </div>
          )}
          {activeMenu === "design" && (
            <div className="absolute right-4 top-full z-40 mt-3">
              <div className="relative">
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
                  initialGradientStartColor={headerStartColor}
                  initialGradientEndColor={headerEndColor || "#4f46e5"}
                  initialTextColor={headerTextColor}
                  initialBackgroundType={isGradient ? "gradient" : "solid"}
                  initialOpacity={100}
                  initialBlurBackground={false}
                  onGradientStartColorChange={handleBackgroundColorChange}
                  onGradientEndColorChange={handleBackgroundColorChange}
                  onTextColorChange={handleTextColorChange}
                  onBackgroundTypeChange={handleBackgroundTypeChange}
                  onOpacityChange={handleOpacityChange}
                  onBlurBackgroundChange={handleBlurBackgroundChange}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
