import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const NumberedList = ({ text, handleTextChange, handleKeyDown, textareaRef }) => {
  return (
    <div className="flex items-center">
      <ol className="list-decimal pl-4">
        <li className="mb-2">
          <ContentEditable
            html={text}
            onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent text-base outline-none"
            innerRef={textareaRef}
          />
        </li>
      </ol>
    </div>
  );
};

export default NumberedList;
