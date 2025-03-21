import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface TaskProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
  isChecked: boolean;
  handleCheckboxChange: () => void;
}

const Task = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
  isChecked,
  handleCheckboxChange,
}: TaskProps) => {
  return (
    <div className="flex w-3/5 items-center font-bold">
      <div
        className={`mr-2 flex size-6 items-center justify-center rounded border-2 ${
          isChecked
            ? "border-red-500 bg-red-500"
            : "border-gray-300 bg-transparent"
        }`}
        onClick={handleCheckboxChange}
        style={{ minWidth: "1.5rem", minHeight: "1.5rem" }}
      >
        {isChecked && (
          <svg
            className="size-4 text-white"
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
          isChecked ? "text-gray-500 line-through decoration-red-500" : ""
        }`}
        innerRef={textareaRef}
        style={{ fontSize: "1.25rem" }} // Task font size
      />
    </div>
  );
};

export default Task;
