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
  onHeightChangeComplete: (height: number) => void;
  onLinkSpacingChangeComplete: (spacing: number) => void;
  onElementSpacingChangeComplete: (spacing: number) => void;
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
  onHeightChangeComplete,
  onLinkSpacingChangeComplete,
  onElementSpacingChangeComplete,
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

  const handleLayoutChange = (newLayout: HeaderLayout) => {
    setSelectedLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeaderHeight(newHeight);
    onHeightChange(newHeight);
  };

  const handleHeightChangeComplete = () => {
    onHeightChangeComplete(headerHeight);
  };

  const handleLinkSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = Number(e.target.value);
    setLinkSpacing(newSpacing);
    onLinkSpacingChange(newSpacing);
  };

  const handleLinkSpacingChangeComplete = () => {
    onLinkSpacingChangeComplete(linkSpacing);
  };

  const handleElementSpacingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSpacing = Number(e.target.value);
    setElementSpacing(newSpacing);
    onElementSpacingChange(newSpacing);
  };

  const handleElementSpacingChangeComplete = () => {
    onElementSpacingChangeComplete(elementSpacing);
  };

  // Add cleanup for all dropdowns/pickers when toolbar is closing
  useEffect(() => {
    if (isClosing) {
      setShowLayoutDropdown(false);
      setShowColorPicker(false);
    }
  }, [isClosing]);

  // Helper function to combine class names
  const getTabClass = (isActive: boolean) => {
    return `py-3 px-3 text-center font-medium text-sm ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-black hover:text-indigo-500'}`;
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
        className={`fixed shadow-lg z-50 overflow-hidden bg-white rounded-lg border border-gray-200 transition-all duration-150 ${
          isClosing ? "translate-x-2 opacity-0" : "opacity-100"
        }`}
        style={{ 
          top: '150px', 
          right: '16px',
          width: '320px',
          maxHeight: '85vh'
        }}
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute bottom-3 right-3 p-1 rounded-full hover:bg-gray-100 z-10"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        </button>

        {/* Header with Tabs */}
        <div className="border-b">
          <div className="flex flex-wrap">
            <button
              onClick={() => setCurrentView("design")}
              className={getTabClass(currentView === "design")}
            >
              Design
            </button>
            <button
              onClick={() => setCurrentView("color")}
              className={getTabClass(currentView === "color")}
            >
              Color
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 48px)' }}>
          {currentView === "design" ? (
            <>
            <div className="p-4">
              {/* Layout Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-black uppercase mb-3">Layout</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
                    className="flex w-full flex-col rounded-md border border-gray-200 bg-white p-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-black">{selectedLayout}</span>
                      <HiChevronDown
                        className={`transition-transform ${showLayoutDropdown ? "rotate-180" : ""}`}
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

              {/* Spacing Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-black uppercase mb-3">Spacing</h3>

                {/* Link Spacing Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-black">
                      Link Spacing
                    </label>
                    <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                      <span className="text-black">{linkSpacing}px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={12}
                    max={48}
                    value={linkSpacing}
                    onChange={handleLinkSpacingChange}
                    onMouseUp={handleLinkSpacingChangeComplete}
                    onTouchEnd={handleLinkSpacingChangeComplete}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Element Spacing Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-black">
                      Element Spacing
                    </label>
                    <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                      <span className="text-black">{elementSpacing}px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={32}
                    value={elementSpacing}
                    onChange={handleElementSpacingChange}
                    onMouseUp={handleElementSpacingChangeComplete}
                    onTouchEnd={handleElementSpacingChangeComplete}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              {/* Size Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-black uppercase mb-3">Size</h3>

                {/* Height Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-black">
                      Height
                    </label>
                    <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                      <span className="text-black">{headerHeight}px</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={200}
                    value={headerHeight}
                    onChange={handleHeightChange}
                    onMouseUp={handleHeightChangeComplete}
                    onTouchEnd={handleHeightChangeComplete}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              </div>

              {/* Style Section */}
              {/* <div className="mb-6">
                <h3 className="text-xs font-semibold text-black uppercase mb-3">Style</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Default", "Minimal", "Modern", "Classic"].map((style) => (
                    <button
                      key={style}
                      className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-black transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div> */}
            </div>
            </>
          ) : (
            <>
            <div className="p-4">
              {/* Color Section */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-black uppercase mb-3">Background</h3>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-black hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-black" />
                    <span>Color</span>
                  </div>
                  <HiChevronDown />
                </button>

                {showColorPicker && (
                  <div className="mt-2 rounded-md border border-gray-200 bg-white p-3">
                    <div className="mb-3 flex flex-col gap-1">
                      {[
                        { label: "Solid", icon: IoColorPaletteOutline },
                        { label: "Gradient", icon: HiOutlineColorSwatch },
                        { label: "Transparent", icon: RxTransparencyGrid },
                      ].map((option) => (
                        <button
                          key={option.label}
                          className="flex items-center gap-2 rounded px-2 py-1.5 text-black hover:bg-gray-100"
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
                          className="group relative size-8 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </>
          )}
        </div>
      </div>

      {/* Layout Dropdown Backdrop - Only show if not closing */}
      {showLayoutDropdown && !isClosing && (
        <div
          className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm transition-opacity"
          onClick={() => setShowLayoutDropdown(false)}
        >
          <div
            className="absolute z-50 w-[280px] rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              top: "120px",
              right: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {layoutOptions.map((option) => (
              <button
                key={option.name}
                className={`w-full border-b border-gray-200 p-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                  selectedLayout === option.name ? "bg-indigo-50" : ""
                }`}
                onClick={() => {
                  handleLayoutChange(option.name);
                  setShowLayoutDropdown(false);
                }}
              >
                <div className="mb-2 text-black">{option.name}</div>
                <div className="overflow-hidden rounded">{option.preview}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
