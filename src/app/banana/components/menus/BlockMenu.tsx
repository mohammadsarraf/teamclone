import React, { useState } from 'react';
import { BlockTemplate } from '../../types';

interface BlockMenuProps {
  onAddBlock: (template: BlockTemplate) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

const BlockMenu: React.FC<BlockMenuProps> = ({ onAddBlock, onClose, position }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Basic');
  
  // Define block templates with icons
  const blockTemplates: Record<string, BlockTemplate[]> = {
    'Basic': [
      {
        title: "Text",
        description: "Add a text block for content",
        height: 2,
        width: 4,
        type: 'textbox',
        icon: <span className="text-xl">T</span>
      },
      {
        title: "Image",
        description: "Add an image to your layout",
        height: 4,
        width: 4,
        type: 'image',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M21 15L16 10L8 18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        title: "Button",
        description: "Add a clickable button",
        height: 1,
        width: 4,
        type: 'button',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        title: "Video",
        description: "Add a video player",
        height: 4,
        width: 6,
        type: 'video',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M10 9L15 12L10 15V9Z" fill="currentColor"/>
          </svg>
        )
      },
      {
        title: "Form",
        description: "Add a form for user input",
        height: 6,
        width: 4,
        type: 'form',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 10H20M4 14H12M4 18H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      {
        title: "Audio",
        description: "Add an audio player",
        height: 2,
        width: 6,
        type: 'audio',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M8 8V16M4 10V14M16 7V17M20 9V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      {
        title: "Newsletter",
        description: "Add a newsletter signup form",
        height: 3,
        width: 6,
        type: 'newsletter',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M2 8L12 14L22 8" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        title: "Accordion",
        description: "Add collapsible content sections",
        height: 4,
        width: 6,
        type: 'accordion',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 9L19 12L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
    ],
    'Media': [
      {
        title: "Shape",
        description: "Add a geometric shape",
        height: 3,
        width: 3,
        type: 'shape',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        title: "Scrolling",
        description: "Add scrolling content",
        height: 6,
        width: 4,
        type: 'scrolling',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 4L8 8M12 4L16 8M12 20L8 16M12 20L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      },
      {
        title: "Line",
        description: "Add a horizontal line",
        height: 1,
        width: 6,
        type: 'line',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      {
        title: "Quote",
        description: "Add a quotation block",
        height: 3,
        width: 6,
        type: 'quote',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11H6V7H10V11ZM10 17H6V13H10V17ZM18 11H14V7H18V11ZM18 17H14V13H18V17Z" fill="currentColor"/>
          </svg>
        )
      },
    ],
    'Advanced': [
      {
        title: "Map",
        description: "Add an interactive map",
        height: 6,
        width: 6,
        type: 'map',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 21L17.5 15.5C19.5 13.5 19.5 10.5 17.5 8.5C15.5 6.5 12.5 6.5 10.5 8.5C8.5 10.5 8.5 13.5 10.5 15.5L12 17" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        title: "Embed",
        description: "Embed external content",
        height: 4,
        width: 6,
        type: 'embed',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3L4 7L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3L20 7L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 12V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      {
        title: "Markdown",
        description: "Add formatted markdown content",
        height: 4,
        width: 6,
        type: 'markdown',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 7V17H9V12L11 15L13 12V17H15V7H13L11 10L9 7H7Z" fill="currentColor"/>
          </svg>
        )
      },
      {
        title: "Code",
        description: "Add a code block with syntax highlighting",
        height: 4,
        width: 6,
        type: 'code',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 9L4 12L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 9L20 12L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 4L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      {
        title: "Summary",
        description: "Add a content summary section",
        height: 3,
        width: 6,
        type: 'summary',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 8H17M7 12H14M7 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      },
      {
        title: "Calendar",
        description: "Add a calendar or event display",
        height: 6,
        width: 6,
        type: 'calendar',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 2V6M16 2V6M3 10H21M8 14H10M14 14H16M8 18H10M14 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      }
    ]
  };

  // Filter blocks based on search query
  const filteredBlocks = Object.entries(blockTemplates).reduce((acc, [category, blocks]) => {
    const filtered = blocks.filter(block => 
      block.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      block.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    
    return acc;
  }, {} as Record<string, BlockTemplate[]>);

  // Get all categories for tabs
  const categories = Object.keys(blockTemplates);

  // Default position if not provided
  const menuPosition = position || { top: 60, left: 0 };

  return (
    <div 
      className="fixed shadow-lg z-50 overflow-hidden bg-white rounded-lg border border-gray-200 block-menu"
      style={{ 
        top: `${menuPosition.top}px`, 
        left: `${menuPosition.left}px`,
        width: '340px',
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

      {/* Search bar */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="search"
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs - Only show if not searching */}
      {!searchQuery && (
        <div className="border-b flex flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              className={`py-2 px-3 text-center font-medium text-sm ${activeCategory === category ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-black hover:text-indigo-500'}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Block categories */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 110px)' }}>
        {/* When searching, show all filtered categories */}
        {searchQuery ? (
          Object.entries(filteredBlocks).map(([category, blocks]) => (
            <div key={category} className="p-3">
              <h3 className="text-xs font-semibold text-black uppercase mb-2">{category}</h3>
              <div className="grid grid-cols-2 gap-2">
                {blocks.map((block, index) => (
                  <button
                    key={`${block.type}-${index}`}
                    className="flex items-center gap-2 p-2 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    onClick={() => onAddBlock(block)}
                  >
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-black">
                      {block.icon}
                    </div>
                    <div className="text-sm font-medium">{block.title}</div>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          // When not searching, show only the active category
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {blockTemplates[activeCategory].map((block, index) => (
                <button
                  key={`${block.type}-${index}`}
                  className="flex items-center gap-2 p-2 text-left border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => onAddBlock(block)}
                >
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-black">
                    {block.icon}
                  </div>
                  <div className="text-sm font-medium text-black">{block.title}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery && Object.keys(filteredBlocks).length === 0 && (
          <div className="p-6 text-center text-black text-sm">
            No blocks match your search
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockMenu; 