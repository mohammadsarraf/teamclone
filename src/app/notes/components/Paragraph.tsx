import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface ParagraphProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Paragraph: React.FC<ParagraphProps> = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: ParagraphProps) => {
  return (
    <div className="flex items-center">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent text-2xl outline-none"
        innerRef={textareaRef}
      />
    </div>
  );
};

export default Paragraph;
