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

interface ToolbarProps {
  onClose: () => void;
  onSizeClick: (option: string) => void;
  onJustifyClick: (option: string) => void;
  onColorClick: (color: string) => void;
  onWidthChange: (width: string) => void;
  onLengthChange: (length: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onClose,
  onSizeClick,
  onJustifyClick,
  onColorClick,
  onWidthChange,
  onLengthChange,
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
          <BiCodeAlt className="m-2" />
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
              onWidthChange={onWidthChange}
              onLengthChange={onLengthChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
