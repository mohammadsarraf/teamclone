"use client";
import { useState } from "react";
import HeaderEditMenu from "./BananaHeaderControls";
import ElementToolbar from "./menus/BananaElementPanel";
import DesignToolbar from "./menus/BananaDesignPanel";
import BananaHeader, { HeaderLayout } from "./BananaHeader";

interface HeaderEditProps {
  isFullscreen: boolean;
}

type MenuType = "none" | "element" | "design";

interface EnabledElements {
  isButton: boolean;
  isSocial: boolean;
  isCart: boolean;
  isAccount: boolean;
}

export default function BananaHeaderEditor({ isFullscreen }: HeaderEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>("none");
  const [enabledElements, setEnabledElements] = useState<EnabledElements>({
    isButton: false,
    isSocial: false,
    isCart: false,
    isAccount: false,
  });
  const [headerLayout, setHeaderLayout] = useState<HeaderLayout>("Option 1");
  const [headerHeight, setHeaderHeight] = useState(80);
  const [linkSpacing, setLinkSpacing] = useState(24);
  const [elementSpacing, setElementSpacing] = useState(16);

  const handleMenuClick = (menuType: MenuType) => {
    setActiveMenu(menuType === activeMenu ? "none" : menuType);
  };

  const handleExitEdit = () => {
    setIsEditing(false);
    setActiveMenu("none");
  };

  const handleElementToggle = (elements: EnabledElements) => {
    setEnabledElements(elements);
  };

  const handleLayoutChange = (layout: HeaderLayout) => {
    setHeaderLayout(layout);
  };

  const handleHeightChange = (height: number) => {
    setHeaderHeight(height);
  };

  const handleLinkSpacingChange = (spacing: number) => {
    setLinkSpacing(spacing);
  };

  const handleElementSpacingChange = (spacing: number) => {
    setElementSpacing(spacing);
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
        <BananaHeader 
          enabledElements={enabledElements} 
          layout={headerLayout}
          height={headerHeight}
          linkSpacing={linkSpacing}
          elementSpacing={elementSpacing}
        />

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
              <ElementToolbar
                onClose={() => handleMenuClick("none")}
                onElementsChange={handleElementToggle}
                initialElements={enabledElements}
              />
            </div>
          )}
          {activeMenu === "design" && (
            <div className="absolute right-0 top-full z-40 mt-3">
              <DesignToolbar
                onClose={() => handleMenuClick("none")}
                onLayoutChange={handleLayoutChange}
                initialLayout={headerLayout}
                onHeightChange={handleHeightChange}
                initialHeight={headerHeight}
                onLinkSpacingChange={handleLinkSpacingChange}
                initialLinkSpacing={linkSpacing}
                onElementSpacingChange={handleElementSpacingChange}
                initialElementSpacing={elementSpacing}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
