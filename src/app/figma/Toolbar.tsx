import { useState, useEffect } from "react";
import ColorMenu from "./colorMenu";
import DesignMenu from "./desginMenu";

interface ToolbarProps {
  onOptionChange: (option: string) => void;
  initialLayoutOption?: string;
  initialLinkSpacing?: number;
  initialElementSpacing?: number;
  initialHeight?: number;
  initialWidth?: string;
  onHeightChange: (height: number) => void;
}

export default function Toolbar({
  onOptionChange,
  initialLayoutOption = "Option 1",
  initialLinkSpacing = 0,
  initialElementSpacing = 0,
  initialHeight = 0,
  initialWidth = "full",
  onHeightChange,
}: ToolbarProps) {
  const [activeMenu, setActiveMenu] = useState("design");
  const [layoutOption, setLayoutOption] = useState(initialLayoutOption);
  const [showDropdown, setShowDropdown] = useState(false);
  const [linkSpacing, setLinkSpacing] = useState(initialLinkSpacing);
  const [elementSpacing, setElementSpacing] = useState(initialElementSpacing);
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    setLayoutOption(initialLayoutOption);
  }, [initialLayoutOption]);

  useEffect(() => {
    setLinkSpacing(initialLinkSpacing);
  }, [initialLinkSpacing]);

  useEffect(() => {
    setElementSpacing(initialElementSpacing);
  }, [initialElementSpacing]);

  useEffect(() => {
    setWidth(initialWidth);
  }, [initialWidth]);

  useEffect(() => {
    onHeightChange(height);
  }, [height]);

  const layoutOptions = [
    {
      name: "Option 1",
      layout: (
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600">
          <div className="flex w-full items-center">
            <p className="text-white">Logo</p>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex gap-1">
                <div className="size-2 rounded-full bg-white"></div>
                <div className="size-2 rounded-full bg-white"></div>
                <div className="size-2 rounded-full bg-white"></div>
              </div>
              <div>
                <div className="h-4 w-8 rounded bg-white"></div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Option 2",
      layout: (
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600">
          <div className="flex w-full items-center">
            <div className="flex gap-1">
              <div className="size-2 rounded-full bg-white"></div>
              <div className="size-2 rounded-full bg-white"></div>
              <div className="size-2 rounded-full bg-white"></div>
            </div>
            <p className="ml-2 text-white">Logo</p>
            <div className="ml-auto">
              <div className="h-4 w-8 rounded bg-white"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Option 3",
      layout: (
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600">
          <div className="flex w-full items-center">
            <p className="text-white">Logo</p>
            <div className="mx-auto flex gap-1">
              <div className="size-2 rounded-full bg-white"></div>
              <div className="size-2 rounded-full bg-white"></div>
              <div className="size-2 rounded-full bg-white"></div>
            </div>
            <div className="ml-auto">
              <div className="h-4 w-8 rounded bg-white"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Option 4",
      layout: (
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600">
          <div className="flex w-full items-center">
            <div className="flex gap-1">
              <div className="size-2 rounded-full bg-white"></div>
              <div className="size-2 rounded-full bg-white"></div>
              <div className="size-2 rounded-full bg-white"></div>
            </div>
            <p className="mx-auto text-white">Logo</p>
            <div className="ml-auto">
              <div className="h-4 w-8 rounded bg-white"></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative flex h-full flex-col">
      <div className="absolute right-0 top-full mt-2 flex h-96 w-80 flex-col  rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-4 flex gap-4 border-b border-gray-300 text-black">
          <button
            className={` px-4 py-2  ${activeMenu === "design" ? "border-b-2 border-blue-400" : ""}`}
            onClick={() => setActiveMenu("design")}
          >
            Design
          </button>
          <button
            className={` px-4 py-2 ${activeMenu === "color" ? "border-b-2 border-blue-400" : ""}`}
            onClick={() => setActiveMenu("color")}
          >
            Color
          </button>
        </div>
        {activeMenu === "design" && (
          <DesignMenu
            onOptionChange={onOptionChange}
            initialLayoutOption={initialLayoutOption}
            initialLinkSpacing={initialLinkSpacing}
            initialElementSpacing={initialElementSpacing}
            initialHeight={initialHeight}
            initialWidth={initialWidth}
            onHeightChange={onHeightChange}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        )}
        {activeMenu === "color" && <ColorMenu />}
      </div>
      {showDropdown && (
        <ul
          className="absolute right-0 z-10 mt-2 w-80 rounded bg-white shadow-md"
          style={{ top: "calc(100% + 8px)" }}
        >
          {layoutOptions.map((option) => (
            <li
              key={option.name}
              className={`flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-200 ${layoutOption === option.name ? "bg-gray-300" : ""}`}
              onClick={() => {
                setLayoutOption(option.name);
                setShowDropdown(false);
                onOptionChange(option.name); // Call the callback function
              }}
            >
              {option.layout}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
