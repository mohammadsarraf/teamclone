import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface Heading3Props {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Heading3 = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: Heading3Props) => {
  return (
    <div className="flex items-center">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent text-3xl outline-none"
        innerRef={textareaRef}
      />
    </div>
  );
};

export default Heading3;
