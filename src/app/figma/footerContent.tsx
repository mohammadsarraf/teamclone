import { useState } from "react";
import AddBlock from "./addBlock";

export default function FooterContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleCloseAddMenu = () => {
    setIsAdding(false);
  };

  return (
    <footer className="group relative flex h-80 flex-col items-center justify-center bg-black p-4 text-white shadow-md">
      <p className="mb-4 text-lg">Footer</p>

      {/* Edit Footer Button (shows on hover if not editing) */}
      {!isEditing && (
        <button
          onClick={handleEditClick}
          className="absolute rounded bg-white px-4 py-2 text-blue-600 opacity-0 shadow-md transition-opacity hover:bg-gray-100 focus:outline-none group-hover:opacity-100"
        >
          Edit Footer
        </button>
      )}

      {/* Add Block and Edit Section Buttons (show after clicking "Edit Footer") */}
      {isEditing && !isAdding && (
        <>
          <div className="absolute left-4 top-4">
            <button
              onClick={handleAddClick}
              className="rounded bg-white px-4 py-2 text-blue-600 shadow-md hover:bg-gray-100"
            >
              Add Block
            </button>
          </div>
          <div className="absolute right-4 top-4 rounded bg-white px-4 py-2 text-blue-600 shadow-md">
            <p>Edit Section</p>
          </div>
        </>
      )}

      {/* Add Block Menu */}
      {isAdding && <AddBlock handleClose={() => handleCloseAddMenu()} />}
    </footer>
  );
}
