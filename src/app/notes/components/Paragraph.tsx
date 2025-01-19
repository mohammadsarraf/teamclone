import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface ParagraphProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
  index: number;
  placeholder?: string;
}

const Paragraph: React.FC<ParagraphProps> = ({
  text = "", // Set default value to an empty string
  handleTextChange,
  handleKeyDown,
  textareaRef,
  index,
  placeholder,
}: ParagraphProps) => {
  return (
    <div className="relative flex w-3/5 items-center font-bold">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent text-2xl outline-none"
        innerRef={textareaRef}
        style={{ fontSize: "1.25rem" }} // Paragraph font size
      />
      {index === 0 && (!text || text === "<br>") && (
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
