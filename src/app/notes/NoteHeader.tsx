import React, { useState } from "react";

export default function NoteHeader() {
  return (
    <div>
      <header className="flex items-center justify-between bg-gray-800 p-4 text-white">
        <h1 className="text-xl">Note App</h1>
        {/* <button  className="bg-white p-2 text-black">
            Add Rectangle
          </button> */}
      </header>
    </div>
  );
}
