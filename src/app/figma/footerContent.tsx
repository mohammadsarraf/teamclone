import React, { useState } from "react";
import Test, { TestPageProps } from "../test/TestPage";
import { useWindowSize } from "../test/hooks/useWindowSize";
import { MdOutlineStyle } from "react-icons/md";

const FooterContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(450);
  const [currentRows, setCurrentRows] = useState(10);

  const initialCols = 36;
  const initialRows = 10;
  const unitSize = containerWidth / initialCols;

  const handleRowsChange = (newHeight: number) => {
    const newRows = Math.round(newHeight / unitSize);
    setCurrentRows(newRows);
    setGridHeight(newHeight);
  };

  const testProps: TestPageProps = {
    className: "w-full",
    containerClassName: "",
    initialCols: initialCols,
    initialRows: initialRows,
    onHeightChange: handleRowsChange,
    showMenuButton: isEditing,
  };

  return (
    <div
      className="group relative z-20 flex bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transition-all duration-300"
      style={{ height: `${gridHeight}px` }}
      onMouseEnter={() => setIsFooterHovered(true)}
      onMouseLeave={() => setIsFooterHovered(false)}
    >
      <Test {...testProps} />
      {!isEditing && isFooterHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
          >
            <MdOutlineStyle className="text-lg" />
            Edit Footer
          </button>
        </div>
      )}
    </div>
  );
};

export default FooterContent;
