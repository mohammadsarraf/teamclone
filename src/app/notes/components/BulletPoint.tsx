import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface BulletPointProps {
  text: string;
  handleTextChange: (value: string) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLElement>;
}

const BulletPoint = ({
  text,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: BulletPointProps) => {
  return (
    <div className="flex items-center">
      <ul className="list-disc pl-4">
        <li>
          <ContentEditable
            html={text}
            onChange={(e: ContentEditableEvent) =>
              handleTextChange(e.target.value)
            }
            onKeyDown={handleKeyDown}
            className="w-full resize-none bg-transparent text-2xl outline-none "
            innerRef={textareaRef}
          />
        </li>
      </ul>
    </div>
  );
};

export default BulletPoint;
