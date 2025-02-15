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
  onTextChange: (newText: string, newAlignment: "left" | "center" | "right") => void;
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
  const [uniqueId] = useState(() => `textbox-${Math.random().toString(36).substr(2, 9)}`);

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
        hardBreak: true, // Enable hard breaks
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
      // Custom enter handler
      Extension.create({
        name: 'customEnter',
        addKeyboardShortcuts() {
          return {
            Enter: () => {
              if (this.editor.isActive('hardBreak')) {
                return false;
              }
              this.editor.commands.setHardBreak();
              return true;
            },
            'Shift-Enter': () => {
              this.editor.commands.setHardBreak();
              return true;
            }
          };
        }
      }),
    ],
    content: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        attrs: { textAlign: textAlign }, // Set initial text alignment
        content: text ? [{ type: 'text', text }] : []
      }]
    },
    editable: true,
    autofocus: false,
    onUpdate: ({ editor }) => {
      // Get the JSON content to preserve line breaks and alignment
      const jsonContent = editor.getJSON();
      
      // Convert the JSON content to text with proper line breaks
      const textContent = jsonContent.content
        ?.map(node => {
          if (node.type === 'paragraph') {
            // Get the alignment from the node attributes
            const alignment = node.attrs?.textAlign || 'left';
            const text = node.content
              ?.map(textNode => {
                if (textNode.type === 'hardBreak') {
                  return '\n';
                }
                return textNode.text || '';
              })
              .join('') || '';
            
            // Return both text and alignment
            return { text, alignment };
          }
          return { text: '', alignment: 'left' };
        }) || [];

      // Get the predominant alignment from paragraphs
      const alignments = textContent.map(p => p.alignment);
      const predominantAlign = alignments.reduce((acc, curr) => 
        acc[curr] ? { ...acc, [curr]: acc[curr] + 1 } : { ...acc, [curr]: 1 },
        {} as Record<string, number>
      );
      const newAlignment = Object.entries(predominantAlign)
        .sort(([,a], [,b]) => b - a)[0]?.[0] as "left" | "center" | "right" || "left";

      // Combine all text content
      const newText = textContent.map(p => p.text).join('\n');

      // Call onTextChange with both text and alignment
      onTextChange(newText, newAlignment);

      if (containerRef.current) {
        const editorElement = editor.view.dom;
        const scrollHeight = editorElement.scrollHeight;
        const requiredGridUnits = Math.max(1, Math.ceil(scrollHeight / unitSize));

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

  // Update content when text prop changes
  useEffect(() => {
    if (editor && text !== editor.getText()) {
      // Convert text with line breaks to proper content
      const paragraphs = text.split('\n');
      const content = {
        type: 'doc',
        content: paragraphs.map(paragraph => ({
          type: 'paragraph',
          content: [{ type: 'text', text: paragraph }]
        }))
      };
      editor.commands.setContent(content);
    }
  }, [editor, text]);

  // Update text alignment when it changes without focusing
  useEffect(() => {
    if (editor && textAlign) {
      editor.chain().setTextAlign(textAlign).run();
    }
  }, [editor, textAlign]);

  const handleTextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (editor && isActive) {
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
        <div className={`flex-1 ${uniqueId}`}>
          <EditorContent
            editor={editor}
            className="size-full cursor-text"
            data-no-drag="true"
            onClick={handleTextClick}
          />
        </div>
      </div>

      <style>{`
        .${uniqueId} .ProseMirror {
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
          overflow: visible;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
        .${uniqueId} .ProseMirror p {
          margin: 0;
          min-height: 1em;
          text-align: ${textAlign};
          width: 100%;
          max-width: 100%;
          word-break: break-word;
        }
        .${uniqueId} .ProseMirror p.is-empty::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
        .${uniqueId} .ProseMirror-focused p.is-empty::before {
          opacity: 0.5;
        }
        .${uniqueId} .ProseMirror.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: "Type something...";
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
        .${uniqueId} .ProseMirror br {
          display: block;
          content: "";
          margin-top: 0;
        }
      `}</style>
    </div>
  );
};

export default TextBox;
