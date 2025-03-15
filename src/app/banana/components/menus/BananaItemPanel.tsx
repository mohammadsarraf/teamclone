"use client";
import { useState, useEffect, useRef } from "react";
import { GridItem } from "../../types";
import { RxCorners } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { FaRegSquare } from "react-icons/fa";
import { AiOutlineDash, AiOutlineStop } from "react-icons/ai";
import { BsDashLg } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";

interface ItemPanelProps {
  selectedItem: GridItem;
  onUpdate: (updates: Partial<GridItem> | { _tempLayout: GridItem[] }) => void;
  onClose: () => void;
  onDelete?: () => void;
  layout: GridItem[];
  position?: { top: number; left: number };
  isDragging?: boolean;
}

export default function BananaItemPanel({ 
  selectedItem, 
  onUpdate, 
  onClose, 
  onDelete, 
  position,
  isDragging = false
}: ItemPanelProps) {
  const [stretch, setStretch] = useState(false);
  const [blur, setBlur] = useState(false);
  const [dropShadow, setDropShadow] = useState(false);
  const [cornerType, setCornerType] = useState<'uniform' | 'individual'>('uniform');
  const [isVisible, setIsVisible] = useState(true);
  const isTextbox = selectedItem.type === 'textbox';
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Add state for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState<'palette' | 'custom'>('palette');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorPickerMenuRef = useRef<HTMLDivElement>(null);
  
  // Predefined color palette
  const colorPalette = ['#F8F5F0', '#F3F169', '#D9D6FF', '#E07A5F', '#2C5530'];

  // Effect to handle clicks outside the color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the color button or inside the color picker menu
      if (
        (colorPickerRef.current && colorPickerRef.current.contains(event.target as Node)) ||
        (colorPickerMenuRef.current && colorPickerMenuRef.current.contains(event.target as Node))
      ) {
        return;
      }
      setShowColorPicker(false);
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColorPicker]);

  // Effect to position the color picker
  const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    const updatePosition = () => {
      if (showColorPicker && colorPickerRef.current) {
        const rect = colorPickerRef.current.getBoundingClientRect();
        
        // Different positions based on active tab
        if (activeColorTab === 'palette') {
          // Position for palette tab - closer to the button
          const top = rect.bottom - 100;
          const left = rect.left + 40;
          setColorPickerPosition({ top, left });
        } else {
          // Position for custom tab - more centered on screen
          const top = rect.bottom - 200;
          const left = rect.left + 40;
          setColorPickerPosition({ top, left });
        }
      }
    };
    
    updatePosition();
    
    // Add resize listener to update position when window is resized
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [showColorPicker, activeColorTab]); // Add activeColorTab as dependency

  // Effect to handle visibility based on drag state
  useEffect(() => {
    if (isDragging) {
      setIsVisible(false);
    } else {
      // Small delay to ensure the panel appears after dragging is complete
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging]);

  // Initialize stretch state from selectedItem
  useEffect(() => {
    if (selectedItem) {
      setStretch(!!selectedItem.stretch);
    }
  }, [selectedItem]);

  if (!selectedItem || !isVisible) return null;


  return (
    <div 
      ref={panelRef}
      className="banana-item-panel shadow-lg z-50 bg-white rounded-lg border border-gray-200 w-[20rem]" 
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 z-10"
      >
        <MdClose size={16} />
      </button>

      {/* Header with Design Tab */}
      <div className="border-b">
        <div className="flex flex-wrap">
          <button
            className="py-3 px-3 text-center font-medium text-sm border-b-2 border-indigo-600 text-indigo-600"
          >
            Design
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[30rem]">
        {/* Design Tab Content */}
        <div className="p-4">
          {/* Shape Section */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-black uppercase mb-3">Shape</h3>
            
            {/* Shape Preview */}
            <div className="bg-gray-100 rounded-lg p-3 mb-3 relative">
              <div className="w-full flex justify-center items-center">
                <div className="w-16 h-16 flex items-center justify-center">
                  <div 
                    className="w-full h-full bg-gray-500" 
                  />
                </div>
              </div>
            </div>
            
            {/* Corner Radius Controls */}
            <div className="flex mb-3">
              <div className="flex gap-1 mr-2">
                <button 
                  className={`h-10 w-10 flex items-center justify-center rounded ${cornerType === 'uniform' ? 'bg-gray-200 text-black' : 'text-black'}`}
                  onClick={() => setCornerType('uniform')}
                >
                  <FaRegSquare/>
                </button>
                <button 
                  className={`h-10 w-10 flex items-center justify-center rounded  ${cornerType === 'individual' ? 'bg-gray-200 text-black' : 'text-black'}`}
                  onClick={() => setCornerType('individual')}
                >
                  <RxCorners className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 flex items-center">
                <input
                  type="number"
                  value={selectedItem.borderRadius || 0}
                  onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) || 0 })}
                  className="w-full h-10 px-2 text-center text-base border border-gray-200 rounded text-black"
                />
              </div>
            </div>
          
            {/* Stretch Toggle */}
            <div className="flex items-center justify-between py-2 border-gray-200">
              <span className="text-sm font-medium text-gray-900">Stretch</span>
              <label className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={stretch}
                  onChange={() => {
                    setStretch(!stretch);
                    onUpdate({ stretch: !stretch });
                  }}
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </div>
          
          <div className="border-t border-gray-200 my-3"></div>
          
          {/* Styling Section */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-black uppercase mb-3">Styling</h3>
            
            {/* Color */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200 relative">
              <span className="text-sm font-medium text-gray-900">Color</span>
              <div className="flex items-center relative">
                <input
                  type="color"
                  value={selectedItem.backgroundColor || '#4B5563'}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="sr-only"
                  id="color-picker"
                />
                <div 
                  ref={colorPickerRef}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowColorPicker(!showColorPicker);
                  }}
                  className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer"
                  style={{ backgroundColor: selectedItem.backgroundColor || '#4B5563' }}
                ></div>
                
                {/* Color Picker Menu */}
                {showColorPicker && (
                  <div 
                    ref={colorPickerMenuRef}
                    className={`fixed z-[1000] bg-white rounded-md shadow-lg border border-gray-200 ${activeColorTab === 'palette' ? 'w-[280px]' : 'w-[320px]'}`}
                    style={{ 
                      top: colorPickerPosition.top,
                      left: colorPickerPosition.left
                    }}
                  >
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                      <button
                        className={`flex-1 py-3 px-3 text-center font-medium text-sm ${activeColorTab === 'palette' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {
                          setActiveColorTab('palette');
                        }}
                      >
                        Palette
                      </button>
                      <button
                        className={`flex-1 py-3 px-3 text-center font-medium text-sm ${activeColorTab === 'custom' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => {
                          setActiveColorTab('custom');
                        }}
                      >
                        Custom
                      </button>
                    </div>
                    
                    {/* Tab Content */}
                    <div className="p-4">
                      {activeColorTab === 'palette' ? (
                        <div>
                          <div className="flex justify-center gap-4 mb-4">
                            {colorPalette.map((color, index) => (
                              <button
                                key={index}
                                className="w-12 h-12 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  onUpdate({ backgroundColor: color });
                                  setShowColorPicker(false);
                                }}
                              />
                            ))}
                          </div>
                          <button
                            className="w-full py-2 text-center text-sm font-medium text-black border-t border-gray-200 mt-2 pt-4"
                          >
                            EDIT SITEWIDE PALETTE
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* Advanced color picker similar to the screenshot */}
                          <div className="flex flex-col gap-3">
                            {/* Main color gradient area */}
                            <div className="relative w-full h-[200px] rounded overflow-hidden">
                              <div 
                                className="absolute inset-0 bg-gradient-to-b from-transparent to-black"
                                style={{ 
                                  backgroundImage: `linear-gradient(to bottom, transparent, #000), 
                                                   linear-gradient(to right, #fff, ${selectedItem.backgroundColor || '#ff0000'})`
                                }}
                              ></div>
                              <div className="absolute right-2 top-2 w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer"></div>
                            </div>
                            
                            {/* Hue slider */}
                            <div className="relative h-8 mt-2 rounded overflow-hidden">
                              <div 
                                className="absolute inset-0" 
                                style={{ 
                                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                                }}
                              ></div>
                              <div className="absolute top-0 h-full w-1 bg-white border border-gray-400 shadow-md cursor-pointer"></div>
                            </div>
                            
                            {/* Transparency slider */}
                            <div className="relative h-8 mt-2 rounded overflow-hidden">
                              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat"></div>
                              <div 
                                className="absolute inset-0" 
                                style={{ 
                                  background: `linear-gradient(to right, transparent, ${selectedItem.backgroundColor || '#ff0000'})`
                                }}
                              ></div>
                              <div className="absolute top-0 h-full w-1 bg-white border border-gray-400 shadow-md cursor-pointer" style={{ left: `${Math.round((selectedItem.opacity || 1) * 100)}%` }}></div>
                            </div>
                            
                            {/* RGB inputs */}
                            <div className="flex items-center mt-2">
                              <div className="flex items-center">
                                <span className="text-sm font-medium mr-2">RGB</span>
                                <div className="border rounded p-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                              
                              <div className="flex flex-1 ml-4 gap-2">
                                <input 
                                  type="text" 
                                  className="w-12 p-1 text-center border rounded text-black" 
                                  value="255" 
                                  readOnly
                                />
                                <input 
                                  type="text" 
                                  className="w-12 p-1 text-center border rounded text-black" 
                                  value="0" 
                                  readOnly
                                />
                                <input 
                                  type="text" 
                                  className="w-12 p-1 text-center border rounded text-black" 
                                  value="0" 
                                  readOnly
                                />
                                <div className="flex items-center">
                                  <span className="text-sm ml-2">{Math.round((selectedItem.opacity || 1) * 100)}%</span>
                                </div>
                              </div>
                            </div>
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Blend Mode */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">Blend Mode</span>
              <div className="relative">
                <select
                  value={selectedItem.blendMode || 'normal'}
                  onChange={(e) => onUpdate({ blendMode: e.target.value })}
                  className="appearance-none bg-transparent pr-6 text-right text-sm font-medium text-gray-700"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="screen">Screen</option>
                  <option value="overlay">Overlay</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                  <IoMdArrowDropdown size={16} />
                </div>
              </div>
            </div>
            
            {/* Stroke */}
            <div className="py-2 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 mr-2">Stroke</span>
                <div className="flex gap-2">
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md border ${!selectedItem.borderWidth ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => onUpdate({ borderWidth: 0, borderStyle: 'none' })}
                  >
                    <AiOutlineStop />
                  </button>
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md border ${selectedItem.borderWidth === 1 && selectedItem.borderStyle === 'solid' ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => onUpdate({ borderWidth: 1, borderStyle: 'solid' })}
                  >
                    <BsDashLg />
                  </button>
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md border ${selectedItem.borderWidth === 2 && selectedItem.borderStyle === 'dash' ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => onUpdate({ borderWidth: 2, borderStyle: 'dash' })}
                  >
                    <AiOutlineDash />
                  </button>
                </div>
              </div>
            </div>
          </div>          
          {/* Effects Section (moved from Effects tab) */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-black uppercase mb-3">Effects</h3>
            
            {/* Drop Shadow Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-900">Drop Shadow</span>
              <label className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={dropShadow}
                  onChange={() => {
                    setDropShadow(!dropShadow);
                    onUpdate({ shadow: !dropShadow ? 'md' : 'none' });
                  }}
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
            
            {/* Blur Toggle */}
            <div className="flex items-center justify-between py-2 ">
              <span className="text-sm font-medium text-gray-900">Blur</span>
              <label className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={blur}
                  onChange={() => {
                    setBlur(!blur);
                    onUpdate({ shadow: !blur ? 'blur' : 'none' });
                  }}
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 