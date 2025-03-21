"use client";
import { GoPencil } from "react-icons/go";
import { HiPlus } from "react-icons/hi";

interface HeaderEditMenuProps {
  isEditing: boolean;
  onEditClick: () => void;
  isHovered: boolean;
  onElementClick: () => void;
  onDesignClick: () => void;
  activeMenu: "none" | "element" | "design";
}

export default function BananaHeaderControls({
  isEditing,
  onEditClick,
  isHovered,
  onElementClick,
  onDesignClick,
  activeMenu,
}: HeaderEditMenuProps) {
  const buttonClasses =
    "flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white";

  if (!isEditing && isHovered) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <button onClick={onEditClick} className={buttonClasses}>
          <GoPencil className="text-lg" />
          Edit Header
        </button>
      </div>
    );
  }

  if (isEditing && activeMenu === "none") {
    return (
      <div className="absolute inset-x-2 top-full mt-3 flex justify-between">
        <button onClick={onElementClick} className={buttonClasses}>
          <HiPlus className="text-lg" />
          Add Elements
        </button>
        <button onClick={onDesignClick} className={buttonClasses}>
          <GoPencil className="text-lg" />
          Design
        </button>
      </div>
    );
  }

  return null;
}
