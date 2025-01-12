import React from "react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa6";

interface FormatDropdownProps {
  onFormatClick: (option: string) => void;
}

const FormatDropdown: React.FC<FormatDropdownProps> = ({ onFormatClick }) => {
  return (
    <div className="absolute left-0 top-full mt-1 w-40 rounded bg-white text-sm shadow-lg">
      <div
        className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
        onClick={() => onFormatClick("bold")}
      >
        <FaBold className="mr-2" />
        Bold
      </div>
      <div
        className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
        onClick={() => onFormatClick("underline")}
      >
        <FaUnderline className="mr-2" />
        Underline
      </div>
      <div
        className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
        onClick={() => onFormatClick("italic")}
      >
        <FaItalic className="mr-2" />
        Italic
      </div>
    </div>
  );
};

export default FormatDropdown;
