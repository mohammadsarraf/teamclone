import React, { useEffect, useState } from "react";
import { BiCodeAlt } from "react-icons/bi";
import { CiGrid42 } from "react-icons/ci";
import { GrDrag } from "react-icons/gr";
import { RiFontSize2 } from "react-icons/ri";
import { FaAlignJustify } from "react-icons/fa6";
import { IoColorPaletteOutline } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";
import SizeDropdown from "./SizeDropdown";
import JustifyDropdown from "./JustifyDropdown";
import ColorDropdown from "./ColorDropdown";
import WidthLengthDropdown from "./WidthLengthDropdown";
import FormatDropdown from "./FormatDropdown"; // Add this line

interface ToolbarProps {
  onClose: () => void;
  onSizeClick: (option: string) => void;
  onJustifyClick: (option: string) => void;
  onColorClick: (color: string) => void;
  onWidthChange: (width: string) => void;
  onLengthChange: (length: string) => void;
  initialWidth: string; // Add this line
  initialLength: string; // Add this line
  onFormatClick: (option: string) => void; // Add this line
}

const Toolbar: React.FC<ToolbarProps> = ({
  onClose,
  onSizeClick,
  onJustifyClick,
  onColorClick,
  onWidthChange,
  onLengthChange,
  initialWidth, // Add this line
  initialLength, // Add this line
  onFormatClick, // Add this line
}) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="z-10 flex w-max items-center justify-normal gap-1 rounded bg-gray-200 text-2xl text-black shadow-lg">
      <div className="flex">
        <div className="flex border-r border-black">
          <CiGrid42 className="m-2" />
        </div>
        <div className="flex border-r border-black">
          <GrDrag className="m-2" />
          <div className="relative">
            <BiCodeAlt
              className="m-2"
              onClick={() => toggleDropdown("format")}
            />
            {showDropdown === "format" && (
              <FormatDropdown onFormatClick={onFormatClick} />
            )}
          </div>
        </div>
        <div className="relative flex border-r border-black">
          <RiFontSize2 className="m-2" onClick={() => toggleDropdown("size")} />
          {showDropdown === "size" && (
            <SizeDropdown onSizeClick={onSizeClick} />
          )}
          <FaAlignJustify
            className="m-2"
            onClick={() => toggleDropdown("justify")}
          />
          {showDropdown === "justify" && (
            <JustifyDropdown onJustifyClick={onJustifyClick} />
          )}
          <IoColorPaletteOutline
            className="m-2"
            onClick={() => toggleDropdown("color")}
          />
          {showDropdown === "color" && (
            <ColorDropdown onColorClick={onColorClick} />
          )}
        </div>
        <div className="relative flex">
          <SlOptionsVertical
            className="m-2"
            onClick={() => toggleDropdown("widthMenu")}
          />
          {showDropdown === "widthMenu" && (
            <WidthLengthDropdown
              key="widthLengthDropdown"
              onWidthChange={onWidthChange}
              onLengthChange={onLengthChange}
              initialWidth={initialWidth} // Update this line
              initialLength={initialLength} // Update this line
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
