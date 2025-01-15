import React, { RefObject } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";

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
}: {
  layout: Layout[];
  texts: Texts;
  handleTextChange: (key: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (key: string, event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  newRectKey: string | null;
  newRectRef: RefObject<HTMLTextAreaElement | null>;
}) => (
  <GridLayout
    className="layout"
    layout={layout}
    cols={12}
    rowHeight={30}
    width={1200}
    draggableHandle=".drag-handle"
    useCSSTransforms={true}
    isResizable={false}
  >
    {layout.map((item) => (
      <div key={item.i} className="flex w-full items-center p-4 text-black rounded">
        <MdOutlineReorder className="drag-handle mr-4 cursor-move" />
        <div className="flex-1 p-4">
          <textarea
            value={texts[item.i]}
            onChange={(e) => handleTextChange(item.i, e)}
            onKeyDown={(e) => handleKeyDown(item.i, e)}
            className="w-full bg-transparent outline-none resize-none overflow-hidden"
            rows={1}
            style={{ height: 'auto' }}
            ref={item.i === newRectKey ? newRectRef : null}
            placeholder={layout.length === 1 && item.i === "rect1" ? "Enter your note here..." : ""}
          />
        </div>
      </div>
    ))}
  </GridLayout>
);

export default NoteGrid;
