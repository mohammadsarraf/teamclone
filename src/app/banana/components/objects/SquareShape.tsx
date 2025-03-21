import React from "react";
import ShapeBase, { ShapeProps, GroupIndicator } from "./ShapeBase";

export default function SquareShape({
  item,
  isBeingDragged,
  isFocused,
  isHovered,
  shadowClasses,
}: ShapeProps) {
  return (
    <ShapeBase
      item={item}
      isBeingDragged={isBeingDragged}
      isFocused={isFocused}
      isHovered={isHovered}
      shadowClasses={shadowClasses}
    />
  );
}
