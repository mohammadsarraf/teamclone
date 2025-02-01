"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopMenu from "./isEdit";
import HeaderContent from "./headerContent";
import FooterContent from "./footerContent";

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
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
    <div className="flex h-screen w-screen bg-gray-600">
      {!isEditing && <Sidebar />}
      <main className="flex grow p-6">
        <div className="flex w-full flex-col overflow-hidden rounded-lg bg-[#141414] shadow-xl">
          {!isEditing && (
            <TopMenu
              setIsEditing={setIsEditing}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          )}
          <div className="flex min-h-0 grow flex-col overflow-auto">
            <div
              className={`flex min-h-0 flex-col transition-all duration-300 ${
                viewMode === "mobile" ? "w-[375px]" : "w-full"
              }`}
            >
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
              <section className="flex-1">
                {/* Section content goes here */}
              </section>
              <FooterContent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
