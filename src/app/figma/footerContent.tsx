import React, { useState } from "react";
import TestPage from "../test/page";

const FooterContent = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <footer className="group relative flex h-80 bg-gradient-to-b from-gray-900 to-black text-white shadow-xl">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md bg-blue-600 px-6 py-3 text-white opacity-0 shadow-lg transition-all hover:bg-blue-700 group-hover:opacity-100"
        >
          Edit Footer
        </button>
      ) : (
        <div className="flex h-full w-full">
          <TestPage 
            className="w-full"
            containerClassName="px-4"
            initialCols={36}
            initialRows={12}
          />
        </div>
      )}
    </footer>
  );
};

export default FooterContent;
