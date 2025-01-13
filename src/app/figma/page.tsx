"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopMenue from "./isEdit";
import HeaderContent from "./headerContent";
import FooterContent from "./footerContent";

export default function Page() {
  const [isEditing, setIsEditing] = useState(true);
  const [isDesignMenuVisible, setIsDesignMenuVisible] = useState(false);
  const [isElementMenuVisible, setIsElementMenuVisible] = useState(false);

  const [selectedLayout, setSelectedLayout] = useState("Option 1"); // Default to "Option 1"
  const [bgColor, setBgColor] = useState("bg-black"); // Default background color

  const handleColorChange = (color: string) => {
    setBgColor(color);
    console.log(color);
  };

  const handleLayoutSelection = (layout: string) => {
    setSelectedLayout(layout);
  };

  return (
    <div className="flex h-screen w-screen bg-white transition-all duration-500">
      {!isEditing && <Sidebar />}
      <main
        className={`flex size-full flex-col bg-gray-900 p-4 transition-all duration-500`}
      >
        {!isEditing && <TopMenue setIsEditing={setIsEditing} />}
        <div
          className={`flex grow flex-col bg-gray-500 transition-all duration-500`}
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
          <section className="grow p-4">
            {/* Section content goes here */}
          </section>
          <FooterContent />
        </div>
      </main>
    </div>
  );
}
