import React, { useState, useEffect } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface TitleProps {
  text: string;
  placeholder?: string;
  setTitle: (text: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

const Title: React.FC<TitleProps> = ({
  text,
  placeholder,
  setTitle,
  handleKeyDown,
}) => {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    setCurrentText(text || "");
  }, [text]);

  const handleTextChange = (e: ContentEditableEvent) => {
    const newText = e.target.value.replace(/<br\/?>/g, "");
    setCurrentText(newText || "");
    setTitle(newText || "");
  };

  return (
    <div className="relative flex w-3/5 items-center font-bold">
      <ContentEditable
        html={currentText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        className={`w-full resize-none bg-transparent outline-none ${!currentText ? "empty-content" : ""}`}
        innerRef={(el: HTMLElement | null) => {
          if (el) el.setAttribute("contentEditable", "true");
        }}
        style={{ fontSize: "3rem" }}
      />
      {!currentText && (
        <span
          className="pointer-events-none absolute left-0 top-0 size-full text-gray-500"
          style={{ fontSize: "3rem" }}
          aria-hidden="true"
        >
          {placeholder}
        </span>
      )}
    </div>
  );
};

export default Title;
