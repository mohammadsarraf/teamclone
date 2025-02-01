"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { ShapeItemProps } from "../types";

// Dynamically import components with no SSR
const ShapeComponents = dynamic(() => import("./ShapeComponents"), {
  ssr: false,
});

const TextBox = dynamic(() => import("./TextBox"), { ssr: false });

const ShapeItem = ({
  type,
  color,
  text,
  onTextChange,
  isActive,
  opacity,
  rotation,
  flipH,
  flipV,
  onStartEdit,
  font,
  fontSize,
  textAlign,
  isBold,
  isItalic,
  isUnderline,
  lineHeight,
  letterSpacing,
  onEnterPress,
  onHeightChange,
  unitSize,
}: ShapeItemProps) => {
  if (!type) return null;

  if (type === "text") {
    return (
      <TextBox
        text={text || ""}
        onTextChange={onTextChange!}
        isActive={isActive}
        onStartEdit={onStartEdit}
        onEnterPress={onEnterPress}
        font={font}
        fontSize={fontSize}
        textAlign={textAlign}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        lineHeight={lineHeight}
        letterSpacing={letterSpacing}
        color={color}
        opacity={opacity}
        unitSize={unitSize}
        onHeightChange={onHeightChange}
      />
    );
  }

  return (
    <Suspense fallback={<div className="size-full bg-gray-700" />}>
      <div className="flex size-full items-center justify-center">
        <div className="size-full">
          <ShapeComponents
            type={type}
            color={color}
            opacity={opacity}
            rotation={rotation}
            flipH={flipH}
            flipV={flipV}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default ShapeItem; 