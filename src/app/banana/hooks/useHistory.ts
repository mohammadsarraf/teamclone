import { useState, useEffect, useCallback } from "react";

export default function useHistory<T>(
  initialState: T,
  options?: {
    onStateChange?: (state: T) => void;
    debounceTime?: number;
    exposeToWindow?: { key: string };
  },
) {
  // Added logging to confirm hook initialization
  console.log(
    `useHistory initialized with key: ${options?.exposeToWindow?.key || "none"}`,
  );

  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Current state always comes from history at current index
  const currentState = history[currentIndex];

  // Add a new state to history
  const addState = useCallback(
    (newState: T) => {
      // Only add if different from current state
      if (JSON.stringify(newState) !== JSON.stringify(history[currentIndex])) {
        const updatedHistory = history.slice(0, currentIndex + 1);
        setHistory([...updatedHistory, newState]);
        setCurrentIndex(updatedHistory.length);

        // Notify parent if callback provided
        if (options?.onStateChange) {
          options.onStateChange(newState);
        }
      }
    },
    [history, currentIndex, options?.onStateChange],
  );

  // Debounced version for sliders and frequent changes
  const debouncedAddState = useCallback(
    (newState: T) => {
      // Simple debounce implementation
      const timeoutId = setTimeout(() => {
        addState(newState);
      }, options?.debounceTime || 300);

      return () => clearTimeout(timeoutId);
    },
    [addState, options?.debounceTime],
  );

  // Undo function
  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);

      // Notify parent if callback provided
      if (options?.onStateChange) {
        options.onStateChange(history[newIndex]);
      }
    }
  }, [canUndo, currentIndex, history, options?.onStateChange]);

  // Redo function
  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      // Notify parent if callback provided
      if (options?.onStateChange) {
        options.onStateChange(history[newIndex]);
      }
    }
  }, [canRedo, currentIndex, history, options?.onStateChange]);

  // Apply an external state (e.g., from parent component)
  const applyExternalState = useCallback(
    (state: T) => {
      // Log the state being applied to verify content formatting is preserved
      console.log("Applying external state:", state);

      // Add the external state to history
      addState(state);
    },
    [addState],
  );

  // Expose functions to window object if requested
  useEffect(() => {
    if (options?.exposeToWindow?.key && typeof window !== "undefined") {
      (window as any)[options.exposeToWindow.key] = {
        undo: canUndo ? undo : null,
        redo: canRedo ? redo : null,
        canUndo,
        canRedo,
        currentState,
        currentHistoryIndex: currentIndex,
        applyExternalState,
      };
    }

    return () => {
      if (options?.exposeToWindow?.key && typeof window !== "undefined") {
        delete (window as any)[options.exposeToWindow.key];
      }
    };
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    currentState,
    currentIndex,
    applyExternalState,
    options?.exposeToWindow?.key,
  ]);

  return {
    state: currentState,
    addState,
    debouncedAddState,
    undo,
    redo,
    canUndo,
    canRedo,
    applyExternalState,
  };
}
