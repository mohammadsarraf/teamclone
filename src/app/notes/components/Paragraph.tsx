import React, { useState, useEffect } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface ParagraphProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: (element: HTMLElement | null) => void; // Update ref type to callback
  index: number;
  placeholder?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({
  text = "",
  handleTextChange,
  handleKeyDown,
  textareaRef,
  index,
  placeholder,
}: ParagraphProps) => {
  const [currentText, setCurrentText] = useState(text || "");

  useEffect(() => {
    setCurrentText(text || "");
  }, [text]);

  const handleChange = (e: ContentEditableEvent) => {
    const newText = e.target.value;
    const cleanText = newText === "<br>" ? "" : newText;
    setCurrentText(cleanText);
    handleTextChange(cleanText);
  };

  return (
    <div className="relative flex w-3/5 items-center font-bold">
      <ContentEditable
        html={currentText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent text-2xl outline-none"
        innerRef={textareaRef} // Now compatible with ContentEditable's innerRef prop
        style={{ fontSize: "1.25rem" }} // Paragraph font size
      />
      {index === 0 && !currentText && (
        <div
          className="pointer-events-none absolute left-0 top-0 size-full text-2xl text-gray-500"
          style={{ fontSize: "1.25rem" }} // Placeholder font size
        >
          {placeholder || "testing"}
        </div>
      )}
    </div>
  );
};

export default Paragraph;
