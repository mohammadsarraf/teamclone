"use client";
import React from "react";

interface ShapeProps {
  type: string;
  color: string;
}

const ShapeComponents = ({ type, color }: ShapeProps) => {
  const colorHex = color.includes("blue")
    ? "#3B82F6"
    : color.includes("red")
      ? "#EF4444"
      : color.includes("green")
        ? "#10B981"
        : "#FFFFFF";

  return (
    <div
      className="flex size-full items-center justify-center"
      style={{ transition: "transform 200ms ease" }}
    >
      <div className="aspect-square max-h-full w-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
        >
          {type === "square" && (
            <rect x="5" y="5" width="90" height="90" fill={colorHex} />
          )}

          {type === "circle" && (
            <circle cx="50" cy="50" r="45" fill={colorHex} />
          )}

          {type === "triangle" && (
            <polygon points="50,5 95,95 5,95" fill={colorHex} />
          )}
        </svg>
      </div>
    </div>
  );
};

export default ShapeComponents;
