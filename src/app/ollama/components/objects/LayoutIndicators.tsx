import React from "react";
import { GridItem } from "../../types";

interface IndicatorProps {
  gridSettings: {
    padding: number;
    margin: number;
  };
  squareSize: number;
  layout: GridItem[];
  currentResizeItem: string | null;
  sameSizeItems: string[];
  isSquare: boolean;
}

export const LayoutIndicators: React.FC<IndicatorProps> = ({
  gridSettings,
  squareSize,
  layout,
  currentResizeItem,
  sameSizeItems,
  isSquare,
}) => {
  if (!currentResizeItem) return null;

  const currentItem = layout.find((item) => item.i === currentResizeItem);
  if (!currentItem) return null;

  // Calculate position and size for the current resize item
  const itemTop =
    currentItem.y * (squareSize + gridSettings.margin) + gridSettings.padding;
  const itemLeft =
    currentItem.x * (squareSize + gridSettings.margin) + gridSettings.padding;
  const itemWidth =
    currentItem.w * squareSize + (currentItem.w - 1) * gridSettings.margin;
  const itemHeight =
    currentItem.h * squareSize + (currentItem.h - 1) * gridSettings.margin;

  return (
    <>
      {/* Same Size Indicators */}
      {sameSizeItems.length > 0 && (
        <>
          {sameSizeItems.map((itemId) => {
            const item = layout.find((i) => i.i === itemId);
            if (!item) return null;

            const itemTop =
              item.y * (squareSize + gridSettings.margin) +
              gridSettings.padding;
            const itemLeft =
              item.x * (squareSize + gridSettings.margin) +
              gridSettings.padding;
            const itemWidth =
              item.w * squareSize + (item.w - 1) * gridSettings.margin;
            const itemHeight =
              item.h * squareSize + (item.h - 1) * gridSettings.margin;

            return (
              <div
                key={`same-size-${itemId}`}
                className="pointer-events-none absolute z-40 border-2"
                style={{
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  left: `${itemLeft}px`,
                  top: `${itemTop}px`,
                  opacity: 0.9,
                  boxSizing: "border-box",
                  borderColor: "#EC4899", // Pink-500
                  backgroundColor: "rgba(236, 72, 153, 0.08)",
                  boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.3)",
                }}
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default LayoutIndicators;
