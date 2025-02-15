import { Layout } from "react-grid-layout";
import { Block } from "./types";

export class ShapeManager {
  layout: Block[];
  setLayout: (layout: Block[] | ((prevLayout: Block[]) => Block[])) => void;
  positions: { [key: string]: { x: number; y: number; w: number; h: number } };
  setPositions: (positions: {
    [key: string]: { x: number; y: number; w: number; h: number };
  }) => void;
  activeShape: string | null;
  setActiveShape: (shape: string | null) => void;

  constructor(
    layout: Block[],
    setLayout: (layout: Block[] | ((prevLayout: Block[]) => Block[])) => void,
    positions: {
      [key: string]: { x: number; y: number; w: number; h: number };
    },
    setPositions: (positions: {
      [key: string]: { x: number; y: number; w: number; h: number };
    }) => void,
    activeShape: string | null,
    setActiveShape: (shape: string | null) => void,
  ) {
    this.layout = layout;
    this.setLayout = setLayout;
    this.positions = positions;
    this.setPositions = setPositions;
    this.activeShape = activeShape;
    this.setActiveShape = setActiveShape;
  }

  handleLayoutChange = (newLayout: Layout[]) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) => {
        const newPos = newLayout.find((item) => item.i === block.i);
        return newPos ? { ...block, ...newPos } : block;
      }),
    );
  };

  handleResizeStop = (layout: Layout[], oldItem: Layout, newItem: Layout) => {
    const block = this.layout.find((item) => item.i === newItem.i);
    if (block?.maintainRatio) {
      const updatedLayout = layout.map((item) => {
        if (item.i === newItem.i) {
          return {
            ...item,
            h: newItem.w,
          };
        }
        return item;
      });

      this.setLayout((prevLayout: Block[]) =>
        prevLayout.map((block) => {
          const updatedItem = updatedLayout.find((item) => item.i === block.i);
          if (updatedItem) {
            return {
              ...block,
              x: updatedItem.x,
              y: updatedItem.y,
              w: updatedItem.w,
              h: updatedItem.h,
            };
          }
          return block;
        }),
      );
    }
  };

  handleTextChange = (
    blockId: string,
    newText: string,
    newAlignment?: "left" | "center" | "right",
  ) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId
          ? {
              ...block,
              text: newText
                .replace(/\r\n/g, "\n") // Normalize Windows line breaks
                .replace(/\r/g, "\n") // Normalize Mac line breaks
                .replace(/\n\n+/g, "\n"), // Remove multiple consecutive line breaks
              ...(newAlignment && { textAlign: newAlignment }), // Update alignment if provided
            }
          : block,
      ),
    );
  };

  handleShapeChange = (
    blockId: string,
    type: "triangle" | "circle" | "square",
  ) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, shape: type } : block,
      ),
    );
  };

  handleColorChange = (blockId: string, color: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, color } : block,
      ),
    );
  };

  handleDelete = (blockId: string) => {
    this.setLayout(this.layout.filter((block) => block.i !== blockId));
    this.setActiveShape(null);
  };

  handleDuplicate = (blockId: string) => {
    const blockToDuplicate = this.layout.find((block) => block.i === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        i: `${blockToDuplicate.shape}${this.layout.length + 1}`,
        x: blockToDuplicate.x + 1,
        y: blockToDuplicate.y + 1,
      };
      this.setLayout([...this.layout, newBlock]);
    }
  };

  handleOpacityChange = (blockId: string, opacity: number) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, opacity } : block,
      ),
    );
  };

  handleRotationChange = (blockId: string, rotation: number) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, rotation } : block,
      ),
    );
  };

  handleBorderChange = (border: { width: number; color: string }) => {
    if (this.activeShape !== null) {
      this.setLayout(
        this.layout.map((block) =>
          block.i === this.activeShape ? { ...block, border } : block,
        ),
      );
    }
  };

  handleFlipH = (blockId: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, flipH: !block.flipH } : block,
      ),
    );
  };

  handleFlipV = (blockId: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, flipV: !block.flipV } : block,
      ),
    );
  };

  handleShadowChange = (shadow: boolean) => {
    if (this.activeShape !== null) {
      this.setLayout(
        this.layout.map((block) =>
          block.i === this.activeShape ? { ...block, shadow } : block,
        ),
      );
    }
  };

  handleFontChange = (blockId: string, font: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, font } : block,
      ),
    );
  };

  handleFontSizeChange = (blockId: string, fontSize: number) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, fontSize } : block,
      ),
    );
  };

  handleTextAlignChange = (
    blockId: string,
    textAlign: "left" | "center" | "right",
  ) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, textAlign } : block,
      ),
    );
  };

  handleBoldChange = (blockId: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, isBold: !block.isBold } : block,
      ),
    );
  };

  handleItalicChange = (blockId: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, isItalic: !block.isItalic } : block,
      ),
    );
  };

  handleUnderlineChange = (blockId: string) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId
          ? { ...block, isUnderline: !block.isUnderline }
          : block,
      ),
    );
  };

  handleLineHeightChange = (blockId: string, lineHeight: number) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, lineHeight } : block,
      ),
    );
  };

  handleLetterSpacingChange = (blockId: string, letterSpacing: number) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, letterSpacing } : block,
      ),
    );
  };

  handleHeightChange = (blockId: string, height: number) => {
    this.setLayout((prevLayout: Block[]) =>
      prevLayout.map((block) =>
        block.i === blockId ? { ...block, h: height } : block,
      ),
    );
  };

  createNewShape = (type: "triangle" | "circle" | "square" | "text") => {
    const id = `${type}${this.layout.length + 1}`;
    const defaultColor = "#3b82f6";
    const colors = {
      triangle: defaultColor,
      circle: defaultColor,
      square: defaultColor,
      text: "#FFFFFF",
    };

    return {
      i: id,
      x: 0,
      y: 0,
      w: type === "text" ? 8 : 2,
      h: type === "text" ? 1 : 2,
      shape: type,
      color: colors[type],
      maintainRatio: type !== "text",
      opacity: 100,
      ...(type === "text" && {
        text: "",
        font: "Inter",
        fontSize: 16,
        textAlign: "left" as const,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        lineHeight: 1.5,
        letterSpacing: 0,
      }),
    };
  };

  addShape = (type: "triangle" | "circle" | "square") => {
    const newShape = this.createNewShape(type);
    const newLayout = [...this.layout, newShape];
    this.setLayout(newLayout);
  };

  addTextBox = () => {
    const newTextBox = this.createNewShape("text");
    const newLayout = [...this.layout, newTextBox];
    this.setLayout(newLayout);
  };

  handleEnterPress = (blockId: string) => {
    const currentBlock = this.layout.find((block) => block.i === blockId);
    if (currentBlock) {
      const newTextBox = this.createNewShape("text");
      newTextBox.x = currentBlock.x;
      newTextBox.y = currentBlock.y + 1;
      this.setLayout([...this.layout, newTextBox]);
    }
  };
}
