import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface Heading3Props {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Heading3: React.FC<Heading3Props> = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: Heading3Props) => {
  return (
    <div className="w-3/5">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent outline-none"
        innerRef={textareaRef}
        style={{ fontSize: "1.125rem" }} // Heading 3 font size
      />
    </div>
  );
};

export default Heading3;
