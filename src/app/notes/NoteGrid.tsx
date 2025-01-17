import React, { useRef, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import { FaJediOrder } from "react-icons/fa6";
import ContentEditable from "react-contenteditable";
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
  handleKeyDown,
  newRectKey,
  newRectRef,
  setLayout, // Receive the setLayout function
}: {
  layout: Layout[];
  handleKeyDown: (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  newRectKey: string | null;
  newRectRef: React.RefObject<HTMLDivElement | null>;
  toggleRectMenu: (key: string) => void;
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>; // Define the type for setLayout
}) => {
  const [texts, setTexts] = useState<Texts>({ rect1: "" });
  const [menuVisibility, setMenuVisibility] = useState<{ [key: string]: boolean }>({});
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isAnyMenuVisible) return;

      const target = event.target as Node;
      if (
        !Object.values(menuRefs.current).some(
          (menuRef) => menuRef && menuRef.contains(target),
        )
      ) {
        setMenuVisibility({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisibility]);

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
        prevLayout.map(
          (item) => (item.i === key ? { ...item, h: newHeight } : item), // Update the height based on the measured height
        ),
      );
    }
  };

  const adjustMenuPosition = (rect: HTMLDivElement) => {
    const rectBounds = rect.getBoundingClientRect();
    const menuHeight = 200; // Assume a fixed height for the menu
    const windowHeight = window.innerHeight;

    if (rectBounds.top + menuHeight > windowHeight) {
      return { top: rectBounds.top - menuHeight, left: rectBounds.left };
    } else {
      return { top: rectBounds.bottom, left: rectBounds.left };
    }
  };

  const isAnyMenuVisible = Object.values(menuVisibility).some((visible) => visible);

  const toggleRectMenu = (key: string) => {
    setMenuVisibility((prev) => {
      const newVisibility = { ...prev, [key]: !prev[key] };
      Object.keys(newVisibility).forEach((k) => {
        if (k !== key) newVisibility[k] = false;
      });
      return newVisibility;
    });
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
        <div
          key={item.i}
          className={`flex items-center b bg-slate-400 `}
          style={{
            height: item.h * rowHeight,
            zIndex: menuVisibility[item.i] ? 10 : 1, // Conditionally apply zIndex to the rectangle
          }}
          ref={(el) => (menuRefs.current[item.i] = el)} // Store the ref to adjust menu position
        >
          <MdOutlineReorder className="drag-handle mr-4 cursor-move " />
          <FaJediOrder
            className="mr-4 cursor-pointer"
            onClick={() => toggleRectMenu(item.i)}
          />
          {menuVisibility[item.i] && (
            <div className="absolute top-auto left-14 z-20"> {/* Ensure the menu has a high z-index */}
              <Menu />
            </div>
          )}
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
