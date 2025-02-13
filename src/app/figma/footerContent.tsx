import React, { useState, useEffect } from "react";
import Test, { TestPageProps } from "../test/TestPage";
import { useWindowSize } from "../test/hooks/useWindowSize";
import { MdOutlineStyle } from "react-icons/md";

interface FooterState {
  gridHeight: number;
  currentRows: number;
  layout: Layout[];  // Add layout state
  activeBlock: string | null;  // Track active block
}

interface FooterContentProps {
  stateKey: string; // Add this prop to distinguish between instances
}

const DEFAULT_FOOTER_STATE: FooterState = {
  gridHeight: 450,
  currentRows: 10,
  layout: [],
  activeBlock: null,
};

const FooterContent = ({ stateKey }: FooterContentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(DEFAULT_FOOTER_STATE.gridHeight);
  const [currentRows, setCurrentRows] = useState(
    DEFAULT_FOOTER_STATE.currentRows,
  );

  // Add loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for saving/canceling changes
  const [savedState, setSavedState] = useState<FooterState>({
    gridHeight,
    currentRows,
    layout: DEFAULT_FOOTER_STATE.layout,
    activeBlock: DEFAULT_FOOTER_STATE.activeBlock,
  });

  // 3. Add unsaved changes warning
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const initialCols = 36;
  const initialRows = 10;
  const unitSize = containerWidth / initialCols;

  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedFooter = localStorage.getItem(`footerState_${stateKey}`);
        if (savedFooter) {
          const parsedState = JSON.parse(savedFooter) as FooterState;
          
          // Set initial state synchronously to prevent layout jumps
          setGridHeight(parsedState.gridHeight);
          setCurrentRows(parsedState.currentRows);
          setSavedState(parsedState);
        }
      } catch (err) {
        setError('Failed to load saved state');
        console.error('Error loading footer state:', err);
      } finally {
        // Use RAF to ensure smooth transition
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      }
    };

    loadSavedState();
  }, [stateKey]);

  // 5. Add autosave functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        handleSaveChanges();
      }, 2000); // Autosave after 2 seconds of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [gridHeight, currentRows]); // Add other tracked states

  const handleRowsChange = (newHeight: number) => {
    const newRows = Math.round(newHeight / unitSize);
    setCurrentRows(newRows);
    setGridHeight(newHeight);
    setHasUnsavedChanges(true);
  };

  const handleStartEditing = () => {
    setSavedState({
      gridHeight,
      currentRows,
      layout: savedState.layout,
      activeBlock: savedState.activeBlock,
    });
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    const newState: FooterState = {
      gridHeight,
      currentRows,
      layout: DEFAULT_FOOTER_STATE.layout,
      activeBlock: DEFAULT_FOOTER_STATE.activeBlock,
    };

    // Save state without triggering a scroll
    requestAnimationFrame(() => {
      try {
        localStorage.setItem(`footerState_${stateKey}`, JSON.stringify(newState));
        setSavedState(newState);
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error('Error saving state:', err);
      }
    });
  };

  const handleCancelEditing = () => {
    // Restore the previous saved state
    setGridHeight(savedState.gridHeight);
    setCurrentRows(savedState.currentRows);
    setIsEditing(false);
  };

  // 6. Add confirmation dialog before resetting
  const handleResetFooter = () => {
    if (window.confirm('Are you sure you want to reset? All changes will be lost.')) {
      try {
        setGridHeight(DEFAULT_FOOTER_STATE.gridHeight);
        setCurrentRows(DEFAULT_FOOTER_STATE.currentRows);
        
        // Save default state to localStorage with unique key
        localStorage.setItem(
          `footerState_${stateKey}`,
          JSON.stringify(DEFAULT_FOOTER_STATE),
        );

        // Update saved state
        setSavedState(DEFAULT_FOOTER_STATE);
        setHasUnsavedChanges(false);
        setIsEditing(false);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to reset footer');
        console.error('Error resetting footer state:', err);
      }
    }
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  // 7. Add undo/redo functionality
  const [history, setHistory] = useState<FooterState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      setGridHeight(previousState.gridHeight);
      setCurrentRows(previousState.currentRows);
    }
  };

  // 8. Add keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isEditing) {
        if (e.key === 'Escape') {
          handleCancelEditing();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          handleSaveChanges();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditing]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const testProps: TestPageProps = {
    className: "w-full",
    containerClassName: "",
    initialCols: initialCols,
    initialRows: initialRows,
    onHeightChange: handleRowsChange,
    showMenuButton: isEditing,
    stateKey: `footer_${stateKey}`,
    editBarPosition: "fixed",
    editBarOffset: 20,
    onClose: handleClose,
  };

  return (
    <div
      className="group relative flex bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transition-all duration-300"
      style={{
        height: `${gridHeight}px`,
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.3s ease-in-out',
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
