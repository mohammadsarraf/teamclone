"use client";
import { useState, useEffect } from "react";
import SideMenu from "./components/sidemenu";
import Edit from "./components/BananaEditor";
import { FiSave } from "react-icons/fi";
import { GrRedo, GrUndo } from "react-icons/gr";
// Import types
import "./types";

export default function Banana() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="flex h-screen bg-[#1b1b1b]">
      {/* Sidebar - Hide in fullscreen */}
      {!isFullscreen && <SideMenu />}

      {/* Main Content with Window Bar */}
      <div className={`flex flex-col ${isFullscreen ? "w-screen" : "flex-1"}`}>
        {/* Main Content Area */}
        <div
          className={`flex-1 ${isFullscreen ? "" : "bg-[#1b1b1b] p-8"} overflow-hidden`}
        >
          <div className="flex h-full flex-col">
            {/* Window Bar */}
            <div
              className={`flex items-center justify-between ${isFullscreen ? "" : "rounded-t-lg"} border border-gray-700 bg-[#2a2a2a] p-3`}
            >
              {/* Left Side - Window Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="size-3 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={() => isFullscreen && setIsFullscreen(false)}
                  />
                  <button className="size-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
                  <button
                    className="size-3 rounded-full bg-green-500 hover:bg-green-600"
                    onClick={() => !isFullscreen && setIsFullscreen(true)}
                  />
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center space-x-2 text-white/80">
                  <button
                    className="rounded p-1 transition-colors hover:bg-[#3a3a3a] disabled:opacity-40"
                    disabled={true}
                  >
                    <GrUndo className="size-4 [&>path]:stroke-white" />
                  </button>
                  <button
                    className="rounded p-1 transition-colors hover:bg-[#3a3a3a] disabled:opacity-40"
                    disabled={true}
                  >
                    <GrRedo className="size-4 [&>path]:stroke-white" />
                  </button>
                </div>
              </div>

              {/* Center - Project Title */}
              <span className="text-sm font-medium text-white/90">
                My Project
              </span>

              {/* Right Side - Save Button */}
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
                  disabled={true}
                >
                  <FiSave className="size-4" />
                  {false ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div
              className={`flex-1 ${isFullscreen ? "" : "rounded-b-lg"} overflow-hidden border border-t-0 border-gray-700 bg-[#2a2a2a]`}
            >
              <Edit isFullscreen={isFullscreen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
