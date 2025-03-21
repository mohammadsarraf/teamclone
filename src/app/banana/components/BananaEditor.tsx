import { useState, useEffect, useCallback, useRef } from "react";
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

// Local storage key
const STORAGE_KEY = "banana-editor-state";

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
    { timestamp: Date.now() },
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  
  // Refs to track component initialization
  const componentsInitialized = useRef({
    header: false,
    content: false,
    footer: false,
  });
  
  // Flag to track if we've loaded from storage
  const loadedFromStorage = useRef(false);
  
  // Load saved state on initial mount
  useEffect(() => {
    if (loadedFromStorage.current) return;
    
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        console.log("Loading saved editor state from localStorage");
        const { history, index } = JSON.parse(savedData);
        
        if (Array.isArray(history) && history.length > 0) {
          loadedFromStorage.current = true;
          setEditorHistory(history);
          setCurrentHistoryIndex(index);
          
          // Save the states separately so we can apply them when components are ready
          const lastState = history[index];
          
          if (lastState.header) {
            setHeaderState(lastState.header);
          }
          
          if (lastState.content) {
            setContentState(lastState.content);
          }
          
          if (lastState.footer) {
            setFooterState(lastState.footer);
          }
        }
      }
    } catch (error) {
      console.error("Error loading editor state:", error);
    }
  }, []);

  // Apply states to components when they're available
  useEffect(() => {
    if (!loadedFromStorage.current) return;
    
    // Apply header state if we have it and the window API is available
    if (headerState && window.bananaHeaderEditor?.applyExternalState) {
      console.log("Applying saved header state");
      window.bananaHeaderEditor.applyExternalState(headerState);
    }
    
    // Apply content state if we have it and the window API is available
    if (contentState && window.bananaContentEditor?.applyExternalState) {
      console.log("Applying saved content state");
      
      // Log textbox content to verify formatting is preserved
      if (contentState.layout && contentState.layout.length > 0) {
        const textboxes = contentState.layout.filter(item => item.type === "textbox");
        if (textboxes.length > 0) {
          console.log("Content state contains textboxes with HTML content:", 
            textboxes.map(item => ({
              id: item.i, 
              content: item.content,
              hasFormatting: item.content?.includes('<') || false
            }))
          );
        }
      }
      
      window.bananaContentEditor.applyExternalState(contentState);
    }
    
    // Apply footer state if we have it and the window API is available
    if (footerState && window.bananaFooterEditor?.applyExternalState) {
      console.log("Applying saved footer state");
      window.bananaFooterEditor.applyExternalState(footerState);
    }
  }, [
    headerState, 
    contentState, 
    footerState, 
    // Check when window APIs become available
    typeof window !== 'undefined' && window.bananaHeaderEditor,
    typeof window !== 'undefined' && window.bananaContentEditor,
    typeof window !== 'undefined' && window.bananaFooterEditor,
  ]);

  // Save state to localStorage whenever history changes
  useEffect(() => {
    // Skip saving during initial load or if no components have initialized
    if (!componentsInitialized.current.header && 
        !componentsInitialized.current.content && 
        !componentsInitialized.current.footer) {
      return;
    }
    
    // Skip saving if we're just initializing and haven't loaded saved state yet
    if (editorHistory.length === 1 && !headerState && !contentState && !footerState) {
      return;
    }
    
    try {
      const dataToSave = {
        history: editorHistory,
        index: currentHistoryIndex
      };
      console.log("Saving editor state to localStorage");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving editor state:", error);
    }
  }, [editorHistory, currentHistoryIndex, headerState, contentState, footerState]);

  // Derived state for undo/redo availability
  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < editorHistory.length - 1;

  // Handler for header state changes
  const handleHeaderStateChange = useCallback(
    (state: HeaderState) => {
      setHeaderState(state);
      componentsInitialized.current.header = true;

      // Skip adding to history if we're still loading from storage
      if (!loadedFromStorage.current) return;

      // Add to global history
      const newEntry: BananaEditorHistory = {
        ...editorHistory[currentHistoryIndex],
        header: state,
        timestamp: Date.now(),
      };

      const newHistory = editorHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(newEntry);
      setEditorHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    },
    [editorHistory, currentHistoryIndex],
  );

  // Handler for content state changes
  const handleContentStateChange = useCallback(
    (state: ContentState) => {
      setContentState(state);
      componentsInitialized.current.content = true;

      // Skip adding to history if we're still loading from storage
      if (!loadedFromStorage.current) return;

      // Add to global history
      const newEntry: BananaEditorHistory = {
        ...editorHistory[currentHistoryIndex],
        content: state,
        timestamp: Date.now(),
      };

      const newHistory = editorHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(newEntry);
      setEditorHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    },
    [editorHistory, currentHistoryIndex],
  );

  // Handler for footer state changes
  const handleFooterStateChange = useCallback(
    (state: FooterState) => {
      setFooterState(state);
      componentsInitialized.current.footer = true;

      // Skip adding to history if we're still loading from storage
      if (!loadedFromStorage.current) return;

      // Add to global history
      const newEntry: BananaEditorHistory = {
        ...editorHistory[currentHistoryIndex],
        footer: state,
        timestamp: Date.now(),
      };

      const newHistory = editorHistory.slice(0, currentHistoryIndex + 1);
      newHistory.push(newEntry);
      setEditorHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    },
    [editorHistory, currentHistoryIndex],
  );
  
  // Mark loading as complete after components have mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadedFromStorage.current) {
        loadedFromStorage.current = true;
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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
      if (
        (cmdOrCtrl && e.altKey && e.key === "z" && e.shiftKey) ||
        (cmdOrCtrl && e.altKey && e.key === "y")
      ) {
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
        history: editorHistory,
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
    currentHistoryIndex,
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
