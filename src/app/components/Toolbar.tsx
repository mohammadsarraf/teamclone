import React, { useEffect, useState } from "react";
import { BiCodeAlt, BiParagraph } from "react-icons/bi";
import {
  BsJustify,
  BsJustifyLeft,
  BsJustifyRight,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
} from "react-icons/bs";
import { CgStyle } from "react-icons/cg";
import {
  CiGrid42,
  CiTextAlignCenter,
  CiTextAlignJustify,
  CiTextAlignLeft,
  CiTextAlignRight,
} from "react-icons/ci";
import { FaDotCircle } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa6";
import { GrDiamond, GrDrag } from "react-icons/gr";
import { IoColorPaletteOutline } from "react-icons/io5";
import { PiOption } from "react-icons/pi";
import { RiFontSize2 } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";

interface ToolbarProps {
  position: { top: number; left: number };
  onClose: () => void;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onH1Click: () => void;
  onH2Click: () => void;
  onH3Click: () => void;
  onH4Click: () => void;
  onH5Click: () => void;
  onH6Click: () => void;
  onJustifyClick: (option: string) => void;
  onColorChange: (color: string) => void; // Add new prop
}

const Toolbar: React.FC<ToolbarProps> = ({
  position,
  onClose,
  onBoldClick,
  onItalicClick,
  onH1Click,
  onH2Click,
  onH3Click,
  onH4Click,
  onH5Click,
  onH6Click,
  onJustifyClick,
  onColorChange, // Destructure new prop
}) => {
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showJustifyDropdown, setShowJustifyDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const handleSizeOption = () => {
    setShowJustifyDropdown(false);
    setShowColorDropdown(false);
    setShowSizeDropdown(!showSizeDropdown);
  };

  const handleJustifyOption = () => {
    setShowJustifyDropdown(!showJustifyDropdown);
    setShowSizeDropdown(false);
    setShowColorDropdown(false);
  };

  const handleColorOption = () => {
    setShowColorDropdown(!showColorDropdown);
    setShowSizeDropdown(false);
    setShowJustifyDropdown(false);
  };

  const handleOptionClick = (option: string) => {
    setShowSizeDropdown(false);
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
    setShowJustifyDropdown(false);
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
    onJustifyClick(option); // Call the new handler
  };

  const handleColorClick = (color: string) => {
    document.execCommand("foreColor", false, color);
    setShowColorDropdown(false);
    onColorChange(color); // Call the new handler
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
        top: position.top - 40, // Adjust the value as needed to position above the selected div
        right: position.left,
        transform: "translateX(0%)", // Remove centering transform
      }}
    >
      <div className="flex">
        <div className="flex border-r border-black">
          <CiGrid42 className="m-2" onClick={onBoldClick} />
        </div>
        <div className="flex border-r border-black">
          <BiParagraph className="m-2" onClick={onItalicClick} />
          <div className="relative">
            <GrDrag className="m-2" />
          </div>
          <BiCodeAlt className="m-2">...</BiCodeAlt>
        </div>
        <div className="flex border-r border-black">
          <RiFontSize2 className="m-2" onClick={handleSizeOption}>
            ...
          </RiFontSize2>
          {showSizeDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleOptionClick("H1")}
                >
                  <BsTypeH1 className="mr-2" /> Heading 1
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleOptionClick("H2")}
                >
                  <BsTypeH2 className="mr-2" /> Heading 2
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleOptionClick("H3")}
                >
                  <BsTypeH3 className="mr-2" /> Heading 3
                </div>{" "}
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleOptionClick("H4")}
                >
                  <BsTypeH4 className="mr-2" /> Heading 4
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleOptionClick("H5")}
                >
                  <BsTypeH5 className="mr-2" /> Heading 5
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleOptionClick("H6")}
                >
                  <BsTypeH6 className="mr-2" /> Heading 6
                </div>
              </div>
            </div>
          )}
          <FaAlignJustify className="m-2" onClick={handleJustifyOption}>
            ...
          </FaAlignJustify>
          {showJustifyDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleJustifyClick("left")}
                >
                  <CiTextAlignLeft className="mr-2" /> Left
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleJustifyClick("center")}
                >
                  <CiTextAlignCenter className="mr-2" /> Center
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleJustifyClick("right")}
                >
                  <CiTextAlignRight className="mr-2" /> Right
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white "
                  onClick={() => handleJustifyClick("justify")}
                >
                  <CiTextAlignJustify className="mr-2" /> Justify
                </div>
              </div>
            </div>
          )}
          <IoColorPaletteOutline className="m-2" onClick={handleColorOption}>
            ...
          </IoColorPaletteOutline>
          {showColorDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
              <div className="flex flex-col text-sm">
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleColorClick("text-red-700")}
                >
                  <FaDotCircle className="mr-2 text-red-700" /> Red
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleColorClick("text-blue-500")}
                >
                  <FaDotCircle className="mr-2 text-blue-500" /> Blue
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleColorClick("text-green-500")}
                >
                  <FaDotCircle className="mr-2 text-green-500" /> Green
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-white"
                  onClick={() => handleColorClick("text-white")}
                >
                  <FaDotCircle className="mr-2 text-white" /> White
                </div>
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
