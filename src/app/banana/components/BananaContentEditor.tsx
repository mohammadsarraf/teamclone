"use client";
import { useState } from "react";
import BananaContent from "./BananaContent";

interface ContentProps {
  isFullscreen: boolean;
}
export default function BananaContentEditor({ isFullscreen }: ContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="h-full overflow-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Content Container */}
      <div className="h-full">
        <BananaContent className="bg-gray-700" />
      </div>

      {/* Edit Overlay */}
      {isFullscreen && !isEditing && isHovered && (
        <div className="absolute inset-0 bg-black/20 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            Edit Content
          </button>
        </div>
      )}

      {/* Edit Mode UI */}
      {isEditing && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
            onClick={() => setIsEditing(false)}
          />

          {/* Edit Tools */}
          <div className="absolute inset-0 z-40">
            {/* Left Button */}
            <button className="absolute left-4 top-4 flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:shadow-xl">
              <span className="text-lg">✏️</span>
              Edit Content
            </button>

            {/* Right Menu */}
            <div className="absolute right-4 top-4 flex flex-col gap-2 rounded-md bg-white/90 p-2 shadow-lg text-black">
              <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-left transition-all hover:bg-gray-100 border border-gray-400">
                <span className="text-lg">🎨</span>
                <span>Design</span>
              </button>
              <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-left transition-all hover:bg-gray-100 border border-gray-400">
                <span className="text-lg">📝</span>
                <span>Edit Text</span>
              </button>
              <button className="flex items-center gap-2 rounded-md px-3 py-1.5 text-left transition-all hover:bg-gray-100 border border-gray-400">
                <span className="text-lg">🔧</span>
                <span>Settings</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
