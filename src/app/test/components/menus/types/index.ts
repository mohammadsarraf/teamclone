export interface TextDesignMenuProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  currentOpacity: number;
  onOpacityChange: (opacity: number) => void;
  onDelete: () => void;
  onDuplicate: () => void;
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
}

export interface ShapeDesignMenuProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  currentShape: string;
  onShapeChange: (type: "triangle" | "circle" | "square") => void;
  currentOpacity: number;
  onOpacityChange: (opacity: number) => void;
  currentRotation: number;
  onRotationChange: (rotation: number) => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  currentFlipH: boolean;
  currentFlipV: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onBorderChange?: (options: { width: number; color: string }) => void;
  currentBorder?: { width: number; color: string };
  onShadowChange?: (hasShadow: boolean) => void;
  currentShadow?: boolean;
}
