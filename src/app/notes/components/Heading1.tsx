import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface Heading1Props {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Heading1: React.FC<Heading1Props> = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: Heading1Props) => {
  return (
    <div className="w-3/5 font-bold">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent outline-none"
        innerRef={textareaRef}
        style={{ fontSize: "2rem" }} // Heading 1 font size
      />
    </div>
  );
};

export default Heading1;
