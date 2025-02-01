import { useEffect, useState } from "react";

interface DesginMenuProps {
  onOptionChange: (option: string) => void;
  initialLayoutOption?: string;
  initialLinkSpacing?: number;
  initialElementSpacing?: number;
  initialHeight?: number;
  initialWidth?: string;
  onHeightChange: (height: number) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

export default function DesignMenu({
  onOptionChange,
  initialLayoutOption = "Option 1",
  initialLinkSpacing = 0,
  initialElementSpacing = 0,
  initialHeight = 0,
  initialWidth = "full",
  onHeightChange,
  showDropdown,
  setShowDropdown,
}: DesginMenuProps) {
  const [activeMenu, setActiveMenu] = useState("design");
  const [layoutOption, setLayoutOption] = useState(initialLayoutOption);
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
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white ">
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
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white ">
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
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white ">
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
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-800 p-2 text-white ">
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
    <ul className="flex grow flex-col gap-2 overflow-auto px-4 text-black">
      <div className="mb-4 border-b pb-2">
        Layout
        <li className="relative mt-2 cursor-pointer rounded bg-gray-100 px-4 py-2">
          <div
            className="flex h-20 items-center justify-between rounded-lg bg-gray-800 p-2 text-white "
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {
              layoutOptions.find((option) => option.name === layoutOption)
                ?.layout
            }
          </div>
        </li>
      </div>
      <div className="mb-4 border-b pb-2">
        Spacing
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Link Spacing
            </label>
            <span className="text-sm font-medium text-gray-700">
              {linkSpacing} vw
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.01"
            value={linkSpacing}
            onChange={(e) => setLinkSpacing(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            style={{
              background: `linear-gradient(to right, black ${Number(linkSpacing) * 20}%, #e5e7eb ${Number(linkSpacing) * 20}%)`,
            }}
          />
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Element Spacing
            </label>
            <span className="text-sm font-medium text-gray-700">
              {elementSpacing} vw
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.01"
            value={elementSpacing}
            onChange={(e) => setElementSpacing(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            style={{
              background: `linear-gradient(to right, black ${Number(elementSpacing) * 10}%, #e5e7eb ${Number(elementSpacing) * 10}%)`,
            }}
          />
        </div>
      </div>
      <div className="mb-4 border-b pb-2">
        Effect
        <ul className="mt-2 flex flex-col gap-2 text-black">
          <li className="flex cursor-pointer items-center justify-between rounded px-4 py-2 hover:bg-gray-100">
            Drop Shadows
            <span className="text-gray-500">→</span>
          </li>
          <li className="flex cursor-pointer items-center justify-between rounded px-4 py-2 hover:bg-gray-100">
            Border
            <span className="text-gray-500">→</span>
          </li>
          <li className="flex cursor-pointer items-center justify-between rounded px-4 py-2 hover:bg-gray-100">
            Fixed Position
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              <span className="absolute left-1 top-1 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-full peer-checked:border-white"></span>
            </label>
          </li>
        </ul>
      </div>
      <div className="mb-4 border-b pb-2">
        Size
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <span className="text-sm font-medium text-gray-700">
              {height.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            value={height}
            onChange={(e) => {
              const newHeight = Number(e.target.value);
              setHeight(newHeight);
              onHeightChange(newHeight);
            }}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            style={{
              background: `linear-gradient(to right, black ${((height - 1) / 9) * 100}%, #e5e7eb ${((height - 1) / 9) * 100}%)`,
            }}
          />
        </div>
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700">
            Width
          </label>
          <div className="mt-2 flex items-center justify-between">
            <button
              className={`w-1/2 rounded px-4 py-2 ${width === "full" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setWidth("full")}
            >
              Full
            </button>
            <button
              className={`w-1/2 rounded px-4 py-2 ${width === "inset" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => setWidth("inset")}
            >
              Inset
            </button>
          </div>
        </div>
      </div>
    </ul>
  );
}
