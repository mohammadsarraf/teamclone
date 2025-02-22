"use client";
import { useState } from "react";
import HeaderEditMenu from "./BananaHeaderControls";
import ElementToolbar from "./menus/BananaElementPanel";
import DesignToolbar from "./menus/BananaDesignPanel";
import BananaHeader from "./BananaHeader";

interface HeaderEditProps {
  isFullscreen: boolean;
}

type MenuType = "none" | "element" | "design";

export default function BananaHeaderEditor({ isFullscreen }: HeaderEditProps) {
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
      {/* Header Container with hover detection */}
      <div
        className={`relative ${isEditing ? "z-30" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Actual Header Content */}
        <BananaHeader />

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
      </div>

      {/* Edit Mode UI */}
      {isEditing && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
            onClick={handleExitEdit}
          />

          {/* Toolbars */}
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
