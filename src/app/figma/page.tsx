"use client";
import { useState, MouseEvent, JSX } from "react";
import Sidebar from "./Sidebar";
import TopMenue from "./isEdit";
import { MdDragHandle } from "react-icons/md";
import DesignMenu from "./desginMenu";

const HeaderContent = ({ selectedLayout }: { selectedLayout: string }) => {
  const layouts: { [key: string]: JSX.Element } = {
    "Option 1": (
      <>
        <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
        <div className="flex space-x-4">
          <button className="rounded px-2 py-1 text-2xl font-bold text-white">
            Menu
          </button>
          <button className="rounded px-2 py-1 text-2xl font-bold text-white">
            Reservation
          </button>
        </div>
      </>
    ),
    "Option 2": (
      <>
        <div className="flex space-x-4">
          <h1 className="text-2xl font-bold">Menu</h1>
          <button className="rounded px-2 py-1 text-2xl font-bold text-white">
            YourWebsiteTitle
          </button>
        </div>
        <button className="text-whit rounded px-2 py-1 text-2xl font-bold">
          Reservation
        </button>
      </>
    ),
    "Option 3": (
      <>
        <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
        <h1 className="rounded px-2 py-1 text-2xl font-bold text-white">
          Menu
        </h1>
        <button className="text-whit rounded px-2 py-1 text-2xl font-bold ">
          Reservation
        </button>
      </>
    ),
    "Option 4": (
      <>
        <button className="rounded px-2 py-1 text-2xl font-bold text-white">
          Menu
        </button>
        <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
        <button className="rounded px-2 py-1 text-2xl font-bold text-white">
          Reservation
        </button>
      </>
    ),
  };

  return layouts[selectedLayout] || null;
};

export default function Page() {
  const [isEditing, setIsEditing] = useState(true);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(3); // Initial height of the header
  const [isResizing, setIsResizing] = useState(false);
  const [isDesignMenuVisible, setIsDesignMenuVisible] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("Option 1"); // Default to "Option 1"

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      setHeaderHeight((prevHeight) => {
        const newHeight = prevHeight + e.movementY * 0.1; // Adjust the scaling factor as needed
        return newHeight > 12 ? 12 : newHeight; // Ensure the height does not exceed 12vw
      });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleLayoutSelection = (layout: string) => {
    setSelectedLayout(layout);
  };

  const handleHeightChange = (height: number) => {
    setHeaderHeight(height + 2);
  };

  return (
    <div
      className="flex h-screen w-screen bg-white transition-all duration-500"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {!isEditing && <Sidebar />}
      <main
        className={`bg-gray-900 ${isEditing ? "w-full" : "w-4/5"} flex h-full flex-col p-4 transition-all duration-500`}
      >
        {!isEditing && <TopMenue setIsEditing={setIsEditing} />}
        <div
          className={`flex grow flex-col bg-gray-500 transition-all duration-500`}
        >
          <header
            className={`relative flex items-center justify-between bg-black p-4 text-white shadow-md hover:bg-opacity-70 ${isHeaderHovered ? "bg-gray-700" : ""}`}
            style={{ height: `${headerHeight}vw` }}
            onMouseEnter={() => setIsHeaderHovered(true)}
            onMouseLeave={() => setIsHeaderHovered(false)}
          >
            <HeaderContent selectedLayout={selectedLayout} />
            {isHeaderHovered && !isHeaderEditing && (
              <button
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-blue-500 px-2 py-1 text-white"
                onClick={() => setIsHeaderEditing(true)}
              >
                Edit Header
              </button>
            )}
            {isHeaderEditing && (
              <MdDragHandle
                className="absolute -bottom-2 right-0 cursor-row-resize bg-gray-700"
                size={24} // Set the size of the icon here
                onMouseDown={() => setIsResizing(true)}
              />
            )}
          </header>
          {isHeaderEditing && (
            <div className="my-10 flex flex-col">
              <div className="flex justify-between">
                <button className="mx-10 rounded bg-white px-2 py-1 text-black">
                  Add Element
                </button>
                <div className="relative mx-10">
                  <button
                    className="rounded bg-white px-2 py-1 text-black"
                    onClick={() => setIsDesignMenuVisible(!isDesignMenuVisible)}
                  >
                    Edit Design
                  </button>
                  {isDesignMenuVisible && (
                    <DesignMenu
                      onOptionChange={handleLayoutSelection}
                      initialHeight={headerHeight}
                      onHeightChange={handleHeightChange}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <section className="grow p-4">
            {/* Section content goes here */}
          </section>
          <footer className="flex bg-blue-600 p-4 text-white shadow-md">
            <p className="text-lg">Footer</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
