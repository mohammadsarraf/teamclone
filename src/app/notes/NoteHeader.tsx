import React from "react";

const NoteHeader = ({ addRectangle }: { addRectangle: () => void }) => (
  <header className="flex items-center justify-between bg-blue-800 p-4 text-white">
    <h1 className="text-xl">Note App</h1>
    <button onClick={addRectangle} className="bg-white p-2 text-black">
      Add Rectangle
    </button>
  </header>
);

export default NoteHeader;
