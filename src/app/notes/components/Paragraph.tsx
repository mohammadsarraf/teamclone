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
    <div className="relative flex items-center w-full">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent text-2xl outline-none"
        innerRef={textareaRef}
      />
      {(index === 0) && (!text || text === "<br>") && (
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none text-2xl text-gray-500"
        >
          {placeholder || "testing"}
        </div>
      )}
    </div>
  );
};

export default Paragraph;
