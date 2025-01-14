import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import { CiMaximize1 } from "react-icons/ci";
import {
  FaAlignCenter,
  FaBold,
  FaItalic,
  FaAlignLeft,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa6";
import { IoMdLink } from "react-icons/io";
import { MdDelete, MdFormatColorText } from "react-icons/md";
import { VscSymbolColor } from "react-icons/vsc";

interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  fontSize?: string; // Add this line
}

interface ActiveBlockProps {
  block: Block;
  index: number;
  isEditing: boolean;
  activeBlock: string | null;
  handleBlockClick: (blockId: string) => void;
  handleTextChange: (
    index: number,
    event: React.ChangeEvent<HTMLInputElement> | any,
  ) => void;
  color: string;
  handleColorChange: (color: string) => void;
  handleHeadingClick: (size: string) => void;
  // handleItalicClick: () => void;
  // handleBoldClick: () => void;
  // handleMaximizeClick: () => void;
  // handleFormatColorTextClick: () => void;
  // handleLinkClick: () => void;
  handleAlignClick: (align: string) => void;
}

const ActiveBlock: React.FC<ActiveBlockProps> = ({
  block,
  // index,
  // isEditing,
  // activeBlock,
  // handleBlockClick,
  // handleTextChange,
  // color,
  handleColorChange,
  handleHeadingClick,
  // handleItalicClick,
  // handleBoldClick,
  // handleMaximizeClick,
  // handleFormatColorTextClick,
  // handleLinkClick,
  handleAlignClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [fontSize, setFontSize] = useState<string>(
    block.fontSize || "Heading 1",
  );
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleAlignDropdown = () => {
    setShowAlignDropdown(!showAlignDropdown);
  };

  return (
    <div className="mb-3 flex w-fit flex-col gap-3">
      <div className="relative flex h-10 items-center rounded-lg bg-gray-300 px-2 text-lg text-black">
        <div className="relative border-r px-2">
          <button
            className="block w-32 items-center justify-between rounded px-2 hover:bg-blue-500"
            onClick={toggleDropdown}
          >
            {fontSize}
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full border border-gray-300 bg-white">
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-4xl");
                  setShowDropdown(false);
                  setFontSize("Heading 1");
                }}
              >
                Heading 1
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-3xl");
                  setShowDropdown(false);
                  setFontSize("Heading 2");
                }}
              >
                Heading 2
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-2xl");
                  setShowDropdown(false);
                  setFontSize("Heading 3");
                }}
              >
                Heading 3
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-xl");
                  setShowDropdown(false);
                  setFontSize("Heading 4");
                }}
              >
                Heading 4
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-lg");
                  setShowDropdown(false);
                  setFontSize("Paragraph 1");
                }}
              >
                Paragraph 1
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-base");
                  setShowDropdown(false);
                  setFontSize("Paragraph 2");
                }}
              >
                Paragraph 2
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("text-sm");
                  setShowDropdown(false);
                  setFontSize("Paragraph 3");
                }}
              >
                Paragraph 3
              </button>
              <button
                className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                onClick={() => {
                  handleHeadingClick("font-mono");
                  setShowDropdown(false);
                  setFontSize("Monospace");
                }}
              >
                Monospace
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 border-r px-2">
          <button className="rounded p-1 hover:bg-blue-500">
            <FaItalic />
          </button>
          <button className="rounded p-1 hover:bg-blue-500">
            <FaBold />
          </button>
          <button className="rounded p-1 hover:bg-blue-500">
            <CiMaximize1 />
          </button>
          <button className="rounded p-1 hover:bg-blue-500">
            <MdFormatColorText />
          </button>
          <button className="rounded p-1 hover:bg-blue-500">
            <IoMdLink />
          </button>
          <div className="relative">
            <button
              className="rounded p-1 hover:bg-blue-500"
              onClick={toggleAlignDropdown}
            >
              <FaAlignCenter />
            </button>
            {showAlignDropdown && (
              <div className="absolute -right-10 top-full mt-1 flex w-fit border border-gray-300 bg-white">
                <button
                  className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                  onClick={() => {
                    handleAlignClick("text-left");
                    setShowAlignDropdown(false);
                  }}
                >
                  <FaAlignLeft />
                </button>
                <button
                  className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                  onClick={() => {
                    handleAlignClick("text-center");
                    setShowAlignDropdown(false);
                  }}
                >
                  <FaAlignCenter />
                </button>
                <button
                  className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                  onClick={() => {
                    handleAlignClick("text-right");
                    setShowAlignDropdown(false);
                  }}
                >
                  <FaAlignRight />
                </button>
                <button
                  className="text-md block w-full px-2 py-1 text-left hover:bg-blue-500"
                  onClick={() => {
                    handleAlignClick("text-justify");
                    setShowAlignDropdown(false);
                  }}
                >
                  <FaAlignJustify />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center px-2">
          <button className="rounded p-1 text-red-500 hover:bg-blue-500">
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveBlock;
