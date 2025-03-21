"use client";
import { useState, useEffect } from "react";
import { GrRedo, GrUndo } from "react-icons/gr";

export default function BananaUndoRedo() {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Check for undo/redo availability periodically
  useEffect(() => {
    const checkUndoRedoStatus = () => {
      if (typeof window !== "undefined" && window.bananaHeaderEditor) {
        // @ts-ignore - Accessing custom properties on window
        setCanUndo(!!window.bananaHeaderEditor.canUndo);
        // @ts-ignore
        setCanRedo(!!window.bananaHeaderEditor.canRedo);
      }
    };

    // Check immediately and then every 100ms
    checkUndoRedoStatus();
    const interval = setInterval(checkUndoRedoStatus, 100);

    return () => clearInterval(interval);
  }, []);

  const handleUndo = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (
      typeof window !== "undefined" &&
      window.bananaHeaderEditor &&
      window.bananaHeaderEditor.undo
    ) {
      // @ts-ignore - Accessing custom properties on window
      window.bananaHeaderEditor.undo();
    }
  };

  const handleRedo = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (
      typeof window !== "undefined" &&
      window.bananaHeaderEditor &&
      window.bananaHeaderEditor.redo
    ) {
      // @ts-ignore - Accessing custom properties on window
      window.bananaHeaderEditor.redo();
    }
  };

  return (
    <div className="fixed right-4 top-4 z-[9999] flex items-center space-x-2 rounded-md bg-black/50 p-2 backdrop-blur-sm">
      <button
        className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
        disabled={!canUndo}
        onClick={handleUndo}
        title="Undo"
      >
        <GrUndo className="size-5" />
      </button>
      <button
        className="rounded p-1.5 text-white/80 transition-colors hover:bg-white/10 disabled:opacity-40"
        disabled={!canRedo}
        onClick={handleRedo}
        title="Redo"
      >
        <GrRedo className="size-5" />
      </button>
    </div>
  );
}
