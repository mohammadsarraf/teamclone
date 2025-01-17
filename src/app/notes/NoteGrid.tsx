import React, { useRef, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import { FaJediOrder } from "react-icons/fa6";
import ContentEditable from "react-contenteditable";

interface Texts {
  [key: string]: string;
}

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const NoteGrid = ({
  layout,
  handleKeyDown,
  newRectKey,
  newRectRef,
  rectMenuStates,
  toggleRectMenu,
  setLayout, // Receive the setLayout function
}: {
  layout: Layout[];
  handleKeyDown: (key: string, event: React.KeyboardEvent<HTMLDivElement>) => void;
  newRectKey: string | null;
  newRectRef: React.RefObject<HTMLDivElement | null>;
  rectMenuStates: { [key: string]: boolean };
  toggleRectMenu: (key: string) => void;
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>; // Define the type for setLayout
}) => {
  const [texts, setTexts] = useState<Texts>({ rect1: "" });
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const rowHeight = 20; // Decrease the row height to reduce the distance between rectangles

  useEffect(() => {
    if (newRectRef.current) {
      newRectRef.current.focus();
    }
  }, [newRectKey]);

  useEffect(() => {
    if (newRectKey && contentRefs.current[newRectKey]) {
      contentRefs.current[newRectKey].focus();
    }
  }, [newRectKey]);

  const handleTextChange = (key: string, text: string) => {
    setTexts({
      ...texts,
      [key]: text,
    });
  };

  const handleTextChangeWithHeight = (key: string, text: string) => {
    handleTextChange(key, text);
    const contentElement = contentRefs.current[key];
    if (contentElement) {
      const newHeight = contentElement.scrollHeight / rowHeight;
      setLayout((prevLayout) =>
        prevLayout.map((item) =>
          item.i === key ? { ...item, h: newHeight } : item, // Update the height based on the measured height
        ),
      );
    }
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={rowHeight} // Use the updated row height
      width={window.innerWidth}
      draggableHandle=".drag-handle"
      useCSSTransforms={true}
      isResizable={false}
    >
      {layout.map((item) => (
        <div key={item.i} className="flex items-center" style={{ height: item.h * rowHeight }}>
          <MdOutlineReorder className="drag-handle mr-4 cursor-move" />
          <FaJediOrder
            className="mr-4 cursor-pointer"
            onClick={() => toggleRectMenu(item.i)}
          />
          <ContentEditable
            className="w-full outline-none"
            html={texts[item.i]} // Use the html prop to set the content
            onChange={(e) => handleTextChangeWithHeight(item.i, e.target.value)} // Use onChange instead of onInput
            onKeyDown={(e) => handleKeyDown(item.i, e)}
            innerRef={(el) => (contentRefs.current[item.i] = el)} // Store the ref to measure height
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default NoteGrid;
