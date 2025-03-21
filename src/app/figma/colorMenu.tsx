import { useState } from "react";
import { HiChevronDown, HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";

interface ColorMenuProps {
  onColorChange: (color: string) => void;
  currentColor?: string;
}

export default function ColorMenu({
  onColorChange,
  currentColor = "bg-black",
}: ColorMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"solid" | "gradient" | "image">(
    "solid",
  );

  const solidColors = [
    { name: "White", value: "bg-white", textColor: "text-gray-900" },
    { name: "Light Gray", value: "bg-gray-100", textColor: "text-gray-900" },
    { name: "Gray", value: "bg-gray-500", textColor: "text-white" },
    { name: "Dark Gray", value: "bg-gray-800", textColor: "text-white" },
    { name: "Black", value: "bg-black", textColor: "text-white" },
    { name: "Blue", value: "bg-blue-600", textColor: "text-white" },
    { name: "Red", value: "bg-red-600", textColor: "text-white" },
    { name: "Green", value: "bg-green-600", textColor: "text-white" },
    { name: "Yellow", value: "bg-yellow-400", textColor: "text-gray-900" },
    { name: "Purple", value: "bg-purple-600", textColor: "text-white" },
    { name: "Pink", value: "bg-pink-600", textColor: "text-white" },
    { name: "Orange", value: "bg-orange-500", textColor: "text-white" },
  ];

  const gradients = [
    { name: "Sunset", value: "bg-gradient-to-r from-orange-500 to-pink-500" },
    { name: "Ocean", value: "bg-gradient-to-r from-blue-500 to-teal-500" },
    { name: "Forest", value: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { name: "Night", value: "bg-gradient-to-r from-gray-900 to-gray-600" },
    { name: "Dawn", value: "bg-gradient-to-r from-rose-400 to-orange-300" },
    { name: "Twilight", value: "bg-gradient-to-r from-purple-600 to-blue-500" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <div className={`size-4 rounded ${currentColor}`} />
          <span>Background Color</span>
        </div>
        <HiChevronDown
          className={`transition-transform${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          {/* Color Type Tabs */}
          <div className="mb-3 flex gap-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => setActiveTab("solid")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${
                activeTab === "solid"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HiOutlineColorSwatch className="text-lg" />
              Solid
            </button>
            <button
              onClick={() => setActiveTab("gradient")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${
                activeTab === "gradient"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <IoColorPaletteOutline className="text-lg" />
              Gradient
            </button>
            <button
              onClick={() => setActiveTab("image")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm ${
                activeTab === "image"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <RxTransparencyGrid className="text-lg" />
              Image
            </button>
          </div>

          {/* Color Grid */}
          {activeTab === "solid" && (
            <div className="grid grid-cols-4 gap-2">
              {solidColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    onColorChange(color.value);
                    setIsOpen(false);
                  }}
                  className={`group relative h-14 w-full rounded-md ${color.value} hover:ring-2 hover:ring-blue-500 hover:ring-offset-2`}
                >
                  <span
                    className={`absolute bottom-1 left-1 text-xs font-medium ${color.textColor} opacity-0 group-hover:opacity-100`}
                  >
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Gradient Grid */}
          {activeTab === "gradient" && (
            <div className="grid grid-cols-2 gap-2">
              {gradients.map((gradient) => (
                <button
                  key={gradient.value}
                  onClick={() => {
                    onColorChange(gradient.value);
                    setIsOpen(false);
                  }}
                  className={`group relative h-20 w-full rounded-md ${gradient.value} hover:ring-2 hover:ring-blue-500 hover:ring-offset-2`}
                >
                  <span className="absolute bottom-1 left-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100">
                    {gradient.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Image Upload Section */}
          {activeTab === "image" && (
            <div className="flex flex-col items-center gap-2 p-4">
              <RxTransparencyGrid className="text-4xl text-gray-400" />
              <p className="text-sm text-gray-600">
                Coming soon: Upload an image to use as background
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
