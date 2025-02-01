import React from "react";
import { MdRotate90DegreesCcw, MdOutlineFlip } from "react-icons/md";
import { RxBorderWidth, RxShadow } from "react-icons/rx";
import { shapes } from "./constants/shapes";
import { colors } from "./constants/colors";
import { getSliderBackground } from "./utils/sliderUtils";
import { ShapeDesignMenuProps } from "./types";

const ShapeDesignMenu: React.FC<ShapeDesignMenuProps> = ({
  selectedColor,
  onColorChange,
  currentShape,
  onShapeChange,
  currentOpacity = 100,
  onOpacityChange,
  currentRotation = 0,
  onRotationChange,
  onFlipHorizontal,
  onFlipVertical,
  currentFlipH,
  currentFlipV,
  onDelete,
  onDuplicate,
  onBorderChange = () => {},
  currentBorder = { width: 0, color: "#000000" },
  onShadowChange = () => {},
  currentShadow = false,
}) => {
  return (
    <div className="w-72 rounded-lg bg-[#f8fafc] p-3 shadow-xl ring-1 ring-gray-200">
      {/* Shape Selection */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="mb-2 font-medium text-gray-800">Shape</h3>
        <div className="grid grid-cols-3 gap-2">
          {shapes.map((shape) => {
            const Icon = shape.icon;
            return (
              <button
                key={shape.type}
                onClick={() =>
                  onShapeChange(shape.type as "triangle" | "circle" | "square")
                }
                className={`flex flex-col items-center rounded-lg p-2 text-gray-700 hover:bg-blue-50 ${
                  currentShape === shape.type
                    ? "bg-blue-50 ring-1 ring-blue-500"
                    : ""
                }`}
              >
                <Icon className="size-6" />
                <span className="mt-1 text-xs">{shape.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transform */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="mb-2 font-medium text-gray-800">Transform</h3>

        {/* Rotation */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MdRotate90DegreesCcw className="text-gray-500" />
              <span className="text-sm text-gray-600">Rotation</span>
            </div>
            <span className="text-sm text-gray-600">{currentRotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={currentRotation}
            onChange={(e) => onRotationChange(Number(e.target.value))}
            className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            style={{
              background: getSliderBackground(currentRotation, 360),
            }}
          />
        </div>

        {/* Flip Controls */}
        <div className="flex gap-2">
          <button
            onClick={onFlipHorizontal}
            className={`flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm ${
              currentFlipH ? "bg-blue-50 text-blue-600" : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <MdOutlineFlip className="rotate-90" />
              <span>Flip H</span>
            </div>
          </button>
          <button
            onClick={onFlipVertical}
            className={`flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm ${
              currentFlipV ? "bg-blue-50 text-blue-600" : "text-gray-600"
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <MdOutlineFlip />
              <span>Flip V</span>
            </div>
          </button>
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

      {/* Border & Effects */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="mb-2 font-medium text-gray-800">Effects</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <RxBorderWidth className="size-4 text-gray-600" />
              <span className="text-sm text-gray-700">Border</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={currentBorder.width}
                onChange={(e) =>
                  onBorderChange({
                    ...currentBorder,
                    width: Number(e.target.value),
                  })
                }
                className="w-16 rounded bg-gray-100 px-2 py-1 text-sm"
              />
              <input
                type="color"
                value={currentBorder.color}
                onChange={(e) =>
                  onBorderChange({
                    ...currentBorder,
                    color: e.target.value,
                  })
                }
                className="size-6 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <RxShadow className="size-4 text-gray-600" />
              <span className="text-sm text-gray-700">Shadow</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={currentShadow}
                onChange={(e) => onShadowChange(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:size-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onDelete}
          className="rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          Delete
        </button>
        <button
          onClick={onDuplicate}
          className="rounded-lg px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50"
        >
          Duplicate
        </button>
      </div>
    </div>
  );
};

export default ShapeDesignMenu;
