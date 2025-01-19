import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface BulletPointProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const BulletPoint: React.FC<BulletPointProps> = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: BulletPointProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-2">•</div>
      <ContentEditable
        html={text}
        onChange={(e: ContentEditableEvent) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full resize-none bg-transparent outline-none"
        innerRef={textareaRef}
        style={{ fontSize: "1rem" }} // Bullet point font size
      />
    </div>
  );
};

export default BulletPoint;
