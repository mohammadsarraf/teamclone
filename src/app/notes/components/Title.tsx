import React, { useState, useRef, useEffect } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

const Title = ({
  text,
  placeholder,
  setTitle,
  handleKeyDown,
}: {
  text: string;
  placeholder?: string;
  setTitle: (text: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}) => {
  const [currentText, setCurrentText] = useState(text);
  const textareaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  const handleTextChange = (e: ContentEditableEvent) => {
    const newText = e.target.value;
    setCurrentText(newText);
    setTitle(newText);
  };

  return (
    <div className="relative flex w-3/5 items-center">
      <ContentEditable
        html={currentText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent outline-none`}
        //@ts-ignore
        innerRef={textareaRef}
        style={{ fontSize: "2rem" }} // Title font size
      />
      {(!currentText || currentText === "<br>") && (
        <div
          className="pointer-events-none absolute left-0 top-0 size-full text-gray-500"
          style={{ fontSize: "2rem" }} // Title font size
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default Title;
