export interface Block {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shape: "triangle" | "circle" | "square" | string;
  color: string;
  maintainRatio?: boolean;
}

export interface ShapeWrapperProps {
  children: React.ReactNode;
  isActive?: boolean;
  onSelect?: () => void;
}
