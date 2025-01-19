import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface TaskProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Task = ({ text, handleTextChange, handleKeyDown, textareaRef }: TaskProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <div
        className={`w-6 h-6 mr-2 flex items-center justify-center border-2 rounded ${
          isChecked ? "bg-red-500 border-red-500" : "bg-transparent border-gray-300"
        }`}
        onClick={handleCheckboxChange}
        style={{ minWidth: "1.5rem", minHeight: "1.5rem" }}
      >
        {isChecked && (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        )}
      </div>
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent text-2xl outline-none ${
          isChecked ? "line-through decoration-red-500 text-gray-500" : ""
        }`}
        innerRef={textareaRef}
      />
    </div>
  );
};

export default Task;
