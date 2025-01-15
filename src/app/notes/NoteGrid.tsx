import { RefObject, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { FaJediOrder } from "react-icons/fa6";
import { MdOutlineReorder } from "react-icons/md";
import Menu from "./menu";

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
  handleTextChange: (
    key: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleKeyDown: (
    key: string,
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => void;
  newRectKey: string | null;
  newRectRef: RefObject<HTMLTextAreaElement | null>;
  rectMenuStates: { [key: string]: boolean };
  toggleRectMenu: (key: string) => void;
}) => {
  const calculateMenuPosition = (
    itemIndex: number,
    itemsPerPage: number = 23,
  ) => {
    const threshold = itemsPerPage - 3; // Last 3 items need "top"
    return itemIndex >= threshold ? "top" : "bottom";
  };

  return (
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
      {layout.map((item, index) => {
        const menuPosition = calculateMenuPosition(index, 23);

        return (
          <div
            key={item.i}
            className="flex w-full items-center rounded p-4 text-black "
          >
            <MdOutlineReorder className="drag-handle mr-4 cursor-move" />
            <FaJediOrder
              className="z-50 mr-4 cursor-pointer"
              onClick={() => toggleRectMenu(item.i)}
            />
            {rectMenuStates[item.i] && (
              <div
                className={`absolute ${
                  menuPosition === "top" ? "bottom-0 mb-2" : "-top-8 mt-2"
                } left-20 w-fit rounded bg-gray-900 p-2 text-white `}
              >
                <div>
                  <Menu />
                </div>
              </div>
            )}
            <div className="flex-1 p-4">
              <textarea
                value={texts[item.i]}
                onChange={(e) => handleTextChange(item.i, e)}
                onKeyDown={(e) => handleKeyDown(item.i, e)}
                className="w-full resize-none overflow-hidden bg-transparent outline-none"
                rows={1}
                style={{ height: "auto" }}
                ref={item.i === newRectKey ? newRectRef : null}
                placeholder={
                  layout.length === 1 && item.i === "rect1"
                    ? "Enter your note here..."
                    : ""
                }
              />
            </div>
          </div>
        );
      })}
    </GridLayout>
  );
};

export default NoteGrid;
