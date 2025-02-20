"use client";
import { useState } from "react";
import HeaderEditMenu from "./HeaderEditMenu";
import ElementToolbar from "./menus/ElementToolbar";
import DesignToolbar from "./menus/DesignToolbar";

interface HeaderEditProps {
  isFullscreen: boolean;
}

type MenuType = "none" | "element" | "design";

export default function HeaderEdit({ isFullscreen }: HeaderEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>("none");

  const handleMenuClick = (menuType: MenuType) => {
    setActiveMenu(menuType === activeMenu ? "none" : menuType);
  };

  const handleExitEdit = () => {
    setIsEditing(false);
    setActiveMenu("none");
  };

  return (
    <div className="relative">
      {/* Header Container */}
      <header
        className={`relative flex w-full items-center justify-between bg-slate-600 px-6 py-4 ${
          isEditing ? "z-30" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-white">YourWebsiteTitle</h1>
          <nav className="flex space-x-4">
            <button className="text-lg font-medium text-white/90 transition-colors hover:text-white">
              Menu
            </button>
            <button className="text-lg font-medium text-white/90 transition-colors hover:text-white">
              Reservation
            </button>
          </nav>
        </div>

        {/* Edit Overlay */}
        {isFullscreen && (isHovered || isEditing) && (
          <>
            {isHovered && !isEditing && (
              <div className="absolute inset-0 bg-black/20 transition-opacity" />
            )}
            <HeaderEditMenu
              isEditing={isEditing}
              onEditClick={() => setIsEditing(true)}
              isHovered={isHovered}
              onElementClick={() => handleMenuClick("element")}
              onDesignClick={() => handleMenuClick("design")}
              activeMenu={activeMenu}
            />
          </>
        )}
      </header>

      {/* Exit Editing Backdrop */}
      {isEditing && (
        <div
          className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
          onClick={handleExitEdit}
        />
      )}

      {/* Menus */}
      {isEditing && (
        <>
          {activeMenu === "element" && (
            <div className="absolute left-0 top-full z-40 mt-3">
              <ElementToolbar onClose={() => handleMenuClick("none")} />
            </div>
          )}
          {activeMenu === "design" && (
            <div className="absolute right-0 top-full z-40 mt-3">
              <DesignToolbar onClose={() => handleMenuClick("none")} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
