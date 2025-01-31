"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";

interface TextBoxProps {
  text: string;
  onTextChange: (newText: string) => void;
  isActive?: boolean;
}

const TextBox = ({ text, onTextChange, isActive }: TextBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable features we don't need
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    content: text,
    editable: true,
    autofocus: "end",
    onUpdate: ({ editor }) => {
      onTextChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class: "size-full outline-none",
      },
    },
  });

  return (
    <>
      {/* Text Menu */}
      {isActive && (
        <div
          className="fixed flex items-center space-x-2 rounded bg-gray-800 px-3 py-1.5 text-sm text-white shadow-lg"
          style={{
            top: containerRef.current?.getBoundingClientRect().top! - 40 || 0,
            left: containerRef.current?.getBoundingClientRect().left || 0,
            zIndex: 1000,
          }}
        >
          <span className="text-gray-400">Click to edit text</span>
        </div>
      )}

      {/* Text Content */}
      <div
        className="size-full"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <EditorContent
          editor={editor}
          className="flex size-full cursor-text items-center justify-center bg-gray-800/50 p-2 text-white"
        />
      </div>
    </>
  );
};

export default TextBox;
