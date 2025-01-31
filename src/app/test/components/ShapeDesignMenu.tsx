import React from "react";
import { BsTriangle, BsCircle, BsSquare } from "react-icons/bs";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoMdResize } from "react-icons/io";
import { MdRotate90DegreesCcw, MdOutlineFlip } from "react-icons/md";
import { RxBorderWidth, RxShadow } from "react-icons/rx";

interface ShapeDesignMenuProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  currentShape: string;
  onShapeChange: (type: "triangle" | "circle" | "square") => void;
  currentOpacity: number;
  onOpacityChange: (opacity: number) => void;
  currentRotation: number;
  onRotationChange: (rotation: number) => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  currentFlipH: boolean;
  currentFlipV: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
}

const getSliderBackground = (value: number, max: number) => {
  const percentage = (value / max) * 100;
  return `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`;
};

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
}) => {
  const shapes = [
    { type: "triangle", icon: BsTriangle, label: "Triangle" },
    { type: "circle", icon: BsCircle, label: "Circle" },
    { type: "square", icon: BsSquare, label: "Square" },
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
                onClick={() => onShapeChange(shape.type as "triangle" | "circle" | "square")}
                className={`flex flex-col items-center rounded-lg p-2 text-gray-700 hover:bg-blue-50 ${
                  currentShape === shape.type ? 'bg-blue-50 ring-1 ring-blue-500' : ''
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
              className={`size-6 rounded-full transition-transform hover:scale-110 hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 ${
                selectedColor === color.value ? 'ring-2 ring-blue-400 ring-offset-2' : ''
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
              height: '6px',
              borderRadius: '4px',
              WebkitAppearance: 'none',
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
              onChange={(e) => onRotationChange(Number(e.target.value))}
              className="mt-1 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              style={{
                background: getSliderBackground(currentRotation, 360),
                height: '6px',
                borderRadius: '4px',
                WebkitAppearance: 'none',
              }}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onFlipHorizontal}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 p-2 text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 ${
                currentFlipH ? 'bg-blue-50 border-blue-500' : ''
              }`}
            >
              <MdOutlineFlip className="h-4 w-4" />
              Flip H
            </button>
            <button 
              onClick={onFlipVertical}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 p-2 text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 ${
                currentFlipV ? 'bg-blue-50 border-blue-500' : ''
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
                value={0}
                className="w-16 rounded bg-gray-100 px-2 py-1 text-sm"
              />
              <input
                type="color"
                value="#000000"
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