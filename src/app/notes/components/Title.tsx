import React, { useState, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const Title = ({
  text,
  placeholder 
}: {
  text: string;
  placeholder?: string;
}) => {
  const [currentText, setCurrentText] = useState(text);
  const textareaRef = useRef<HTMLElement>(null);

  const handleTextChange = (e: ContentEditableEvent) => {
    setCurrentText(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle key down events if needed
  };

  return (
    <div className="flex w-full items-center relative">
      <ContentEditable
        html={currentText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent text-5xl outline-none ${
          !currentText ? "text-gray-400" : "text-black"
        }`}
        //@ts-ignore
        innerRef={textareaRef}
      />
      {!currentText && (
        <div
          className="pointer-events-none absolute flex size-full items-center bg-transparent text-5xl text-gray-400 outline-none"
          onClick={() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
            }
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default Title;
