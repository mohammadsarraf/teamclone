import React, { useEffect, useState } from "react";
import { BiCodeAlt } from "react-icons/bi";
import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
} from "react-icons/bs";
import {
  CiGrid42,
  CiTextAlignCenter,
  CiTextAlignJustify,
  CiTextAlignLeft,
  CiTextAlignRight,
} from "react-icons/ci";
import { FaAlignJustify, FaCircle } from "react-icons/fa6";
import { GrDrag } from "react-icons/gr";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RiFontSize2 } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";

interface ToolbarProps {
  onClose: () => void;
  onSizeClick: (option: string) => void;
  onJustifyClick: (option: string) => void;
  onColorClick: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onClose,
  onSizeClick,
  onJustifyClick,
  onColorClick,
}) => {
  const headingIcons = {
    H1: BsTypeH1,
    H2: BsTypeH2,
    H3: BsTypeH3,
    H4: BsTypeH4,
    H5: BsTypeH5,
    H6: BsTypeH6,
  };
  type HeadingKey = keyof typeof headingIcons;

  const justifyIcons = {
    left: CiTextAlignLeft,
    center: CiTextAlignCenter,
    right: CiTextAlignRight,
    justify: CiTextAlignJustify,
  };
  type JustifyKey = keyof typeof justifyIcons;

  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleSizeChange = (size: string) => {
    setShowDropdown(null);
    onSizeClick(size);
  };

  const handleAlignmentChange = (alignment: string) => {
    setShowDropdown(null);
    onJustifyClick(alignment);
  };

  const handleColorChange = (color: string) => {
    setShowDropdown(null);
    onColorClick(color);
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
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                {(
                  [
                    "text-6xl",
                    "text-5xl",
                    "text-4xl",
                    "text-3xl",
                    "text-2xl",
                    "text-xl",
                  ] as string[]
                ).map((size, index) => {
                  const heading = `H${index + 1}`;
                  const Icon = headingIcons[heading as HeadingKey];
                  return (
                    <div
                      key={size}
                      className="flex cursor-pointer items-center p-2 hover:bg-white"
                      onClick={() => handleSizeChange(size)}
                    >
                      {React.createElement(Icon, { className: "mr-2" })} Heading{" "}
                      {heading[1]}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <FaAlignJustify
            className="m-2"
            onClick={() => toggleDropdown("justify")}
          />
          {showDropdown === "justify" && (
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                {(
                  [
                    "text-left",
                    "text-center",
                    "text-right",
                    "text-justify",
                  ] as string[]
                ).map((align) => {
                  const Icon = justifyIcons[align.split("-")[1] as JustifyKey];
                  return (
                    <div
                      key={align}
                      className="flex cursor-pointer items-center p-2 hover:bg-white"
                      onClick={() => handleAlignmentChange(align)}
                    >
                      {React.createElement(Icon, { className: "mr-2" })}{" "}
                      {align.split("-")[1].charAt(0).toUpperCase() +
                        align.split("-")[1].slice(1)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <IoColorPaletteOutline
            className="m-2"
            onClick={() => toggleDropdown("color")}
          />
          {showDropdown === "color" && (
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                {["text-red-700", "text-blue-700", "text-green-500", "text-white"].map((color) => (
                  <div
                    key={color}
                    className="flex cursor-pointer items-center p-2 hover:bg-white"
                    onClick={() => handleColorChange(`${color}`)}
                  >
                    <FaCircle className={`mr-2 ${color}`} />{" "}
                    {color.split("-")[1].charAt(0).toUpperCase() +
                      color.split("-")[1].slice(1)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex">
          <SlOptionsVertical className="m-2" />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
