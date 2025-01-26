import {
  LinkIcon,
  BoldIcon,
  ItalicIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface SelectionMenuProps {
  onBold: () => void;
  onItalic: () => void;
  onLink: () => void;
  onClear: () => void;
}

export default function SelectionMenu({
  onBold,
  onItalic,
  onLink,
  onClear,
}: SelectionMenuProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setIsVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const scrollY = window.scrollY;

      // Calculate position relative to viewport
      const menuHeight = 40; // Height of our menu
      const buffer = 10; // Space between selection and menu

      setPosition({
        // Center horizontally over selection
        left: Math.max(0, rect.left + rect.width / 2 - 84),
        // Position above selection, but ensure it stays in viewport
        top: Math.max(0, rect.top + scrollY - menuHeight - buffer),
      });
      setIsVisible(true);
    };

    document.addEventListener("selectionchange", handleSelection);
    window.addEventListener("scroll", handleSelection); // Handle scroll position
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      window.removeEventListener("scroll", handleSelection);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1 rounded-md bg-zinc-800/90 p-1.5 shadow-lg backdrop-blur-sm transition-all duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)", // Center the menu
      }}
    >
      <button
        onClick={onBold}
        className="rounded p-1.5 text-zinc-400 hover:bg-zinc-700"
        title="Bold"
      >
        <BoldIcon className="size-4" />
      </button>
      <button
        onClick={onItalic}
        className="rounded p-1.5 text-zinc-400 hover:bg-zinc-700"
        title="Italic"
      >
        <ItalicIcon className="size-4" />
      </button>
      <button
        onClick={onLink}
        className="rounded p-1.5 text-zinc-400 hover:bg-zinc-700"
        title="Add link"
      >
        <LinkIcon className="size-4" />
      </button>
      <button
        onClick={onClear}
        className="rounded p-1.5 text-zinc-400 hover:bg-zinc-700"
        title="Clear formatting"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
}
