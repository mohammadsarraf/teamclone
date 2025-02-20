"use client";
import { useState } from "react";
import { HiChevronDown, HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";

interface ColorMenuProps {
  currentColor: string;
}

export default function ColorMenu({ currentColor }: ColorMenuProps) {
  const [showMenu, setShowMenu] = useState(false);

  const colorOptions = [
    { label: "Solid", icon: IoColorPaletteOutline },
    { label: "Gradient", icon: HiOutlineColorSwatch },
    { label: "Transparent", icon: RxTransparencyGrid },
  ];

  const colors = [
    { label: "Black", value: "#000000" },
    { label: "White", value: "#FFFFFF" },
    { label: "Gray", value: "#808080" },
    { label: "Red", value: "#FF0000" },
    { label: "Blue", value: "#0000FF" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex w-full items-center justify-between rounded-md bg-[#404040] px-3 py-2 text-white hover:bg-[#4a4a4a]"
      >
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded" style={{ backgroundColor: currentColor }} />
          <span>Color</span>
        </div>
        <HiChevronDown />
      </button>

      {showMenu && (
        <div className="absolute left-0 right-0 mt-1 rounded-md bg-[#404040] p-2">
          <div className="mb-2 flex flex-col gap-1">
            {colorOptions.map((option) => (
              <button
                key={option.label}
                className="flex items-center gap-2 rounded px-2 py-1.5 text-white hover:bg-[#505050]"
              >
                <option.icon className="text-lg" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color.value}
                className="group relative h-8 w-8 rounded"
                style={{ backgroundColor: color.value }}
              >
                <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {color.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 