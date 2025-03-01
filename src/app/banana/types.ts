// Type declarations for global window object extensions
declare global {
  // Define MenuType here to match the one in BananaHeaderEditor.tsx
  type MenuType = "none" | "element" | "design";
  
  // Define HeaderLayout to match the one in BananaHeader.tsx
  type HeaderLayout = "Option 1" | "Option 2" | "Option 3" | "Option 4";
  
  // Define EnabledElements to match the one in BananaHeaderEditor.tsx
  interface EnabledElements {
    isButton: boolean;
    isSocial: boolean;
    isCart: boolean;
    isAccount: boolean;
  }
  
  // Complete state of the header for history tracking
  interface HeaderState {
    layout: HeaderLayout;
    height: number;
    linkSpacing: number;
    elementSpacing: number;
    enabledElements: EnabledElements;
    activeMenu: MenuType;
    isEditing: boolean;
  }
  
  interface Window {
    bananaHeaderEditor?: {
      undo: (() => void) | null;
      redo: (() => void) | null;
      canUndo: boolean;
      canRedo: boolean;
      currentState?: any; // The current state of the header
      currentHistoryIndex?: number; // The current index in the history
    };
  }
}

export {}; 