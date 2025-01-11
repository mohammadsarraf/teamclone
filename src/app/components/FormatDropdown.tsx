import React from "react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa6";

interface FormatDropdownProps {
  onFormatClick: (option: string) => void;
}

const FormatDropdown: React.FC<FormatDropdownProps> = ({ onFormatClick }) => {
  return (
    <div className="absolute top-full left-0 mt-1 w-40 rounded bg-white shadow-lg text-sm">
      <div
        className="cursor-pointer p-2 hover:bg-gray-200 flex items-center"
        onClick={() => onFormatClick("bold")}
      >
        <FaBold className="mr-2" />
        Bold
      </div>
      <div
        className="cursor-pointer p-2 hover:bg-gray-200 flex items-center"
        onClick={() => onFormatClick("underline")}
      >
        <FaUnderline className="mr-2" />
        Underline
      </div>
      <div
        className="cursor-pointer p-2 hover:bg-gray-200 flex items-center"
        onClick={() => onFormatClick("italic")}
      >
        <FaItalic className="mr-2" />
        Italic
      </div>
    </div>
  );
};

export default FormatDropdown;
