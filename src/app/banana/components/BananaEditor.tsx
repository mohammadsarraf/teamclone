import { useState, useEffect, useCallback } from "react";
import FooterEdit from "./BananaFooterEditor";
import HeaderEdit from "./BananaHeaderEditor";
import MainEdit from "./BananaContentEditor";
import { HeaderState, ContentState, FooterState } from "../types/index";

// Global editor history entry
interface BananaEditorHistory {
  header?: HeaderState;
  content?: ContentState;
  footer?: FooterState;
  timestamp: number;
}

export default function BananaEditor({
  isFullscreen,
}: {
  isFullscreen: boolean;
}) {
  // Track current state of each component
  const [headerState, setHeaderState] = useState<HeaderState | undefined>();
  const [contentState, setContentState] = useState<ContentState | undefined>();
  const [footerState, setFooterState] = useState<FooterState | undefined>();

  // Global history management
  const [editorHistory, setEditorHistory] = useState<BananaEditorHistory[]>([
    { timestamp: Date.now() }
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  // Derived state for undo/redo availability
  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < editorHistory.length - 1;

  // Handler for header state changes
  const handleHeaderStateChange = useCallback((state: HeaderState) => {
    setHeaderState(state);
    
    // Add to global history
    const newEntry: BananaEditorHistory = {
      ...editorHistory[currentHistoryIndex],
      header: state,
      timestamp: Date.now()
    };
    
    const newHistory = editorHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(newEntry);
    setEditorHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [editorHistory, currentHistoryIndex]);

  // Handler for content state changes
  const handleContentStateChange = useCallback((state: ContentState) => {
    setContentState(state);
    
    // Add to global history
    const newEntry: BananaEditorHistory = {
      ...editorHistory[currentHistoryIndex],
      content: state,
      timestamp: Date.now()
    };
    
    const newHistory = editorHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(newEntry);
    setEditorHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [editorHistory, currentHistoryIndex]);

  // Handler for footer state changes
  const handleFooterStateChange = useCallback((state: FooterState) => {
    setFooterState(state);
    
    // Add to global history
    const newEntry: BananaEditorHistory = {
      ...editorHistory[currentHistoryIndex],
      footer: state,
      timestamp: Date.now()
    };
    
    const newHistory = editorHistory.slice(0, currentHistoryIndex + 1);
    newHistory.push(newEntry);
    setEditorHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [editorHistory, currentHistoryIndex]);

  // Global undo handler
  const handleGlobalUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      
      const state = editorHistory[newIndex];
      
      // Apply states to components via their window-exposed APIs
      if (state.header && window.bananaHeaderEditor?.applyExternalState) {
        window.bananaHeaderEditor.applyExternalState(state.header);
      }
      
      if (state.content && window.bananaContentEditor?.applyExternalState) {
        window.bananaContentEditor.applyExternalState(state.content);
      }
      
      if (state.footer && window.bananaFooterEditor?.applyExternalState) {
        window.bananaFooterEditor.applyExternalState(state.footer);
      }
    }
  }, [canUndo, currentHistoryIndex, editorHistory]);

  // Global redo handler
  const handleGlobalRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      
      const state = editorHistory[newIndex];
      
      // Apply states to components via their window-exposed APIs
      if (state.header && window.bananaHeaderEditor?.applyExternalState) {
        window.bananaHeaderEditor.applyExternalState(state.header);
      }
      
      if (state.content && window.bananaContentEditor?.applyExternalState) {
        window.bananaContentEditor.applyExternalState(state.content);
      }
      
      if (state.footer && window.bananaFooterEditor?.applyExternalState) {
        window.bananaFooterEditor.applyExternalState(state.footer);
      }
    }
  }, [canRedo, currentHistoryIndex, editorHistory]);

  // Setup keyboard shortcuts for global undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      
      // Global undo with Alt modifier (Cmd+Alt+Z or Ctrl+Alt+Z)
      if (cmdOrCtrl && e.altKey && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleGlobalUndo();
      }
      
      // Global redo with Alt modifier (Cmd+Alt+Shift+Z or Ctrl+Alt+Y)
      if ((cmdOrCtrl && e.altKey && e.key === "z" && e.shiftKey) || 
          (cmdOrCtrl && e.altKey && e.key === "y")) {
        e.preventDefault();
        handleGlobalRedo();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleGlobalUndo, handleGlobalRedo]);

  // Expose global history functions to window
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.bananaEditor = {
        undo: canUndo ? handleGlobalUndo : null,
        redo: canRedo ? handleGlobalRedo : null,
        canUndo,
        canRedo,
        currentState: editorHistory[currentHistoryIndex],
        currentHistoryIndex,
        history: editorHistory
      };
    }
    
    return () => {
      if (typeof window !== "undefined") {
        delete window.bananaEditor;
      }
    };
  }, [
    canUndo,
    canRedo,
    handleGlobalUndo,
    handleGlobalRedo,
    editorHistory,
    currentHistoryIndex
  ]);

  return (
    <div className="flex h-full flex-col overflow-auto">
      <HeaderEdit 
        isFullscreen={isFullscreen} 
        onStateChange={handleHeaderStateChange}
      />
      <div className="flex-1">
        <MainEdit 
          isFullscreen={isFullscreen} 
          onStateChange={handleContentStateChange}
        />
      </div>
      <FooterEdit 
        isFullscreen={isFullscreen}
        onStateChange={handleFooterStateChange}
      />
    </div>
  );
}
