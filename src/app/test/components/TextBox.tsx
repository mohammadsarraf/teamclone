"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";
import { RiEdit2Line } from "react-icons/ri";

interface TextBoxProps {
  text: string;
  onTextChange: (newText: string) => void;
  isActive?: boolean;
  onStartEdit?: () => void;
}

const TextBox = ({ text, onTextChange, isActive, onStartEdit }: TextBoxProps) => {
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
    onUpdate: ({ editor }) => {
      onTextChange(editor.getText());
    },
  });

  const handleStartEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartEdit?.();
    if (editor) {
      setTimeout(() => {
        editor.commands.focus('end');
      }, 0);
    }
  };

  return (
    <div 
      className="group relative size-full bg-gray-800"
      ref={containerRef}
    >
      {/* Drag Handle */}
      <div className="absolute inset-x-0 top-0 h-6 cursor-move bg-gray-700/50" />
      
      <div className="absolute inset-0 pt-6">
        <EditorContent
          editor={editor}
          className="size-full cursor-text text-white"
          data-no-drag="true"
          onClick={handleStartEdit}
        />
      </div>
      
      <style jsx global>{`
        .ProseMirror {
          height: 100%;
          width: 100%;
          padding: 0.5rem;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ProseMirror p {
          margin: 0;
        }
      `}</style>
      
      {/* Edit Button - Added z-50 to ensure it's above wrapper */}
      <button
        className="absolute right-2 top-2 z-50 rounded-full bg-blue-500 p-1.5 text-white opacity-0 shadow-lg transition-opacity hover:bg-blue-600 group-hover:opacity-100"
        onClick={handleStartEdit}
        data-no-drag="true"
      >
        <RiEdit2Line className="size-4" />
      </button>
    </div>
  );
};

export default TextBox;
