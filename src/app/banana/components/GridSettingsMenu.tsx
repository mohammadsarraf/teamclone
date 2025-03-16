import React, { useState } from 'react';
import { BiHorizontalCenter, BiVerticalBottom, BiVerticalCenter } from 'react-icons/bi';
import { BsGrid3X3, BsGrid3X3Gap, BsGrid3X3GapFill } from 'react-icons/bs';
import { IoMdMore } from 'react-icons/io';
import { GridSettings } from '../types';

interface GridSettingsMenuProps {
  initialSettings: GridSettings;
  onSettingsChange: (settings: GridSettings) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

const GridSettingsMenu: React.FC<GridSettingsMenuProps> = ({
  initialSettings,
  onSettingsChange,
  onClose,
  position
}) => {
  const [activeTab, setActiveTab] = useState('design');
  const [settings, setSettings] = useState<GridSettings>({
    ...initialSettings,
    fillScreen: initialSettings.fillScreen || false,
    heightSetting: initialSettings.heightSetting as 'small' | 'medium' | 'large' | 'custom' || 'medium',
    customHeight: initialSettings.customHeight || 50
  });
  const [moreGap, setMoreGap] = useState(false);
  const [selectedGap, setSelectedGap] = useState('large');
  const [selectedAlignment, setSelectedAlignment] = useState('top');

  const handleChange = (key: keyof GridSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    
    // Keep margin in sync with horizontal/vertical for backward compatibility
    if (key === 'horizontalMargin' || key === 'verticalMargin') {
      // If both horizontal and vertical are the same, update margin too
      if (key === 'horizontalMargin' && value === settings.verticalMargin) {
        newSettings.margin = value;
      } else if (key === 'verticalMargin' && value === settings.horizontalMargin) {
        newSettings.margin = value;
      }
    } else if (key === 'margin') {
      // If margin is updated, update both horizontal and vertical
      newSettings.horizontalMargin = value;
      newSettings.verticalMargin = value;
    }
    
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Default position if not provided
  const menuPosition = position || { top: 60, left: 'auto' };

  return (
    <div 
      className="fixed shadow-lg z-50 overflow-hidden bg-white rounded-lg border border-gray-200 grid-settings-menu"
      style={{ 
        top: `${menuPosition.top}px`, 
        right: '16px',
        width: '320px',
        maxHeight: '85vh'
      }}
    >
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      </button>

      {/* Header with Tabs */}
      <div className="border-b">
        <div className="flex flex-wrap">
          <button
            className={`py-3 px-3 text-center font-medium text-sm ${activeTab === 'design' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-black hover:text-indigo-500'}`}
            onClick={() => setActiveTab('design')}
          >
            Design
          </button>
          <button
            className={`py-3 px-3 text-center font-medium text-sm ${activeTab === 'grid' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-black hover:text-indigo-500'}`}
            onClick={() => setActiveTab('grid')}
          >
            Grid Settings
          </button>
          <button
            className={`py-3 px-3 text-center font-medium text-sm ${activeTab === 'background' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-black hover:text-indigo-500'}`}
            onClick={() => setActiveTab('background')}
          >
            Background
          </button>
        </div>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 48px)' }}>
        {/* Design Tab Content */}
        {activeTab === 'design' && (
          <div className="p-4">
            {/* GRID Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-black uppercase mb-3">Grid</h3>
              
              {/* Row Count */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-black">Row Count</label>

                  <button 
                      className="p-1.5 bg-white border rounded-md text-black"
                      onClick={() => {if(settings.rows > 0) handleChange('rows', settings.rows - 1);}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L9 11L15 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="bg-gray-100 rounded-md px-3 py-1 w-10 text-center">
                      <span className="text-black">{settings.rows}</span>
                    </div>
                    <button 
                      className="p-1.5 bg-white border rounded-md text-black"
                      onClick={() => handleChange('rows', settings.rows + 1)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5L15 11L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                </div>
              </div>
              
              {/* Gap */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-black">Gap</label>
                  <div className="flex space-x-1">
                    <button 
                      className={`p-1.5 ${selectedGap === 'large' ? 'bg-indigo-50 border-indigo-300' : 'bg-white'} border rounded-md`}
                      onClick={() => {handleChange('margin', parseInt('0')); setMoreGap(false); setSelectedGap('large')}}
                    >
                      <BsGrid3X3 className='text-black'/>
                    </button>
                    
                    <button 
                      className={`p-1.5 ${selectedGap === 'medium' ? 'bg-indigo-50 border-indigo-300' : 'bg-white'} border rounded-md`}
                      onClick={() => {handleChange('margin', parseInt('10')); setMoreGap(false);setSelectedGap('medium')}}
                    >
                      <BsGrid3X3Gap className='text-black'/>
                    </button>
                    <button 
                      className={`p-1.5 ${selectedGap === 'small' ? 'bg-indigo-50 border-indigo-300' : 'bg-white'} border rounded-md`}
                      onClick={() => {setMoreGap(true); handleChange('margin', parseInt('8')); setSelectedGap('small')}}
                    >
                      <IoMdMore className='text-black'/>
                    </button>
                  </div>
                </div>
                  {moreGap && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span><BiVerticalCenter className='text-black'/></span>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={settings.verticalMargin}
                          onChange={(e) => handleChange('verticalMargin', parseInt(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="text-xs text-gray-500 w-8 text-right">{settings.verticalMargin}px</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span><BiHorizontalCenter className='text-black'/></span>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={settings.horizontalMargin}
                          onChange={(e) => handleChange('horizontalMargin', parseInt(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <span className="text-xs text-gray-500 w-8 text-right">{settings.horizontalMargin}px</span>
                      </div>
                    </div>
                  )}
              </div>
            </div>
            {/* SECTION Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-black uppercase mb-3">Section</h3>
              
              {/* Fill Screen Toggle */}
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-black">Fill Screen</label>
                <button 
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors ${settings.fillScreen ? 'bg-indigo-500' : 'bg-gray-300'}`}
                  onClick={() => {
                    const newSettings = { 
                      ...settings, 
                      fillScreen: !settings.fillScreen 
                    };
                    setSettings(newSettings);
                    onSettingsChange(newSettings);
                  }}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${settings.fillScreen ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>
              
              {/* Height Options - Only show when Fill Screen is enabled */}
              {settings.fillScreen && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-black">Height</label>
                    <div className="flex space-x-1">
                      <button 
                        className={`px-3 py-1 text-sm ${settings.heightSetting === 'small' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { 
                            ...settings, 
                            heightSetting: 'small' as 'small',
                            customHeight: 50, // 50vh
                            minHeight: 300, // Minimum height in pixels
                            maxHeight: 600 // Maximum height in pixels
                          };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        S
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm ${settings.heightSetting === 'medium' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { 
                            ...settings, 
                            heightSetting: 'medium' as 'medium',
                            customHeight: 75, // 75vh
                            minHeight: 400,
                            maxHeight: 800
                          };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        M
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm ${settings.heightSetting === 'large' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { 
                            ...settings, 
                            heightSetting: 'large' as 'large',
                            customHeight: 100, // 100vh
                            minHeight: 500,
                            maxHeight: 1000
                          };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        L
                      </button>
                      <button 
                        className={`px-2 py-1 text-sm ${settings.heightSetting === 'custom' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { 
                            ...settings, 
                            heightSetting: 'custom' as 'custom'
                          };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        •••
                      </button>
                    </div>
                  </div>
                  
                  {/* Custom Height Controls - Only show when custom is selected */}
                  {settings.heightSetting === 'custom' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-black mb-2 block">Viewport Height</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="30"
                            max="100"
                            value={settings.customHeight || 50}
                            onChange={(e) => {
                              const newHeight = parseInt(e.target.value);
                              const newSettings = { 
                                ...settings, 
                                customHeight: newHeight 
                              };
                              setSettings(newSettings);
                              onSettingsChange(newSettings);
                            }}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="text-xs text-gray-500 w-12 text-right">{settings.customHeight}vh</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-black mb-2 block">Minimum Height</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="200"
                            max="800"
                            step="50"
                            value={settings.minHeight || 300}
                            onChange={(e) => {
                              const newSettings = { 
                                ...settings, 
                                minHeight: parseInt(e.target.value)
                              };
                              setSettings(newSettings);
                              onSettingsChange(newSettings);
                            }}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="text-xs text-gray-500 w-12 text-right">{settings.minHeight}px</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-black mb-2 block">Maximum Height</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="400"
                            max="1200"
                            step="50"
                            value={settings.maxHeight || 600}
                            onChange={(e) => {
                              const newSettings = { 
                                ...settings, 
                                maxHeight: parseInt(e.target.value)
                              };
                              setSettings(newSettings);
                              onSettingsChange(newSettings);
                            }}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                          <span className="text-xs text-gray-500 w-12 text-right">{settings.maxHeight}px</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Visual height indicator */}
                  <div className="mt-4 bg-gray-100 rounded-md p-1">
                    <div 
                      className="bg-indigo-100 border border-indigo-200 rounded h-6 flex items-center justify-center text-xs text-indigo-700 font-medium"
                      style={{ width: `${settings.customHeight}%` }}
                    >
                      {settings.heightSetting === 'small' ? '50vh' : 
                       settings.heightSetting === 'medium' ? '75vh' : 
                       settings.heightSetting === 'large' ? '100vh' : 
                       `${settings.customHeight}vh`}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Content Width - Only show when Fill Screen is enabled */}
              {settings.fillScreen && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-black">Content Width</label>
                    <div className="flex space-x-1">
                      <button 
                        className={`px-3 py-1 text-sm ${settings.contentWidth === 'narrow' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, contentWidth: 'narrow' as 'narrow' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        Narrow
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm ${settings.contentWidth === 'medium' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, contentWidth: 'medium' as 'medium' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        Medium
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm ${settings.contentWidth === 'wide' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, contentWidth: 'wide' as 'wide' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        Wide
                      </button>
                      <button 
                        className={`px-3 py-1 text-sm ${settings.contentWidth === 'full' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, contentWidth: 'full' as 'full' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        Full
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Alignment - Only show when Fill Screen is enabled */}
              {settings.fillScreen && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-black">Alignment</label>
                    <div className="flex space-x-1">
                      <button 
                        className={`p-1.5 ${settings.verticalAlignment === 'top' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, verticalAlignment: 'top' as 'top' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20M12 20V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button 
                        className={`p-1.5 ${settings.verticalAlignment === 'middle' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, verticalAlignment: 'middle' as 'middle' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 12H20M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <button 
                        className={`p-1.5 ${settings.verticalAlignment === 'bottom' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white text-black'} border rounded-md`}
                        onClick={() => {
                          const newSettings = { ...settings, verticalAlignment: 'bottom' as 'bottom' };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 20H20M12 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Description */}
              <p className="text-black text-xs">
                Fill screen will expand the section height to fill a portion of the viewport height (vh). You can set minimum and maximum heights to ensure consistent appearance across different screen sizes.
              </p>
            </div>
            
          </div>
        )}

        {/* Grid Settings Tab Content */}
        {activeTab === 'grid' && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-black uppercase mb-3">Grid Configuration</h3>
            
            {/* Rows Setting */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-black">Rows</label>
                <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                  <span className="text-black">{settings.rows}</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={settings.rows}
                onChange={(e) => handleChange('rows', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Columns Setting */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-black">Columns</label>
                <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                  <span className="text-black">{settings.columns}</span>
                </div>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                value={settings.columns}
                onChange={(e) => handleChange('columns', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Margin Setting */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-black">Margin (px)</label>
                <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                  <span className="text-black">{settings.margin}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.margin}
                onChange={(e) => handleChange('margin', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Padding Setting */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-black">Padding (px)</label>
                <div className="bg-gray-100 rounded-md px-3 py-1 w-16 text-center">
                  <span className="text-black">{settings.padding}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={settings.padding}
                onChange={(e) => handleChange('padding', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSettings({...initialSettings});
                onSettingsChange({...initialSettings});
              }}
              className="w-full py-2 px-4 bg-gray-100 text-black font-medium rounded-md hover:bg-gray-200 transition-colors mt-2"
            >
              Reset to Default
            </button>
          </div>
        )}

        {/* Background Tab Content (placeholder) */}
        {activeTab === 'background' && (
          <div className="p-4">
            <p className="text-black text-sm">Background settings will be available here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridSettingsMenu; 