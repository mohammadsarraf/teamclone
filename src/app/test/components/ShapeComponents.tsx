"use client";
import React from "react";
import ShapeWrapper from "./ShapeWrapper";

interface ShapeProps {
  type: string;
  color: string;
  opacity: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
}

const ShapeComponents = ({
  type,
  color,
  opacity = 100,
  rotation = 0,
  flipH = false,
  flipV = false,
}: ShapeProps) => {
  const shapeStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: color,
    opacity: opacity / 100,
    transform: `
      rotate(${rotation}deg)
      scaleX(${flipH ? -1 : 1})
      scaleY(${flipV ? -1 : 1})
    `,
    transition: "transform 0.2s, opacity 0.2s",
  };

  const handleSelect = () => {
    console.log("Shape selected");
  };

  switch (type) {
    case "triangle":
      return (
        <div className="size-full">
          <div
            style={{
              ...shapeStyle,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
        </div>
      );
    case "circle":
      return <div style={shapeStyle} className="rounded-full" />;
    case "square":
      return <div style={shapeStyle} />;
    default:
      return null;
  }
};

export default ShapeComponents;
