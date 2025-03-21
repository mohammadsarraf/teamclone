"use client";
import { useState, useEffect } from "react";
import SideMenu from "./components/sidemenu";
import Edit from "./components/BananaEditor";
import { FiSave } from "react-icons/fi";
import { GrRedo, GrUndo } from "react-icons/gr";
// Import types
import "./types";

// Local storage key matching the one in BananaEditor
const STORAGE_KEY = "banana-editor-state";

export default function Banana() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if we have saved data to show loading state
  useEffect(() => {
    // Small delay to ensure components are mounted
    const timer = setTimeout(() => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        // Even if no data is found, we still want to show the editor
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking for saved editor state:", error);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Enable undo/redo buttons based on global state
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const checkUndoRedoState = () => {
      if (window.bananaEditor) {
        setCanUndo(!!window.bananaEditor.canUndo);
        setCanRedo(!!window.bananaEditor.canRedo);
      }
    };

    // Check initially
    const timer = setTimeout(checkUndoRedoState, 1000);
    
    // Set up interval to check periodically
    const interval = setInterval(checkUndoRedoState, 500);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Handle global undo/redo
  const handleUndo = () => {
    if (window.bananaEditor?.undo) {
      window.bananaEditor.undo();
    }
  };

  const handleRedo = () => {
    if (window.bananaEditor?.redo) {
      window.bananaEditor.redo();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#1b1b1b]">
        {/* Sidebar Skeleton */}
        <div className="w-64 animate-pulse bg-[#232323]"></div>

        {/* Main Content with Window Bar */}
        <div className="flex flex-1 flex-col">
          {/* Main Content Area */}
          <div className="flex-1 bg-[#1b1b1b] p-8 overflow-hidden">
            <div className="flex h-full flex-col">
              {/* Window Bar Skeleton */}
              <div className="flex items-center justify-between rounded-t-lg border border-gray-700 bg-[#2a2a2a] p-3">
                {/* Left Side - Controls Skeleton */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="size-3 rounded-full bg-red-500/50"></div>
                    <div className="size-3 rounded-full bg-yellow-500/50"></div>
                    <div className="size-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded bg-gray-600/50"></div>
                    <div className="h-6 w-6 rounded bg-gray-600/50"></div>
                  </div>
                </div>
                
                {/* Center - Title Skeleton */}
                <div className="h-4 w-24 rounded bg-gray-600/50"></div>
                
                {/* Right Side - Save Button Skeleton */}
                <div className="h-8 w-32 rounded-md bg-indigo-600/50"></div>
              </div>

              {/* Content Container Skeleton */}
              <div className="flex-1 rounded-b-lg overflow-hidden border border-t-0 border-gray-700 bg-[#2a2a2a]">
                {/* Header Skeleton */}
                <div className="h-12 w-full animate-pulse bg-gray-700/30"></div>
                
                {/* Content Skeleton */}
                <div className="flex flex-1 h-96 flex-col space-y-4 p-8">
                  <div className="h-4 w-3/4 rounded bg-gray-700/30"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-700/30"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-700/30"></div>
                  <div className="h-4 w-2/3 rounded bg-gray-700/30"></div>
                </div>
                
                {/* Footer Skeleton */}
                <div className="h-12 w-full animate-pulse bg-gray-700/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

                {/* Undo/Redo DISABLED not working.*/}
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
