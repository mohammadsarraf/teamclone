"use client";
import { useState } from "react";
import { GridItem } from "../../types";

interface ItemPanelProps {
  selectedItem: GridItem;
  onUpdate: (updates: Partial<GridItem> | { _tempLayout: GridItem[] }) => void;
  onClose: () => void;
  onDelete?: () => void;
  layout: GridItem[];
}

export default function BananaItemPanel({ selectedItem, onUpdate, onClose, onDelete, layout }: ItemPanelProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style');
  const isTextbox = selectedItem.type === 'textbox';

  if (!selectedItem) return null;

  const renderTextboxStyleTab = () => (
    <div className="space-y-5 text-[#1c1c1c]">
      {/* Text Styling */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Text Style</h3>
        <div className="space-y-3">
          {/* Text Style Presets */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Text Style</label>
            <select
              value={selectedItem.textStyle || 'paragraph-1'}
              onChange={(e) => {
                const style = e.target.value as 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'paragraph-1' | 'paragraph-2' | 'paragraph-3' | 'monospace';
                let fontSize = 16;
                let fontWeight = 'normal';
                
                // Set appropriate font size and weight based on style
                switch(style) {
                  case 'heading-1': fontSize = 32; fontWeight = 'bold'; break;
                  case 'heading-2': fontSize = 28; fontWeight = 'bold'; break;
                  case 'heading-3': fontSize = 24; fontWeight = 'semibold'; break;
                  case 'heading-4': fontSize = 20; fontWeight = 'semibold'; break;
                  case 'paragraph-1': fontSize = 16; fontWeight = 'normal'; break;
                  case 'paragraph-2': fontSize = 14; fontWeight = 'normal'; break;
                  case 'paragraph-3': fontSize = 12; fontWeight = 'normal'; break;
                  case 'monospace': fontSize = 14; fontWeight = 'normal'; break;
                }
                
                onUpdate({ 
                  textStyle: style, 
                  fontSize, 
                  fontWeight,
                  fontFamily: style === 'monospace' ? 'monospace' : undefined
                });
              }}
              className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs shadow-sm"
            >
              <option value="heading-1">Heading 1 (32px)</option>
              <option value="heading-2">Heading 2 (28px)</option>
              <option value="heading-3">Heading 3 (24px)</option>
              <option value="heading-4">Heading 4 (20px)</option>
              <option value="paragraph-1">Paragraph 1 (16px)</option>
              <option value="paragraph-2">Paragraph 2 (14px)</option>
              <option value="paragraph-3">Paragraph 3 (12px)</option>
              <option value="monospace">Monospace (14px)</option>
            </select>
          </div>

          {/* Text Color */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Text Color</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={selectedItem.textColor || '#000000'}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-md border border-gray-200"
                />
                <div className="absolute inset-0 rounded-md shadow-sm pointer-events-none"></div>
              </div>
              <input
                type="text"
                value={selectedItem.textColor || '#000000'}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs shadow-sm"
              />
            </div>
          </div>

          {/* Text Decoration */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Text Decoration</label>
            <div className="flex gap-1 rounded-md bg-gray-100 p-0.5">
              <button
                onClick={() => onUpdate({ textDecoration: selectedItem.textDecoration === 'underline' ? undefined : 'underline' })}
                className={`flex-1 rounded-md px-2 py-1 text-xs transition-all ${
                  selectedItem.textDecoration === 'underline'
                    ? 'bg-white font-medium shadow-sm text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Underline
              </button>
              <button
                onClick={() => onUpdate({ textDecoration: selectedItem.textDecoration === 'line-through' ? undefined : 'line-through' })}
                className={`flex-1 rounded-md px-2 py-1 text-xs transition-all ${
                  selectedItem.textDecoration === 'line-through'
                    ? 'bg-white font-medium shadow-sm text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Strikethrough
              </button>
              <button
                onClick={() => onUpdate({ textDecoration: undefined })}
                className={`flex-1 rounded-md px-2 py-1 text-xs transition-all ${
                  !selectedItem.textDecoration
                    ? 'bg-white font-medium shadow-sm text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                None
              </button>
            </div>
          </div>

          {/* Text Alignment */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Text Align</label>
            <div className="flex gap-1 rounded-md bg-gray-100 p-0.5">
              <button
                onClick={() => onUpdate({ textAlign: 'left' })}
                className={`flex-1 rounded-md px-2 py-1 text-xs transition-all ${
                  selectedItem.textAlign === 'left' || !selectedItem.textAlign
                    ? 'bg-white font-medium shadow-sm text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Left
              </button>
              <button
                onClick={() => onUpdate({ textAlign: 'center' })}
                className={`flex-1 rounded-md px-2 py-1 text-xs transition-all ${
                  selectedItem.textAlign === 'center'
                    ? 'bg-white font-medium shadow-sm text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Center
              </button>
              <button
                onClick={() => onUpdate({ textAlign: 'right' })}
                className={`flex-1 rounded-md px-2 py-1 text-xs transition-all ${
                  selectedItem.textAlign === 'right'
                    ? 'bg-white font-medium shadow-sm text-gray-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Right
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Background</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              type="checkbox"
              id="enableBackground"
              checked={!!selectedItem.backgroundColor}
              onChange={(e) => onUpdate({ 
                backgroundColor: e.target.checked ? '#FFFFFF' : undefined 
              })}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="enableBackground" className="text-xs text-gray-700">Enable</label>
          </div>
          
          {selectedItem.backgroundColor && (
            <div className="flex flex-1 items-center gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={selectedItem.backgroundColor}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-md border border-gray-200"
                />
                <div className="absolute inset-0 rounded-md shadow-sm pointer-events-none"></div>
              </div>
              <input
                type="text"
                value={selectedItem.backgroundColor}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Layout</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Padding</label>
              <span className="text-xs text-gray-500">{selectedItem.padding || 16}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={selectedItem.padding || 16}
              onChange={(e) => onUpdate({ padding: parseInt(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Radius</label>
              <span className="text-xs text-gray-500">{selectedItem.borderRadius || 8}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={selectedItem.borderRadius || 8}
              onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Layer</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex < layout.length - 1) {
                const newLayout = [...layout];
                const [item] = newLayout.splice(currentIndex, 1);
                newLayout.push(item);
                onUpdate({ _tempLayout: newLayout });
              }
            }}
            className="rounded-md bg-white px-2 py-1.5 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Bring Front
          </button>
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex > 0) {
                const newLayout = [...layout];
                const [item] = newLayout.splice(currentIndex, 1);
                newLayout.unshift(item);
                onUpdate({ _tempLayout: newLayout });
              }
            }}
            className="rounded-md bg-white px-2 py-1.5 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Send Back
          </button>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-all"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  );

  const renderShapeStyleTab = () => (
    <div className="space-y-5 text-[#1c1c1c]">
      {/* Shape Type Selector */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shape Type</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onUpdate({ shapeType: 'square' })}
            className={`flex flex-col items-center justify-center rounded-md p-2 transition-all ${
              selectedItem.shapeType === 'square' || !selectedItem.shapeType
                ? 'bg-blue-50 border border-blue-200 text-blue-600'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="h-8 w-8 rounded-sm bg-current mb-1"></div>
            <span className="text-xs font-medium">Square</span>
          </button>
          <button
            onClick={() => onUpdate({ shapeType: 'circle' })}
            className={`flex flex-col items-center justify-center rounded-md p-2 transition-all ${
              selectedItem.shapeType === 'circle'
                ? 'bg-blue-50 border border-blue-200 text-blue-600'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="h-8 w-8 rounded-full bg-current mb-1"></div>
            <span className="text-xs font-medium">Circle</span>
          </button>
          <button
            onClick={() => onUpdate({ shapeType: 'triangle' })}
            className={`flex flex-col items-center justify-center rounded-md p-2 transition-all ${
              selectedItem.shapeType === 'triangle'
                ? 'bg-blue-50 border border-blue-200 text-blue-600'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="h-8 w-8 flex items-center justify-center mb-1">
              <div 
                className="h-6 w-6" 
                style={{
                  backgroundColor: 'currentColor',
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}
              ></div>
            </div>
            <span className="text-xs font-medium">Triangle</span>
          </button>
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Colors</h3>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700">Background</label>
          <div className="flex items-center gap-1">
            <div className="relative">
              <input
                type="color"
                value={selectedItem.backgroundColor || '#3B82F6'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="h-7 w-7 cursor-pointer rounded-md border border-gray-200"
              />
              <div className="absolute inset-0 rounded-md shadow-sm pointer-events-none"></div>
            </div>
            <input
              type="text"
              value={selectedItem.backgroundColor || '#3B82F6'}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Border */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Border</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Width</label>
              <span className="text-xs text-gray-500">{selectedItem.borderWidth || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={selectedItem.borderWidth || 0}
              onChange={(e) => onUpdate({ borderWidth: parseInt(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Color</label>
            <div className="flex items-center gap-1">
              <div className="relative">
                <input
                  type="color"
                  value={selectedItem.borderColor || '#000000'}
                  onChange={(e) => onUpdate({ borderColor: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded-md border border-gray-200"
                  disabled={!selectedItem.borderWidth}
                />
                <div className="absolute inset-0 rounded-md shadow-sm pointer-events-none"></div>
              </div>
              <input
                type="text"
                value={selectedItem.borderColor || '#000000'}
                onChange={(e) => onUpdate({ borderColor: e.target.value })}
                className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs shadow-sm"
                disabled={!selectedItem.borderWidth}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shape */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shape</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Radius</label>
              <span className="text-xs text-gray-500">{selectedItem.borderRadius || 8}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedItem.borderRadius || 8}
              onChange={(e) => onUpdate({ borderRadius: parseInt(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">Padding</label>
              <span className="text-xs text-gray-500">{selectedItem.padding || 16}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={selectedItem.padding || 16}
              onChange={(e) => onUpdate({ padding: parseInt(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shadow</h3>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700">Type</label>
          <select
            value={selectedItem.shadow || 'none'}
            onChange={(e) => onUpdate({ shadow: e.target.value as any })}
            className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs shadow-sm"
          >
            <option value="none">None</option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">Extra Large</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Layer</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex < layout.length - 1) {
                const newLayout = [...layout];
                const [item] = newLayout.splice(currentIndex, 1);
                newLayout.push(item);
                onUpdate({ _tempLayout: newLayout });
              }
            }}
            className="rounded-md bg-white px-2 py-1.5 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Bring Front
          </button>
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex > 0) {
                const newLayout = [...layout];
                const [item] = newLayout.splice(currentIndex, 1);
                newLayout.unshift(item);
                onUpdate({ _tempLayout: newLayout });
              }
            }}
            className="rounded-md bg-white px-2 py-1.5 text-xs font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Send Back
          </button>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className="flex w-full items-center justify-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-all"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </button>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-5">
      <div className="space-y-3 rounded-md bg-gray-50 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Content</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={selectedItem.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs shadow-sm"
              placeholder="Enter title"
            />
          </div>
          {isTextbox && (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">Content</label>
                <textarea
                  value={selectedItem.content || ''}
                  onChange={(e) => onUpdate({ content: e.target.value })}
                  className="h-32 w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs shadow-sm"
                  placeholder="Enter content"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-gray-700">Placeholder</label>
                <input
                  type="text"
                  value={selectedItem.placeholder || ''}
                  onChange={(e) => onUpdate({ placeholder: e.target.value })}
                  className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-xs shadow-sm"
                  placeholder="Enter placeholder text"
                />
                <p className="text-xs text-gray-500 mt-1">Shown when content is empty</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-64 rounded-lg bg-white p-3 shadow-xl border border-gray-100">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('style')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'style' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Style
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'content' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Content
          </button>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        {activeTab === 'style' 
          ? (isTextbox ? renderTextboxStyleTab() : renderShapeStyleTab())
          : renderContentTab()
        }
      </div>
    </div>
  );
} 