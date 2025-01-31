"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from '@tiptap/extension-text-style'
import { useRef } from "react";
import { RiEdit2Line } from "react-icons/ri";
import TextAlign from '@tiptap/extension-text-align'

interface TextBoxProps {
  text: string;
  onTextChange: (newText: string) => void;
  isActive?: boolean;
  onStartEdit?: () => void;
  font?: string;
  fontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
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
  font = 'Inter',
  fontSize = 16,
  textAlign = 'left',
  isBold = false,
  isItalic = false,
  isUnderline = false,
  lineHeight = 1.5,
  letterSpacing = 0,
  color = '#000000',
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
        types: ['paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: text,
    editable: true,
    onUpdate: ({ editor }) => {
      onTextChange(editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none',
        style: {
          fontFamily: font,
          fontSize: `${fontSize}px`,
          textAlign: textAlign,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none',
          lineHeight: `${lineHeight}`,
          letterSpacing: `${letterSpacing}px`,
          color: color,
          opacity: opacity / 100,
        }
      }
    }
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
          className="size-full cursor-text"
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
          font-family: ${font};
          font-size: ${fontSize}px;
          text-align: ${textAlign};
          font-weight: ${isBold ? 'bold' : 'normal'};
          font-style: ${isItalic ? 'italic' : 'normal'};
          text-decoration: ${isUnderline ? 'underline' : 'none'};
          line-height: ${lineHeight};
          letter-spacing: ${letterSpacing}px;
          color: ${color};
          opacity: ${opacity / 100};
        }
        .ProseMirror p {
          margin: 0;
        }
      `}</style>
      
      {/* Edit Button */}
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
