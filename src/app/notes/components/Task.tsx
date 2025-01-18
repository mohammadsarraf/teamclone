import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const Task = ({ text, handleTextChange, handleKeyDown, textareaRef }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="mr-2 mt-1"
      />
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent text-2xl outline-none ${isChecked ? "line-through" : ""}`}
        innerRef={textareaRef}
      />
    </div>
  );
};

export default Task;
