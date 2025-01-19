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
    <div className="relative flex w-full items-center">
      <ContentEditable
        html={currentText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent text-5xl outline-none`}
        //@ts-ignore
        innerRef={textareaRef}
      />
      {(!currentText || currentText === "<br>") && (
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none text-5xl text-gray-500"
        >
          {placeholder || "testing"}
        </div>
      )}
    </div>
  );
};

export default Title;
