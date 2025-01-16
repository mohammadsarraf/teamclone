import React, { useState } from "react";

const NoteHeader = ({ addRectangle }: { addRectangle: () => void }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <header className="flex items-center justify-between bg-blue-800 p-4 text-white">
      <h1
        className={`text-xl ${isSelected ? "h-auto" : ""}`}
        onClick={() => setIsSelected(!isSelected)}
      >
        Note App
      </h1>
      <button onClick={addRectangle} className="bg-white p-2 text-black">
        Add Rectangle
      </button>
    </header>
  );
};

export default NoteHeader;
