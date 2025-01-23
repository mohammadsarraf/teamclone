import React from "react";

interface TitleProps {
  text: string;
  placeholder?: string;
  setTitle: (text: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export default function Title({
  text,
  placeholder,
  setTitle,
  handleKeyDown,
}: TitleProps) {
  return (
    <div
      contentEditable
      onInput={(e) => setTitle(e.currentTarget.textContent || "")}
      onKeyDown={handleKeyDown}
      dangerouslySetInnerHTML={{ __html: text }}
      className={`block w-full border-none bg-transparent text-4xl font-bold text-zinc-100 outline-none ${
        !text
          ? "before:text-zinc-600 before:content-[attr(data-placeholder)]"
          : ""
      }`}
      data-placeholder={placeholder}
    />
  );
}
