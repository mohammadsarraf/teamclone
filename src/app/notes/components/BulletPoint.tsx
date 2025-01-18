import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const BulletPoint = ({ text, handleTextChange, handleKeyDown, textareaRef }) => {
  return (
    <div className="flex items-center">
      <ul className="list-disc pl-4">
        <li>
          <ContentEditable
            html={text}
            onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent text-base outline-none"
            innerRef={textareaRef}
          />
        </li>
      </ul>
    </div>
  );
};

export default BulletPoint;
