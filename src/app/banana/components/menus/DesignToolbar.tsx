"use client";
import { useState } from "react";
import ColorMenu from "@/app/figma/colorMenu";
import DesignMenu from "@/app/figma/desginMenu";

interface ToolbarProps {
  onOptionChange: (option: string) => void;
  onHeightChange: (height: number) => void;
  onBgColorChange: (color: string) => void;
  onClose: () => void;
  initialLayoutOption?: string;
  initialLinkSpacing?: number;
  initialElementSpacing?: number;
  initialHeight?: number;
}

export default function DesignToolbar({
  onOptionChange,
  onHeightChange,
  onBgColorChange,
  onClose,
  initialLayoutOption = "Option 1",
  initialLinkSpacing = 24,
  initialElementSpacing = 16,
  initialHeight = 80,
}: ToolbarProps) {
  const [currentColor, setCurrentColor] = useState("#000000");

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-[#2d2d2d] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Design</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Layout</span>
          <DesignMenu
            onOptionChange={onOptionChange}
            initialLayoutOption={initialLayoutOption}
            initialLinkSpacing={initialLinkSpacing}
            initialElementSpacing={initialElementSpacing}
            initialHeight={initialHeight}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Background</span>
          <ColorMenu
            onColorChange={(color) => {
              setCurrentColor(color);
              onBgColorChange(color);
            }}
            currentColor={currentColor}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Height</span>
          <input
            type="range"
            min="60"
            max="120"
            defaultValue={initialHeight}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-gray-600"
          />
        </div>
      </div>
    </div>
  );
} 