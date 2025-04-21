import React from "react";
import ShapeBase, {
  ShapeProps,
  getBaseStyles,
  GroupIndicator,
} from "./ShapeBase";

export default function CircleShape({
  item,
  isBeingDragged,
  isFocused,
  isHovered,
  shadowClasses,
}: ShapeProps) {
  // For circle shapes, we use the ShapeBase component with borderRadius set to 50% in getBaseStyles
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
