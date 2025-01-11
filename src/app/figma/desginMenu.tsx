import { useState } from "react";

export default function DesignMenu() {
  const [activeMenu, setActiveMenu] = useState("design");
  const [layoutOption, setLayoutOption] = useState("Option 1");
  const [showDropdown, setShowDropdown] = useState(false);

  const layoutOptions = [
    { name: "Option 1", layout: <div className="flex items-center gap-1"><div className="flex gap-1"><div className="bg-white w-2 h-2"></div><div className="bg-white w-2 h-2"></div><div className="bg-white w-2 h-2"></div></div><div className="bg-white w-8 h-4"></div></div> },
    { name: "Option 2", layout: <div className="flex gap-1"><div className="bg-white w-8 h-4"></div><div className="bg-white w-2 h-2"></div><div className="bg-white w-2 h-2"></div><div className="bg-white w-2 h-2"></div></div> },
    { name: "Option 3", layout: <div className="flex gap-1"><div className="bg-white w-2 h-2"></div><div className="bg-white w-8 h-4"></div><div className="bg-white w-2 h-2"></div><div className="bg-white w-2 h-2"></div></div> },
    { name: "Option 4", layout: <div className="flex gap-1"><div className="bg-white w-2 h-2"></div><div className="bg-white w-2 h-2"></div><div className="bg-white w-8 h-4"></div><div className="bg-white w-2 h-2"></div></div> },
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-lg bg-white p-4 shadow-lg">
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
          <li className="relative cursor-pointer rounded px-4 py-2">
            <div className="mb-4">Layout</div>
            <div
              className="hover:bg-gray-200 rounded-lg h-20 flex items-center justify-between p-2 bg-black text-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex items-center gap-2">
                <div className=" text-white px-2 py-1">Logo</div>
              </div>
              <div className="flex items-center gap-1"> {/* layout*/ }
                <div className="flex gap-1">
                  <div className="bg-white w-2 h-2"></div>
                  <div className="bg-white w-2 h-2"></div>
                  <div className="bg-white w-2 h-2"></div>
                </div>
                <div className="bg-white w-8 h-4"></div>
              </div>
            </div>
            {showDropdown && (
              <ul className="absolute left-0 mt-2 w-full rounded bg-white shadow-md">
                {layoutOptions.map((option) => (
                  <li
                    key={option.name}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex items-center gap-2"
                    onClick={() => {
                      setLayoutOption(option.name);
                      setShowDropdown(false);
                    }}
                  >
                    {option.layout}
                  </li>
                ))}
              </ul>
            )}
          </li>
          <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
            Spacing
          </li>
          <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
            Effect
          </li>
          <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
            Size
          </li>
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
  );
}
