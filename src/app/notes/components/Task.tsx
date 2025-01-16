import React, { useState } from "react";

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
      <textarea
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent text-2xl outline-none ${isChecked ? "line-through" : ""}`}
        rows={1}
        style={{ height: "auto" }}
        ref={textareaRef}
      />
    </div>
  );
};

export default Task;
