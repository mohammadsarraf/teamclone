import { useState, useEffect, useRef } from "react";
import { HiOutlineDesktopComputer, HiPlus } from "react-icons/hi";
import { MdOutlineStyle } from "react-icons/md";
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
  const [elements, setElements] = useState<HeaderElements>(DEFAULT_HEADER_STATE.elements);
  const [headerHeight, setHeaderHeight] = useState(DEFAULT_HEADER_STATE.headerHeight);
  const [savedState, setSavedState] = useState({
    elements,
    headerHeight,
  });

  // Add new states for hover effects
  const [showOptions, setShowOptions] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  // Load saved state on component mount
  useEffect(() => {
    const savedHeader = localStorage.getItem("headerState");
    if (savedHeader) {
      const parsedState = JSON.parse(savedHeader) as HeaderState;
      setElements(parsedState.elements);
      setHeaderHeight(parsedState.headerHeight || DEFAULT_HEADER_STATE.headerHeight);
      handleLayoutSelection(parsedState.selectedLayout);
      handleColorChange(parsedState.bgColor);
    }
  }, []);

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
    return ((headerHeight - 100) / (100)) * 9 + 1;
  };

  return (
    <div className="relative">
      {/* Header Container */}
      <div
        className={`relative flex items-center justify-between transition-all duration-300 ${bgColor}`}
        style={{ height: `${Math.max(headerHeight, 100)}px` }}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        {/* Main header content */}
        <div className="relative flex w-full items-center justify-between px-6">
          {layouts[selectedLayout]({
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
              isHeaderHovered ? 'opacity-100' : 'opacity-0'
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
        <div 
          className="absolute left-1/2 -translate-x-1/2 transform z-[1001]"
          style={{ top: `${Math.max(headerHeight, 100)}px` }}
        >
          <div className="relative bottom-0 flex items-center gap-2 rounded-md bg-white px-2 py-1.5 shadow-lg">
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
              className="flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Menu Overlay - Added this new section */}
      {(isDesignMenuVisible || isElementMenuVisible) && (
        <div className="fixed inset-0 z-[1999] bg-transparent" onClick={() => {
          setIsDesignMenuVisible(false);
          setIsElementMenuVisible(false);
        }} />
      )}

      {/* Design Menu */}
      {isDesignMenuVisible && (
        <div 
          ref={menuRef}
          className="absolute inset-x-0 top-full z-[2000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex w-full justify-end">
            <div className="w-80 mr-1">
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
        </div>
      )}

      {/* Elements Menu */}
      {isElementMenuVisible && (
        <div 
          ref={menuRef}
          className="absolute inset-x-0 top-full z-[2000]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex w-full justify-start">
            <div className="w-80 ml-1">
              <div className="flex flex-col rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-4">
                  <h3 className="font-medium text-black">Add Elements</h3>
                  <button
                    onClick={() => setIsElementMenuVisible(false)}
                    className="rounded p-1 hover:bg-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
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
        </div>
      )}
    </div>
  );
}
