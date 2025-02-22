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
    <div className="relative h-full">
      {/* Content Container */}
      <div className="relative h-full">
        {/* Edit Tools Container - Sticky */}
        {isEditing && (
          <div className="sticky top-0 z-40 px-4">
            <div className="relative">
              {/* Left Button */}
              <button className="absolute left-0 flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:shadow-xl">
                <span className="text-lg">✏️</span>
                Edit Content
              </button>

              {/* Right Menu */}
              <div className="absolute right-0 flex flex-col gap-2 rounded-md bg-white/90 p-2 text-black shadow-lg">
                <button className="flex items-center gap-2 rounded-md border border-gray-400 px-3 py-1.5 text-left transition-all hover:bg-gray-100">
                  <span className="text-lg">🎨</span>
                  <span>Design</span>
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-400 px-3 py-1.5 text-left transition-all hover:bg-gray-100">
                  <span className="text-lg">📝</span>
                  <span>Edit Text</span>
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-400 px-3 py-1.5 text-left transition-all hover:bg-gray-100">
                  <span className="text-lg">🔧</span>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div
          className={`relative h-full overflow-auto ${isEditing ? "z-30" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <BananaContent className="bg-gray-700" />
        </div>

        {/* Backdrop blur */}
        {isEditing && (
          <div
            className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
            onClick={() => setIsEditing(false)}
          />
        )}
      </div>

      {/* Edit Overlay - Fixed to viewport */}
      {isFullscreen && !isEditing && isHovered && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 transition-opacity" />
          <button
            onClick={() => setIsEditing(true)}
            onMouseEnter={() => setIsHovered(true)}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            Edit Content
          </button>
        </div>
      )}
    </div>
  );
}
