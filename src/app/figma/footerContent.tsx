import React, { useState, useEffect } from "react";
import Test, { TestPageProps } from "../test/TestPage";
import { useWindowSize } from "../test/hooks/useWindowSize";
import { MdOutlineStyle } from "react-icons/md";
import { Layout } from "react-grid-layout";
import { Block } from "../test/types";

interface FooterState {
  gridHeight: number;
  currentRows: number;
  layout: Block[];
  activeBlock: string | null;
}

interface FooterContentProps {
  stateKey: string;
}

const DEFAULT_FOOTER_STATE: FooterState = {
  gridHeight: 450,
  currentRows: 10,
  layout: [],
  activeBlock: null,
};

const FooterContent = ({ stateKey }: FooterContentProps) => {
  const storageKey = `footerState_${stateKey}`;
  const [isEditing, setIsEditing] = useState(false);
  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const containerWidth = useWindowSize();
  const [gridHeight, setGridHeight] = useState(DEFAULT_FOOTER_STATE.gridHeight);
  const [currentRows, setCurrentRows] = useState(
    DEFAULT_FOOTER_STATE.currentRows,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Add state to track if this instance is being edited
  const [isActiveInstance, setIsActiveInstance] = useState(false);

  // Add layout state
  const [layout, setLayout] = useState<Block[]>([]);

  const initialCols = 36;
  const initialRows = 10;
  const unitSize = containerWidth / initialCols;

  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedFooter = localStorage.getItem(storageKey);
        if (savedFooter) {
          const parsedState = JSON.parse(savedFooter) as FooterState;
          setGridHeight(parsedState.gridHeight);
          setCurrentRows(parsedState.currentRows);
          setLayout(parsedState.layout || []); // Load saved layout
        }
      } catch (err) {
        setError("Failed to load saved state");
        console.error(`Error loading footer state for ${stateKey}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedState();
    // Always reset editing state on page load
    setIsEditing(false);
    setIsActiveInstance(false);
  }, [storageKey]);

  const handleRowsChange = (newHeight: number) => {
    const newRows = Math.round(newHeight / unitSize);
    setCurrentRows(newRows);
    setGridHeight(newHeight);
    setHasUnsavedChanges(true);
  };

  const handleStartEditing = () => {
    // Check if any other instance is being edited
    const otherInstances = document.querySelectorAll(".footer-instance");
    const isAnyInstanceEditing = Array.from(otherInstances).some(
      (instance) =>
        instance.getAttribute("data-editing") === "true" &&
        instance.getAttribute("data-key") !== stateKey,
    );

    if (isAnyInstanceEditing) {
      alert("Please finish editing the other section first.");
      return;
    }

    setIsEditing(true);
    setIsActiveInstance(true);
  };

  // Update layout change handler to handle Block type
  const handleLayoutChange = (newLayout: Layout[]) => {
    // Convert Layout to Block if necessary
    const blockLayout = newLayout.map(item => ({
      ...item,
      shape: (layout.find(block => block.i === item.i)?.shape || 'text'),
      color: (layout.find(block => block.i === item.i)?.color || '#000000'),
      opacity: (layout.find(block => block.i === item.i)?.opacity || 100),
    })) as Block[];
    setLayout(blockLayout);
    setHasUnsavedChanges(true);
  };

  // Update save handler to include layout
  const handleSaveChanges = () => {
    try {
      const stateToSave: FooterState = {
        gridHeight,
        currentRows,
        layout: layout,
        activeBlock: null,
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      setHasUnsavedChanges(false);
      setIsEditing(false);
      setIsActiveInstance(false);
    } catch (err) {
      setError("Failed to save changes");
      console.error(`Error saving footer state for ${stateKey}:`, err);
    }
  };

  const handleCancelEditing = () => {
    // Restore the previous saved state
    setGridHeight(DEFAULT_FOOTER_STATE.gridHeight);
    setCurrentRows(DEFAULT_FOOTER_STATE.currentRows);
    setIsEditing(false);
  };

  // 6. Add confirmation dialog before resetting
  const handleResetFooter = () => {
    if (
      window.confirm(
        "Are you sure you want to reset? All changes will be lost.",
      )
    ) {
      try {
        setGridHeight(DEFAULT_FOOTER_STATE.gridHeight);
        setCurrentRows(DEFAULT_FOOTER_STATE.currentRows);

        // Save default state to localStorage with unique key
        localStorage.setItem(storageKey, JSON.stringify(DEFAULT_FOOTER_STATE));

        // Update saved state
        setIsEditing(false);
        setError(null); // Clear any previous errors
      } catch (err) {
        setError("Failed to reset footer");
        console.error("Error resetting footer state:", err);
      }
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setIsActiveInstance(false);
    setHasUnsavedChanges(false);
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
        if (e.key === "Escape") {
          handleCancelEditing();
        } else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          handleSaveChanges();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isEditing]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Add block handler
  const handleAddBlock = (text: string, type?: string) => {
    if (!isActiveInstance) return; // Only add blocks to active instance
    // Your block adding logic here
  };

  const testProps: TestPageProps = {
    className: "w-full",
    containerClassName: "",
    initialCols: initialCols,
    initialRows: initialRows,
    onHeightChange: handleRowsChange,
    showMenuButton: isEditing && isActiveInstance,
    stateKey: `footer_${stateKey}`,
    editBarPosition: "fixed",
    editBarOffset: 20,
    onClose: () => {
      setIsEditing(false);
      setIsActiveInstance(false);
      setHasUnsavedChanges(false);
    },
    layout: layout,
    onLayoutChange: handleLayoutChange,
    onAddBlock: handleAddBlock,
    isActiveInstance: isActiveInstance,
  };

  return (
    <div
      className={`footer-instance group relative flex bg-gradient-to-b from-gray-900 to-black text-white shadow-xl transition-all duration-300 ${
        isActiveInstance ? "z-50" : "z-0"
      }`}
      style={{
        height: `${gridHeight}px`,
        opacity: isLoading ? 0 : 1,
        transition: "opacity 0.3s ease-in-out",
      }}
      onMouseEnter={() => !isEditing && setIsFooterHovered(true)}
      onMouseLeave={() => !isEditing && setIsFooterHovered(false)}
      data-key={stateKey}
      data-editing={isEditing}
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
