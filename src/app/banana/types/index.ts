// Component state types
export interface HeaderState {
  layout: string;
  height: number;
  linkSpacing: number;
  elementSpacing: number;
  enabledElements: {
    isButton: boolean;
    isSocial: boolean;
    isCart: boolean;
    isAccount: boolean;
  };
  gradientStartColor: string;
  gradientEndColor?: string;
  isGradient?: boolean;
  textColor: string;
}

export interface GridItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  type?: string;
  content?: string;
  placeholder?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  padding?: number;
  fontSize?: number;
  fontWeight?: string;
  shadow?: string;
  layer?: number;
  shapeType?: string;
  textStyle?: string;
  textDecoration?: string;
  fontFamily?: string;
}

export interface GridSettings {
  rows: number;
  columns: number;
  margin: number;
  horizontalMargin: number;
  verticalMargin: number;
  padding: number;
}

export interface ContentState {
  layout: GridItem[];
  gridSettings: GridSettings;
  backgroundColor?: string;
  textColor?: string;
}

export interface FooterState {
  layout?: string;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  columns?: any[];
}

// Additional types for templates
export interface BlockTemplate {
  title: string;
  description: string;
  height: number;
  width: number;
  type: string;
}

// Window extensions
declare global {
  interface Window {
    bananaHeaderEditor?: {
      undo: (() => void) | null;
      redo: (() => void) | null;
      canUndo: boolean;
      canRedo: boolean;
      currentState: HeaderState | null;
      currentHistoryIndex: number;
      applyExternalState: (state: HeaderState) => void;
    };
    bananaContentEditor?: {
      undo: (() => void) | null;
      redo: (() => void) | null;
      canUndo: boolean;
      canRedo: boolean;
      currentState: ContentState | null;
      currentHistoryIndex: number;
      applyExternalState: (state: ContentState) => void;
    };
    bananaFooterEditor?: {
      undo: (() => void) | null;
      redo: (() => void) | null;
      canUndo: boolean;
      canRedo: boolean;
      currentState: FooterState | null;
      currentHistoryIndex: number;
      applyExternalState: (state: FooterState) => void;
    };
    bananaEditor?: {
      undo: (() => void) | null;
      redo: (() => void) | null;
      canUndo: boolean;
      canRedo: boolean;
      currentState: any;
      currentHistoryIndex: number;
      history: any[];
    };
  }
}
