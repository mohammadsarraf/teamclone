"use client";
import { useState, useEffect } from "react";
import BananaContent from "./BananaContent";
import BananaItemPanel from "./menus/BananaItemPanel";
import { GridItem } from "./BananaContent";

interface ContentProps {
  isFullscreen: boolean;
}

interface BlockTemplate {
  title: string;
  description: string;
  height: number;
  type: 'section' | 'square' | 'textbox';
  width?: number;
}

interface GridSettings {
  rows: number;
  columns: number;
  margin: number;
  padding: number;
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
    height: 1,
    width: 4,
    type: 'textbox'
  }
];

const defaultGridSettings: GridSettings = {
  rows: 20,
  columns: 12,
  margin: 8,
  padding: 16
};

export default function BananaContentEditor({ isFullscreen }: ContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showGridSettings, setShowGridSettings] = useState(false);
  const [layout, setLayout] = useState<any[]>([]);
  const [gridSettings, setGridSettings] = useState<GridSettings>(defaultGridSettings);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

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

    const newBlock = {
      i: `${template.type}-${layout.length + 1}`,
      x: 0,
      y: 0,
      w: template.width || 4,
      h: template.height,
      title: `${template.title} ${layout.length + 1}`,
      type: template.type,
      content: template.type === 'textbox' ? 'Click to edit text' : undefined,
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF',
      borderRadius: 8,
      padding: 16,
      fontSize: 16,
      fontWeight: 'normal',
      shadow: 'none',
      layer: maxLayer + 1 // Place new blocks on top
    };

    setLayout([...layout, newBlock]);
    setShowBlockMenu(false);
  };

  const handleItemClick = (item: any) => {
    // Close other menus when opening item panel
    setShowBlockMenu(false);
    setShowGridSettings(false);
    setSelectedItem(item);
  };

  const handleItemUpdate = (updates: Partial<any>) => {
    if ('_tempLayout' in updates) {
      // Handle layout reordering
      setLayout(updates._tempLayout);
      const updatedItem = updates._tempLayout.find((item: GridItem) => item.i === selectedItem.i);
      if (updatedItem) {
        setSelectedItem(updatedItem);
      }
    } else {
      // For non-layer updates, just update normally
      const updatedLayout = layout.map(item => 
        item.i === selectedItem.i ? { ...item, ...updates } : item
      );
      setLayout(updatedLayout);
      setSelectedItem({ ...selectedItem, ...updates });
    }
  };

  const handleDelete = () => {
    // Filter out the selected item from layout
    const updatedLayout = layout.filter(item => item.i !== selectedItem.i);
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

  return (
    <div className="relative flex-1">
      {/* Main Content Area with smooth transition */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          selectedItem && !isDragging ? 'mr-80' : ''
        }`}
      >
        {/* Content Container */}
        <div className="relative h-full">
          {/* Edit Tools Container - Sticky */}
          {isEditing && !isDragging && !selectedItem && (
            <div className="sticky top-0 z-40 px-4">
              <div className="relative">
                {/* Left Button with Dropdown */}
                <div className="absolute left-0">
                  <button 
                    onClick={() => {
                      setShowBlockMenu(!showBlockMenu);
                      setShowGridSettings(false);
                    }}
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

                  {/* Block Menu Dropdown */}
                  {showBlockMenu && !isDragging && (
                    <div className="absolute left-0 top-full mt-1 w-64 rounded-md bg-white shadow-xl">
                      {blockTemplates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleAddBlock(template)}
                          className="flex w-full flex-col gap-1 px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{template.title}</span>
                          <span className="text-sm text-gray-500">{template.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Menu */}
                <div className="absolute right-0">
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setShowGridSettings(!showGridSettings);
                        setShowBlockMenu(false);
                      }}
                      className="flex items-center gap-2 rounded-md bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-white hover:shadow-xl"
                    >
                      Edit Section
                    </button>

                    {/* Grid Settings Panel */}
                    {showGridSettings && !isDragging && (
                      <div className="absolute right-0 top-full mt-1 w-64 rounded-md bg-white p-4 shadow-xl">
                        <h3 className="mb-4 font-medium text-gray-900">Grid Settings</h3>
                        
                        {/* Rows Setting */}
                        <div className="mb-4">
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Rows: {gridSettings.rows}
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="30"
                            value={gridSettings.rows}
                            onChange={(e) => handleGridSettingChange('rows', parseInt(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                          />
                        </div>

                        {/* Columns Setting */}
                        <div className="mb-4">
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Columns: {gridSettings.columns}
                          </label>
                          <input
                            type="range"
                            min="6"
                            max="24"
                            value={gridSettings.columns}
                            onChange={(e) => handleGridSettingChange('columns', parseInt(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                          />
                        </div>

                        {/* Margin Setting */}
                        <div className="mb-4">
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Margin: {gridSettings.margin}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={gridSettings.margin}
                            onChange={(e) => handleGridSettingChange('margin', parseInt(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                          />
                        </div>

                        {/* Padding Setting */}
                        <div className="mb-4">
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Padding: {gridSettings.padding}px
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="32"
                            value={gridSettings.padding}
                            onChange={(e) => handleGridSettingChange('padding', parseInt(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                          />
                        </div>

                        {/* Reset Button */}
                        <button
                          onClick={() => setGridSettings(defaultGridSettings)}
                          className="mt-2 w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Reset to Default
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Content */}
          <div
            className={`relative h-full overflow-auto ${isEditing ? "z-30" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <BananaContent 
              className="bg-gray-700" 
              layout={layout}
              onLayoutChange={setLayout}
              gridSettings={gridSettings}
              onItemClick={handleItemClick}
              onDragStateChange={handleDragStateChange}
              isEditing={isEditing}
              showGridSettings={showGridSettings}
            />
          </div>
        </div>
      </div>

      {/* Side Panel with smooth transition */}
      <div 
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          selectedItem && !isDragging ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedItem && !isDragging && (
          <BananaItemPanel
            selectedItem={selectedItem}
            onUpdate={handleItemUpdate}
            onClose={() => setSelectedItem(null)}
            onDelete={handleDelete}
            layout={layout}
          />
        )}
      </div>

      {/* Backdrop blur */}
      {isEditing && !isDragging && (
        <div
          className="fixed inset-0 z-20 bg-black/5 backdrop-blur-[2px]"
          onClick={() => {
            setIsEditing(false);
            setShowGridSettings(false);
            setShowBlockMenu(false);
          }}
        />
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
