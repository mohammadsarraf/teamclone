import React, { useState, useEffect } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface TitleProps {
  text: string;
  placeholder?: string;
  setTitle: (text: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  textareaRef?: (element: HTMLElement | null) => void;
}

export default function Title({
  text = "",
  placeholder,
  setTitle,
  handleKeyDown,
  textareaRef,
}: TitleProps) {
  const [currentText, setCurrentText] = useState(text || "");

  useEffect(() => {
    setCurrentText(text || "");
  }, [text]);

  const handleChange = (e: ContentEditableEvent) => {
    const newText = e.target.value;
    const cleanText = newText === "<br>" ? "" : newText;
    setCurrentText(cleanText);
    setTitle(cleanText);
  };

  return (
    <ContentEditable
      html={currentText}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      innerRef={textareaRef}
      className={`block w-full border-none bg-transparent text-4xl font-bold text-zinc-100 outline-none ${
        !currentText
          ? "before:text-zinc-600 before:content-[attr(data-placeholder)]"
          : ""
      }`}
      data-placeholder={placeholder}
    />
  );
}
