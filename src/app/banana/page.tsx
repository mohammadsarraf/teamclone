"use client";
import { useState } from "react";
import SideMenu from "./components/sidemenu";
import Edit from "./components/BananaEditor";
import { FiSave } from "react-icons/fi";
import { GrRedo, GrUndo } from "react-icons/gr";

export default function Banana() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Add save logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate save
    setIsSaving(false);
  };

  return (
    <div className="flex h-screen">
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
              className={`flex items-center justify-between ${isFullscreen ? "" : "rounded-t-lg"} bg-blue-800 p-3`}
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
                    className="rounded p-1 transition-colors hover:bg-white/10 disabled:opacity-40"
                    disabled={!canUndo}
                  >
                    <GrUndo className="size-4" />
                  </button>
                  <button
                    className="rounded p-1 transition-colors hover:bg-white/10 disabled:opacity-40"
                    disabled={!canRedo}
                  >
                    <GrRedo className="size-4" />
                  </button>
                </div>
              </div>

              {/* Center - Project Title */}
              <span className="text-sm text-white/80">My Project</span>

              {/* Right Side - Save Button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-800"
                >
                  <FiSave className="size-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div
              className={`flex-1 ${isFullscreen ? "" : "rounded-b-lg"} overflow-hidden`}
            >
              <Edit isFullscreen={isFullscreen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
