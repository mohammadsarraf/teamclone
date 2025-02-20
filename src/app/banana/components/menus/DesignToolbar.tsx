"use client";
import { useState, useEffect } from "react";
import { HiX, HiChevronDown } from "react-icons/hi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";

interface DesignToolbarProps {
  onClose: () => void;
}

type MenuView = "design" | "color";

const layoutOptions = [
  {
    name: "Option 1",
    preview: (
      <div className="flex h-12 w-full items-center rounded bg-[#404040] px-3">
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Logo */}
        <div className="ml-6 flex gap-2"> {/* Nav Links */}
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
        </div>
        <div className="ml-auto flex items-center gap-3"> {/* Right Elements */}
          <div className="h-3 w-3 rounded-full bg-white/60" />
          <div className="h-3 w-6 rounded bg-white/80" />
        </div>
      </div>
    )
  },
  {
    name: "Option 2",
    preview: (
      <div className="flex h-12 w-full items-center justify-between rounded bg-[#404040] px-3">
        <div className="flex gap-2"> {/* Left Elements */}
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
        </div>
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Centered Logo */}
        <div className="flex gap-2"> {/* Right Elements */}
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
        </div>
      </div>
    )
  },
  {
    name: "Option 3",
    preview: (
      <div className="flex h-12 w-full flex-col items-center justify-center rounded bg-[#404040] px-3 py-2">
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Logo Top */}
        <div className="mt-1.5 flex gap-2"> {/* Nav Below */}
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
        </div>
      </div>
    )
  },
  {
    name: "Option 4",
    preview: (
      <div className="flex h-12 w-full items-center rounded bg-[#404040] px-3">
        <div className="flex gap-2"> {/* Left Nav */}
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
        </div>
        <div className="mx-auto h-3 w-8 rounded bg-white/80" /> {/* Center Logo */}
        <div className="flex gap-2"> {/* Right Nav */}
          <div className="h-2 w-6 rounded bg-white/60" />
          <div className="h-2 w-6 rounded bg-white/60" />
        </div>
      </div>
    )
  }
];

export default function DesignToolbar({ onClose }: DesignToolbarProps) {
  const [currentView, setCurrentView] = useState<MenuView>("design");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState(layoutOptions[0].name);
  const [isClosing, setIsClosing] = useState(false);

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
    // First cleanup all open states
    setShowLayoutDropdown(false);
    setShowColorPicker(false);
    setIsClosing(true);
    
    // Then trigger the closing animation
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <>
      {/* Main Toolbar */}
      <div 
        className={`flex w-[280px] flex-col overflow-hidden rounded-lg bg-[#1a1a1a] text-sm shadow-xl border border-[#333333] transition-all duration-150 ${
          isClosing ? 'opacity-0 transform translate-x-2' : 'opacity-100'
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
            className="rounded-md p-1.5 text-gray-400 hover:bg-[#333333] hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <HiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-4 space-y-5 h-[480px] overflow-y-auto custom-scrollbar">
          {currentView === "design" ? (
            <>
              {/* Layout Section */}
              <div className="space-y-2.5">
                <span className="text-sm font-medium text-white">Layout</span>
                <div className="relative">
                  <button
                    onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
                    className="flex w-full flex-col rounded-lg bg-[#262626] p-3 text-left hover:bg-[#333333] transition-colors border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-white">{selectedLayout}</span>
                      <HiChevronDown 
                        className={`transform transition-transform ${
                          showLayoutDropdown ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    {/* Preview of selected layout */}
                    <div className="overflow-hidden rounded">
                      {layoutOptions.find(opt => opt.name === selectedLayout)?.preview}
                    </div>
                  </button>
                </div>
              </div>

              {/* Sliders Section */}
              <div className="space-y-5">
                {/* Height Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Height</span>
                    <span className="text-xs text-gray-400">80px</span>
                  </div>
                  <input
                    type="range"
                    className="w-full appearance-none bg-[#333333] h-1.5 rounded-full accent-blue-500 hover:accent-blue-400"
                    defaultValue={80}
                  />
                </div>

                {/* Link Spacing Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Link Spacing</span>
                    <span className="text-xs text-gray-400">24px</span>
                  </div>
                  <input
                    type="range"
                    className="w-full appearance-none bg-[#333333] h-1.5 rounded-full accent-blue-500 hover:accent-blue-400"
                    defaultValue={24}
                  />
                </div>

                {/* Element Spacing Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Element Spacing</span>
                    <span className="text-xs text-gray-400">16px</span>
                  </div>
                  <input
                    type="range"
                    className="w-full appearance-none bg-[#333333] h-1.5 rounded-full accent-blue-500 hover:accent-blue-400"
                    defaultValue={16}
                  />
                </div>
              </div>

              {/* Alignment Section */}
              <div className="space-y-2.5">
                <span className="text-sm font-medium text-white">Alignment</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Left", "Center", "Right"].map((align) => (
                    <button
                      key={align}
                      className="rounded-md bg-[#262626] px-3 py-2 text-sm text-white hover:bg-[#333333] transition-colors border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Section */}
              <div className="space-y-2.5">
                <span className="text-sm font-medium text-white">Style</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {["Default", "Minimal", "Modern", "Classic"].map((style) => (
                    <button
                      key={style}
                      className="rounded-md bg-[#262626] px-3 py-2 text-sm text-white hover:bg-[#333333] transition-colors border border-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
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
                    <div className="h-4 w-4 rounded bg-black" />
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
                          className="group relative h-8 w-8 rounded"
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
            className="absolute z-50 w-[280px] rounded-lg bg-[#262626] shadow-xl border border-[#404040]"
            style={{
              top: '120px',
              right: '300px',
            }}
            onClick={e => e.stopPropagation()}
          >
            {layoutOptions.map((option) => (
              <button
                key={option.name}
                className={`w-full border-b border-[#404040] p-3 text-left transition-colors hover:bg-[#404040] last:border-0 ${
                  selectedLayout === option.name ? 'bg-[#404040]' : ''
                }`}
                onClick={() => {
                  setSelectedLayout(option.name);
                  setShowLayoutDropdown(false);
                }}
              >
                <div className="mb-2 text-white">{option.name}</div>
                <div className="overflow-hidden rounded">
                  {option.preview}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
} 