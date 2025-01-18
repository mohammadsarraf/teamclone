import { useEffect, useRef } from "react";

export default function Menu({
  closeMenu,
  adjustTextareaHeight,
  onSelect, // Add onSelect prop
}: {
  closeMenu: () => void;
  adjustTextareaHeight: () => void;
  onSelect: (option: string) => void; // Define the type for onSelect
}) {

  const handleOptionClick = (option: string) => {
    adjustTextareaHeight();
    onSelect(option); // Call onSelect with the selected option
    closeMenu();
  };

  return (
    <div className="bg-gray-900 w-fit">
      <div className="border-b">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() =>  handleOptionClick("Task") }
        >
          Task
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Paragraph")}
        >
          Paragraph
        </button>
      </div>
      <div className="border-b">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Heading 1")}
        >
          Heading 1
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Heading 2")}
        >
          Heading 2
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Heading 3")}
        >
          Heading 3
        </button>
      </div>
      <div className="border-b">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Divider")}
        >
          Divider
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Bullet point")}
        >
          Bullet point
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Numbered List")}
        >
          Numbered List
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Blockquote")}
        >
          Blockquote
        </button>
      </div>
      <div className="">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Image")}
        >
          Image
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          onClick={() => handleOptionClick("Attachment")}
        >
          Attachment
        </button>
      </div>
    </div>
  );
}
