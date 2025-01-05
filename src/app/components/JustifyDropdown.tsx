import React from "react";
import {
  CiTextAlignCenter,
  CiTextAlignJustify,
  CiTextAlignLeft,
  CiTextAlignRight,
} from "react-icons/ci";

interface JustifyDropdownProps {
  onJustifyClick: (option: string) => void;
}

const JustifyDropdown: React.FC<JustifyDropdownProps> = ({ onJustifyClick }) => {
  const justifyIcons = {
    left: CiTextAlignLeft,
    center: CiTextAlignCenter,
    right: CiTextAlignRight,
    justify: CiTextAlignJustify,
  };
  type JustifyKey = keyof typeof justifyIcons;

  const handleAlignmentChange = (alignment: string) => {
    onJustifyClick(alignment);
  };

  return (
    <div className="absolute left-0 top-full mt-1 w-full rounded border bg-gray-200 shadow-lg">
      <div className="flex flex-col text-sm">
        {(
          [
            "text-left",
            "text-center",
            "text-right",
            "text-justify",
          ] as string[]
        ).map((align) => {
          const Icon = justifyIcons[align.split("-")[1] as JustifyKey];
          return (
            <div
              key={align}
              className="flex cursor-pointer items-center p-2 hover:bg-white"
              onClick={() => handleAlignmentChange(align)}
            >
              {React.createElement(Icon, { className: "mr-2" })}{" "}
              {align.split("-")[1].charAt(0).toUpperCase() +
                align.split("-")[1].slice(1)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JustifyDropdown;
