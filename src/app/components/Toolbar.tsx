import React, { useEffect, useState } from "react";
import { BiCodeAlt, BiParagraph } from "react-icons/bi";
import { BsTypeH1, BsTypeH2, BsTypeH3 } from "react-icons/bs";
import { CgStyle } from "react-icons/cg";
import { CiGrid42 } from "react-icons/ci";
import { FaDotCircle } from "react-icons/fa";
import { FaAlignJustify } from "react-icons/fa6";
import { GrDiamond, GrDrag } from "react-icons/gr";
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
  onPClick: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  position,
  onClose,
  onBoldClick,
  onItalicClick,
  onH1Click,
  onH2Click,
  onH3Click,
  onPClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSizeOption = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option: string) => {
    setShowDropdown(false);
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
      case "P":
        document.execCommand("formatBlock", false, "p");
        onPClick();
        break;
      default:
        break;
    }
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
      className="absolute z-10 flex w-max items-center justify-normal gap-1 rounded bg-white text-2xl text-black shadow-lg"
      style={{
        top: position.top - 40, // Adjust the value as needed to position above the selected div
        right: position.left,
        transform: "translateX(0%)", // Remove centering transform
      }}
    >
      <div className="flex">
        <div className="flex border-r">
          <CiGrid42 className="m-2" onClick={onBoldClick} />
        </div>
        <div className="flex border-r">
          <BiParagraph className="m-2" onClick={onItalicClick} />
          <div className="relative">
            <GrDrag className="m-2" />
          </div>
          <BiCodeAlt className="m-2">...</BiCodeAlt>
        </div>
        <div className="flex border-r">
          <RiFontSize2 className="m-2" onClick={handleSizeOption}>
            ...
          </RiFontSize2>
          {showDropdown && (
            <div className="absolute left-40 top-full mt-1 rounded border bg-white shadow-lg">
              <div className="flex flex-col text-sm">
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
                  onClick={() => handleOptionClick("H1")}
                >
                  <BsTypeH1 className="mr-2" /> Heading 1
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
                  onClick={() => handleOptionClick("H2")}
                >
                  <BsTypeH2 className="mr-2" /> Heading 2
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
                  onClick={() => handleOptionClick("H3")}
                >
                  <BsTypeH3 className="mr-2" /> Heading 3
                </div>
                <div
                  className="flex cursor-pointer items-center p-2 hover:bg-gray-200"
                  onClick={() => handleOptionClick("P")}
                >
                  <BiParagraph className="mr-2" /> Paragraph
                </div>
              </div>
            </div>
          )}
          <FaAlignJustify className="m-2">...</FaAlignJustify>
        </div>
        <div className="flex">
          <SlOptionsVertical className="m-2">...</SlOptionsVertical>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
