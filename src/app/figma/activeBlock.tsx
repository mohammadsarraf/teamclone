import React, { useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { CiMaximize1 } from 'react-icons/ci';
import { FaAlignCenter, FaBold, FaItalic, FaAlignLeft, FaAlignRight, FaAlignJustify } from 'react-icons/fa6';
import { IoMdLink } from 'react-icons/io';
import { MdDelete, MdFormatColorText } from 'react-icons/md';
import { VscSymbolColor } from 'react-icons/vsc';

interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
}

interface ActiveBlockProps {
  block: Block;
  index: number;
  isEditing: boolean;
  activeBlock: string | null;
  handleBlockClick: (blockId: string) => void;
  handleTextChange: (index: number, event: React.ChangeEvent<HTMLInputElement> | any) => void;
  color: string;
  handleColorChange: (color: string) => void;
  handleHeadingClick: (size: string) => void;
  handleItalicClick: () => void;
  handleBoldClick: () => void;
  handleMaximizeClick: () => void;
  handleFormatColorTextClick: () => void;
  handleLinkClick: () => void;
  handleAlignClick: (align: string) => void;
}

const ActiveBlock: React.FC<ActiveBlockProps> = ({
  block,
  index,
  isEditing,
  activeBlock,
  handleBlockClick,
  handleTextChange,
  color,
  handleColorChange,
  handleHeadingClick,
  handleItalicClick,
  handleBoldClick,
  handleMaximizeClick,
  handleFormatColorTextClick,
  handleLinkClick,
  handleAlignClick,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlignDropdown, setShowAlignDropdown] = useState(false);
  const [fontSize, setFontSize] = useState<string>(block.fontSize || 'Heading 1');
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleAlignDropdown = () => {
    setShowAlignDropdown(!showAlignDropdown);
  };

  return (
    <div className='flex flex-col gap-3 w-fit'>
      <div className="relative flex h-10 items-center rounded-lg bg-gray-300 text-black px-2 text-xl">
        <div className='relative border-r px-2'>
          <button className='flex w-32 items-center justify-between hover:bg-blue-400' onClick={toggleDropdown}>
            {fontSize}
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300">
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-4xl'); setShowDropdown(false); setFontSize("Heading 1")}}>Heading 1</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-3xl'); setShowDropdown(false); setFontSize("Heading 2")}}>Heading 2</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-2xl'); setShowDropdown(false); setFontSize("Heading 3")}}>Heading 3</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-xl'); setShowDropdown(false); setFontSize("Heading 4")}}>Heading 4</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-lg'); setShowDropdown(false); setFontSize("Paragraph 1")}}>Paragraph 1</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-base'); setShowDropdown(false); setFontSize("Paragraph 2")}}>Paragraph 2</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('text-sm'); setShowDropdown(false); setFontSize("Paragraph 3")}}>Paragraph 3</button>
              <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleHeadingClick('font-mono'); setShowDropdown(false); setFontSize("Monospace")}}>Monospace</button>
            </div>
          )}
        </div>
        <div className='flex items-center space-x-2 px-2 border-r'>
          <button className='p-1 hover:bg-blue-400 rounded' onClick={handleItalicClick}><FaItalic /></button>
          <button className='p-1 hover:bg-blue-400 rounded' onClick={handleBoldClick}><FaBold /></button>
          <button className='p-1 hover:bg-blue-400 rounded' onClick={handleMaximizeClick}><CiMaximize1 /></button>
          <button className='p-1 hover:bg-blue-400 rounded' onClick={handleFormatColorTextClick}><MdFormatColorText /></button>
          <button className='p-1 hover:bg-blue-400 rounded' onClick={handleLinkClick}><IoMdLink /></button>
          <div className='relative'>
            <button className='p-1 hover:bg-blue-400 rounded' onClick={toggleAlignDropdown}><FaAlignCenter /></button>
            {showAlignDropdown && (
              <div className="absolute flex top-full -right-10 mt-1 w-fit bg-white border border-gray-300">
                <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleAlignClick('text-left'); setShowAlignDropdown(false);}}><FaAlignLeft /></button>
                <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleAlignClick('text-center'); setShowAlignDropdown(false);}}><FaAlignCenter /></button>
                <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleAlignClick('text-right'); setShowAlignDropdown(false);}}><FaAlignRight /></button>
                <button className='block w-full text-left px-2 py-1 text-md hover:bg-blue-400' onClick={() => {handleAlignClick('text-justify'); setShowAlignDropdown(false);}}><FaAlignJustify /></button>
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center px-2'>
          <button className='p-1 hover:bg-blue-400 rounded'><MdDelete /></button>
        </div>
      </div>
    </div>
  );
};

export default ActiveBlock;
