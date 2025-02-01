// @ts-nocheck
"use client";
import { Illustration, Box, Cylinder, Shape } from "react-zdog";

interface ZdogProps {
  type: string;
  color: string;
}

const ZdogComponents = ({ type, color }: ZdogProps) => {
  const colorHex = color.includes("blue")
    ? "#3B82F6"
    : color.includes("red")
      ? "#EF4444"
      : color.includes("green")
        ? "#10B981"
        : "#FFFFFF";

  return (
    <Illustration zoom={8} className="size-full">
      {type === "square" && (
        <Box
          width={20}
          height={20}
          depth={20}
          color={colorHex}
          stroke={false}
          rotate={{ y: 0.5 }}
        />
      )}
      {type === "circle" && (
        <Cylinder
          diameter={20}
          length={1}
          color={colorHex}
          stroke={false}
          rotate={{ x: 0.5 }}
        />
      )}
      {type === "triangle" && (
        <Shape
          path={[
            { x: -10, y: 10 },
            { x: 10, y: 10 },
            { x: 0, y: -10 },
          ]}
          color={colorHex}
          stroke={false}
          rotate={{ y: 0.3 }}
          fill
        />
      )}
    </Illustration>
  );
};

export default ZdogComponents;
