import React, { useState } from "react";

interface WidthLengthDropdownProps {
  onWidthChange: (width: string) => void;
  onLengthChange: (length: string) => void;
}

const WidthLengthDropdown: React.FC<WidthLengthDropdownProps> = ({
  onWidthChange,
  onLengthChange,
}) => {
  const [width, setWidth] = useState<string | null>('20'); // default width
  const [length, setLength] = useState<string | null>('20'); // default length

  const incrementWidth = () => {
    const newWidth = (parseInt(width || "0") + 1).toString();
    setWidth(newWidth);
    onWidthChange(newWidth);
  };

  const decrementWidth = () => {
    const newWidth = (parseInt(width || "0") - 1).toString();
    setWidth(newWidth);
    onWidthChange(newWidth);
  };

  const incrementLength = () => {
    const newLength = (parseInt(length || "0") + 1).toString();
    setLength(newLength);
    onLengthChange(newLength);
  };
  
  const decrementLength = () => {
    const newLength = (parseInt(length || "0") - 1).toString();
    setLength(newLength);
    onLengthChange(newLength);
  };

  const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    onWidthChange(newWidth);
  };

  const handleLengthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = e.target.value;
    setLength(newLength);
    onLengthChange(newLength);
  };

  const handleWidthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      incrementWidth();
    } else if (e.key === "ArrowDown") {
      decrementWidth();
    }
  };

  const handleLengthKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      incrementLength();
    } else if (e.key === "ArrowDown") {
      decrementLength();
    }
  };

  return (
    <div className="absolute top-full mt-1 w-auto rounded border bg-gray-200 shadow-lg">
      <div className="flex flex-col text-sm p-2">
        <label className="flex items-center">
          Width:
          <div className="flex items-center ml-2 border rounded">
            <button
              className="px-2 py-1 border-r"
              onClick={decrementWidth}
            >
              -
            </button>
            <input
              type="text"
              className="w-12 p-1 text-center"
              value={width || ""}
              onChange={handleWidthInputChange}
              onKeyDown={handleWidthKeyDown}
            />
            <button
              className="px-2 py-1 border-l"
              onClick={incrementWidth}
            >
              +
            </button>
          </div>
        </label>
        <label className="flex items-center mt-2">
          Length:
          <div className="flex items-center ml-2 border rounded">
            <button
              className="px-2 py-1 border-r"
              onClick={decrementLength}
            >
              -
            </button>
            <input
              type="text"
              className="w-12 p-1 text-center"
              value={length || ""}
              onChange={handleLengthInputChange}
              onKeyDown={handleLengthKeyDown}
            />
            <button
              className="px-2 py-1 border-l"
              onClick={incrementLength}
            >
              +
            </button>
          </div>
        </label>
      </div>
    </div>
  );
};

export default WidthLengthDropdown;
