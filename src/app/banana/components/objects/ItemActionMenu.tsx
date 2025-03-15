import React from 'react';
import { GridItem } from '../../types';

interface ItemActionMenuProps {
  item: GridItem;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const ItemActionMenu: React.FC<ItemActionMenuProps> = ({ 
  item, 
  onEdit, 
  onDuplicate, 
  onDelete
}) => {
  return (
    <div 
      className=" z-50 bg-white rounded-md shadow-md border border-gray-200 flex items-center divide-x divide-gray-200 text-black"
    >
      {/* Pencil/Edit Button */}
      <button 
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={onEdit}
        title="Edit"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Ink/Style Button (placeholder) */}
      <button 
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={() => {}}
        title="Style"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14c-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V8c0-2.21 1.79-4 4-4s4 1.79 4 4v.17c1.16.42 2 1.52 2 2.83 0 1.66-1.34 3-3 3H7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 18h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Move Up Button (placeholder) */}
      <button 
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={() => {}}
        title="Move Up"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20V4M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Duplicate Button */}
      <button 
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={onDuplicate}
        title="Duplicate"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>

      {/* Template Button (placeholder) */}
      <button 
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={() => {}}
        title="Template"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 21L9 9" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>

      {/* Link Button (placeholder) */}
      <button 
        className="p-2 hover:bg-gray-50 transition-colors"
        onClick={() => {}}
        title="Link"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Delete Button */}
      <button 
        className="p-2 hover:bg-gray-50 hover:text-red-500 transition-colors"
        onClick={onDelete}
        title="Delete"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default ItemActionMenu; 