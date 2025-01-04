import React, { useEffect, useState } from "react";
import { BiCodeAlt, BiParagraph } from "react-icons/bi";
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
  position: { top: number; left: number };
  onClose: () => void;
  onH1Click: () => void;
  onH2Click: () => void;
  onH3Click: () => void;
  onH4Click: () => void;
  onH5Click: () => void;
  onH6Click: () => void;
  onJustifyClick: (option: string) => void;
  onColorChange: (color: string) => void;
  onTextSizeChange: (size: string) => void; // Add onTextSizeChange prop
}

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

const Dropdown: React.FC<{
  show: boolean;
  items: { key: string; label: string; Icon: React.ComponentType<any> }[];
  onClick: (key: string) => void;
}> = ({ show, items, onClick }) => {
  if (!show) return null;
  return (
    <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
      <div className="flex flex-col text-sm">
        {items.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="flex cursor-pointer items-center p-2 hover:bg-white"
            onClick={() => onClick(key)}
          >
            <Icon className="mr-2" /> {label}
          </div>
        ))}
      </div>
    </div>
  );
};

const Toolbar: React.FC<ToolbarProps> = ({
  position,
  onClose,
  onH1Click,
  onH2Click,
  onH3Click,
  onH4Click,
  onH5Click,
  onH6Click,
  onJustifyClick,
  onColorChange,
  onTextSizeChange, // Add onTextSizeChange prop
}) => {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setShowDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const handleOptionClick = (option: string) => {
    setShowDropdown(null);
    switch (option) {
      case "H1":
        document.execCommand("formatBlock", false, "h1");
        onH1Click();
        break;
      case "H2":
        document.execCommand("formatBlock", false, "h2");
        onH2Click();
        break;
      case "H3":
        document.execCommand("formatBlock", false, "h3");
        onH3Click();
        break;
      case "H4":
        document.execCommand("formatBlock", false, "h4");
        onH4Click();
        break;
      case "H5":
        document.execCommand("formatBlock", false, "h5");
        onH5Click();
        break;
      case "H6":
        document.execCommand("formatBlock", false, "h6");
        onH6Click();
        break;
      default:
        break;
    }
  };

  const handleJustifyClick = (option: string) => {
    setShowDropdown(null);
    switch (option) {
      case "left":
        document.execCommand("justifyLeft");
        break;
      case "center":
        document.execCommand("justifyCenter");
        break;
      case "right":
        document.execCommand("justifyRight");
        break;
      case "justify":
        document.execCommand("justifyFull");
        break;
      default:
        break;
    }
    onJustifyClick(option);
  };

  const handleColorClick = (color: string) => {
    document.execCommand("foreColor", false, color);
    setShowDropdown(null);
    onColorChange(color);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    console.log("Selected color:", newColor); // Log the new selected color
    handleColorClick(newColor);
  };

  const handleTextSizeChange = (size: string) => {
    onTextSizeChange(size);
    setShowDropdown(null);
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
    <div
      className="absolute z-10 flex w-max items-center justify-normal gap-1 rounded bg-gray-200 text-2xl text-black shadow-lg"
      style={{
        top: position.top - 40,
        right: position.left,
        transform: "translateX(0%)",
      }}
    >
      <div className="flex">
        <div className="flex border-r border-black">
          <CiGrid42 className="m-2" />
        </div>
        <div className="flex border-r border-black">
          <BiParagraph className="m-2" />
          <GrDrag className="m-2" />
          <BiCodeAlt className="m-2">...</BiCodeAlt>
        </div>
        <div className="flex border-r border-black">
          <RiFontSize2 className="m-2" onClick={() => toggleDropdown("size")} />
          <Dropdown
            show={showDropdown === "size"}
            items={[
              { key: "1", label: "Small", Icon: () => <span>Small</span> },
              { key: "3", label: "Normal", Icon: () => <span>Normal</span> },
              { key: "5", label: "Large", Icon: () => <span>Large</span> },
              { key: "7", label: "Huge", Icon: () => <span>Huge</span> },
            ]}
            onClick={handleTextSizeChange}
          />
          <FaAlignJustify
            className="m-2"
            onClick={() => toggleDropdown("justify")}
          />
          <Dropdown
            show={showDropdown === "justify"}
            items={Object.keys(justifyIcons).map((key) => ({
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1),
              Icon: justifyIcons[key as JustifyKey],
            }))}
            onClick={handleJustifyClick}
          />
          <IoColorPaletteOutline
            className="m-2"
            onClick={() => toggleDropdown("color")}
          />
          {showDropdown === "color" && (
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                {[
                  "text-red-700",
                  "text-blue-500",
                  "text-green-500",
                  "text-white",
                ].map((color) => (
                  <div
                    key={color}
                    className="flex cursor-pointer items-center p-2 hover:bg-white"
                    onClick={() => handleColorClick(`${color}`)}
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
          <SlOptionsVertical className="m-2">...</SlOptionsVertical>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
