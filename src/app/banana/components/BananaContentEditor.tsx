"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import BananaContent from "./BananaContent";
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

// Define content state here until types are correctly resolved
interface ContentState {
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
  margin: 8, // For backward compatibility
  horizontalMargin: 0,
  verticalMargin: 0,
  padding: 0,
};

export default function BananaContentEditor({ isFullscreen, onStateChange }: ContentProps) {
  // Initialize with default content state
  const initialState: ContentState = {
    layout: [],
    gridSettings: defaultGridSettings,
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };
  
  // Use history hook for state management
  const {
    state: contentState,
    addState,
    debouncedAddState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<ContentState>(initialState, {
    onStateChange, // Pass through to parent if provided
    debounceTime: 300,
    exposeToWindow: { key: "bananaContentEditor" }
  });
  
  // Extract current values from history state
  const { layout = [], gridSettings = defaultGridSettings } = contentState;

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

  const handleAddBlock = (template: BlockTemplate) => {
    // Find the highest layer number and add 1 to put new block on top
    const maxLayer =
      layout.length > 0
        ? Math.max(...layout.map((item: GridItem) => item.layer || 0))
        : 0;

    const newBlock: GridItem = {
      i: `${template.type}-${layout.length + 1}`,
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
    
    // Add to history
    addState({
      ...contentState,
      layout: newLayout
    });
    
    setShowBlockMenu(false);
  };

  const handleItemClick = (itemId: string, e?: React.MouseEvent) => {
    // Find the item by id
    const item = layout.find((item: GridItem) => item.i === itemId);
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
    let updatedLayout: GridItem[];
    let updatedSelectedItem: GridItem | null = selectedItem;
    
    if ("_tempLayout" in updates) {
      // Handle layout reordering
      updatedLayout = updates._tempLayout;
      updatedSelectedItem = updates._tempLayout.find(
        (item: GridItem) => item.i === selectedItem?.i,
      ) || null;
    } else {
      // For non-layer updates, just update normally
      updatedLayout = layout.map((item: GridItem) =>
        item.i === selectedItem?.i ? { ...item, ...updates } : item,
      );
      updatedSelectedItem = selectedItem ? { ...selectedItem, ...updates } as GridItem : null;
    }
    
    // Add to history
    addState({
      ...contentState,
      layout: updatedLayout
    });
    
    setSelectedItem(updatedSelectedItem);
  };

  const handleDelete = () => {
    // Filter out the selected item from layout
    const updatedLayout = layout.filter((item: GridItem) => item.i !== selectedItem?.i);
    
    // Add to history
    addState({
      ...contentState,
      layout: updatedLayout
    });
    
    setSelectedItem(null); // Close the panel
  };

  const handleGridSettingChange = (key: keyof GridSettings, value: number) => {
    const updatedSettings = {
      ...gridSettings,
      [key]: value,
    };
    
    // Add to history (debounced for slider values)
    debouncedAddState({
      ...contentState,
      gridSettings: updatedSettings
    });
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
    setFocusedItem(focusedItemId);

    // Hide menus when an item is focused
    if (focusedItemId !== null) {
      setShowBlockMenu(false);
      setShowGridSettings(false);

      // Find the focused item data
      const item = layout.find((item: GridItem) => item.i === focusedItemId);
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
    // Ensure all required properties are present
    const updatedSettings: GridSettings = {
      ...gridSettings,
      ...newSettings,
      // Make sure horizontalMargin and verticalMargin are set even if they weren't in newSettings
      horizontalMargin:
        newSettings.horizontalMargin ??
        newSettings.margin ??
        gridSettings.horizontalMargin,
      verticalMargin:
        newSettings.verticalMargin ??
        newSettings.margin ??
        gridSettings.verticalMargin,
    };
    
    // Add to history
    addState({
      ...contentState,
      gridSettings: updatedSettings
    });
  };

  const handleCloseContextMenu = () => {
    setSelectedItem(null);
    setContextMenuPosition(null);
  };

  const handleLayoutChange = (newLayout: GridItem[]) => {
    // Add to history
    addState({
      ...contentState,
      layout: newLayout
    });
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
        ? Math.max(...layout.map((item: GridItem) => item.layer || 0))
        : 0;

    // Create a duplicate with a new ID
    const duplicatedItem: GridItem = {
      ...focusedItemData,
      i: `${focusedItemData.type}-${layout.length + 1}`,
      x: focusedItemData.x + 1, // Offset slightly
      y: focusedItemData.y + 1, // Offset slightly
      layer: maxLayer + 1, // Place on top
    };

    // Add duplicated item to layout via history
    addState({
      ...contentState,
      layout: [...layout, duplicatedItem]
    });
    
    setShowItemToolbar(false);
    setFocusedItem(null);
  };

  // Handle edit item
  const handleEditItem = () => {
    if (!focusedItemData) return;

    // For textboxes, let BananaContent handle the edit with TextStyleMenu
    if (focusedItemData.type === "textbox") {
      // We'll let the BananaContent component handle this
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
    const updatedLayout = layout.filter((item: GridItem) => item.i !== focusedItemData.i);
    
    // Add to history
    addState({
      ...contentState,
      layout: updatedLayout
    });
    
    setShowItemToolbar(false);
    setFocusedItem(null);
  };

  return (
    <div className="relative flex-1">
      {/* Main Content Area */}
      <div>
        {/* Content Container */}
        <div className="relative h-full">
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
          {/* ItemActionMenu is now rendered directly inside BananaContent */}

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
            <div className={`
              ${isEditing 
                ? "p-[4px] bg-gradient-to-r from-indigo-500 to-blue-500 rounded-md shadow-lg" 
                : isHovered 
                  ? "p-[2px] bg-indigo-200 rounded-md shadow-md" 
                  : "p-0"
              } 
              transition-all duration-200 ease-in-out
              relative
            `}>
              {/* Editing indicator label */}
              {isEditing && (
                <div className="absolute -top-6 right-2 bg-indigo-600 text-white text-xs font-semibold py-1 px-2 rounded shadow-md z-50">
                  Editing Content
                </div>
              )}
              <div className={`
                relative rounded-sm overflow-hidden
                ${isEditing 
                  ? "ring-2 ring-white/80" 
                  : isHovered 
                    ? "ring-1 ring-white/60" 
                    : ""
                } transition-all
              `}>
                <BananaContent
                  className="bg-gray-700"
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
            left: contextMenuPosition.x,
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
          className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
          onClick={handleCloseContextMenu}
        />
      )}

      {/* Edit mode overlay blur */}
      {isEditing && (
        <div
          className="fixed left-0 right-0 bottom-0 z-10 cursor-pointer"
          style={{ top: '48px' }} // Start below the top toolbar
          onClick={() => setIsEditing(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" />
        </div>
      )}

      {/* Edit Overlay - Fixed to viewport */}
      {isFullscreen && !isEditing && isHovered && !isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 transition-opacity" />
          <button
            onClick={() => setIsEditing(true)}
            onMouseEnter={() => setIsHovered(true)}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white"
          >
            Edit Content
          </button>
        </div>
      )}
    </div>
  );
}
