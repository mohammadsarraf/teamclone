export interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "triangle" | "circle" | "square" | "text" | string;
  color: string;
  maintainRatio?: boolean;
  text?: string;
}

export interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
}
