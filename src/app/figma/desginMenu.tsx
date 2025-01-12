import { useState } from "react";

export default function DesignMenu() {
  const [activeMenu, setActiveMenu] = useState("design");
  const [layoutOption, setLayoutOption] = useState("Option 1");
  const [showDropdown, setShowDropdown] = useState(false);
  const [linkSpacing, setLinkSpacing] = useState(0);
  const [elementSpacing, setElementSpacing] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState("full");

  const layoutOptions = [
    {
      name: "Option 1",
      layout: (
        <div className="flex h-20 items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600 w-full">
          <div className="flex w-full items-center">
            <p className="text-white">Logo</p>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex gap-1">
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <div className="h-2 w-2 bg-white rounded-full"></div>
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="h-4 w-8 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Option 2",
      layout: (
        <div className="flex h-20 items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600 w-full">
          <div className="flex w-full items-center">
            <div className="flex gap-1">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <p className="text-white ml-2">Logo</p>
            <div className="ml-auto">
              <div className="h-4 w-8 bg-white rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Option 3",
      layout: (
        <div className="flex h-20 items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600 w-full">
          <div className="flex w-full items-center">
            <p className="text-white">Logo</p>
            <div className="flex gap-1 mx-auto">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <div className="ml-auto">
              <div className="h-4 w-8 bg-white rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Option 4",
      layout: (
        <div className="flex h-20 items-center rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600 w-full">
          <div className="flex w-full items-center">
            <div className="flex gap-1">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <div className="h-2 w-2 bg-white rounded-full"></div>
            </div>
            <p className="text-white mx-auto">Logo</p>
            <div className="ml-auto">
              <div className="h-4 w-8 bg-white rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative">
      <div className="absolute right-0 top-full mt-2 w-80 h-96 rounded-lg bg-white p-4 shadow-lg overflow-auto">
        <div className="mb-4 flex gap-4 border-b border-gray-300 pb-2 text-black">
          <button
            className={`rounded px-4 py-2 ${activeMenu === "design" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setActiveMenu("design")}
          >
            Design
          </button>
          <button
            className={`rounded px-4 py-2 ${activeMenu === "color" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
            onClick={() => setActiveMenu("color")}
          >
            Color
          </button>
        </div>
        {activeMenu === "design" && (
          <ul className="flex flex-col gap-2 text-black">
            <div className="mb-4 pb-2 border-b">
              Layout
              <li className="relative cursor-pointer rounded px-4 py-2 mt-2">
                <div
                  className="flex h-20 items-center justify-between rounded-lg bg-gray-800 p-2 text-white hover:bg-gray-600"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {layoutOptions.find(option => option.name === layoutOption)?.layout}
                </div>
              </li>
            </div>
            <div className="mb-4 pb-2 border-b">
              Spacing
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Link Spacing</label>
                  <span className="text-sm font-medium text-gray-700">{linkSpacing} vw</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.01"
                  value={linkSpacing}
                  onChange={(e) => setLinkSpacing(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, black ${linkSpacing * 20}%, #e5e7eb ${linkSpacing * 20}%)`
                  }}
                />
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Element Spacing</label>
                  <span className="text-sm font-medium text-gray-700">{elementSpacing} vw</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.01"
                  value={elementSpacing}
                  onChange={(e) => setElementSpacing(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, black ${elementSpacing * 10}%, #e5e7eb ${elementSpacing * 10}%)`
                  }}
                />
              </div>
            </div>
            <div className="mb-4 pb-2 border-b">
              Effect
              <ul className="mt-2 flex flex-col gap-2 text-black">
                <li className="flex justify-between items-center cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
                  Drop Shadows
                  <span className="text-gray-500">→</span>
                </li>
                <li className="flex justify-between items-center cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
                  Border
                  <span className="text-gray-500">→</span>
                </li>
                <li className="flex justify-between items-center cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
                  Fixed Position
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:bg-blue-600"></div>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-full peer-checked:border-white"></span>
                  </label>
                </li>
              </ul>
            </div>
            <div className="mb-4 pb-2 border-b">
              Size
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  <span className="text-sm font-medium text-gray-700">{height} vw</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.01"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, black ${height * 10}%, #e5e7eb ${height * 10}%)`
                  }}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Width</label>
                <div className="flex justify-between items-center mt-2">
                  <button
                    className={`px-4 py-2 rounded w-1/2 ${width === "full" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    onClick={() => setWidth("full")}
                  >
                    Full
                  </button>
                  <button
                    className={`px-4 py-2 rounded w-1/2 ${width === "inset" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    onClick={() => setWidth("inset")}
                  >
                    Inset
                  </button>
                </div>
              </div>
            </div>
          </ul>
        )}
        {activeMenu === "color" && (
          <ul className="flex flex-col gap-2">
            <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
              Color Option 1
            </li>
            <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
              Color Option 2
            </li>
            <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
              Color Option 3
            </li>
          </ul>
        )}
      </div>
      {showDropdown && (
        <ul className="absolute right-0 mt-2 w-80 rounded bg-white shadow-md z-10" style={{ top: 'calc(100% + 8px)' }}>
          {layoutOptions.map((option) => (
            <li
              key={option.name}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-200"
              onClick={() => {
                setLayoutOption(option.name);
                setShowDropdown(false);
              }}
            >
              {option.layout}
              {layoutOption === option.name && (
                <span className="ml-2 text-green-500">✔</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
