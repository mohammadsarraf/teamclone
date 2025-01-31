import React, { useState } from "react";
import { BsTriangle, BsCircle, BsSquare } from "react-icons/bs";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoMdResize } from "react-icons/io";
import { MdRotate90DegreesCcw, MdOutlineFlip } from "react-icons/md";
import { RxBorderWidth, RxShadow } from "react-icons/rx";

interface ShapeDesignMenuProps {
  currentShape: string;
  onShapeChange: (type: "triangle" | "circle" | "square") => void;
  onColorChange?: (color: string) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onOpacityChange?: (opacity: number) => void;
  onRotationChange?: (rotation: number) => void;
  onBorderChange?: (options: { width: number; color: string }) => void;
  currentOpacity?: number;
  currentRotation?: number;
  currentBorder?: { width: number; color: string };
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onShadowChange?: (hasShadow: boolean) => void;
  currentShadow?: boolean;
  currentFlipH?: boolean;
  currentFlipV?: boolean;
  currentColor?: string;
}

const ShapeDesignMenu: React.FC<ShapeDesignMenuProps> = ({
  currentShape,
  onShapeChange,
  onColorChange,
  onDelete,
  onDuplicate,
  onOpacityChange,
  onRotationChange,
  onBorderChange,
  currentOpacity = 100,
  currentRotation = 0,
  currentBorder = { width: 0, color: "transparent" },
  onFlipHorizontal,
  onFlipVertical,
  onShadowChange,
  currentShadow = false,
  currentFlipH = false,
  currentFlipV = false,
  currentColor,
}) => {
  const [activeSection, setActiveSection] = useState<string>("shape");

  const shapes = [
    { type: "triangle" as const, icon: BsTriangle, label: "Triangle" },
    { type: "circle" as const, icon: BsCircle, label: "Circle" },
    { type: "square" as const, icon: BsSquare, label: "Square" },
  ];

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#22c55e" },
    { name: "Yellow", value: "#eab308" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Teal", value: "#14b8a6" },
  ];

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
                onClick={() => onShapeChange(shape.type)}
                className={`flex flex-col items-center rounded-lg p-2 transition-colors
                  ${currentShape === shape.type 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-blue-50'
                  }`}
              >
                <Icon className="h-6 w-6" />
                <span className="mt-1 text-xs">{shape.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color & Opacity */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="mb-2 font-medium text-gray-800">Color</h3>
        <div className="grid grid-cols-8 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange?.(color.value)}
              className={`size-6 rounded-full transition-transform hover:scale-110 
                ${currentColor === color.value 
                  ? 'ring-2 ring-blue-400 ring-offset-2' 
                  : 'hover:ring-2 hover:ring-blue-400 hover:ring-offset-2'
                }`}
              style={{ backgroundColor: color.value }}
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
            onChange={(e) => onOpacityChange?.(Number(e.target.value))}
            className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${currentOpacity}%, #e5e7eb ${currentOpacity}%)`
            }}
          />
        </div>
      </div>

      {/* Transform */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="mb-2 font-medium text-gray-800">Transform</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Rotation</span>
              <span className="text-sm text-gray-600">{currentRotation}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={currentRotation}
              onChange={(e) => onRotationChange?.(Number(e.target.value))}
              className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${(currentRotation / 360) * 100}%, #e5e7eb ${(currentRotation / 360) * 100}%)`
              }}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onFlipHorizontal}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-2 text-sm transition-colors
                ${currentFlipH 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                }`}
            >
              <MdOutlineFlip className="h-4 w-4" />
              Flip H
            </button>
            <button 
              onClick={onFlipVertical}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg border p-2 text-sm transition-colors
                ${currentFlipV 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                }`}
            >
              <MdOutlineFlip className="h-4 w-4 rotate-90" />
              Flip V
            </button>
          </div>
        </div>
      </div>

      {/* Border & Effects */}
      <div className="mb-4 border-b border-gray-200 pb-3">
        <h3 className="mb-2 font-medium text-gray-800">Effects</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <RxBorderWidth className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Border</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="10"
                value={currentBorder.width}
                onChange={(e) => onBorderChange?.({ ...currentBorder, width: Number(e.target.value) })}
                className="w-16 rounded bg-gray-100 px-2 py-1 text-sm"
              />
              <input
                type="color"
                value={currentBorder.color}
                onChange={(e) => onBorderChange?.({ ...currentBorder, color: e.target.value })}
                className="h-6 w-6 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded px-2 py-1.5 hover:bg-blue-50">
            <div className="flex items-center gap-2">
              <RxShadow className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Shadow</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input 
                type="checkbox" 
                checked={currentShadow}
                onChange={(e) => onShadowChange?.(e.target.checked)}
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