import React, { useState, useEffect } from "react";
import Test, { TestPageProps } from "../test/page";
import { useWindowSize } from "../test/hooks/useWindowSize";

const FooterContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(450); // Default height
  const [currentRows, setCurrentRows] = useState(10); // Add state for current rows
  
  const initialCols = 36;
  const initialRows = 10;
  const unitSize = containerWidth / initialCols;

  const handleHeightChange = (height: number) => {
    setGridHeight(height);
  };

  // Add handler for row changes
  const handleRowsChange = (newHeight: number) => {
    const newRows = Math.round(newHeight / unitSize);
    setCurrentRows(newRows);
    setGridHeight(newHeight);
  };

  // Log current rows for debugging
  useEffect(() => {
    console.log('Current rows:', currentRows);
  }, [currentRows]);

  const testProps: TestPageProps = {
    className: "w-full",
    containerClassName: "px-4",
    initialCols: initialCols,
    initialRows: initialRows,
    onHeightChange: handleRowsChange, // Use the new handler
  };

  return (
    <footer 
      className="group relative flex bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transition-all duration-300"
      style={{ height: isEditing ? `${gridHeight}px` : '320px' }}
    >
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-6 py-3 text-white opacity-0 shadow-lg transition-all hover:bg-blue-700 group-hover:opacity-100"
        >
          Edit Footer
        </button>
      ) : (
        <div className="flex size-full">
          <Test {...testProps} />
        </div>
      )}
    </footer>
  );
};

export default FooterContent;
