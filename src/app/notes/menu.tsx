import { useEffect, useRef } from "react";

export default function Menu({
  closeMenu,
  onSelect,
  adjustTextareaHeight,
}: {
  closeMenu: () => void;
  onSelect: (option: string) => void;
  adjustTextareaHeight: () => void;
}) {
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      event.currentTarget.click();
    }
  };

  const handleOptionClick = (option: string) => {
    onSelect(option);
    adjustTextareaHeight();
    closeMenu();
  };

  return (
    <div className="">
      <div className="border-b">
        <button
          ref={firstButtonRef}
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Task")}
        >
          Task
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Paragraph")}
        >
          Paragraph
        </button>
      </div>
      <div className="border-b">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Heading 1")}
        >
          Heading 1
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Heading 2")}
        >
          Heading 2
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Heading 3")}
        >
          Heading 3
        </button>
      </div>
      <div className="border-b">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Divider")}
        >
          Divider
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Bullet point")}
        >
          Bullet point
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Numbered List")}
        >
          Numbered List
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Blockquote")}
        >
          Blockquote
        </button>
      </div>
      <div className="">
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Image")}
        >
          Image
        </button>
        <button
          className="block w-full px-2 py-1 text-left hover:bg-gray-300 focus:bg-gray-500"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={() => handleOptionClick("Attachment")}
        >
          Attachment
        </button>
      </div>
    </div>
  );
}
