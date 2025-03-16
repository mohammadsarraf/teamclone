"use client";
import { useState, useEffect, useRef } from "react";
import BananaContent from "./BananaContent";
import BananaItemPanel from "./menus/BananaItemPanel";
import GridSettingsMenu from "./GridSettingsMenu";
import BlockMenu from "./menus/BlockMenu";
import { ItemActionMenu } from "./objects";
import { GridItem, BlockTemplate, GridSettings } from "../types";

interface ContentProps {
  isFullscreen: boolean;
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
    type: 'square'
  },
  {
    title: "Small Square",
    description: "A smaller square for compact content",
    height: 2,
    width: 2,
    type: 'square'
  },
  {
    title: "Large Square",
    description: "A larger square for more content",
    height: 3,
    width: 3,
    type: 'square'
  },
  {
    title: "Text Box",
    description: "Editable text area for custom content",
    height: 2,
    width: 20,
    type: 'textbox'
  }
];

const defaultGridSettings: GridSettings = {
  rows: 20,
  columns: 50,
  margin: 8, // For backward compatibility
  horizontalMargin: 0,
  verticalMargin: 0,
  padding: 16
};

export default function BananaContentEditor({ isFullscreen }: ContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [showEditSectionMenu, setShowEditSectionMenu] = useState(false);
  const [layout, setLayout] = useState<GridItem[]>([]);
  const [gridSettings, setGridSettings] = useState<GridSettings>(defaultGridSettings);
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<ContextMenuPosition | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [editSectionButtonRef, setEditSectionButtonRef] = useState<HTMLButtonElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 60, left: 0 });
  const [blockMenuPosition, setBlockMenuPosition] = useState({ top: 0, left: 0 });
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showItemToolbar, setShowItemToolbar] = useState(false);
  const [focusedItemData, setFocusedItemData] = useState<GridItem | null>(null);
  const addBlockButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedItem(null);
        setShowBlockMenu(false);
        setShowGridSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAddBlock = (template: BlockTemplate) => {
    // Find the highest layer number and add 1 to put new block on top
    const maxLayer = layout.length > 0 
      ? Math.max(...layout.map(item => item.layer || 0))
      : 0;

    const newBlock: GridItem = {
      i: `${template.type}-${layout.length + 1}`,
      x: 0,
      y: template.type === 'textbox' ? 5 : 0,
      w: template.type === 'textbox' ? 10 : 3,
      h: 3,
      title: `${template.title} ${layout.length + 1}`,
      type: template.type,
      content: template.type === 'textbox' ? '' : undefined,
      placeholder: template.type === 'textbox' ? 'Click to edit text' : undefined,
      backgroundColor: '#3B82F6',
      textColor: template.type === 'textbox' ? '#FFFFFF' : undefined,
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      fontWeight: 'normal',
      shadow: 'none',
      layer: maxLayer + 1, // Place new blocks on top
      shapeType: template.type === 'square' ? 'square' : undefined, // Set default shape type for squares
      // Set default text style for textboxes
      textStyle: template.type === 'textbox' ? 'paragraph-1' : undefined,
      textDecoration: undefined,
      fontFamily: undefined
    };

    setLayout([...layout, newBlock]);
    setShowBlockMenu(false);
  };

  const handleItemClick = (itemId: string, e?: React.MouseEvent) => {
    // Find the item by id
    const item = layout.find(item => item.i === itemId);
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

  const handleItemUpdate = (updates: Partial<GridItem> | { _tempLayout: GridItem[] }) => {
    if ('_tempLayout' in updates) {
      // Handle layout reordering
      setLayout(updates._tempLayout);
      const updatedItem = updates._tempLayout.find((item: GridItem) => item.i === selectedItem?.i);
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    } else {
      // For non-layer updates, just update normally
      const updatedLayout = layout.map(item => 
        item.i === selectedItem?.i ? { ...item, ...updates } : item
      );
      setLayout(updatedLayout);
      setSelectedItem({ ...selectedItem, ...updates } as GridItem);
    }
  };

  const handleDelete = () => {
    // Filter out the selected item from layout
    const updatedLayout = layout.filter(item => item.i !== selectedItem?.i);
    setLayout(updatedLayout);
    setSelectedItem(null); // Close the panel
  };

  const handleGridSettingChange = (key: keyof GridSettings, value: number) => {
    setGridSettings(prev => ({
      ...prev,
      [key]: value
    }));
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
      const item = layout.find(item => item.i === focusedItemId);
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
      horizontalMargin: newSettings.horizontalMargin ?? newSettings.margin ?? gridSettings.horizontalMargin,
      verticalMargin: newSettings.verticalMargin ?? newSettings.margin ?? gridSettings.verticalMargin
    };
    
    setGridSettings(updatedSettings);
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
        left: rect.left
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
        left: rect.left
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
      const menuElement = document.querySelector('.grid-settings-menu');
      if (menuElement && !menuElement.contains(e.target as Node)) {
        setShowEditSectionMenu(false);
      }
    }
    
    // Close Block Menu when clicking outside
    if (showBlockMenu) {
      const menuElement = document.querySelector('.block-menu');
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
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showEditSectionMenu, showBlockMenu]);

  // Add a duplicate item function
  const handleDuplicateItem = () => {
    if (!focusedItemData) return;
    
    // Find the highest layer number and add 1 to put new block on top
    const maxLayer = layout.length > 0 
      ? Math.max(...layout.map(item => item.layer || 0))
      : 0;
    
    // Create a duplicate with a new ID
    const duplicatedItem: GridItem = {
      ...focusedItemData,
      i: `${focusedItemData.type}-${layout.length + 1}`,
      x: focusedItemData.x + 1, // Offset slightly
      y: focusedItemData.y + 1, // Offset slightly
      layer: maxLayer + 1, // Place on top
    };
    
    setLayout([...layout, duplicatedItem]);
    setShowItemToolbar(false);
    setFocusedItem(null);
  };

  // Handle edit item
  const handleEditItem = () => {
    if (!focusedItemData) return;
    
    // For textboxes, let BananaContent handle the edit with TextStyleMenu
    if (focusedItemData.type === 'textbox') {
      // We'll let the BananaContent component handle this
      // The toolbar will be hidden automatically when clicking outside
      setShowItemToolbar(false); // Hide the toolbar when showing the TextStyleMenu
      return;
    }
    
    // For non-textbox items, show the context menu
    setSelectedItem(focusedItemData);
    setContextMenuPosition({
      x: toolbarPosition.left,
      y: toolbarPosition.top + 50 // Position below the toolbar
    });
    
    setShowItemToolbar(false);
  };

  // Handle delete item
  const handleDeleteFocusedItem = () => {
    if (!focusedItemData) return;
    
    // Filter out the focused item from layout
    const updatedLayout = layout.filter(item => item.i !== focusedItemData.i);
    setLayout(updatedLayout);
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
          {isEditing && !isDragging && !selectedItem && focusedItem === null && (
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
                        className={`h-4 w-4 transition-transform ${showBlockMenu ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                      ref={ref => setEditSectionButtonRef(ref)}
                      onClick={handleEditSectionClick}
                      className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
                    >
                      <span>Edit Section</span>
                      <svg
                        className={`h-4 w-4 transition-transform ${showEditSectionMenu ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  ) : showEditSectionMenu && (
                    /* Edit Section Menu */
                    <GridSettingsMenu
                      initialSettings={gridSettings}
                      onSettingsChange={handleGridSettingsChange}
                      onClose={() => setShowEditSectionMenu(false)}
                      position={menuPosition}
                    />
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
            <BananaContent 
              className="bg-red-700" 
              layout={layout}
              onLayoutChange={setLayout}
              gridSettings={gridSettings}
              onItemClick={handleItemClick}
              onDragStateChange={handleDragStateChange}
              onFocusChange={handleFocusChange}
              isEditing={isEditing}
              isInteracting={showEditSectionMenu || showBlockMenu || showItemToolbar}
              onItemPanelClose={handleCloseContextMenu}
            />
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
          className="fixed inset-0 z-10 cursor-pointer"
          onClick={() => setIsEditing(false)}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
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
