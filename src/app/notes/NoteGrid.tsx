// @ts-nocheck

import React, { useRef, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import { FaParagraph } from "react-icons/fa6";
import Menu from "./menu";
import Task from "./components/Task";
import Paragraph from "./components/Paragraph";
import BulletPoint from "./components/BulletPoint"; // Import BulletPoint component
import Heading1 from "./components/Heading1";
import Heading2 from "./components/Heading2";
import Heading3 from "./components/Heading3";
import Title from "./components/Title"; // Import Title component

interface Texts {
  [key: string]: string;
}

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type?: string;
  showIcons: boolean; // Add showIcons property to Layout interface
}

const calculateDistance = (
  iconRef: HTMLDivElement | null,
  containerRef: HTMLDivElement | null,
  setMenuPositionClass: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (iconRef && containerRef) {
    const iconRect = iconRef.getBoundingClientRect();
    const containerRect = containerRef.getBoundingClientRect();
    const iconCenterY = iconRect.top + iconRect.height / 2;
    const distanceTop = iconCenterY - containerRect.top;
    const distanceBottom = containerRect.bottom - iconCenterY;
    const menuHeight = 100;
    if (distanceTop < (menuHeight / 2) + 300) {
      setMenuPositionClass("top-0");
    } else if (distanceBottom < (menuHeight / 2) + 120) {
      setMenuPositionClass("bottom-0");
    } else {
      setMenuPositionClass("");
    }
  }
};

const NoteGrid = ({
  layout,
  handleKeyDown,
  handleArrowNavigation,
  newRectKey,
  newRectRef,
  setLayout,
}: {
  layout: Layout[];
  handleKeyDown: (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  handleArrowNavigation: (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  newRectKey: string | null;
  newRectRef: React.RefObject<HTMLDivElement | null>;
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>;
}) => {
  const initialTexts = layout.reduce((acc, item) => {
    acc[item.i] = "";
    return acc;
  }, {} as Texts);

  const [texts, setTexts] = useState<Texts>(initialTexts);
  const [menuVisibility, setMenuVisibility] = useState<{ [key: string]: boolean }>({});
  const [menuPositionClass, setMenuPositionClass] = useState<string>("");
  const [gridWidth, setGridWidth] = useState<number>(0);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contentRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const rowHeight = 20;

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
    setGridWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setMenuVisibility({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

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
          item.i === key && newHeight > item.h ? { ...item, h: newHeight } : item
        ),
      );
    }
  };

  const handleMenuSelect = (key: string, option: string) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [key]: prevTexts[key],
    }));
    setLayout((prevLayout) =>
      prevLayout.map((item) =>
        item.i === key ? { ...item, type: option } : item
      )
    );
  };

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
    <div ref={containerRef}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={rowHeight}
        width={gridWidth}
        draggableHandle=".drag-handle"
        useCSSTransforms={true}
        isResizable={false}
        onDrag={(layout, oldItem, newItem, placeholder, e, element) => {
          calculateDistance(menuRefs.current[newItem.i], containerRef.current, setMenuPositionClass);
        }}
      >

{layout.slice(0).map((item) => (
  <div
    key={item.i}
    className="flex items-center group"
    style={{
      height: item.h * rowHeight,
      zIndex: menuVisibility[item.i] ? 10 : 1,
    }}
  >
            {item.showIcons && (
              <>
                <MdOutlineReorder className="drag-handle mr-4 cursor-move opacity-0 group-hover:opacity-100" />
                <div
                  className="mr-4 cursor-pointer opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    toggleRectMenu(item.i);
                    calculateDistance(menuRefs.current[item.i], containerRef.current, setMenuPositionClass);
                  }}
                  ref={(el: HTMLDivElement | null) => {
                    menuRefs.current[item.i] = el;
                  }}
                >
                  <FaParagraph />
                </div>
              </>
            )}
            {menuVisibility[item.i] && (
              <div className={`absolute left-14 z-20 ${menuPositionClass}`}>
                <Menu
                  closeMenu={() => setMenuVisibility({ ...menuVisibility, [item.i]: false })}
                  onSelect={(option: string) => handleMenuSelect(item.i, option)}
                  adjustTextareaHeight={() => handleTextChangeWithHeight(item.i, texts[item.i])}
                />
              </div>
            )}
            { item.type === "Task" ? (
              <Task
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Heading 1" ? (
              <Heading1
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Heading 2" ? (
              <Heading2
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Heading 3" ? (
              <Heading3
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Bullet point" ? (
              <BulletPoint
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : (
              <Paragraph
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            )}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default NoteGrid;
