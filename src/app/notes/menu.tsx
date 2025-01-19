import { useEffect, useRef } from "react";
import { BsClipboard, BsFillFileEarmarkImageFill } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { FaParagraph } from "react-icons/fa6";
import { HiH1, HiH2, HiH3, HiNumberedList } from "react-icons/hi2";
import { LiaLine } from "react-icons/lia";
import { PiListBulletsBold } from "react-icons/pi";
import { TbQuoteOff } from "react-icons/tb";

export default function Menu({
  closeMenu,
  adjustTextareaHeight,
  onSelect, // Add onSelect prop
}: {
  closeMenu: () => void;
  adjustTextareaHeight: () => void;
  onSelect: (option: string) => void; // Define the type for onSelect
}) {
  const handleOptionClick = (option: string) => {
    adjustTextareaHeight();
    onSelect(option); // Call onSelect with the selected option
    closeMenu();
  };

  return (
    <div className="w-fit rounded-lg bg-gray-900">
      <div className="border-b">
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Task")}
        >
          <FaTasks />
          Task
        </button>
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Paragraph")}
        >
          <FaParagraph />
          Paragraph
        </button>
      </div>
      <div className="border-b">
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Heading 1")}
        >
          <HiH1 />
          Heading 1
        </button>
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Heading 2")}
        >
          <HiH2 />
          Heading 2
        </button>
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Heading 3")}
        >
          <HiH3 />
          Heading 3
        </button>
      </div>
      <div className="border-b">
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Divider")}
        >
          <LiaLine />
          Divider
        </button>
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Bullet point")}
        >
          <PiListBulletsBold />
          Bullet point
        </button>
        {/* <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Numbered List")}
        >
          <HiNumberedList />
          Numbered List
        </button> */}
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Blockquote")}
        >
          <TbQuoteOff />
          Blockquote
        </button>
      </div>
      <div className="">
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Image")}
        >
          <BsFillFileEarmarkImageFill />
          Image
        </button>
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Attachment")}
        >
          <BsClipboard />
          Attachment
        </button>
      </div>
    </div>
  );
}
