"use client";
import React from "react";
import ShapeWrapper from "./ShapeWrapper";

interface ShapeProps {
  type: string;
  color: string;
}

const ShapeComponents = ({ type, color }: ShapeProps) => {
  const shapeClass = `size-full ${color}`;

  const handleSelect = () => {
    console.log("Shape selected");
  };

  switch (type) {
    case "triangle":
      return (
        <div className="size-full">
          <div
            className={shapeClass}
            style={{
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
    case "circle":
      return (
        <div className={`${shapeClass} rounded-full`} />
      );
    case "square":
      return (
        <div className={shapeClass} />
      );
    default:
      return null;
  }
};

export default ShapeComponents;
