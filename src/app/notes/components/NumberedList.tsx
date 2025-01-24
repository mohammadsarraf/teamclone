import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface NumberedListProps {
  text: string;
  number: number;
  handleTextChange: (text: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  textareaRef: (element: HTMLElement | null) => void;
}

export default function NumberedList({
  text,
  number,
  handleTextChange,
  handleKeyDown,
  textareaRef,
}: NumberedListProps) {
  const handleChange = (e: ContentEditableEvent) => {
    const newText = e.target.value;
    handleTextChange(newText === "<br>" ? "" : newText);
  };

  return (
    <div className="flex w-full items-start gap-2">
      <span className="mt-[2px] select-none text-zinc-500">{number}.</span>
      <ContentEditable
        className="w-full bg-transparent text-zinc-200 outline-none empty:before:text-zinc-500 empty:before:content-[attr(data-placeholder)]"
        html={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        innerRef={textareaRef}
      />
    </div>
  );
} 