import React from "react";
import {
  MdAdd,
  MdEdit,
  MdSettings,
  MdStyle,
  MdSave,
  MdRestartAlt,
  MdUndo,
  MdRedo,
} from "react-icons/md";
import AddBlock from "../../figma/addBlock";
import { SettingsMenu } from "./menus/SettingsMenu";

interface EditBarProps {
  isEditing: boolean;
  showEditBar: boolean;
  handleEditClick: () => void;
  handleDesignClick: () => void;
  onSettingsClick?: () => void;
  handleAddBlock: (text: string, type?: string) => void;
  handleSaveChanges?: () => void;
  handleResetChanges?: () => void;
  cols: number;
  rows: number;
  onColsChange: (cols: number) => void;
  onRowsChange: (rows: number) => void;
  stateKey: string;
  position?: "fixed" | "relative";
  offset?: number;
  onClose?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const EditBar = ({
  isEditing,
  showEditBar,
  handleEditClick,
  handleDesignClick,
  onSettingsClick = () => {},
  handleAddBlock,
  handleSaveChanges = () => {},
  handleResetChanges = () => {},
  cols,
  rows,
  onColsChange,
  onRowsChange,
  stateKey,
  position,
  offset,
  onClose,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
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
      y: rect.top - 320,
    });

    setIsMenuVisible((prev) => !prev);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsSettingsVisible((prev) => !prev);
    onSettingsClick?.();
  };

  const handleSave = () => {
    handleSaveChanges?.();
    onClose?.();
  };

  return (
    <>
      {/* Bottom Edit Bar - Make it fixed to viewport */}
      <div
        className={`fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-blue-900 p-2 text-white shadow-xl ${
          showEditBar ? "opacity-100" : "opacity-0"
        } transition-opacity duration-200`}
        style={{ zIndex: 1000 }}
      >
        <button
          type="button"
          onClick={handleAddBlockClick}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600"
          style={{ cursor: "pointer" }}
        >
          <MdAdd className="text-lg" />
          Add Block
        </button>
        <div className="h-4 w-px bg-gray-700"></div>
        {/* <button
          type="button"
          onClick={handleEditClick}
          className={`edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors ${
            isEditing ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-gray-700"
          } active:bg-gray-600`}
          style={{ cursor: "pointer" }}
        >
          <MdEdit className="text-lg" />
          {isEditing ? "Done" : "Edit"}
        </button> */}
        <button
          type="button"
          onClick={handleDesignClick}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600"
          style={{ cursor: "pointer" }}
        >
          <MdStyle className="text-lg" />
          Design
        </button>
        <button
          type="button"
          onClick={handleSettingsClick}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors hover:bg-gray-700 active:bg-gray-600"
          style={{ cursor: "pointer" }}
        >
          <MdSettings className="text-lg" />
          Settings
        </button>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          type="button"
          onClick={handleSave}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm text-green-400 transition-colors hover:bg-gray-700 active:bg-gray-600"
        >
          <MdSave className="text-lg" />
          Save
        </button>
        <button
          type="button"
          onClick={handleResetChanges}
          className="edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-gray-700 active:bg-gray-600"
        >
          <MdRestartAlt className="text-lg" />
          Reset
        </button>
        <div className="h-4 w-px bg-gray-700"></div>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors 
            ${canUndo ? "hover:bg-gray-700 active:bg-gray-600" : "cursor-not-allowed opacity-50"}`}
        >
          <MdUndo className="text-lg" />
          Undo
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`edit-bar-button pointer-events-auto flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors
            ${canRedo ? "hover:bg-gray-700 active:bg-gray-600" : "cursor-not-allowed opacity-50"}`}
        >
          <MdRedo className="text-lg" />
          Redo
        </button>
      </div>

      {/* Add Block Menu */}
      {isMenuVisible && (
        <div
          className="fixed bottom-10"
          style={{
            zIndex: 2000,
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
        <div className="fixed bottom-20 right-10" style={{ zIndex: 2000 }}>
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
