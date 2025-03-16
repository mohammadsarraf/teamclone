"use client";
import { useState, useEffect, useRef, useMemo } from "react";
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
  
  // Add state for shape dropdown
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [selectedShape, setSelectedShape] = useState<'square' | 'circle' | 'triangle'>('square');
  
  // Add state for color picker
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState<'palette' | 'custom'>('palette');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorPickerMenuRef = useRef<HTMLDivElement>(null);
  const shapeDropdownRef = useRef<HTMLDivElement>(null);
  
  // Color picker state
  const [hue, setHue] = useState(0); // 0-360
  const [saturation, setSaturation] = useState(100); // 0-100
  const [lightness, setLightness] = useState(50); // 0-100
  const [opacity, setOpacity] = useState(selectedItem.opacity || 1); // 0-1
  const [colorPickerPosition, setColorPickerPosition] = useState({ top: 0, left: 0 });
  
  // Refs for color picker elements
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const saturationPickerRef = useRef<HTMLDivElement>(null);
  const opacitySliderRef = useRef<HTMLDivElement>(null);
  
  // Predefined color palette
  const colorPalette = ['#F8F5F0', '#F3F169', '#D9D6FF', '#E07A5F', '#2C5530'];

  // Add state for shadow properties
  const [shadowAngle, setShadowAngle] = useState(0);
  const [shadowDistance, setShadowDistance] = useState(54);
  const [shadowBlur, setShadowBlur] = useState(20);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.5)');

  // Convert HSL to RGB and then to HEX
  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };
  
  // Convert HEX to HSL
  const hexToHsl = (hex: string) => {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find the min and max values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h = Math.round(h * 60);
    }
    
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return { h, s, l };
  };
  
  // Initialize color state from selectedItem
  useEffect(() => {
    if (selectedItem && selectedItem.backgroundColor) {
      try {
        const { h, s, l } = hexToHsl(selectedItem.backgroundColor);
        // Only update if values are different to prevent infinite loops
        if (h !== hue) setHue(h);
        if (s !== saturation) setSaturation(s);
        if (l !== lightness) setLightness(l);
      } catch (error) {
        console.error("Error parsing color:", error);
      }
    }
    
    if (selectedItem && selectedItem.opacity !== undefined && selectedItem.opacity !== opacity) {
      setOpacity(selectedItem.opacity);
    }
  }, [selectedItem.backgroundColor, selectedItem.opacity]);
  
  // Store the current color to avoid unnecessary updates
  const currentColor = useMemo(() => hslToHex(hue, saturation, lightness), [hue, saturation, lightness]);
  
  // Update color when hue, saturation, or lightness changes
  useEffect(() => {
    // Skip the initial render and only update when the color picker is open
    if (!showColorPicker || activeColorTab !== 'custom') return;
    
    // Use a debounce to prevent too many updates
    const timer = setTimeout(() => {
      onUpdate({ 
        backgroundColor: currentColor,
        opacity
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentColor, opacity, showColorPicker, activeColorTab]);

  // Effect to handle clicks outside the shape dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shapeDropdownRef.current && !shapeDropdownRef.current.contains(event.target as Node)) {
        setShowShapeDropdown(false);
      }
    };

    if (showShapeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShapeDropdown]);

  // Initialize shape state from selectedItem
  useEffect(() => {
    if (selectedItem && selectedItem.shape) {
      setSelectedShape(selectedItem.shape as 'square' | 'circle' | 'triangle');
    }
  }, [selectedItem]);

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
          const top = rect.bottom - 300;
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

  // Initialize shadow state from selectedItem
  useEffect(() => {
    if (selectedItem) {
      setDropShadow(selectedItem.shadow === 'custom');
      setShadowAngle(selectedItem.shadowAngle ?? 0);
      setShadowDistance(selectedItem.shadowDistance ?? 54);
      setShadowBlur(selectedItem.shadowBlur ?? 20);
      setShadowColor(selectedItem.shadowColor ?? 'rgba(0, 0, 0, 0.5)');
      
      // Initialize blur state based on object-blur values
      setBlur(selectedItem.shadow?.startsWith('object-blur') || false);
    }
  }, [selectedItem]);

  if (!selectedItem || !isVisible) return null;

  // Function to handle shape change
  const handleShapeChange = (shape: 'square' | 'circle' | 'triangle') => {
    // Update local state
    setSelectedShape(shape);
    
    // Update the actual item with the new shape
    // The application has specific rendering logic for different shapes
    let updates: Partial<GridItem> = {
      shape,
      shapeType: shape
    };
    
    // Handle specific shape types based on the rendering logic in BananaContent
    if (shape === 'triangle') {
      // For triangle, we need type='square' and shapeType='triangle'
      updates.type = 'square';
    } else if (shape === 'circle') {
      // For circle, we need type='square' and shapeType='circle'
      updates.type = 'square';
    } else if (shape === 'square') {
      // For square, we need type='square' and shapeType='square' or undefined
      updates.type = 'square';
    }
    
    // Apply the updates
    onUpdate(updates);
    
    // Close the dropdown
    setShowShapeDropdown(false);
    
    // Log to confirm shape change
    console.log(`Shape changed to: ${shape}`, updates);
  };

  // Handle hue slider interaction
  const handleHueSliderChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hueSliderRef.current) {
      const rect = hueSliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newHue = Math.max(0, Math.min(360, Math.round((x / width) * 360)));
      setHue(newHue);
    }
  };
  
  // Handle saturation/lightness picker interaction
  const handleSaturationLightnessChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (saturationPickerRef.current) {
      const rect = saturationPickerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const width = rect.width;
      const height = rect.height;
      
      // Calculate saturation (x-axis: 0 = 0%, width = 100%)
      const newSaturation = Math.round((x / width) * 100);
      
      // Calculate lightness (y-axis: 0 = 100%, height = 0%)
      // For a standard HSL color picker:
      // - Top-left is white (S=0, L=100)
      // - Top-right is pure color (S=100, L=50)
      // - Bottom-left is black (S=0, L=0)
      // - Bottom-right is dark color (S=100, L=0)
      
      // Calculate vertical position (0 at top, 1 at bottom)
      const yPos = y / height;
      
      // At x=0 (left edge), lightness goes from 100% (top) to 0% (bottom)
      // At x=width (right edge), lightness goes from 50% (top) to 0% (bottom)
      const maxLightness = 100 - (newSaturation / 2);
      const newLightness = Math.round(maxLightness * (1 - yPos));
      
      setSaturation(newSaturation);
      setLightness(newLightness);
    }
  };
  
  // Handle opacity slider interaction
  const handleOpacityChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (opacitySliderRef.current) {
      const rect = opacitySliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const newOpacity = Math.max(0, Math.min(1, parseFloat((x / width).toFixed(2))));
      setOpacity(newOpacity);
    }
  };
  
  // Calculate RGB values from HSL
  const getRgbValues = () => {
    const hexColor = hslToHex(hue, saturation, lightness);
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return { r, g, b };
  };

  // Handle RGB input changes
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    // Parse the input value
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    // Ensure the value is within the valid range
    const validValue = Math.max(0, Math.min(255, numValue));
    
    // Get current RGB values
    const { r, g, b } = getRgbValues();
    
    // Update the appropriate component
    const newR = component === 'r' ? validValue : r;
    const newG = component === 'g' ? validValue : g;
    const newB = component === 'b' ? validValue : b;
    
    // Convert RGB to HSL
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h = h * 60;
      }
      
      return { 
        h: Math.round(h), 
        s: Math.round(s * 100), 
        l: Math.round(l * 100) 
      };
    };
    
    // Convert the new RGB values to HSL
    const { h, s, l } = rgbToHsl(newR, newG, newB);
    
    // Update the HSL state
    setHue(h);
    setSaturation(s);
    setLightness(l);
  };

  // Handle shadow angle change
  const handleShadowAngleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = parseInt(e.target.value);
    setShadowAngle(newAngle);
    onUpdate({ 
      shadowAngle: newAngle,
      shadow: 'custom'
    });
  };

  // Handle shadow distance change
  const handleShadowDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDistance = parseInt(e.target.value);
    setShadowDistance(newDistance);
    onUpdate({ 
      shadowDistance: newDistance,
      shadow: 'custom'
    });
  };

  // Handle shadow blur change
  const handleShadowBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBlur = parseInt(e.target.value);
    setShadowBlur(newBlur);
    onUpdate({ 
      shadowBlur: newBlur,
      shadow: 'custom'
    });
  };

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
            <div 
              className="bg-gray-100 rounded-lg p-3 mb-3 relative cursor-pointer"                     
              onClick={(e) => {
                e.stopPropagation();
                setShowShapeDropdown(!showShapeDropdown);
              }}
            >
              <div className="w-full flex justify-center items-center relative">
                <div className="w-16 h-16 flex items-center justify-center relative">
                  {selectedShape === 'square' && (
                    <div 
                      className="w-full h-full bg-gray-500" 
                    />
                  )}
                  {selectedShape === 'circle' && (
                    <div className="w-full h-full bg-gray-500 rounded-full" />
                  )}
                  {selectedShape === 'triangle' && (
                    <div 
                      className="w-full h-full bg-gray-500" 
                      style={{ 
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Shape Dropdown - Positioned as a portal to avoid containment issues */}
            {showShapeDropdown && (
              <div 
                ref={shapeDropdownRef}
                className="absolute top-20 left-2 bg-white border border-gray-200 shadow-lg rounded-md z-[1000] p-4 w-[300px]"
              >
                <div className="grid grid-cols-3 gap-4">
                  {/* Row 1 */}
                  <div 
                    className={`p-2 cursor-pointer flex flex-col items-center justify-center ${selectedShape === 'square' ? 'border-2 border-black' : 'border border-gray-200'} rounded-md`}
                    onClick={() => handleShapeChange('square')}
                  >
                    <div className="w-12 h-12 bg-gray-500 mb-1"></div>
                  </div>
                  <div 
                    className={`p-2 cursor-pointer flex flex-col items-center justify-center ${selectedShape === 'circle' ? 'border-2 border-black' : 'border border-gray-200'} rounded-md`}
                    onClick={() => handleShapeChange('circle')}
                  >
                    <div className="w-12 h-12 bg-gray-500 rounded-full mb-1"></div>
                  </div>
                  <div 
                    className={`p-2 cursor-pointer flex flex-col items-center justify-center ${selectedShape === 'triangle' ? 'border-2 border-black' : 'border border-gray-200'} rounded-md`}
                    onClick={() => handleShapeChange('triangle')}
                  >
                    <div 
                      className="w-12 h-12 bg-gray-500 mb-1" 
                      style={{ 
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}
                    ></div>
                  </div>
                  
                </div>
              </div>
            )}
            
            {/* Corner Radius Controls Only for Square Shapes */}
            {selectedShape === 'square' && (
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
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedItem.borderRadius || 0}
                    onChange={(e) => {
                      // Ensure value is between 0 and 100
                      const value = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                      onUpdate({ borderRadius: value });
                    }}
                    className="w-full h-10 px-2 text-center text-base border border-gray-200 rounded text-black pr-8"
                  />
                </div>
              </div>
            </div>)}
          
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
                            <div 
                              ref={saturationPickerRef}
                              className="relative w-full h-[200px] rounded overflow-hidden cursor-crosshair"
                              onClick={handleSaturationLightnessChange}
                              onMouseDown={(e) => {
                                handleSaturationLightnessChange(e);
                                const handleMouseMove = (e: MouseEvent) => {
                                  handleSaturationLightnessChange(e as unknown as React.MouseEvent<HTMLDivElement>);
                                };
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            >
                              <div 
                                className="absolute inset-0"
                                style={{ 
                                  background: `
                                    linear-gradient(to right, 
                                      rgb(255, 255, 255), 
                                      hsl(${hue}, 100%, 50%)
                                    ),
                                    linear-gradient(to bottom, 
                                      rgba(255, 255, 255, 0), 
                                      rgba(0, 0, 0, 1)
                                    )
                                  `,
                                  backgroundBlendMode: 'multiply'
                                }}
                              ></div>
                              <div 
                                className="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg cursor-move transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ 
                                  left: `${saturation}%`,
                                  top: `${100 - lightness}%`,
                                  backgroundColor: currentColor,
                                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 0 0 3px rgba(255,255,255,0.5)'
                                }}
                              ></div>
                            </div>
                            
                            {/* Hue slider */}
                            <div 
                              ref={hueSliderRef}
                              className="relative h-8 mt-2 rounded overflow-hidden cursor-pointer"
                              onClick={handleHueSliderChange}
                              onMouseDown={(e) => {
                                handleHueSliderChange(e);
                                const handleMouseMove = (e: MouseEvent) => {
                                  handleHueSliderChange(e as unknown as React.MouseEvent<HTMLDivElement>);
                                };
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            >
                              <div 
                                className="absolute inset-0" 
                                style={{ 
                                  background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                                }}
                              ></div>
                              <div 
                                className="absolute top-1/2 w-5 h-5 rounded-full bg-white border border-gray-400 shadow-md pointer-events-none transform -translate-y-1/2"
                                style={{ 
                                  left: `${(hue / 360) * 100}%`,
                                  marginLeft: "-2.5px" 
                                }}
                              ></div>
                            </div>
                            
                            {/* Transparency slider */}
                            <div 
                              ref={opacitySliderRef}
                              className="relative h-8 mt-2 rounded overflow-hidden cursor-pointer"
                              onClick={handleOpacityChange}
                              onMouseDown={(e) => {
                                handleOpacityChange(e);
                                const handleMouseMove = (e: MouseEvent) => {
                                  handleOpacityChange(e as unknown as React.MouseEvent<HTMLDivElement>);
                                };
                                const handleMouseUp = () => {
                                  document.removeEventListener('mousemove', handleMouseMove);
                                  document.removeEventListener('mouseup', handleMouseUp);
                                };
                                document.addEventListener('mousemove', handleMouseMove);
                                document.addEventListener('mouseup', handleMouseUp);
                              }}
                            >
                              <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat"></div>
                              <div 
                                className="absolute inset-0" 
                                style={{ 
                                  background: `linear-gradient(to right, transparent, ${hslToHex(hue, saturation, lightness)})`
                                }}
                              ></div>
                              <div 
                                className="absolute top-1/2 w-5 h-5 rounded-full bg-white border border-gray-400 shadow-md pointer-events-none transform -translate-y-1/2" 
                                style={{ 
                                  left: `${opacity * 100}%`,
                                  marginLeft: "-2.5px" 
                                }}
                              ></div>
                            </div>
                            
                            {/* RGB inputs */}
                            <div className="flex items-center mt-2 text-black">
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
                                  value={getRgbValues().r}
                                  onChange={(e) => handleRgbChange('r', e.target.value)}
                                />
                                <input 
                                  type="text" 
                                  className="w-12 p-1 text-center border rounded text-black" 
                                  value={getRgbValues().g}
                                  onChange={(e) => handleRgbChange('g', e.target.value)}
                                />
                                <input 
                                  type="text" 
                                  className="w-12 p-1 text-center border rounded text-black" 
                                  value={getRgbValues().b}
                                  onChange={(e) => handleRgbChange('b', e.target.value)}
                                />
                                <div className="flex items-center">
                                  <span className="text-sm ml-2">{Math.round(opacity * 100)}%</span>
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
            <div className="py-3 ">
              <div className="flex items-center justify-between mb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-900 mr-2 py-4">Stroke Type</span>
                <div className="flex gap-2">
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md border ${!(selectedItem?.borderWidth ?? 0) ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => onUpdate({ borderWidth: 0, borderStyle: 'none' })}
                  >
                    <AiOutlineStop />
                  </button>
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md border ${(selectedItem?.borderWidth ?? 0) > 0 && selectedItem.borderStyle === 'solid' ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => onUpdate({ borderWidth: 2, borderStyle: 'solid' })}
                  >
                    <BsDashLg />
                  </button>
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md border ${(selectedShape === "triangle") ? "cursor-not-allowed" : ""} ${(selectedItem?.borderWidth ?? 0) > 0 && selectedItem.borderStyle === 'dash' ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => {if (selectedShape !== "triangle") onUpdate({ borderWidth: 2, borderStyle: 'dash' })}}
                  >
                    <AiOutlineDash />
                  </button>
                </div>
              </div>
              
              {(selectedItem.borderWidth ?? 0) > 0 && (
                
                <div className="flex flex-col gap-4 mt-3">
                  {/* Stroke Color */}
                  <div className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Stroke Color</span>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={(selectedItem as any).borderColor || '#000000'}
                        onChange={(e) => {
                          onUpdate({ 
                            // @ts-ignore - borderColor might not be in the type but it's used in the application
                            borderColor: e.target.value 
                          });
                        }}
                        className="sr-only"
                        id="stroke-color-picker"
                      />
                      <label 
                        htmlFor="stroke-color-picker"
                        className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer"
                        style={{ backgroundColor: (selectedItem as any).borderColor || '#000000' }}
                      ></label>
                    </div>
                  </div>
                  
                  {/* Stroke Size */}
                  {(selectedItem.borderStyle && selectedItem.borderStyle !== 'none') && (
                    <div className="">
                                  <div className=" ">
              <div className="flex items-center justify-between border-b border-gray-200 py-2">
                <span className="text-sm font-medium text-gray-900 mr-2 ">Stroke Size</span>
                <div className="flex gap-2">
                  <button 
                          className={`px-4 py-2 text-sm rounded text-black ${(selectedItem?.borderWidth ?? 0) === 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                          onClick={() => onUpdate({ borderWidth: 1 })}
                  >
                    S
                  </button>
                  <button 
                         className={`px-4 py-2 text-sm rounded text-black ${(selectedItem?.borderWidth ?? 0) === 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                         onClick={() => onUpdate({ borderWidth: 2 })}
                       >
                         M
                  </button>
                  <button 
                          className={`px-4 py-2 text-sm rounded text-black ${(selectedItem?.borderWidth ?? 0) === 4 ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
                          onClick={() => onUpdate({ borderWidth: 4 })}
                        >
                          L
                  </button>
                  <button 
                    className={`h-10 w-10 flex items-center justify-center rounded-md ${(selectedItem?.borderWidth ?? 0) > 0 && selectedItem.borderStyle === 'dash' ? 'bg-gray-200 text-black' : 'text-black'}`}
                    onClick={() => onUpdate({ borderWidth: 2, borderStyle: 'dash' })}
                  >
                    <AiOutlineDash />
                  </button>
                </div>
              </div>
              </div>

                    </div>
                  )}
                  
                </div>
              )}
            </div>
          </div>          
          {/* Effects Section (moved from Effects tab) */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-black uppercase mb-3">Effects</h3>
            
            {/* Drop Shadow Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-900">Drop Shadow</span>
              <label className="relative inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={dropShadow}
                  onChange={() => {
                    const newState = !dropShadow;
                    setDropShadow(newState);
                    if (newState) {
                      onUpdate({ 
                        shadow: 'custom',
                        shadowAngle: shadowAngle,
                        shadowDistance: shadowDistance,
                        shadowBlur: shadowBlur,
                        shadowColor: shadowColor
                      });
                    } else {
                      onUpdate({ shadow: 'none' });
                    }
                  }}
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
            
            {/* Drop Shadow Options */}
            {dropShadow && (
              <div className="py-2 border-b border-gray-200">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Angle</span>
                    <span className="text-sm text-gray-500">{shadowAngle}°</span>
                  </div>
                  
                  {/* Angle visual indicator */}
                  <div className="flex justify-center mb-3">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border border-gray-300 bg-gray-50"></div>
                      <div 
                        className="absolute top-1/2 left-1/2 w-7 h-0.5 bg-indigo-500 origin-left"
                        style={{ 
                          transform: `translateY(-50%) rotate(${shadowAngle}deg)` 
                        }}
                      >
                        <div className="absolute right-0 top-1/2 w-2 h-2 bg-indigo-500 rounded-full transform -translate-y-1/2"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Angle slider */}
                  <div className="relative h-6 flex items-center">
                    <div className="absolute inset-0 h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"></div>
                    <div 
                      className="absolute h-2 bg-indigo-500 rounded-lg top-1/2 -translate-y-1/2" 
                      style={{ width: `${(shadowAngle / 360) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={shadowAngle}
                      onChange={handleShadowAngleChange}
                      className="w-full h-6 appearance-none cursor-pointer opacity-0 z-10 relative"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm pointer-events-none" 
                      style={{ 
                        left: `calc(${(shadowAngle / 360) * 100}% - 8px)`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    ></div>
                  </div>
                </div>
                {/* Distance */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Distance</span>
                    <span className="text-sm text-gray-500">{shadowDistance}px</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 h-2 bg-gray-200 rounded-lg"></div>
                    <div 
                      className="absolute h-2 bg-indigo-500 rounded-lg" 
                      style={{ width: `${(shadowDistance / 100) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowDistance}
                      onChange={handleShadowDistanceChange}
                      className="w-full h-2 appearance-none cursor-pointer opacity-0"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm pointer-events-none" 
                      style={{ 
                        left: `calc(${(shadowDistance / 100) * 100}% - 8px)`,
                        top: '-5px'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Blur */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Blur</span>
                    <span className="text-sm text-gray-500">{shadowBlur}px</span>
                  </div>
                  <div className="relative h-6 flex items-center">
                    <div className="absolute inset-0 h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"></div>
                    <div 
                      className="absolute h-2 bg-indigo-500 rounded-lg top-1/2 -translate-y-1/2" 
                      style={{ width: `${(shadowBlur / 100) * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={shadowBlur}
                      onChange={handleShadowBlurChange}
                      className="w-full h-6 appearance-none cursor-pointer opacity-0 z-10 relative"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm pointer-events-none" 
                      style={{ 
                        left: `calc(${(shadowBlur / 100) * 100}% - 8px)`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Shadow Color */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Shadow Color</span>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={shadowColor.startsWith('rgba') ? '#000000' : shadowColor}
                        onChange={(e) => {
                          // Extract opacity from current shadowColor if it's rgba
                          let opacity = 0.5;
                          if (shadowColor.startsWith('rgba')) {
                            const match = shadowColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
                            if (match && match[1]) {
                              opacity = parseFloat(match[1]);
                            }
                          }
                          
                          // Convert hex to rgba
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          const newColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                          
                          setShadowColor(newColor);
                          onUpdate({ 
                            shadowColor: newColor,
                            shadow: 'custom'
                          });
                        }}
                        className="sr-only"
                        id="shadow-color-picker"
                      />
                      <label 
                        htmlFor="shadow-color-picker"
                        className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer"
                        style={{ backgroundColor: shadowColor }}
                      ></label>
                      
                      {/* Opacity slider for shadow color */}
                      <div className="relative flex-1 ml-3 h-6">
                        <div className="absolute inset-0 h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"></div>
                        <div 
                          className="absolute h-2 bg-indigo-500 rounded-lg top-1/2 -translate-y-1/2" 
                          style={{ 
                            width: `${shadowColor.startsWith('rgba') ? 
                              parseFloat(shadowColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/)?.[1] || '0.5') * 100 : 
                              50}%` 
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={shadowColor.startsWith('rgba') ? 
                            parseFloat(shadowColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/)?.[1] || '0.5') : 
                            0.5}
                          onChange={(e) => {
                            const opacity = parseFloat(e.target.value);
                            
                            // Extract RGB values from current shadowColor
                            let r = 0, g = 0, b = 0;
                            if (shadowColor.startsWith('rgba')) {
                              const match = shadowColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
                              if (match) {
                                r = parseInt(match[1]);
                                g = parseInt(match[2]);
                                b = parseInt(match[3]);
                              }
                            } else if (shadowColor.startsWith('#')) {
                              r = parseInt(shadowColor.slice(1, 3), 16);
                              g = parseInt(shadowColor.slice(3, 5), 16);
                              b = parseInt(shadowColor.slice(5, 7), 16);
                            }
                            
                            const newColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                            setShadowColor(newColor);
                            onUpdate({ 
                              shadowColor: newColor,
                              shadow: 'custom'
                            });
                          }}
                          className="w-full h-6 appearance-none cursor-pointer opacity-0 z-10 relative"
                        />
                        <div 
                          className="absolute w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm pointer-events-none" 
                          style={{ 
                            left: `calc(${shadowColor.startsWith('rgba') ? 
                              parseFloat(shadowColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/)?.[1] || '0.5') * 100 : 
                              50}% - 8px)`,
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {Math.round((shadowColor.startsWith('rgba') ? 
                          parseFloat(shadowColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/)?.[1] || '0.5') : 
                          0.5) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
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
                    onUpdate({ 
                      shadow: !blur ? 'object-blur' : 'none' 
                    });
                  }}
                />
                <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
            
            {/* Blur Options */}
            <div className="border-b border-gray-200">
              {blur && (
                <div className="flex flex-col gap-2 mt-2 ">
                  {/* Blur Amount */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Blur Amount</span>
                    <span className="text-sm text-gray-500">
                      {selectedItem.shadow === 'object-blur-sm' ? '5px' : 
                       selectedItem.shadow === 'object-blur' ? '15px' : 
                       selectedItem.shadow === 'object-blur-lg' ? '100px' : '15px'}
                    </span>
                  </div>
                  
                  {/* Blur Amount Slider */}
                  <div className="relative h-6 flex items-center mb-3">
                    <div className="absolute inset-0 h-2 bg-gray-200 rounded-lg top-1/2 -translate-y-1/2"></div>
                    <div 
                      className="absolute h-2 bg-indigo-500 rounded-lg top-1/2 -translate-y-1/2" 
                      style={{ 
                        width: `${selectedItem.shadow === 'object-blur-sm' ? 16.7 : 
                                selectedItem.shadow === 'object-blur' ? 50 : 
                                selectedItem.shadow === 'object-blur-lg' ? 83.3 : 50}%` 
                      }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      value={selectedItem.shadow === 'object-blur-sm' ? 5 : 
                             selectedItem.shadow === 'object-blur' ? 15 : 
                             selectedItem.shadow === 'object-blur-lg' ? 100 : 100}
                      onChange={(e) => {
                        const blurAmount = parseInt(e.target.value);
                        if (blurAmount < 10) {
                          onUpdate({ shadow: 'object-blur-sm' });
                        } else if (blurAmount < 20) {
                          onUpdate({ shadow: 'object-blur' });
                        } else {
                          onUpdate({ shadow: 'object-blur-lg' });
                        }
                      }}
                      className="w-full h-6 appearance-none cursor-pointer opacity-0 z-10 relative"
                    />
                    <div 
                      className="absolute w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm pointer-events-none" 
                      style={{ 
                        left: `calc(${selectedItem.shadow === 'object-blur-sm' ? 16.7 : 
                                selectedItem.shadow === 'object-blur' ? 50 : 
                                selectedItem.shadow === 'object-blur-lg' ? 83.3 : 50}% - 8px)`,
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    ></div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 