"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { useRef, useEffect } from "react";
import { RiEdit2Line, RiDragMove2Fill } from "react-icons/ri";
import TextAlign from "@tiptap/extension-text-align";

interface TextBoxProps {
  text: string;
  onTextChange: (newText: string) => void;
  isActive?: boolean;
  onStartEdit?: () => void;
  font?: string;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  color?: string;
  opacity?: number;
}

const TextBox = ({
  text,
  onTextChange,
  isActive,
  onStartEdit,
  font = "Inter",
  fontSize = 16,
  textAlign = "left",
  isBold = false,
  isItalic = false,
  isUnderline = false,
  lineHeight = 1.5,
  letterSpacing = 0,
  color = "#000000",
  opacity = 100,
}: TextBoxProps) => {
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
      TextStyle,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
    ],
    content: text,
    editable: true,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none",
      },
    },
  });

  // Update text alignment when it changes
  useEffect(() => {
    if (editor && textAlign) {
      editor.chain().focus().setTextAlign(textAlign).run();
    }
  }, [editor, textAlign]);

  const handleTextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only focus the editor, don't open menu
    if (editor) {
      editor.commands.focus("end");
    }
  };

  return (
    <div className="group relative size-full bg-gray-800" ref={containerRef}>
      {/* Main content area with border */}
      <div className="absolute inset-0 rounded-lg border border-gray-700 transition-colors hover:border-gray-600">
        {/* Control buttons - Outside the box */}
        <div className="absolute -right-10 top-0 z-50 flex flex-col gap-2">
          {/* Edit Button */}
          <button
            className="rounded-full bg-gray-700 p-1.5 text-white opacity-0 shadow-lg transition-all hover:bg-gray-600 hover:shadow-xl group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartEdit?.();
            }}
            data-no-drag="true"
          >
            <RiEdit2Line className="size-4" />
          </button>

          {/* Drag Handle */}
          <div
            className="cursor-move rounded-full bg-gray-700 p-1.5 text-white opacity-0 shadow-lg transition-all hover:bg-gray-600 hover:shadow-xl group-hover:opacity-100"
            data-drag-handle="true"
          >
            <RiDragMove2Fill className="size-4" />
          </div>
        </div>

        {/* Text Editor */}
        <div className="size-full cursor-default">
          <EditorContent
            editor={editor}
            className="size-full cursor-text"
            data-no-drag="true"
            onClick={handleTextClick}
          />
        </div>
      </div>

      <style jsx global>{`
        .ProseMirror {
          height: 100%;
          width: 100%;
          padding: 12px;
          outline: none;
          display: block;
          font-family: ${font};
          font-size: ${fontSize}px;
          font-weight: ${isBold ? "bold" : "normal"};
          font-style: ${isItalic ? "italic" : "normal"};
          text-decoration: ${isUnderline ? "underline" : "none"};
          line-height: ${lineHeight};
          letter-spacing: ${letterSpacing}px;
          color: ${color};
          opacity: ${opacity / 100};
          overflow-y: auto;
        }
        .ProseMirror p {
          margin: 0;
          min-height: 1em;
          text-align: ${textAlign};
        }
        .ProseMirror::-webkit-scrollbar {
          width: 4px;
        }
        .ProseMirror::-webkit-scrollbar-track {
          background: transparent;
        }
        .ProseMirror::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.3);
          border-radius: 2px;
        }
        .ProseMirror::-webkit-scrollbar-thumb:hover {
          background-color: rgba(155, 155, 155, 0.5);
        }
      `}</style>
    </div>
  );
};

export default TextBox;
