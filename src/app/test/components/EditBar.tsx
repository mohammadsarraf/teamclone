import React from 'react';
import { MdAdd, MdEdit, MdSettings, MdStyle } from "react-icons/md";
import AddBlock from "../../figma/addBlock";
import { SettingsMenu } from './menus/SettingsMenu';

interface EditBarProps {
  isEditing: boolean;
  showEditBar: boolean;
  handleEditClick: () => void;
  handleDesignClick: () => void;
  onSettingsClick?: () => void;
  handleAddBlock: (text: string, type?: string) => void;
  cols: number;
  rows: number;
  onColsChange: (cols: number) => void;
  onRowsChange: (rows: number) => void;
}

export const EditBar = ({
  isEditing,
  showEditBar,
  handleEditClick,
  handleDesignClick,
  onSettingsClick = () => {},
  handleAddBlock,
  cols,
  rows,
  onColsChange,
  onRowsChange,
}: EditBarProps) => {
  const [isMenuVisible, setIsMenuVisible] = React.useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  const handleAddBlockClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    
    setMenuPosition({
      x: rect.left - 192,
      y: rect.top - 320
    });
    
    setIsMenuVisible((prev) => !prev);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSettingsVisible((prev) => !prev);
    onSettingsClick?.();
  };

  return (
    <>
      {/* Bottom Edit Bar */}
      <div 
        className={`fixed bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-gray-900 p-2 text-white shadow-xl ${
          showEditBar ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
        style={{ zIndex: 1000 }}
      >
        <button
          type="button"
          onClick={handleAddBlockClick}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600"
          style={{ cursor: 'pointer' }}
        >
          <MdAdd className="text-lg" />
          Add Block
        </button>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          type="button"
          onClick={handleEditClick}
          className={`edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
            isEditing ? 'bg-blue-500 hover:bg-blue-600' : 'hover:bg-gray-700'
          } active:bg-gray-600`}
          style={{ cursor: 'pointer' }}
        >
          <MdEdit className="text-lg" />
          {isEditing ? 'Done' : 'Edit'}
        </button>
        <button
          type="button"
          onClick={handleDesignClick}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600"
          style={{ cursor: 'pointer' }}
        >
          <MdStyle className="text-lg" />
          Design
        </button>
        <button
          type="button"
          onClick={handleSettingsClick}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600"
          style={{ cursor: 'pointer' }}
        >
          <MdSettings className="text-lg" />
          Settings
        </button>
      </div>

      {/* Add Block Menu */}
      {isMenuVisible && (
        <div 
          className="fixed bottom-10"
          style={{
            zIndex: 1001,
          }}
        >
          <AddBlock 
            handleClose={() => setIsMenuVisible(false)}
            handleAddBlock={handleAddBlock}
          />
        </div>
      )}

      {/* Settings Menu */}
      {isSettingsVisible && (
        <div 
          className="fixed bottom-20 right-10"
          style={{ zIndex: 1001 }}
        >
          <SettingsMenu 
            cols={cols}
            rows={rows}
            onColsChange={onColsChange}
            onRowsChange={onRowsChange}
            handleClose={() => setIsSettingsVisible(false)}
          />
        </div>
      )}
    </>
  );
}; 