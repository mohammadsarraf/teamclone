import React, { useState, useEffect } from "react";
import Test, { TestPageProps } from "../test/TestPage";
import { useWindowSize } from "../test/hooks/useWindowSize";
import { MdOutlineStyle } from "react-icons/md";

interface FooterState {
  gridHeight: number;
  currentRows: number;
}

const DEFAULT_FOOTER_STATE: FooterState = {
  gridHeight: 450,
  currentRows: 10,
};

const FooterContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(DEFAULT_FOOTER_STATE.gridHeight);
  const [currentRows, setCurrentRows] = useState(DEFAULT_FOOTER_STATE.currentRows);

  // Add state for saving/canceling changes
  const [savedState, setSavedState] = useState<FooterState>({
    gridHeight,
    currentRows,
  });

  const initialCols = 36;
  const initialRows = 10;
  const unitSize = containerWidth / initialCols;

  // Load saved state on component mount
  useEffect(() => {
    const savedFooter = localStorage.getItem('footerState');
    if (savedFooter) {
      const parsedState = JSON.parse(savedFooter) as FooterState;
      setGridHeight(parsedState.gridHeight);
      setCurrentRows(parsedState.currentRows);
    }
  }, []);

  const handleRowsChange = (newHeight: number) => {
    const newRows = Math.round(newHeight / unitSize);
    setCurrentRows(newRows);
    setGridHeight(newHeight);
  };

  const handleStartEditing = () => {
    setSavedState({
      gridHeight,
      currentRows,
    });
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    // Create state object to save
    const footerState: FooterState = {
      gridHeight,
      currentRows,
    };

    // Save to localStorage
    localStorage.setItem('footerState', JSON.stringify(footerState));

    // Update saved state for cancel functionality
    setSavedState(footerState);

    // Close editing mode
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    // Restore the previous saved state
    setGridHeight(savedState.gridHeight);
    setCurrentRows(savedState.currentRows);
    setIsEditing(false);
  };

  const handleResetFooter = () => {
    // Reset to default state
    setGridHeight(DEFAULT_FOOTER_STATE.gridHeight);
    setCurrentRows(DEFAULT_FOOTER_STATE.currentRows);

    // Save default state to localStorage
    localStorage.setItem('footerState', JSON.stringify(DEFAULT_FOOTER_STATE));

    // Update saved state
    setSavedState(DEFAULT_FOOTER_STATE);

    // Close editing mode
    setIsEditing(false);
  };

  const testProps: TestPageProps = {
    className: "w-full",
    containerClassName: "",
    initialCols: initialCols,
    initialRows: initialRows,
    onHeightChange: handleRowsChange,
    showMenuButton: isEditing,
    stateKey: "footer"
  };

  return (
    <div
      className="group relative z-0 flex bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transition-all duration-300"
      style={{ height: `${gridHeight}px` }}
      onMouseEnter={() => setIsFooterHovered(true)}
      onMouseLeave={() => setIsFooterHovered(false)}
    >
      <Test {...testProps} />
      
      {/* Edit Overlay */}
      {!isEditing && isFooterHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button
            onClick={handleStartEditing}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
          >
            <MdOutlineStyle className="text-lg" />
            Edit Footer
          </button>
        </div>
      )}

      {/* Edit Tools */}
      {isEditing && (
        <div className="absolute inset-x-0 -bottom-16 flex items-center justify-center gap-4">
          {/* Save/Cancel/Reset Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCancelEditing}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
            <button
              onClick={handleResetFooter}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600"
            >
              Reset Footer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterContent;
