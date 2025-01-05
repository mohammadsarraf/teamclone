import React from "react";
import { FaCircle } from "react-icons/fa6";

interface ColorDropdownProps {
  onColorClick: (color: string) => void;
}

const ColorDropdown: React.FC<ColorDropdownProps> = ({ onColorClick }) => {
  const handleColorChange = (color: string) => {
    onColorClick(color);
  };

  return (
    <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
      <div className="flex flex-col text-sm">
        {["text-red-700", "text-blue-700", "text-green-500", "text-white"].map(
          (color) => (
            <div
              key={color}
              className="flex cursor-pointer items-center p-2 hover:bg-white"
              onClick={() => handleColorChange(`${color}`)}
            >
              <FaCircle className={`mr-2 ${color}`} />{" "}
              {color.split("-")[1].charAt(0).toUpperCase() +
                color.split("-")[1].slice(1)}
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default ColorDropdown;
