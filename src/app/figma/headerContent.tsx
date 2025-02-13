import { useState, useEffect, useRef } from "react";
import { HiOutlineDesktopComputer, HiPlus } from "react-icons/hi";
import { MdOutlineStyle, MdUndo, MdRedo } from "react-icons/md";
import { layouts } from "./class";
import Toolbar from "./Toolbar";
import ElementToolbar from "./elementMenu";

interface HeaderContentProps {
  selectedLayout: string;
  bgColor: string;
  handleColorChange: (color: string) => void;
  handleLayoutSelection: (layout: string) => void;
  isElementMenuVisible: boolean;
  setIsElementMenuVisible: (value: boolean) => void;
  isDesignMenuVisible: boolean;
  setIsDesignMenuVisible: (value: boolean) => void;
}

interface HeaderElements {
  isButton: boolean;
  isSocial: boolean;
  isCart: boolean;
  isAccount: boolean;
}

interface HeaderState {
  elements: HeaderElements;
  headerHeight: number;
  selectedLayout: string;
  bgColor: string;
}

interface HistoryState {
  past: HeaderState[];
  present: HeaderState;
  future: HeaderState[];
}

// First, let's define the default state as a constant at the top of the file
const DEFAULT_HEADER_STATE: HeaderState = {
  elements: {
    isButton: false,
    isSocial: false,
    isCart: false,
    isAccount: false,
  },
  headerHeight: 100,
  selectedLayout: "Option 1",
  bgColor: "bg-black",
};

export default function HeaderContent({
  selectedLayout,
  bgColor,
  handleColorChange,
  handleLayoutSelection,
  isElementMenuVisible,
  setIsElementMenuVisible,
  isDesignMenuVisible,
  setIsDesignMenuVisible,
}: HeaderContentProps) {
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [elements, setElements] = useState<HeaderElements>(
    DEFAULT_HEADER_STATE.elements,
  );
  const [headerHeight, setHeaderHeight] = useState(
    DEFAULT_HEADER_STATE.headerHeight,
  );
  const [savedState, setSavedState] = useState({
    elements,
    headerHeight,
  });

  // Add new states for hover effects
  const [showOptions, setShowOptions] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Add history state
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: {
      elements,
      headerHeight,
      selectedLayout,
      bgColor,
    },
    future: [],
  });

  // Add local state to track layout and color
  const [localLayout, setLocalLayout] = useState(selectedLayout);
  const [localColor, setLocalColor] = useState(bgColor);

  // Update local state when parent props change
  useEffect(() => {
    setLocalLayout(selectedLayout);
    setLocalColor(bgColor);
  }, [selectedLayout, bgColor]);

  // Load saved state on component mount
  useEffect(() => {
    const savedHeader = localStorage.getItem("headerState");
    if (savedHeader) {
      try {
        const parsedState = JSON.parse(savedHeader) as HeaderState;

        // Batch all state updates together
        const batchUpdate = () => {
          setElements(parsedState.elements);
          setHeaderHeight(
            parsedState.headerHeight || DEFAULT_HEADER_STATE.headerHeight,
          );
          // Instead of calling handlers directly, update the local state
          setHistory({
            past: [],
            present: {
              ...parsedState,
              selectedLayout: parsedState.selectedLayout || selectedLayout,
              bgColor: parsedState.bgColor || bgColor,
            },
            future: [],
          });
        };

        // Execute state updates in next tick
        setTimeout(batchUpdate, 0);
      } catch (err) {
        console.error("Error loading header state:", err);
      }
    }
  }, []); // Empty dependency array since we only want this to run once

  // Update history when state changes
  const updateHistory = (newState: HeaderState) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present],
      present: newState,
      future: [],
    }));
  };

  const handleElementChange = (
    elementType: keyof HeaderElements,
    value: boolean,
  ) => {
    setElements((prev) => ({
      ...prev,
      [elementType]: value,
    }));
  };

  const handleHeightChange = (scaleValue: number) => {
    const minHeight = 100;
    const maxHeight = 200;
    const pixelHeight =
      minHeight + ((maxHeight - minHeight) * (scaleValue - 1)) / 9;
    setHeaderHeight(Math.round(pixelHeight));
  };

  const handleStartEditing = () => {
    setSavedState({
      elements,
      headerHeight,
    });
    setIsHeaderEditing(true);
  };

  const handleSaveChanges = () => {
    // Create state object to save
    const headerState: HeaderState = {
      elements,
      headerHeight,
      selectedLayout,
      bgColor,
    };

    // Save to localStorage
    localStorage.setItem("headerState", JSON.stringify(headerState));

    // Update saved state for cancel functionality
    setSavedState({
      elements,
      headerHeight,
    });

    // Close menus
    setIsHeaderEditing(false);
    setIsDesignMenuVisible(false);
    setIsElementMenuVisible(false);
  };

  const handleCancelEditing = () => {
    // Restore the previous saved state
    setElements(savedState.elements);
    setHeaderHeight(savedState.headerHeight);
    setIsHeaderEditing(false);
    setIsDesignMenuVisible(false);
    setIsElementMenuVisible(false);
  };

  const handleResetHeader = () => {
    // Reset all states to default
    setElements(DEFAULT_HEADER_STATE.elements);
    setHeaderHeight(DEFAULT_HEADER_STATE.headerHeight);
    handleLayoutSelection(DEFAULT_HEADER_STATE.selectedLayout);
    handleColorChange(DEFAULT_HEADER_STATE.bgColor);

    // Save default state to localStorage
    localStorage.setItem("headerState", JSON.stringify(DEFAULT_HEADER_STATE));

    // Update saved state
    setSavedState({
      elements: DEFAULT_HEADER_STATE.elements,
      headerHeight: DEFAULT_HEADER_STATE.headerHeight,
    });

    // Close menus
    setIsHeaderEditing(false);
    setIsDesignMenuVisible(false);
    setIsElementMenuVisible(false);
  };

  // Pass the correct initial height to Toolbar
  const calculateInitialHeight = () => {
    // Convert pixel height back to scale value (1-10)
    return ((headerHeight - 100) / 100) * 9 + 1;
  };

  // Update history when state changes
  useEffect(() => {
    const currentState = {
      elements,
      headerHeight,
      selectedLayout,
      bgColor,
    };

    if (JSON.stringify(currentState) !== JSON.stringify(history.present)) {
      updateHistory(currentState);
    }
  }, [elements, headerHeight, selectedLayout, bgColor]);

  // Modify handleUndo
  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;

      const newPast = prev.past.slice(0, -1);
      const newPresent = prev.past[prev.past.length - 1];

      // Update local states instead of calling parent handlers
      setElements(newPresent.elements);
      setHeaderHeight(newPresent.headerHeight);
      setLocalLayout(newPresent.selectedLayout);
      setLocalColor(newPresent.bgColor);

      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  };

  // Modify handleRedo similarly
  const handleRedo = () => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;

      const newFuture = prev.future.slice(1);
      const newPresent = prev.future[0];

      // Update local states instead of calling parent handlers
      setElements(newPresent.elements);
      setHeaderHeight(newPresent.headerHeight);
      setLocalLayout(newPresent.selectedLayout);
      setLocalColor(newPresent.bgColor);

      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  };

  // Add effect to sync local state with parent
  useEffect(() => {
    if (localLayout !== selectedLayout) {
      handleLayoutSelection(localLayout);
    }
    if (localColor !== bgColor) {
      handleColorChange(localColor);
    }
  }, [localLayout, localColor]);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isDesignMenuVisible || isElementMenuVisible) {
          setIsDesignMenuVisible(false);
          setIsElementMenuVisible(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesignMenuVisible, isElementMenuVisible]);

  // Add useEffect to manage body scroll
  useEffect(() => {
    // When either menu is open, prevent body scroll
    if (isDesignMenuVisible || isElementMenuVisible) {
      document.body.style.overflow = "hidden";
    } else {
      // When menus are closed, restore body scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup function to ensure scroll is restored when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDesignMenuVisible, isElementMenuVisible]);

  // First, add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isHeaderEditing) {
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isHeaderEditing]);

  return (
    <div className="relative">
      {/* Header Container */}
      <div
        className={`relative flex items-center justify-between transition-all duration-300 ${localColor}`}
        style={{ height: `${Math.max(headerHeight, 100)}px` }}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        {/* Main header content */}
        <div className="relative flex w-full items-center justify-between px-6">
          {layouts[localLayout]({
            isButton: elements.isButton,
            isSocial: elements.isSocial,
            isCart: elements.isCart,
            isAccount: elements.isAccount,
          })}
        </div>

        {/* Edit Header Button - Shows on hover */}
        {!isHeaderEditing && (
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              isHeaderHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={() => setIsHeaderEditing(true)}
              className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-white"
            >
              <MdOutlineStyle className="text-lg text-blue-600" />
              Edit Header
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions - Only show when editing */}
      {isHeaderEditing && !isDesignMenuVisible && !isElementMenuVisible && (
        <div className="absolute bottom-0 left-1/2 z-[1001] -translate-x-1/2 translate-y-1/2">
          <div className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5 shadow-lg">
            {/* Undo/Redo buttons */}
            <button
              onClick={handleUndo}
              disabled={history.past.length === 0}
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <MdUndo className="text-lg text-blue-600" />
              Undo
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={handleRedo}
              disabled={history.future.length === 0}
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <MdRedo className="text-lg text-blue-600" />
              Redo
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={() => {
                setIsDesignMenuVisible(true);
              }}
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <HiOutlineDesktopComputer className="text-lg text-blue-600" />
              Design Header
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={() => {
                setIsElementMenuVisible(true);
              }}
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <HiPlus className="text-lg text-purple-600" />
              Add Elements
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <button
              onClick={() => {
                handleSaveChanges();
                setIsHeaderEditing(false);
              }}
              className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {(isDesignMenuVisible || isElementMenuVisible) && (
        <div
          className="fixed inset-0 z-[1999] bg-black/20"
          onClick={() => {
            setIsDesignMenuVisible(false);
            setIsElementMenuVisible(false);
          }}
        />
      )}

      {/* Design Menu - Right side */}
      {isDesignMenuVisible && (
        <div
          ref={menuRef}
          className="absolute right-0 z-[2000] max-h-[calc(100vh-var(--header-height))] overflow-y-auto"
          style={
            {
              top: `${Math.max(headerHeight, 100)}px`,
              "--header-height": `${Math.max(headerHeight, 100)}px`,
            } as React.CSSProperties
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mr-1 w-80">
            <div className="flex flex-col rounded-lg bg-white shadow-xl">
              <Toolbar
                onOptionChange={handleLayoutSelection}
                onBgColorChange={handleColorChange}
                onHeightChange={handleHeightChange}
                initialHeight={calculateInitialHeight()}
                onClose={() => {
                  setIsDesignMenuVisible(false);
                }}
                initialLayoutOption={selectedLayout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Elements Menu - Left side */}
      {isElementMenuVisible && (
        <div
          ref={menuRef}
          className="absolute left-0 z-[2000] max-h-[calc(100vh-var(--header-height))] overflow-y-auto"
          style={
            {
              top: `${Math.max(headerHeight, 100)}px`,
              "--header-height": `${Math.max(headerHeight, 100)}px`,
            } as React.CSSProperties
          }
          onClick={(e) => e.stopPropagation()}
        >
          <div className="ml-1 w-80">
            <div className="flex flex-col rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-medium text-black">Add Elements</h3>
                <button
                  onClick={() => setIsElementMenuVisible(false)}
                  className="rounded p-1 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <ElementToolbar
                  elements={elements}
                  onElementChange={handleElementChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
