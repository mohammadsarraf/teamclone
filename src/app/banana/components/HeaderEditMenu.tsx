"use client";
import { useState } from "react";
import { MdOutlineStyle } from "react-icons/md";
import { HiPlus } from "react-icons/hi";

interface HeaderEditMenuProps {
  isEditing: boolean;
  onEditClick: () => void;
  isHovered: boolean;
  onElementClick: () => void;
  onDesignClick: () => void;
  activeMenu: "none" | "element" | "design";
}

export default function HeaderEditMenu({
  isEditing,
  onEditClick,
  isHovered,
  onElementClick,
  onDesignClick,
  activeMenu,
}: HeaderEditMenuProps) {
  return (
    <>
      {/* Show Edit Header button only when hovering and not editing */}
      {!isEditing && isHovered ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            <MdOutlineStyle className="text-lg" />
            Edit Header
          </button>
        </div>
      ) : isEditing && activeMenu === "none" ? (
        <div className="absolute inset-x-2 top-full mt-3 flex justify-between">
          <button 
            onClick={onElementClick}
            className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            <HiPlus className="text-lg" />
            Add Elements
          </button>
          <button 
            onClick={onDesignClick}
            className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            <MdOutlineStyle className="text-lg" />
            Design
          </button>
        </div>
      ) : null}
    </>
  );
}
