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
        className={`w-full resize-none bg-transparent text-2xl outline-none ${
          !currentText && index === 0 ? "before:content-[attr(data-placeholder)] before:text-zinc-600" : ""
        }`}
        innerRef={textareaRef} // Now compatible with ContentEditable's innerRef prop
        style={{ fontSize: "1.25rem" }} // Paragraph font size
        data-placeholder={index === 0 ? placeholder : ""}
      />
    </div>
  );
};

export default Paragraph;
