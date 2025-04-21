import React from "react";
import ShapeBase, { ShapeProps } from "./ShapeBase";

export default function SectionShape({
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
    ></ShapeBase>
  );
}
