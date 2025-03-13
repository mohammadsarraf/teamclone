"use client";
import { useState } from "react";
import { GridItem } from "../../types";

interface ItemPanelProps {
  selectedItem: GridItem;
  onUpdate: (updates: Partial<GridItem>) => void;
  onClose: () => void;
  onDelete?: () => void;
  layout: GridItem[];
}

export default function BananaItemPanel({ selectedItem, onUpdate, onClose, onDelete, layout }: ItemPanelProps) {
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style');

  if (!selectedItem) return null;

  const renderStyleTab = () => (
    <div className="space-y-8 text-[#1c1c1c]">
      {/* Section: Colors */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Colors</h3>
        <div className="space-y-4">
          {/* Background Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1c1c1c]">
              Background
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={selectedItem.backgroundColor || '#3B82F6'}
                  onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-gray-200 p-0.5 transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              <input
                type="text"
                value={selectedItem.backgroundColor || '#3B82F6'}
                onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1c1c1c] shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1c1c1c]">
              Text
            </label>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={selectedItem.textColor || '#FFFFFF'}
                  onChange={(e) => onUpdate({ textColor: e.target.value })}
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded-full border-2 border-gray-200 p-0.5 transition-all hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              <input
                type="text"
                value={selectedItem.textColor || '#FFFFFF'}
                onChange={(e) => onUpdate({ textColor: e.target.value })}
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1c1c1c] shadow-sm transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Layout */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Layout</h3>
        <div className="space-y-4">
          {/* Border Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#1c1c1c]">
                Border Radius
              </label>
              <span className="text-sm text-gray-500">{selectedItem.borderRadius || 8}px</span>
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

          {/* Padding */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#1c1c1c]">
                Padding
              </label>
              <span className="text-sm text-gray-500">{selectedItem.padding || 16}px</span>
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

      {/* Section: Typography */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Typography</h3>
        <div className="space-y-4">
          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-[#1c1c1c]">
                Font Size
              </label>
              <span className="text-sm text-gray-500">{selectedItem.fontSize || 16}px</span>
            </div>
            <input
              type="range"
              min="12"
              max="32"
              value={selectedItem.fontSize || 16}
              onChange={(e) => onUpdate({ fontSize: parseInt(e.target.value) })}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
            />
          </div>

          {/* Font Weight */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1c1c1c]">
              Font Weight
            </label>
            <select
              value={selectedItem.fontWeight || 'normal'}
              onChange={(e) => onUpdate({ fontWeight: e.target.value })}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1c1c1c] shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="medium">Medium</option>
              <option value="semibold">Semibold</option>
              <option value="bold">Bold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section: Effects */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Effects</h3>
        <div className="space-y-4">
          {/* Shadow */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1c1c1c]">
              Shadow
            </label>
            <select
              value={selectedItem.shadow || 'none'}
              onChange={(e) => onUpdate({ shadow: e.target.value })}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1c1c1c] shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="none">None</option>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section: Layer Controls */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Layer</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex < layout.length - 1) {
                const newLayout = [...layout];
                // Move to end of array
                const [item] = newLayout.splice(currentIndex, 1);
                newLayout.push(item);
                if (onUpdate) onUpdate({ _tempLayout: newLayout });
              }
            }}
            className={`flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm transition-all ${
              layout.findIndex(item => item.i === selectedItem.i) === layout.length - 1
                ? 'bg-gray-50 text-gray-400'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            disabled={layout.findIndex(item => item.i === selectedItem.i) === layout.length - 1}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Bring to Front
            </span>
          </button>
          
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex < layout.length - 1) {
                const newLayout = [...layout];
                // Swap with next item
                [newLayout[currentIndex], newLayout[currentIndex + 1]] = 
                [newLayout[currentIndex + 1], newLayout[currentIndex]];
                if (onUpdate) onUpdate({ _tempLayout: newLayout });
              }
            }}
            className={`flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm transition-all ${
              layout.findIndex(item => item.i === selectedItem.i) === layout.length - 1
                ? 'bg-gray-50 text-gray-400'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            disabled={layout.findIndex(item => item.i === selectedItem.i) === layout.length - 1}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7" />
              </svg>
              Move Forward
            </span>
          </button>
          
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex > 0) {
                const newLayout = [...layout];
                // Swap with previous item
                [newLayout[currentIndex], newLayout[currentIndex - 1]] = 
                [newLayout[currentIndex - 1], newLayout[currentIndex]];
                if (onUpdate) onUpdate({ _tempLayout: newLayout });
              }
            }}
            className={`flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm transition-all ${
              layout.findIndex(item => item.i === selectedItem.i) === 0
                ? 'bg-gray-50 text-gray-400'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            disabled={layout.findIndex(item => item.i === selectedItem.i) === 0}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" />
              </svg>
              Move Backward
            </span>
          </button>
          
          <button
            onClick={() => {
              const currentIndex = layout.findIndex(item => item.i === selectedItem.i);
              if (currentIndex > 0) {
                const newLayout = [...layout];
                // Move to start of array
                const [item] = newLayout.splice(currentIndex, 1);
                newLayout.unshift(item);
                if (onUpdate) onUpdate({ _tempLayout: newLayout });
              }
            }}
            className={`flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm font-medium shadow-sm transition-all ${
              layout.findIndex(item => item.i === selectedItem.i) === 0
                ? 'bg-gray-50 text-gray-400'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            disabled={layout.findIndex(item => item.i === selectedItem.i) === 0}
          >
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Send to Back
            </span>
          </button>
        </div>
      </div>

      {/* Group Control */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#1c1c1c]">
          Group
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={selectedItem.group || ''}
            onChange={(e) => onUpdate({ group: e.target.value || undefined })}
            placeholder="Enter group name"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm text-[#1c1c1c]"
          />
          {selectedItem.group && (
            <button
              onClick={() => onUpdate({ group: undefined })}
              className="rounded-md bg-red-100 px-3 py-1.5 text-sm text-red-600 hover:bg-red-200"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Delete Button Section */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Danger Zone</h3>
        <button
          onClick={onDelete}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Item
        </button>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Content Section */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-gray-500">Content</h3>
        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#1c1c1c]">
              Title
            </label>
            <input
              type="text"
              value={selectedItem.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#1c1c1c] shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Content (for textbox) */}
          {selectedItem.type === 'textbox' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#1c1c1c]">
                Content
              </label>
              <textarea
                value={selectedItem.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                className="h-32 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-[#1c1c1c] shadow-sm transition-all hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <h2 className="text-base font-medium text-[#1c1c1c]">Edit {selectedItem.type}</h2>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-1">
        <button
          onClick={() => setActiveTab('style')}
          className={`relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'style'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Style
          {activeTab === 'style' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Content
          {activeTab === 'content' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'style' ? renderStyleTab() : renderContentTab()}
      </div>
    </div>
  );
} 