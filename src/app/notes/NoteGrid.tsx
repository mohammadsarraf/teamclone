import React, { useRef, useEffect } from "react";
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
  texts,
  handleTextChange,
  handleKeyDown,
  newRectKey,
  newRectRef,
  rectMenuStates,
  toggleRectMenu,
}: {
  layout: Layout[];
  texts: Texts;
  handleTextChange: (key: string, text: string) => void;
  handleKeyDown: (key: string, event: React.KeyboardEvent<HTMLDivElement>) => void;
  newRectKey: string | null;
  newRectRef: React.RefObject<HTMLDivElement | null>;
  rectMenuStates: { [key: string]: boolean };
  toggleRectMenu: (key: string) => void;
}) => {
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (newRectRef.current) {
      newRectRef.current.focus();
    }
  }, [newRectKey]);

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={window.innerWidth}
      draggableHandle=".drag-handle"
      useCSSTransforms={true}
      isResizable={false}
    >
      {layout.map((item) => (
        <div key={item.i} className="flex items-center p-4">
          <MdOutlineReorder className="drag-handle mr-4 cursor-move" />
          <FaJediOrder
            className="mr-4 cursor-pointer"
            onClick={() => toggleRectMenu(item.i)}
          />
          <ContentEditable
            className="w-full p-2 rounded outline-none"
            html={texts[item.i]} // Use the html prop to set the content
            onChange={(e) => handleTextChange(item.i, e.target.value)} // Use onChange instead of onInput
            onKeyDown={(e) => handleKeyDown(item.i, e)}
            innerRef={item.i === newRectKey ? newRectRef : null}
            style={{ direction: "ltr", textAlign: "left" }} // Ensure text direction is left-to-right and aligned left
          />
        </div>
      ))}
    </GridLayout>
  );
};

export default NoteGrid;
