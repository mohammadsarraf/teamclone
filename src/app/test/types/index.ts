import { Layout } from "react-grid-layout";

export interface Block extends Layout {
  shape: "triangle" | "circle" | "square" | "text" | string;
  color: string;
  maintainRatio?: boolean;
  text?: string;
  rotation?: number;
  border?: { width: number; color: string };
  shadow?: boolean;
  flipH?: boolean;
  flipV?: boolean;
  opacity: number;
  font?: string;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
}

export interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
  isText?: boolean;
  currentShape?: string;
  onShapeChange?: (type: "triangle" | "circle" | "square") => void;
  onColorChange?: (color: string) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onOpacityChange?: (opacity: number) => void;
  onRotationChange?: (rotation: number) => void;
  onBorderChange?: (options: { width: number; color: string }) => void;
  currentOpacity?: number;
  currentRotation?: number;
  currentBorder?: { width: number; color: string };
  onFlipHorizontal?: () => void;
  onFlipVertical?: () => void;
  onShadowChange?: (hasShadow: boolean) => void;
  currentShadow?: boolean;
  currentFlipH?: boolean;
  currentFlipV?: boolean;
  currentColor?: string;
  totalShapes: number;
  index: number;
  menuVisible?: boolean;
  onFontChange?: (font: string) => void;
  currentFont?: string;
  onFontSize?: (size: number) => void;
  currentFontSize?: number;
  onTextAlign?: (align: "left" | "center" | "right") => void;
  currentTextAlign?: "left" | "center" | "right";
  onBold?: () => void;
  isBold?: boolean;
  onItalic?: () => void;
  isItalic?: boolean;
  onUnderline?: () => void;
  isUnderline?: boolean;
  onLineHeight?: (height: number) => void;
  currentLineHeight?: number;
  onLetterSpacing?: (spacing: number) => void;
  currentLetterSpacing?: number;
  onEnterPress?: () => void;
  onHeightChange?: (height: number) => void;
  unitSize: number;
  className?: string;
}

export interface ShapeItemProps {
  type: Block["shape"];
  color: string;
  text?: string;
  onTextChange?: (newText: string) => void;
  onTextAlign?: (align: "left" | "center" | "right") => void;
  isActive?: boolean;
  opacity: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  onStartEdit?: () => void;
  font?: string;
  fontSize?: number;
  textAlign?: "left" | "center" | "right";
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  onEnterPress?: () => void;
  onHeightChange?: (height: number) => void;
  unitSize: number;
}

export interface TextBoxProps {
  onTextChange: (text: string, alignment?: "left" | "center" | "right") => void;
}
