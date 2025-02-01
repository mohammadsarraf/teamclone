import React from "react";
import {
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiTextSpacing,
  RiFontSize,
  RiBold,
  RiItalic,
  RiUnderline,
  RiLineHeight,
} from "react-icons/ri";
import { fonts } from "./constants/fonts";
import { colors } from "./constants/colors";
import { getSliderBackground } from "./utils/sliderUtils";
import { TextDesignMenuProps } from "./types";

const TextDesignMenu: React.FC<TextDesignMenuProps> = ({
  selectedColor,
  onColorChange,
  currentOpacity = 100,
  onOpacityChange,
  onDelete,
  onDuplicate,
  onFontChange = () => {},
  currentFont = "Inter",
  onFontSize = () => {},
  currentFontSize = 16,
  onTextAlign = () => {},
  currentTextAlign = "left",
  onBold = () => {},
  isBold = false,
  onItalic = () => {},
  isItalic = false,
  onUnderline = () => {},
  isUnderline = false,
  onLineHeight = () => {},
  currentLineHeight = 1.5,
  onLetterSpacing = () => {},
  currentLetterSpacing = 0,
}) => {
  return (
    <div className="menu-content w-[300px] rounded-xl bg-white p-4 shadow-xl">
      <div className="max-h-[20rem] overflow-y-auto">
        {/* Menu Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Text Design</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onDuplicate}
              className="rounded-lg px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50"
            >
              Duplicate
            </button>
            <button
              onClick={onDelete}
              className="rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="space-y-6">
          {/* Typography */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <h3 className="mb-2 font-medium text-gray-800">Typography</h3>

            {/* Font Family */}
            <div className="mb-3">
              <select
                value={currentFont}
                onChange={(e) => onFontChange(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 focus:border-blue-500 focus:outline-none"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Controls */}
            <div className="mb-3 flex items-center gap-2">
              {/* Font Size */}
              <div className="flex flex-1 items-center gap-2">
                <RiFontSize className="text-gray-500" />
                <input
                  type="number"
                  value={currentFontSize}
                  onChange={(e) => onFontSize(Number(e.target.value))}
                  className="w-16 rounded border border-gray-200 px-2 py-1 text-sm text-gray-500"
                  min="8"
                  max="72"
                />
              </div>

              {/* Style Controls */}
              <button
                onClick={onBold}
                className={`rounded p-1.5 hover:bg-gray-100 ${
                  isBold ? "bg-gray-100 text-blue-500" : "text-gray-700"
                }`}
              >
                <RiBold />
              </button>
              <button
                onClick={onItalic}
                className={`rounded p-1.5 hover:bg-gray-100 ${
                  isItalic ? "bg-gray-100 text-blue-500" : "text-gray-700"
                }`}
              >
                <RiItalic />
              </button>
              <button
                onClick={onUnderline}
                className={`rounded p-1.5 hover:bg-gray-100 ${
                  isUnderline ? "bg-gray-100 text-blue-500" : "text-gray-700"
                }`}
              >
                <RiUnderline />
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex rounded-lg bg-gray-100 p-0.5">
              <button
                onClick={() => onTextAlign("left")}
                className={`flex-1 rounded p-1.5 ${
                  currentTextAlign === "left"
                    ? "bg-white text-blue-500 shadow"
                    : "text-gray-700"
                }`}
              >
                <RiAlignLeft />
              </button>
              <button
                onClick={() => onTextAlign("center")}
                className={`flex-1 rounded p-1.5 ${
                  currentTextAlign === "center"
                    ? "bg-white text-blue-500 shadow"
                    : "text-gray-700"
                }`}
              >
                <RiAlignCenter />
              </button>
              <button
                onClick={() => onTextAlign("right")}
                className={`flex-1 rounded p-1.5 ${
                  currentTextAlign === "right"
                    ? "bg-white text-blue-500 shadow"
                    : "text-gray-700"
                }`}
              >
                <RiAlignRight />
              </button>
            </div>
          </div>

          {/* Spacing */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <h3 className="mb-2 font-medium text-gray-800">Spacing</h3>

            {/* Line Height */}
            <div className="mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiLineHeight className="text-gray-500" />
                  <span className="text-sm text-gray-600">Line Height</span>
                </div>
                <span className="text-sm text-gray-600">{currentLineHeight}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={currentLineHeight}
                onChange={(e) => onLineHeight(Number(e.target.value))}
                className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                style={{
                  background: getSliderBackground(
                    ((currentLineHeight - 1) / 1) * 100,
                    100,
                  ),
                }}
              />
            </div>

            {/* Letter Spacing */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiTextSpacing className="text-gray-500" />
                  <span className="text-sm text-gray-600">Letter Spacing</span>
                </div>
                <span className="text-sm text-gray-600">
                  {currentLetterSpacing}px
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="10"
                value={currentLetterSpacing}
                onChange={(e) => onLetterSpacing(Number(e.target.value))}
                className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                style={{
                  background: getSliderBackground(
                    ((currentLetterSpacing + 2) / 12) * 100,
                    100,
                  ),
                }}
              />
            </div>
          </div>

          {/* Color & Opacity */}
          <div className="mb-4 border-b border-gray-200 pb-3">
            <h3 className="mb-2 font-medium text-gray-800">Color</h3>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  className={`size-6 rounded-full transition-transform hover:scale-110 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 ${
                    selectedColor === color.value
                      ? "ring-2 ring-blue-400 ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => onColorChange(color.value)}
                />
              ))}
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Opacity</span>
                <span className="text-sm text-gray-600">{currentOpacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentOpacity}
                onChange={(e) => onOpacityChange(Number(e.target.value))}
                className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                style={{
                  background: getSliderBackground(currentOpacity, 100),
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextDesignMenu;
