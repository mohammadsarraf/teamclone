import React from "react";

interface TriangleProps {
  color?: string;
  className?: string;
}

const Triangle = ({
  color = "border-white",
  className = "",
}: TriangleProps) => {
  return (
    <div
      className={`relative flex size-full items-center justify-center ${className}`}
    >
      <div
        className={`clip-path-triangle absolute size-[70%]
          ${color}
          bg-current
          transition-all duration-200`}
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
    </div>
  );
};

export default Triangle;
