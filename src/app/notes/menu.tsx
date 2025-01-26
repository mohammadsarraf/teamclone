"use client";

import React, { useEffect, useRef, MouseEvent as ReactMouseEvent } from "react";
import { BsClipboard, BsFillFileEarmarkImageFill } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { FaParagraph } from "react-icons/fa6";
import { HiH1, HiH2, HiH3 } from "react-icons/hi2";
import { LiaLine } from "react-icons/lia";
import { PiListBulletsBold } from "react-icons/pi";
import { TbQuoteOff } from "react-icons/tb";
import { GoNumber } from "react-icons/go";

interface MenuProps {
  closeMenu: () => void;
  adjustTextareaHeight: () => void;
  onSelect: (
    option: string,
    fileData?: { data: string; filename: string },
  ) => void;
}

const Menu: React.FC<MenuProps> = ({
  closeMenu,
  adjustTextareaHeight,
  onSelect,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  const handleOptionClick = (option: string) => {
    adjustTextareaHeight();
    onSelect(option);
    closeMenu();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "Image" | "Attachment",
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    // For images, check dimensions and compress if needed
    if (type === "Image") {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimensions
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;

          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const base64String = canvas.toDataURL("image/jpeg", 0.8);
          onSelect(type, { data: base64String, filename: file.name });
        };
      };
      reader.readAsDataURL(file);
    } else {
      // Handle other file types
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        onSelect(type, { data: base64String, filename: file.name });
      };
      reader.readAsDataURL(file);
    }
    closeMenu();
  };

  return (
    <div
      ref={menuRef}
      className="w-fit rounded-lg border border-zinc-700 bg-zinc-800 shadow-xl"
    >
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
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Blockquote")}
        >
          <TbQuoteOff />
          Blockquote
        </button>
      </div>
      <div className="border-t border-zinc-700">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "Image")}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.zip,.rar"
          className="hidden"
          onChange={(e) => handleFileSelect(e, "Attachment")}
        />
        <button
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-50"
          onClick={() => imageInputRef.current?.click()}
        >
          <BsFillFileEarmarkImageFill className="size-4" />
          Image
        </button>
        <button
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-50"
          onClick={() => fileInputRef.current?.click()}
        >
          <BsClipboard className="size-4" />
          Attachment
        </button>
      </div>
      <div className="border-b">
        <button
          className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-gray-500 focus:bg-gray-500"
          onClick={() => handleOptionClick("Numbered list")}
        >
          <GoNumber />
          Numbered list
        </button>
      </div>
    </div>
  );
};

export default Menu;
