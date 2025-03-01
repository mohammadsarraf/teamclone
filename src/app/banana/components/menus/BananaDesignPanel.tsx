"use client";
import { useState, useEffect } from "react";
import { HiX, HiChevronDown } from "react-icons/hi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";
import type { HeaderLayout } from "../BananaHeader";

interface DesignToolbarProps {
  onClose: () => void;
  onLayoutChange: (layout: HeaderLayout) => void;
  onHeightChange: (height: number) => void;
  onLinkSpacingChange: (spacing: number) => void;
  onElementSpacingChange: (spacing: number) => void;
  initialLayout: HeaderLayout;
  initialHeight: number;
  initialLinkSpacing: number;
  initialElementSpacing: number;
}

type MenuView = "design" | "color";

const layoutOptions = [
  {
    name: "Option 1" as const,
    preview: (
      <div className="flex h-12 w-full items-center rounded bg-[#404040] px-3">
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Logo */}
        <div className="ml-6 flex gap-2">
          {[1, 2].map((i /* Navigation */) => (
            <div key={i} className="h-2 w-6 rounded bg-white/60" />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {[1, 2].map((i /* Dynamic Elements */) => (
            <div key={i} className="size-3 rounded-full bg-white/60" />
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Option 2" as const,
    preview: (
      <div className="flex h-12 w-full items-center justify-between rounded bg-[#404040] px-3">
        <div className="flex gap-2">
          {" "}
          {/* Left Navigation */}
          {[1, 2].map((i) => (
            <div key={i} className="h-2 w-6 rounded bg-white/60" />
          ))}
        </div>
        <div className="absolute left-1/2 h-3 w-8 -translate-x-1/2 rounded bg-white/80" />{" "}
        {/* Centered Logo */}
        <div className="flex gap-2">
          {" "}
          {/* Right Elements */}
          {[1, 2].map((i) => (
            <div key={i} className="size-3 rounded-full bg-white/60" />
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Option 3" as const,
    preview: (
      <div className="flex h-12 w-full flex-col items-center justify-center rounded bg-[#404040] px-3 py-2">
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Logo Top */}
        <div className="mt-1.5 flex items-center gap-4">
          {" "}
          {/* Nav and Elements Below */}
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-2 w-6 rounded bg-white/60" />
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="size-3 rounded-full bg-white/60" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Option 4" as const,
    preview: (
      <div className="relative flex h-12 w-full items-center justify-between rounded bg-[#404040] px-3">
        <div className="flex gap-2">
          {" "}
          {/* Left Nav */}
          {[1, 2].map((i) => (
            <div key={i} className="h-2 w-6 rounded bg-white/60" />
          ))}
        </div>
        <div className="absolute left-1/2 h-3 w-8 -translate-x-1/2 rounded bg-white/80" />{" "}
        {/* Center Logo */}
        <div className="flex gap-2">
          {" "}
          {/* Right Elements */}
          {[1, 2].map((i) => (
            <div key={i} className="size-3 rounded-full bg-white/60" />
          ))}
        </div>
      </div>
    ),
  },
];

export default function BananaDesignPanel({
  onClose,
  onLayoutChange,
  onHeightChange,
  onLinkSpacingChange,
  onElementSpacingChange,
  initialLayout,
  initialHeight,
  initialLinkSpacing,
  initialElementSpacing,
}: DesignToolbarProps) {
  const [currentView, setCurrentView] = useState<MenuView>("design");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);
  const [selectedLayout, setSelectedLayout] =
    useState<HeaderLayout>(initialLayout);
  const [headerHeight, setHeaderHeight] = useState(initialHeight);
  const [linkSpacing, setLinkSpacing] = useState(initialLinkSpacing);
  const [elementSpacing, setElementSpacing] = useState(initialElementSpacing);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    onLayoutChange(selectedLayout);
  }, [selectedLayout, onLayoutChange]);

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeaderHeight(newHeight);
    onHeightChange(newHeight);
  };

  const handleLinkSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = Number(e.target.value);
    setLinkSpacing(newSpacing);
    onLinkSpacingChange(newSpacing);
  };

  const handleElementSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = Number(e.target.value);
    setElementSpacing(newSpacing);
    onElementSpacingChange(newSpacing);
  };

  // Add cleanup for all dropdowns/pickers when toolbar is closing
  useEffect(() => {
    if (isClosing) {
      setShowLayoutDropdown(false);
      setShowColorPicker(false);
    }
  }, [isClosing]);

  // Helper function to combine class names
  const getButtonClass = (isActive: boolean) => {
    const baseClasses = "rounded-md px-3 py-1.5 font-medium transition-all";
    const activeClasses = "bg-[#333333] text-white";
    const inactiveClasses = "text-gray-400 hover:text-white hover:bg-[#262626]";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const handleClose = () => {
    setShowLayoutDropdown(false);
    setShowColorPicker(false);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <>
      {/* Main Toolbar */}
      <div
        className={`flex w-[325px] flex-col overflow-hidden rounded-lg border border-[#333333] bg-[#1a1a1a] text-sm shadow-xl transition-all duration-150 ${
          isClosing ? "translate-x-2 opacity-0" : "opacity-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#333333] px-3 py-2.5">
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentView("design")}
              className={getButtonClass(currentView === "design")}
            >
              Design
            </button>
            <button
              onClick={() => setCurrentView("color")}
              className={getButtonClass(currentView === "color")}
            >
              Color
            </button>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-[#333333] hover:text-white"
            aria-label="Close menu"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="custom-scrollbar flex h-[480px] flex-col space-y-5 overflow-y-auto p-4">
          {currentView === "design" ? (
            <>
              {/* Layout Section */}
              <div className="space-y-2.5">
                <span className="text-sm font-medium text-white">Layout</span>
                <div className="relative">
                  <button
                    onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
                    className="flex w-full flex-col rounded-lg border border-[#404040] bg-[#262626] p-3 text-left transition-colors hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-white">{selectedLayout}</span>
                      <HiChevronDown
                        className={`transition-transform${
                          showLayoutDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {/* Preview of selected layout */}
                    <div className="overflow-hidden rounded">
                      {
                        layoutOptions.find((opt) => opt.name === selectedLayout)
                          ?.preview
                      }
                    </div>
                  </button>
                </div>
              </div>

              {/* Sliders Section */}
              <div className="space-y-5">
                <span>Spacing</span>

                {/* Link Spacing Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      Link Spacing
                    </span>
                    <span className="text-xs text-gray-400">{linkSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={48}
                    value={linkSpacing}
                    onChange={handleLinkSpacingChange}
                    className="h-1.5 w-full appearance-none rounded-full bg-[#333333] accent-blue-500 hover:accent-blue-400"
                  />
                </div>

                {/* Element Spacing Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      Element Spacing
                    </span>
                    <span className="text-xs text-gray-400">{elementSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={32}
                    value={elementSpacing}
                    onChange={handleElementSpacingChange}
                    className="h-1.5 w-full appearance-none rounded-full bg-[#333333] accent-blue-500 hover:accent-blue-400"
                  />
                </div>
              </div>

                {/* Height Slider */}
                <span>Size</span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Height</span>
                    <span className="text-xs text-gray-400">{headerHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={200}
                    value={headerHeight}
                    onChange={handleHeightChange}
                    className="h-1.5 w-full appearance-none rounded-full bg-[#333333] accent-blue-500 hover:accent-blue-400"
                  />
                </div>

              {/* Style Section */}
              {/* <div className="space-y-2.5">
                <span className="text-sm font-medium text-white">Style</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Default", "Minimal", "Modern", "Classic"].map((style) => (
                    <button
                      key={style}
                      className="rounded-md border border-[#404040] bg-[#262626] px-3 py-2 text-sm text-white transition-colors hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div> */}
            </>
          ) : (
            <>
              {/* Color Section */}
              <div className="space-y-2">
                <span className="text-sm text-white">Background</span>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex w-full items-center justify-between rounded-md bg-[#404040] px-3 py-2 text-white hover:bg-[#4a4a4a]"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-black" />
                    <span>Color</span>
                  </div>
                  <HiChevronDown />
                </button>

                {showColorPicker && (
                  <div className="rounded-md bg-[#404040] p-2">
                    <div className="mb-2 flex flex-col gap-1">
                      {[
                        { label: "Solid", icon: IoColorPaletteOutline },
                        { label: "Gradient", icon: HiOutlineColorSwatch },
                        { label: "Transparent", icon: RxTransparencyGrid },
                      ].map((option) => (
                        <button
                          key={option.label}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-white hover:bg-[#505050]"
                        >
                          <option.icon className="text-lg" />
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        "#000000",
                        "#FFFFFF",
                        "#808080",
                        "#FF0000",
                        "#0000FF",
                      ].map((color) => (
                        <button
                          key={color}
                          className="group relative size-8 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Layout Dropdown Backdrop - Only show if not closing */}
      {showLayoutDropdown && !isClosing && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setShowLayoutDropdown(false)}
        >
          <div
            className="absolute z-50 w-[280px] rounded-lg border border-[#404040] bg-[#262626] shadow-xl"
            style={{
              top: "120px",
              right: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {layoutOptions.map((option) => (
              <button
                key={option.name}
                className={`w-full border-b border-[#404040] p-3 text-left transition-colors last:border-0 hover:bg-[#404040] ${
                  selectedLayout === option.name ? "bg-[#404040]" : ""
                }`}
                onClick={() => {
                  setSelectedLayout(option.name);
                  setShowLayoutDropdown(false);
                }}
              >
                <div className="mb-2 text-white">{option.name}</div>
                <div className="overflow-hidden rounded">{option.preview}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
