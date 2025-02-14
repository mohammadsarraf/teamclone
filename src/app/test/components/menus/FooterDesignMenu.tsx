import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";
import {
  MdOutlineStyle,
  MdFormatColorFill,
  MdBorderColor,
} from "react-icons/md";
import { BsLayoutSidebar, BsGrid } from "react-icons/bs";
import { TbSpacingVertical, TbBorderRadius } from "react-icons/tb";

interface FooterDesignMenuProps {
  onColorChange: (color: string) => void;
  handleClose: () => void;
  currentColor?: string;
}

export const FooterDesignMenu = ({
  onColorChange,
  handleClose,
  currentColor = "#ffffff",
}: FooterDesignMenuProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("style"); // style, layout, spacing

  const colors = [
    // Solids
    { name: "White", value: "#FFFFFF", category: "Solids" },
    { name: "Black", value: "#000000", category: "Solids" },
    { name: "Gray", value: "#6B7280", category: "Solids" },
    { name: "Red", value: "#EF4444", category: "Solids" },
    { name: "Orange", value: "#F97316", category: "Solids" },
    { name: "Yellow", value: "#EAB308", category: "Solids" },
    { name: "Green", value: "#22C55E", category: "Solids" },
    { name: "Blue", value: "#3B82F6", category: "Solids" },
    { name: "Purple", value: "#A855F7", category: "Solids" },
    { name: "Pink", value: "#EC4899", category: "Solids" },

    // Grays
    { name: "Gray 50", value: "#F9FAFB", category: "Grays" },
    { name: "Gray 100", value: "#F3F4F6", category: "Grays" },
    { name: "Gray 200", value: "#E5E7EB", category: "Grays" },
    { name: "Gray 300", value: "#D1D5DB", category: "Grays" },
    { name: "Gray 400", value: "#9CA3AF", category: "Grays" },
    { name: "Gray 500", value: "#6B7280", category: "Grays" },
    { name: "Gray 600", value: "#4B5563", category: "Grays" },
    { name: "Gray 700", value: "#374151", category: "Grays" },
    { name: "Gray 800", value: "#1F2937", category: "Grays" },
    { name: "Gray 900", value: "#111827", category: "Grays" },

    // Blues
    { name: "Blue 50", value: "#EFF6FF", category: "Blues" },
    { name: "Blue 100", value: "#DBEAFE", category: "Blues" },
    { name: "Blue 200", value: "#BFDBFE", category: "Blues" },
    { name: "Blue 300", value: "#93C5FD", category: "Blues" },
    { name: "Blue 400", value: "#60A5FA", category: "Blues" },
    { name: "Blue 500", value: "#3B82F6", category: "Blues" },
    { name: "Blue 600", value: "#2563EB", category: "Blues" },
    { name: "Blue 700", value: "#1D4ED8", category: "Blues" },
    { name: "Blue 800", value: "#1E40AF", category: "Blues" },
    { name: "Blue 900", value: "#1E3A8A", category: "Blues" },
  ];

  const gradients = [
    {
      name: "Blue to Purple",
      value: "linear-gradient(to right, #4F46E5, #7C3AED)",
      category: "Gradients",
    },
    {
      name: "Green to Blue",
      value: "linear-gradient(to right, #059669, #3B82F6)",
      category: "Gradients",
    },
    {
      name: "Orange to Pink",
      value: "linear-gradient(to right, #F97316, #EC4899)",
      category: "Gradients",
    },
    {
      name: "Purple to Pink",
      value: "linear-gradient(to right, #7C3AED, #EC4899)",
      category: "Gradients",
    },
    {
      name: "Teal to Lime",
      value: "linear-gradient(to right, #14B8A6, #84CC16)",
      category: "Gradients",
    },
    {
      name: "Blue to Cyan",
      value: "linear-gradient(to right, #2563EB, #06B6D4)",
      category: "Gradients",
    },
    {
      name: "Rose to Orange",
      value: "linear-gradient(to right, #E11D48, #F97316)",
      category: "Gradients",
    },
    {
      name: "Slate to Gray",
      value: "linear-gradient(to right, #475569, #6B7280)",
      category: "Gradients",
    },
  ];

  // Combine colors and gradients
  const allColors = [...colors, ...gradients];

  // Group all colors by category
  const colorCategories = allColors.reduce(
    (acc, color) => {
      if (!acc[color.category]) {
        acc[color.category] = [];
      }
      acc[color.category].push(color);
      return acc;
    },
    {} as Record<string, typeof allColors>,
  );

  const tabs = [
    { id: "style", icon: MdOutlineStyle, label: "Style" },
    { id: "layout", icon: BsLayoutSidebar, label: "Layout" },
    { id: "spacing", icon: TbSpacingVertical, label: "Spacing" },
  ];

  const getDisplayColor = (color: string) => {
    if (color.startsWith("linear-gradient")) {
      const gradientColor = gradients.find((g) => g.value === color);
      return gradientColor ? gradientColor.name : "Gradient";
    }
    return color;
  };

  return (
    <div className="fixed bottom-20 right-10 z-50 w-[360px] rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
      {/* Header with tabs */}
      <div className="flex border-b border-gray-200 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <tab.icon className="text-lg" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="p-4">
        {activeTab === "style" && (
          <div className="space-y-6">
            {/* Background Color Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Background
                </label>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <div
                    className="size-5 rounded-md border border-gray-200"
                    style={{
                      backgroundColor: currentColor.startsWith("#")
                        ? currentColor
                        : "transparent",
                      backgroundImage: currentColor.startsWith(
                        "linear-gradient",
                      )
                        ? currentColor
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <span className="font-mono">
                    {getDisplayColor(currentColor)}
                  </span>
                  <HiChevronDown
                    className={`transition-transform${
                      showColorPicker ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showColorPicker && (
                <div className="mt-2 h-48 space-y-4 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                  {Object.entries(colorCategories).map(([category, colors]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="text-xs font-medium text-gray-500">
                        {category}
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        {colors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => {
                              onColorChange(color.value);
                            }}
                            className="group space-y-1"
                          >
                            <div
                              className={`h-12 w-full rounded-lg border border-gray-200 transition-all hover:scale-105 
                                ${
                                  currentColor === color.value
                                    ? "ring-2 ring-blue-500"
                                    : "hover:ring-2 hover:ring-gray-300"
                                }`}
                              style={{
                                backgroundColor: color.value.startsWith("#")
                                  ? color.value
                                  : "transparent",
                                backgroundImage: color.value.startsWith(
                                  "linear-gradient",
                                )
                                  ? color.value
                                  : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <div className="text-center">
                              <span className="text-xs text-gray-600">
                                {color.name}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Border Radius Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Border Radius
                </label>
                <div className="flex items-center gap-2">
                  <TbBorderRadius className="text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="20"
                    className="h-1 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200"
                    // Add handler when needed
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "layout" && (
          <div className="space-y-4">
            {/* Add layout options here */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              Layout options coming soon
            </div>
          </div>
        )}

        {activeTab === "spacing" && (
          <div className="space-y-4">
            {/* Add spacing options here */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              Spacing options coming soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
