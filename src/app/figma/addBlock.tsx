import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { CgScrollH } from "react-icons/cg";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  FaChartSimple,
  FaCode,
  FaGripLinesVertical,
  FaImage,
  FaMarkdown,
  FaShapes,
} from "react-icons/fa6";
import { GiNotebook } from "react-icons/gi";
import { ImEmbed } from "react-icons/im";
import {
  MdAudioFile,
  MdLibraryBooks,
  MdOutlineFormatListBulleted,
  MdOutlineOndemandVideo,
  MdSmartButton,
} from "react-icons/md";
import { RiText } from "react-icons/ri";
import { SlCalender, SlEnvolopeLetter } from "react-icons/sl";
import { TbSocial } from "react-icons/tb";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";

interface AddBlockProps {
  handleClose: () => void;
  handleAddBlock: (text: string, type?: string) => void;
}

export default function AddBlock({
  handleClose,
  handleAddBlock,
}: AddBlockProps) {
  const [showShapesMenu, setShowShapesMenu] = useState(false);

  const handleShapesClick = () => {
    setShowShapesMenu(true);
  };

  return (
    <div className="absolute -top-[30rem] left-80 size-96 -translate-x-1/2 overflow-auto rounded-xl bg-white p-4 text-black">
      {!showShapesMenu ? (
        <>
          {/* Original Menu */}
          <button
            onClick={handleClose}
            className="absolute right-2 top-2 text-red-600 hover:text-red-800"
          >
            ✕
          </button>

          <div className="mb-4 flex items-center gap-2 rounded border px-2 py-1">
            <AiOutlineSearch size={20} className="text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              className="grow text-sm text-gray-800 outline-none"
            />
          </div>

          <h3 className="mb-2 border-b px-4 text-lg font-bold">Basic</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAddBlock("Text Block")}
              className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400"
            >
              <RiText
                className="mr-4 flex items-center text-blue-600"
                size={20}
              />
              <span className="text-black">Text</span>
            </button>
            {/* ... other buttons ... */}
            <button
              onClick={handleShapesClick}
              className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400"
            >
              <FaShapes
                className="mr-4 flex items-center text-blue-600"
                size={20}
              />
              <span className="text-black">Shape</span>
            </button>
            {/* ... rest of the buttons ... */}
          </div>
        </>
      ) : (
        // Shapes Sub-menu
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setShowShapesMenu(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <button
              onClick={handleClose}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
          <h3 className="mb-4 text-lg font-bold">Shapes</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAddBlock("", "triangle")}
              className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400"
            >
              <div className="mr-4 size-5 border-x-8 border-b-[12px] border-x-transparent border-b-blue-600" />
              <span className="text-black">Triangle</span>
            </button>
            {/* Add more shape options here */}
          </div>
        </div>
      )}
    </div>
  );
}
