"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import HeaderContent from "./headerContent";
import FooterContent from "./footerContent";

export default function Page() {
  const [isEditing, setIsEditing] = useState(true);
  const [isDesignMenuVisible, setIsDesignMenuVisible] = useState(false);
  const [isElementMenuVisible, setIsElementMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedLayout, setSelectedLayout] = useState("Option 1");
  const [bgColor, setBgColor] = useState("bg-black");

  const handleColorChange = (color: string) => {
    setBgColor(color);
  };

  const handleLayoutSelection = (layout: string) => {
    setSelectedLayout(layout);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-600">
      {!isEditing && <Sidebar />}
      <main className={`relative grow ${isEditing ? 'p-0' : 'p-6'}`}>
        {/* Windows-like container */}
        <div 
          className={`flex flex-col overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-2xl transition-all duration-300
            ${isEditing ? 'fixed inset-0 z-[100] rounded-none border-none' : 'h-full'}
            ${viewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}
        >
          {/* Combined Window Title Bar and TopMenu */}
          <div className="flex h-12 items-center justify-between bg-gray-900 px-4">
            <div className="flex items-center space-x-4">
              {/* Window Controls */}
              <div className="flex items-center space-x-2">
                <div className="size-3 rounded-full bg-red-500"></div>
                <div className="size-3 rounded-full bg-yellow-500"></div>
                <div className="size-3 rounded-full bg-green-500"></div>
              </div>
              {/* Edit Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
                >
                  <span className="text-sm">Edit</span>
                </button>
              )}
            </div>

            {/* Window Title */}
            <span className="text-sm text-gray-400">Website Preview</span>

            {/* View Controls */}
            {!isEditing && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center rounded bg-[#2d2d2d] p-1">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`flex items-center rounded px-3 py-1.5 text-sm ${
                      viewMode === "desktop"
                        ? "bg-[#404040] text-white"
                        : "text-[#999999] hover:text-white"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`flex items-center rounded px-3 py-1.5 text-sm ${
                      viewMode === "mobile"
                        ? "bg-[#404040] text-white"
                        : "text-[#999999] hover:text-white"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Window Content */}
          <div className="flex grow flex-col overflow-auto">
            <HeaderContent
              selectedLayout={selectedLayout}
              bgColor={bgColor}
              handleColorChange={handleColorChange}
              handleLayoutSelection={handleLayoutSelection}
              isElementMenuVisible={isElementMenuVisible}
              setIsElementMenuVisible={setIsElementMenuVisible}
              isDesignMenuVisible={isDesignMenuVisible}
              setIsDesignMenuVisible={setIsDesignMenuVisible}
            />
            <section className="grow">
              {/* Main content area */}
            </section>
            <FooterContent />
          </div>
        </div>
      </main>
    </div>
  );
}