import React, { useState, useEffect } from "react";
import Test, { TestPageProps } from "../test/TestPage";
import { useWindowSize } from "../test/hooks/useWindowSize";
import { MdOutlineStyle } from "react-icons/md";

interface MainState {
  gridHeight: number;
  currentRows: number;
}

const DEFAULT_MAIN_STATE: MainState = {
  gridHeight: 600, // Taller default height for main content
  currentRows: 20, // More rows by default
};

const MainContent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMainHovered, setIsMainHovered] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(DEFAULT_MAIN_STATE.gridHeight);
  const [currentRows, setCurrentRows] = useState(DEFAULT_MAIN_STATE.currentRows);

  // Add state for saving/canceling changes
  const [savedState, setSavedState] = useState<MainState>({
    gridHeight,
    currentRows,
  });

  const initialCols = 36;
  const initialRows = 20;
  const unitSize = containerWidth / initialCols;

  // Load saved state on component mount
  useEffect(() => {
    const savedMain = localStorage.getItem('mainState');
    if (savedMain) {
      const parsedState = JSON.parse(savedMain) as MainState;
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
    const mainState: MainState = {
      gridHeight,
      currentRows,
    };

    // Save to localStorage
    localStorage.setItem('mainState', JSON.stringify(mainState));

    // Update saved state for cancel functionality
    setSavedState(mainState);

    // Close editing mode
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    // Restore the previous saved state
    setGridHeight(savedState.gridHeight);
    setCurrentRows(savedState.currentRows);
    setIsEditing(false);
  };

  const handleResetMain = () => {
    // Reset to default state
    setGridHeight(DEFAULT_MAIN_STATE.gridHeight);
    setCurrentRows(DEFAULT_MAIN_STATE.currentRows);

    // Save default state to localStorage
    localStorage.setItem('mainState', JSON.stringify(DEFAULT_MAIN_STATE));

    // Update saved state
    setSavedState(DEFAULT_MAIN_STATE);

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
    stateKey: "main"
  };

  return (
    <div
      className="group relative z-10 flex bg-white text-black shadow-xl transition-all duration-300"
      style={{ height: `${gridHeight}px` }}
      onMouseEnter={() => setIsMainHovered(true)}
      onMouseLeave={() => setIsMainHovered(false)}
    >
      {/* Add a wrapper div to contain the Test component and its EditBar */}
      <div className="relative flex w-full">
        <Test {...testProps} />
        
        {/* Edit Overlay */}
        {!isEditing && isMainHovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button
              onClick={handleStartEditing}
              className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-lg hover:bg-gray-50"
            >
              <MdOutlineStyle className="text-lg" />
              Edit Main Content
            </button>
          </div>
        )}

        {/* Edit Tools - Position at bottom but with higher z-index */}
        {isEditing && (
          <div 
            className="absolute inset-x-0 bottom-4 flex items-center justify-center"
            style={{ zIndex: 1000 }} // Higher z-index to stay above footer
          >
            <div className="flex gap-2 rounded-lg bg-gray-900/90 p-2 shadow-xl">
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
                onClick={handleResetMain}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600"
              >
                Reset Main
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent; 