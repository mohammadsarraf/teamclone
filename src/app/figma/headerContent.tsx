import { useState } from "react";
import { HiOutlineDesktopComputer, HiPlus } from "react-icons/hi";
import { MdOutlineStyle } from "react-icons/md";
import { layouts } from "./class";
import ElementToolbar from "./elementMenu";
import Toolbar from "./Toolbar";

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
  const [elements, setElements] = useState<HeaderElements>({
    isButton: false,
    isSocial: false,
    isCart: false,
    isAccount: false,
  });
  const [headerHeight, setHeaderHeight] = useState(80);

  // Add state for saving/canceling changes
  const [savedState, setSavedState] = useState({
    elements,
    headerHeight,
  });

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
    const minHeight = 60;
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
    setSavedState({
      elements,
      headerHeight,
    });
    setIsHeaderEditing(false);
    setIsDesignMenuVisible(false);
    setIsElementMenuVisible(false);
  };

  const handleCancelEditing = () => {
    setElements(savedState.elements);
    setHeaderHeight(savedState.headerHeight);
    setIsHeaderEditing(false);
    setIsDesignMenuVisible(false);
    setIsElementMenuVisible(false);
  };

  return (
    <div className="relative">
      {/* Header Content */}
      <header
        className={`relative flex items-center justify-between ${bgColor} px-6 transition-all duration-300`}
        style={{ height: `${headerHeight}px` }}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        {layouts[selectedLayout](elements)}

        {/* Edit Overlay */}
        {isHeaderHovered && !isHeaderEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
              onClick={handleStartEditing}
            >
              <MdOutlineStyle className="text-lg" />
              Edit Header
            </button>
          </div>
        )}
      </header>

      {/* Edit Tools */}
      {isHeaderEditing && (
        <div className="absolute inset-x-0 -bottom-16 flex items-center justify-center gap-4">
          {/* Design Menu Button */}
          <button
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-all
              ${
                isDesignMenuVisible
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              }`}
            onClick={() => {
              setIsDesignMenuVisible(!isDesignMenuVisible);
              setIsElementMenuVisible(false);
            }}
          >
            <HiOutlineDesktopComputer className="text-lg" />
            Design
          </button>

          {/* Elements Menu Button */}
          <button
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-lg transition-all
              ${
                isElementMenuVisible
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              }`}
            onClick={() => {
              setIsElementMenuVisible(!isElementMenuVisible);
              setIsDesignMenuVisible(false);
            }}
          >
            <HiPlus className="text-lg" />
            Add Elements
          </button>

          {/* Save/Cancel Buttons */}
          <div className="ml-4 flex gap-2">
            <button
              onClick={handleCancelEditing}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Design Menu */}
      {isDesignMenuVisible && (
        <div className="absolute right-0 top-full z-50 mt-4 w-80">
          <div className="rounded-lg bg-white shadow-xl">
            <Toolbar
              onOptionChange={handleLayoutSelection}
              onBgColorChange={handleColorChange}
              onHeightChange={handleHeightChange}
              initialHeight={(headerHeight - 60) / (140 / 9) + 1}
              onClose={() => setIsDesignMenuVisible(false)}
              initialLayoutOption={selectedLayout}
            />
          </div>
        </div>
      )}

      {/* Elements Menu */}
      {isElementMenuVisible && (
        <div className="absolute right-0 top-full z-50 mt-4 w-80">
          <div className="rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-medium text-gray-900">
                Add Elements
              </h3>
              <button
                onClick={() => setIsElementMenuVisible(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            {/* <ElementToolbar
              elements={elements}
              onElementChange={handleElementChange}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
}
