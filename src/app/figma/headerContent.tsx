import { MdDragHandle } from "react-icons/md";
import Toolbar from "./Toolbar";
import { layouts } from "./class";
import { useState } from "react";
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
  const [headerHeight, setHeaderHeight] = useState(3); // Initial height of the header
  const [isResizing, setIsResizing] = useState(false);

  const [isButton, setIsButton] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [isCart, setIsCart] = useState(false);
  const [isAccount, setIsAccount] = useState(false);


  return (
    <>
      <header
        className={`relative flex items-center justify-between ${bgColor} p-4 text-white shadow-md hover:bg-opacity-70 ${isHeaderHovered ? "bg-gray-700" : ""}`}
        style={{ height: `${headerHeight}vw` }}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        {layouts[selectedLayout]({
          isButton,
          isSocial,
          isCart,
          isAccount,
        })}
        {isHeaderHovered && !isHeaderEditing && (
          <button
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-blue-500 px-2 py-1 text-white"
            onClick={() => setIsHeaderEditing(true)}
          >
            Edit Header
          </button>
        )}
        {isHeaderEditing && (
          <MdDragHandle
            className="absolute -bottom-2 right-0 cursor-row-resize bg-gray-700"
            size={24}
          />
        )}
      </header>
      {isHeaderEditing && (
        <div className="my-10 flex justify-between">
          <button
            className="mx-10 rounded bg-white px-2 py-1 text-black"
            onClick={() => setIsElementMenuVisible(!isElementMenuVisible)}
          >
            Add Element
            {isElementMenuVisible && (
              <div
                className="relative z-20 bg-gray-300 text-black"
                onClick={(e) => e.stopPropagation()} // Prevent click events from propagating
              >
                <div
                  className={`absolute left-0  mt-2 flex w-80 flex-col  rounded-lg bg-white p-4 shadow-lg`}
                >
                  <p className=" mb-4 border-b py-2 text-left">
                    Add Elements
                  </p>
                  <div className="relative z-20">

                  <ElementToolbar
                    setIsButton={setIsButton}
                    setIsSocial={setIsSocial}
                    setIsCart={setIsCart}
                    setIsAccount={setIsAccount}
                  />
                  </div>
                </div>
              </div>
            )}
          </button>
          <div className="relative mx-10">
            <button
              className="rounded bg-white px-2 py-1 text-black"
              onClick={() => setIsDesignMenuVisible(!isDesignMenuVisible)}
            >
              Edit Design
            </button>
            {isDesignMenuVisible && (
              <div className="relative z-20">
                <Toolbar
                  onOptionChange={handleLayoutSelection}
                  initialHeight={headerHeight}
                  onHeightChange={setHeaderHeight}
                  onBgColorChange={handleColorChange} // Updates `bgColor`
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
