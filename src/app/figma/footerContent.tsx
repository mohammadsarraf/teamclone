import React, { useState, useEffect } from "react";
import Test, { TestPageProps } from "../test/TestPage";
import { useWindowSize } from "../test/hooks/useWindowSize";
import { MdOutlineStyle } from "react-icons/md";

interface FooterState {
  gridHeight: number;
  currentRows: number;
}

interface FooterContentProps {
  stateKey: string; // Add this prop to distinguish between instances
}

const DEFAULT_FOOTER_STATE: FooterState = {
  gridHeight: 450,
  currentRows: 10,
};

const FooterContent = ({ stateKey }: FooterContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(DEFAULT_FOOTER_STATE.gridHeight);
  const [currentRows, setCurrentRows] = useState(
    DEFAULT_FOOTER_STATE.currentRows,
  );

  // Add state for saving/canceling changes
  const [savedState, setSavedState] = useState<FooterState>({
    gridHeight,
    currentRows,
  });

  const initialCols = 36;
  const initialRows = 10;
  const unitSize = containerWidth / initialCols;

  // Load saved state on component mount - use unique key for each instance
  useEffect(() => {
    const savedFooter = localStorage.getItem(`footerState_${stateKey}`);
    if (savedFooter) {
      const parsedState = JSON.parse(savedFooter) as FooterState;
      setGridHeight(parsedState.gridHeight);
      setCurrentRows(parsedState.currentRows);
    }
  }, [stateKey]);

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

    // Save to localStorage with unique key
    localStorage.setItem(
      `footerState_${stateKey}`,
      JSON.stringify(footerState),
    );

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

    // Save default state to localStorage with unique key
    localStorage.setItem(
      `footerState_${stateKey}`,
      JSON.stringify(DEFAULT_FOOTER_STATE),
    );

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
    stateKey: `footer_${stateKey}`, // Pass unique key to TestPage
    editBarPosition: "relative", // Add this prop
  };

  return (
    <div
      className="group relative flex bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transition-all duration-300"
      style={{
        height: `${gridHeight}px`,
        // Add z-index when editing to ensure menus are visible
        zIndex: isEditing ? 50 : 0,
      }}
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
            Edit Footer {stateKey}
          </button>
        </div>
      )}
    </div>
  );
};

export default FooterContent;
