"use client";
import React from "react";
import ShapeWrapper from "./ShapeWrapper";

interface ShapeProps {
  type: string;
  color: string;
}

const ShapeComponents = ({ type, color }: ShapeProps) => {
  const shapeStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: color,
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
      return (
        <div style={shapeStyle} className="rounded-full" />
      );
    case "square":
      return (
        <div style={shapeStyle} />
      );
    default:
      return null;
  }
};

export default ShapeComponents;
