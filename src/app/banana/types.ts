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

import { Layout } from "react-grid-layout";
import { ReactNode } from 'react';

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
  shadowAngle?: number;
  shadowDistance?: number;
  shadowBlur?: number;
  shadowColor?: string;
  layer?: number;
  shapeType?: string;
  shape?: 'square' | 'circle' | 'triangle';
  textStyle?: string;
  textDecoration?: string;
  fontFamily?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
  stretch?: boolean;
  blendMode?: string;
  borderWidth?: number;
  borderStyle?: string;
  cornerMode?: 'uniform' | 'individual';
  borderRadiusTopLeft?: number;
  borderRadiusTopRight?: number;
  borderRadiusBottomLeft?: number;
  borderRadiusBottomRight?: number;
  rounded?: string;
  roundedTopLeft?: string;
  roundedTopRight?: string;
  roundedBottomLeft?: string;
  roundedBottomRight?: string;
  opacity?: number;
}

export interface BlockTemplate {
  title: string;
  description: string;
  height: number;
  type: 'section' | 'square' | 'textbox' | 'image' | 'video' | 'button' | 'form' | 'audio' | 'newsletter' | 'accordion' | 'shape' | 'scrolling' | 'line' | 'quote' | 'map' | 'embed' | 'markdown' | 'code' | 'summary' | 'calendar';
  width?: number;
  icon?: ReactNode;
}

export interface GridSettings {
  rows: number;
  columns: number;
  margin: number; // For backward compatibility
  horizontalMargin: number;
  verticalMargin: number;
  padding: number;
  fillScreen?: boolean;
  heightSetting?: 'small' | 'medium' | 'large' | 'custom';
  customHeight?: number;
  minHeight?: number;
  maxHeight?: number;
  contentWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  contentAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'middle' | 'bottom';
}

export {};
