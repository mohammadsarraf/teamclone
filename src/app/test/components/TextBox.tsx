"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import { useRef, useEffect, useState } from "react";
import { RiEdit2Line, RiDragMove2Fill } from "react-icons/ri";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";

// Modify the SingleLine extension
const createSingleLineExtension = (onEnter: () => void) => {
  return Extension.create({
    name: "singleLine",
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          onEnter();
          return true;
        },
      };
    },
  });
};

interface TextBoxProps {
  text: string;
  onTextChange: (newText: string) => void;
  isActive?: boolean;
  onStartEdit?: () => void;
  onEnterPress?: () => void;
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
  unitSize?: number;
  onHeightChange?: (height: number) => void;
}

const TextBox = ({
  text,
  onTextChange,
  isActive,
  onStartEdit,
  onEnterPress = () => {},
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
  unitSize = 30,
  onHeightChange,
}: TextBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Allow line breaks but disable other features
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        hardBreak: {
          keepMarks: true,
          HTMLAttributes: {},
        }, // Configure hardBreak properly
      }),
      TextStyle,
      TextAlign.configure({
        types: ["paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
      Placeholder.configure({
        placeholder: "Type something...",
        emptyEditorClass: "is-editor-empty",
      }),
      createSingleLineExtension(onEnterPress || (() => {})),
    ],
    content: text,
    autofocus: false,
    editable: isActive,
    onUpdate: ({ editor }) => {
      if (!isInitialLoad) {
        onTextChange(editor.getHTML());
      }

      if (containerRef.current) {
        const editorElement = editor.view.dom;
        const scrollHeight = editorElement.scrollHeight;

        // Use unitSize instead of container height for grid calculation
        const requiredGridUnits = Math.max(
          1,
          Math.ceil(scrollHeight / unitSize),
        );

        if (requiredGridUnits !== contentHeight) {
          setContentHeight(requiredGridUnits);
          onHeightChange?.(requiredGridUnits);
        }
      }
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none",
      },
    },
  });

  // Clear initial load flag after mount
  useEffect(() => {
    setIsInitialLoad(false);
  }, []);

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
    <div className="group relative size-full" ref={containerRef}>
      {/* Main content area with border */}
      <div className="absolute inset-0 flex rounded-lg transition-colors ">
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

        {/* Text Editor Container */}
        <div className="flex-1">
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
          height: auto;
          min-height: 100%;
          width: 100%;
          max-width: 100%;
          padding: 8px 12px;
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
          overflow: visible; /* Changed from auto to visible */
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .ProseMirror p {
          margin: 0;
          min-height: 1em;
          text-align: ${textAlign};
          width: 100%;
          max-width: 100%;
          word-break: break-word;
        }
        .ProseMirror p.is-empty::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
        .ProseMirror-focused p.is-empty::before {
          opacity: 0.5;
        }
        .ProseMirror.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: "Type something...";
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
        /* Remove scrollbar styles since we don't need them anymore */
      `}</style>
    </div>
  );
};

export default TextBox;
