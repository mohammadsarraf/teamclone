import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function ColorDropdown({ onColorChange }: any) {
  const [bgColor, setBgColor] = useState("bg-black"); // Default background color
  const [isOpen, setIsOpen] = useState(false); // Dropdown state

  const colors = [
    { name: "Red", className: "bg-red-500" },
    { name: "Blue", className: "bg-blue-500" },
  ];

  return (
    <div className={` flex items-center justify-center text-black`}>
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 shadow-md transition hover:bg-gray-200"
        >
          <span>Select Color</span>
          <FaChevronDown
            className={`transition${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute left-0 top-12 w-32 overflow-hidden rounded-md border bg-white shadow-lg">
            {colors.map((color) => (
              <li
                key={color.name}
                onClick={() => {
                  setBgColor(color.className);
                  setIsOpen(false); // Close dropdown after selection
                  onColorChange(color.className); // Notify parent about the change
                }}
                className="flex h-12 cursor-pointer items-center justify-center transition hover:bg-gray-100"
              >
                <div
                  className={`size-8 rounded-full ${color.className} border border-gray-300`}
                  title={color.name}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
