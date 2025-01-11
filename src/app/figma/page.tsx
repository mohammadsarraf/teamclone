"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopMenue from "./isEdit";
import { MdDragHandle } from "react-icons/md";
import DesignMenu from "./desginMenu";

export default function Page() {
  const [isEditing, setIsEditing] = useState(true);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(100); // Initial height of the header
  const [isResizing, setIsResizing] = useState(false);
  const [isDesignMenuVisible, setIsDesignMenuVisible] = useState(false);

  const handleMouseMove = (e) => {
    if (isResizing) {
      setHeaderHeight(e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
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
            className={`relative flex bg-red-400 p-4 text-white shadow-md hover:bg-gray-700 ${isHeaderHovered ? "bg-gray-700" : ""}`}
            style={{ height: `${headerHeight}px` }}
            onMouseEnter={() => setIsHeaderHovered(true)}
            onMouseLeave={() => setIsHeaderHovered(false)}
          >
            <h1 className="text-2xl font-bold">Header</h1>
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
                  {isDesignMenuVisible && <DesignMenu />}
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
