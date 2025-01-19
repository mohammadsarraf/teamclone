import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface Heading2Props {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const Heading2: React.FC<Heading2Props> = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: Heading2Props) => {
  return (
    <div className="w-3/5 font-bold">
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent outline-none"
        innerRef={textareaRef}
        style={{ fontSize: "1.5rem" }} // Heading 2 font size
      />
    </div>
  );
};

export default Heading2;
