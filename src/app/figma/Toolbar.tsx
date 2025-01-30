import { useState, useEffect } from "react";
import ColorMenu from "./colorMenu";
import DesignMenu from "./desginMenu";
import { handleColorChange } from "../utils/textHandlers";

interface ToolbarProps {
  onOptionChange: (option: string) => void;
  initialLayoutOption?: string;
  initialLinkSpacing?: number;
  initialElementSpacing?: number;
  initialHeight?: number;
  initialWidth?: string;
  onHeightChange: (height: number) => void;
  onBgColorChange: (color: string) => void;
  onbgColorChange?: (color: string) => void;
  onClose: () => void;
}

export default function Toolbar({
  onOptionChange,
  initialLayoutOption = "Option 1",
  initialLinkSpacing = 0,
  initialElementSpacing = 0,
  initialHeight = 0,
  initialWidth = "full",
  onHeightChange,
  onBgColorChange,
  onClose,
}: ToolbarProps) {
  const [activeMenu, setActiveMenu] = useState("design");
  const [layoutOption, setLayoutOption] = useState(initialLayoutOption);
  const [showDropdown, setShowDropdown] = useState(false);
  const [linkSpacing, setLinkSpacing] = useState(initialLinkSpacing);
  const [elementSpacing, setElementSpacing] = useState(initialElementSpacing);
  const [height, setHeight] = useState(initialHeight);
  const [width, setWidth] = useState(initialWidth);
  const [bgColor, setBgColor] = useState("bg-black");

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
      <div className="mb-4 flex items-center justify-between border-b border-gray-300 p-3">
        <div className="flex gap-4 text-black">
          <button
            className={`px-4 py-2 ${activeMenu === "design" ? "border-b-2 border-blue-400" : ""}`}
            onClick={() => setActiveMenu("design")}
          >
            Design
          </button>
          <button
            className={`px-4 py-2 ${activeMenu === "color" ? "border-b-2 border-blue-400" : ""}`}
            onClick={() => setActiveMenu("color")}
          >
            Color
          </button>
        </div>
        <button
          onClick={onClose}
          className="text-xl text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="h-[400px] overflow-y-auto pr-2">
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
        {activeMenu === "color" && (
          <ColorMenu
            onColorChange={(color: string) => {
              setBgColor(color);
              onBgColorChange(color);
            }}
          />
        )}
      </div>

      {showDropdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-2xl rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-medium">Choose Layout</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {layoutOptions.map((option) => (
                <button
                  key={option.name}
                  className={`flex cursor-pointer flex-col gap-2 rounded-lg p-4 hover:bg-gray-100 
                    ${layoutOption === option.name ? "bg-blue-50 ring-2 ring-blue-500" : ""}`}
                  onClick={() => {
                    setLayoutOption(option.name);
                    setShowDropdown(false);
                    onOptionChange(option.name);
                  }}
                >
                  {option.layout}
                  <span className="text-sm text-gray-600">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
