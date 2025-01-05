import React from "react";
import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
} from "react-icons/bs";

interface SizeDropdownProps {
  onSizeClick: (option: string) => void;
}

const SizeDropdown: React.FC<SizeDropdownProps> = ({ onSizeClick }) => {
  const headingIcons = {
    H1: BsTypeH1,
    H2: BsTypeH2,
    H3: BsTypeH3,
    H4: BsTypeH4,
    H5: BsTypeH5,
    H6: BsTypeH6,
  };
  type HeadingKey = keyof typeof headingIcons;

  const handleSizeChange = (size: string) => {
    onSizeClick(size);
  };

  return (
    <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
      <div className="flex flex-col text-sm">
        {(
          [
            "text-6xl",
            "text-5xl",
            "text-4xl",
            "text-3xl",
            "text-2xl",
            "text-xl",
          ] as string[]
        ).map((size, index) => {
          const heading = `H${index + 1}`;
          const Icon = headingIcons[heading as HeadingKey];
          return (
            <div
              key={size}
              className="flex cursor-pointer items-center p-2 hover:bg-white"
              onClick={() => handleSizeChange(size)}
            >
              {React.createElement(Icon, { className: "mr-2" })} Heading{" "}
              {heading[1]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SizeDropdown;
