"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import BananaFooter from "./BananaFooter";
import BananaItemPanel from "./menus/BananaItemPanel";
import GridSettingsMenu from "./GridSettingsMenu";
import BlockMenu from "./menus/BlockMenu";
import { ItemActionMenu } from "./objects";
import { GridItem, BlockTemplate, GridSettings } from "../types";
import useHistory from "../hooks/useHistory";

interface ContentProps {
  isFullscreen: boolean;
  onStateChange?: (state: any) => void;
}

// Define footer state here until types are correctly resolved
interface FooterState {
  layout: GridItem[];
  gridSettings: GridSettings;
  backgroundColor?: string;
  textColor?: string;
}

interface ContextMenuPosition {
  x: number;
  y: number;
}

const blockTemplates: BlockTemplate[] = [
  {
    title: "Square Block",
    description: "A perfect square shape for balanced content",
    height: 4,
    width: 4,
    type: "square",
  },
  {
    title: "Small Square",
    description: "A smaller square for compact content",
    height: 2,
    width: 2,
    type: "square",
  },
  {
    title: "Large Square",
    description: "A larger square for more content",
    height: 3,
    width: 3,
    type: "square",
  },
  {
    title: "Text Box",
    description: "Editable text area for custom content",
    height: 2,
    width: 20,
    type: "textbox",
  },
];

const defaultGridSettings: GridSettings = {
  rows: 20,
  columns: 50,
  margin: 0, // For backward compatibility
  horizontalMargin: 0,
  verticalMargin: 0,
  padding: 0,
};

export default function BananaFooterEditor({
  isFullscreen,
  onStateChange,
}: ContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [showEditSectionMenu, setShowEditSectionMenu] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] =
    useState<ContextMenuPosition | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [editSectionButtonRef, setEditSectionButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 60, left: 0 });
  const [blockMenuPosition, setBlockMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showItemToolbar, setShowItemToolbar] = useState(false);
  const [focusedItemData, setFocusedItemData] = useState<GridItem | null>(null);
  const addBlockButtonRef = useRef<HTMLButtonElement>(null);
  const hasInitialized = useRef(false);

  // Initial footer state
  const initialState: FooterState = {
    layout: [],
    gridSettings: defaultGridSettings,
    backgroundColor: "#000000",
    textColor: "#ffffff",
  };

  // Use the history hook
  const {
    state: footerState,
    addState,
    debouncedAddState,
    undo,
    redo,
    canUndo,
    canRedo,
    applyExternalState,
  } = useHistory<FooterState>(initialState, {
    onStateChange,
    debounceTime: 300,
    exposeToWindow: { key: "bananaFooterEditor" },
  });
  
  // Wait for external state application before signaling we're initialized
  useEffect(() => {
    // Mark as initialized after a small delay
    // This prevents the initialState from overriding loaded state
    const timer = setTimeout(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        
        // Only call onStateChange with current state if we haven't been initialized with external state
        if (onStateChange && JSON.stringify(footerState) === JSON.stringify(initialState)) {
          onStateChange(footerState);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [footerState, initialState, onStateChange]);

  // Extract current values from history state
  const { layout = [], gridSettings = defaultGridSettings } = footerState;

  // Add keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in edit mode
      if (!isEditing) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd+Z or Ctrl+Z
      if (cmdOrCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo: Cmd+Shift+Z or Ctrl+Y
      if (
        (cmdOrCtrl && e.key === "z" && e.shiftKey) ||
        (cmdOrCtrl && e.key === "y")
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEditing, undo, redo]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
        setShowBlockMenu(false);
        setShowGridSettings(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddBlock = (template: BlockTemplate) => {
    // Find the highest layer number and add 1 to put new block on top
    const maxLayer =
      layout.length > 0
        ? Math.max(...layout.map((item) => item.layer || 0))
        : 0;

    const newBlock: GridItem = {
      // Add 'footer-' prefix to ensure unique IDs across sections
      i: `footer-${template.type}-${layout.length + 1}`,
      x: 0,
      y: template.type === "textbox" ? 5 : 0,
      w: template.type === "textbox" ? 10 : 3,
      h: 3,
      title: `${template.title} ${layout.length + 1}`,
      type: template.type,
      content: template.type === "textbox" ? "" : undefined,
      placeholder:
        template.type === "textbox" ? "Click to edit text" : undefined,
      backgroundColor: "#3B82F6",
      textColor: template.type === "textbox" ? "#FFFFFF" : undefined,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      fontWeight: "normal",
      shadow: "none",
      layer: maxLayer + 1, // Place new blocks on top
      shapeType: template.type === "square" ? "square" : undefined, // Set default shape type for squares
      // Set default text style for textboxes
      textStyle: template.type === "textbox" ? "paragraph-1" : undefined,
      textDecoration: undefined,
      fontFamily: undefined,
    };

    const newLayout = [...layout, newBlock];
    handleLayoutChange(newLayout);
    setShowBlockMenu(false);
  };

  const handleItemClick = (itemId: string, e?: React.MouseEvent) => {
    // Find the item by id
    const item = layout.find((item) => item.i === itemId);
    if (!item) return;

    if (e) {
      e.preventDefault();
      setContextMenuPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
    setSelectedItem(item);
  };

  const handleItemUpdate = (
    updates: Partial<GridItem> | { _tempLayout: GridItem[] },
  ) => {
    if ("_tempLayout" in updates) {
      // Handle layout reordering
      const newLayout = updates._tempLayout;
      handleLayoutChange(newLayout);
      const updatedItem = newLayout.find(
        (item: GridItem) => item.i === selectedItem?.i,
      );
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    } else {
      // For non-layer updates, just update normally
      const updatedLayout = layout.map((item) =>
        item.i === selectedItem?.i ? { ...item, ...updates } : item,
      );
      handleLayoutChange(updatedLayout);
      setSelectedItem({ ...selectedItem, ...updates } as GridItem);
    }
  };

  const handleDelete = () => {
    // Filter out the selected item from layout
    const updatedLayout = layout.filter((item) => item.i !== selectedItem?.i);
    handleLayoutChange(updatedLayout);
    setSelectedItem(null); // Close the panel
  };

  const handleGridSettingChange = (key: keyof GridSettings, value: number) => {
    const updatedSettings: GridSettings = {
      ...gridSettings,
      [key]: value,
    };

    handleGridSettingsChange(updatedSettings);
  };

  const handleDragStateChange = (dragging: boolean) => {
    setIsDragging(dragging);
    if (dragging) {
      // Hide all menus when dragging starts
      setShowBlockMenu(false);
      setShowGridSettings(false);
      setSelectedItem(null);
    }
  };

  const handleFocusChange = (focusedItemId: string | null) => {
    console.log("Focus changed to:", focusedItemId);
    setFocusedItem(focusedItemId);

    // Hide menus when an item is focused
    if (focusedItemId !== null) {
      setShowBlockMenu(false);
      setShowGridSettings(false);

      // Find the focused item data
      const item = layout.find((item) => item.i === focusedItemId);
      if (item) {
        setFocusedItemData(item);
        setShowItemToolbar(true);
      }
    } else {
      setShowItemToolbar(false);
      setFocusedItemData(null);
    }
  };

  const handleGridSettingsChange = (newSettings: GridSettings) => {
    // Add to history
    addState({
      ...footerState,
      gridSettings: newSettings,
    });
  };

  const handleCloseContextMenu = () => {
    setSelectedItem(null);
    setContextMenuPosition(null);
  };

  // Update menu position when the edit section button is clicked
  const handleEditSectionClick = () => {
    if (editSectionButtonRef) {
      const rect = editSectionButtonRef.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8, // Position below the button with a small gap
        left: rect.left,
      });
    }
    setShowEditSectionMenu(!showEditSectionMenu);
    setShowBlockMenu(false);
    setShowGridSettings(false);
  };

  // Update block menu position when the add block button is clicked
  const handleAddBlockClick = () => {
    if (addBlockButtonRef.current) {
      const rect = addBlockButtonRef.current.getBoundingClientRect();
      setBlockMenuPosition({
        top: rect.bottom + 8, // Position below the button with a small gap
        left: rect.left,
      });
    }
    setShowBlockMenu(!showBlockMenu);
    setShowGridSettings(false);
    setShowEditSectionMenu(false);
  };

  // Handle clicking outside the menu to close it
  const handleOutsideClick = (e: MouseEvent) => {
    // Close Edit Section Menu when clicking outside
    if (showEditSectionMenu) {
      const menuElement = document.querySelector(".grid-settings-menu");
      if (menuElement && !menuElement.contains(e.target as Node)) {
        setShowEditSectionMenu(false);
      }
    }

    // Close Block Menu when clicking outside
    if (showBlockMenu) {
      const menuElement = document.querySelector(".block-menu");
      const buttonElement = addBlockButtonRef.current;

      // Check if click is outside both the menu and the button that opened it
      if (
        menuElement &&
        !menuElement.contains(e.target as Node) &&
        buttonElement &&
        !buttonElement.contains(e.target as Node)
      ) {
        setShowBlockMenu(false);
      }
    }
  };

  // Add event listener for outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showEditSectionMenu, showBlockMenu]);

  // Add a duplicate item function
  const handleDuplicateItem = () => {
    if (!focusedItemData) return;

    // Find the highest layer number and add 1 to put new block on top
    const maxLayer =
      layout.length > 0
        ? Math.max(...layout.map((item) => item.layer || 0))
        : 0;

    // Create a duplicate with a new ID
    const duplicatedItem: GridItem = {
      ...focusedItemData,
      // Ensure the duplicated item maintains the footer- prefix
      i: `footer-${focusedItemData.type}-${layout.length + 1}`,
      x: focusedItemData.x + 1, // Offset slightly
      y: focusedItemData.y + 1, // Offset slightly
      layer: maxLayer + 1, // Place on top
    };

    const newLayout = [...layout, duplicatedItem];
    handleLayoutChange(newLayout);
    setShowItemToolbar(false);
    setFocusedItem(null);
  };

  // Handle edit item
  const handleEditItem = () => {
    if (!focusedItemData) return;

    // For textboxes, let BananaFooter handle the edit with TextStyleMenu
    if (focusedItemData.type === "textbox") {
      // We'll let the BananaFooter component handle this
      // The toolbar will be hidden automatically when clicking outside
      setShowItemToolbar(false); // Hide the toolbar when showing the TextStyleMenu
      return;
    }

    // For non-textbox items, show the context menu
    setSelectedItem(focusedItemData);
    setContextMenuPosition({
      x: toolbarPosition.left,
      y: toolbarPosition.top + 50, // Position below the toolbar
    });

    setShowItemToolbar(false);
  };

  // Handle delete item
  const handleDeleteFocusedItem = () => {
    if (!focusedItemData) return;

    // Filter out the focused item from layout
    const updatedLayout = layout.filter((item) => item.i !== focusedItemData.i);
    handleLayoutChange(updatedLayout);
    setShowItemToolbar(false);
    setFocusedItem(null);
  };

  const handleLayoutChange = (newLayout: GridItem[]) => {
    // Add to history
    addState({
      ...footerState,
      layout: newLayout,
    });
  };

  return (
    <div className="relative flex-1">
      {/* Main Content Area */}
      <div>
        {/* Content Container */}
        <div className="relative h-full" onClick={() => {if (isFullscreen){setIsEditing(true)}}}>
          {/* Edit Tools Container - Sticky */}
          {isEditing &&
            !isDragging &&
            !selectedItem &&
            focusedItem === null && (
              <div className="sticky top-0 z-40 px-4">
                <div className="relative">
                  {/* Left Button with Dropdown - Only show when no menu is open */}
                  {!showEditSectionMenu && !showBlockMenu && (
                    <div className="absolute left-0">
                      <button
                        ref={addBlockButtonRef}
                        onClick={handleAddBlockClick}
                        className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
                      >
                        <span>Add Block</span>
                        <svg
                          className={`size-4 transition-transform ${showBlockMenu ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Block Menu - Show regardless of button visibility */}
                  {showBlockMenu && !isDragging && (
                    <BlockMenu
                      onAddBlock={handleAddBlock}
                      onClose={() => setShowBlockMenu(false)}
                      position={blockMenuPosition}
                    />
                  )}

                  {/* Right Menu - Only show Edit Section button when no menu is open */}
                  <div className="absolute right-0">
                    {!showEditSectionMenu && !showBlockMenu ? (
                      <button
                        ref={(ref) => setEditSectionButtonRef(ref)}
                        onClick={handleEditSectionClick}
                        className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
                      >
                        <span>Edit Section</span>
                        <svg
                          className={`size-4 transition-transform ${showEditSectionMenu ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    ) : (
                      showEditSectionMenu && (
                        /* Edit Section Menu */
                        <GridSettingsMenu
                          initialSettings={gridSettings}
                          onSettingsChange={handleGridSettingsChange}
                          onClose={() => setShowEditSectionMenu(false)}
                          position={menuPosition}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

          {/* Item Toolbar - Show when an item is focused */}
          {/* ItemActionMenu is now rendered directly inside BananaFooter */}

          {/* Scrollable Content */}
          <div
            className={`relative h-full overflow-auto ${isEditing ? "z-30" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              // Close menus when clicking on the content area
              if (showBlockMenu) setShowBlockMenu(false);
              if (showEditSectionMenu) setShowEditSectionMenu(false);
              if (!isDragging && !selectedItem) {
                setShowItemToolbar(false);
                setFocusedItem(null);
              }
            }}
          >
            {/* Highlight ring container */}
            <div
              className={`
              ${
                isEditing
                  ? "rounded-md bg-gradient-to-r from-indigo-500 to-blue-500 p-[4px] shadow-lg"
                  : isHovered
                    ? "rounded-md bg-indigo-200 p-[2px] shadow-md"
                    : "p-0"
              } 
              relative transition-all duration-200
              ease-in-out
            `}
            >
              {/* Editing indicator label */}
              {isEditing && (
                <div className="absolute -top-6 right-2 z-50 rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-md">
                  Editing Footer
                </div>
              )}
              <div
                className={`
                relative overflow-hidden rounded-sm
                ${
                  isEditing
                    ? "ring-2 ring-white/80"
                    : isHovered
                      ? "ring-1 ring-white/60"
                      : ""
                } transition-all
              `}
              >
                <BananaFooter
                  className="bg-gray-500"
                  layout={layout}
                  onLayoutChange={handleLayoutChange}
                  gridSettings={gridSettings}
                  onItemClick={handleItemClick}
                  onDragStateChange={handleDragStateChange}
                  onFocusChange={handleFocusChange}
                  isEditing={isEditing}
                  isInteracting={
                    showEditSectionMenu || showBlockMenu || showItemToolbar
                  }
                  onItemPanelClose={handleCloseContextMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {selectedItem && contextMenuPosition && !isDragging && (
        <div
          className="fixed z-50"
          style={{
            left: contextMenuPosition.x ,
            top: contextMenuPosition.y,
          }}
          data-item-panel-container="true"
          
        >
          <div className="w-64 rounded-lg bg-white shadow-xl">
            <BananaItemPanel
              selectedItem={selectedItem}
              onUpdate={handleItemUpdate}
              onClose={handleCloseContextMenu}
              onDelete={handleDelete}
              layout={layout}
              isDragging={isDragging}
            />
          </div>
        </div>
      )}

      {/* Backdrop blur when item is selected */}
      {selectedItem && !isDragging && (
        <div
          className="fixed inset-0 z-20 bg-black/30"
          onClick={handleCloseContextMenu}
        />
      )}

      {/* Edit mode overlay blur */}
      {isEditing && (
        <div
          className="fixed inset-x-0 bottom-0 z-10 cursor-pointer"
          style={{ top: "48px" }} // Start below the top toolbar
          onClick={() => setIsEditing(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" />
        </div>
      )}

      {/* Edit Overlay - Fixed to viewport */}
      {isFullscreen && !isEditing && isHovered && !isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50" >
          <div className="absolute inset-0 bg-black/20 transition-opacity" />
          <button
            onClick={() => setIsEditing(true)}
            onMouseEnter={() => setIsHovered(true)}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            Edit Footer
          </button>
        </div>
      )}
    </div>
  );
}
