import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface Heading1Props {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Heading1 = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: Heading1Props) => {
  return (
    <div className="flex items-center">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent text-5xl outline-none"
        innerRef={textareaRef}
      />
    </div>
  );
};

export default Heading1;
