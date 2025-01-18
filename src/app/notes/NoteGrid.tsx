import React, { useRef, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import { FaParagraph } from "react-icons/fa6";
import Menu from "./menu";
import Task from "./components/Task";
import Paragraph from "./components/Paragraph";
import Heading1 from "./components/Heading1"; // Import Heading1 component
import Heading2 from "./components/Heading2"; // Import Heading2 component
import Heading3 from "./components/Heading3"; // Import Heading3 component
import BulletPoint from "./components/BulletPoint"; // Import BulletPoint component
import NumberedList from "./components/NumberedList"; // Ensure correct import

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

const logCurrentRectStyle = (key: string, layout: Layout[]) => {
  const currentRect = layout.find(item => item.i === key);
  if (currentRect) {
    console.log(`Current rectangle style: ${currentRect.type}`);
  } else {
    console.log("Rectangle not found");
  }
};

const NoteGrid = ({
  layout,
  handleKeyDown,
  newRectKey,
  newRectRef,
  setLayout,
}: {
  layout: Layout[];
  handleKeyDown: (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => void;
  newRectKey: string | null;
  newRectRef: React.RefObject<HTMLDivElement | null>;
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>;
}) => {
  const [texts, setTexts] = useState<Texts>({ rect1: "" });
  const [menuVisibility, setMenuVisibility] = useState<{ [key: string]: boolean }>({});
  const [menuPositionClass, setMenuPositionClass] = useState<string>("");
  const [gridWidth, setGridWidth] = useState<number>(0);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
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
          (item) => (item.i === key ? { ...item, h: newHeight } : item),
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

  const handleFocus = (key: string) => {
    logCurrentRectStyle(key, layout);
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
        {layout.map((item) => (
          <div
            key={item.i}
            className="flex items-center group"
            style={{
              height: item.h * rowHeight,
              zIndex: menuVisibility[item.i] ? 10 : 1,
            }}
            onClick={() => handleFocus(item.i)} // Log the style on click
          >
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
            {menuVisibility[item.i] && (
              <div className={`absolute left-14 z-20 ${menuPositionClass}`}>
                <Menu
                  closeMenu={() => setMenuVisibility({ ...menuVisibility, [item.i]: false })}
                  onSelect={(option: string) => handleMenuSelect(item.i, option)}
                  adjustTextareaHeight={() => handleTextChangeWithHeight(item.i, texts[item.i])}
                />
              </div>
            )}
            {item.type === "Task" ? (
              <Task
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
                }}
              />
            ) : item.type === "Heading 1" ? (
              <Heading1
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
                }}
              />
            ) : item.type === "Heading 2" ? (
              <Heading2
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
                }}
              />
            ) : item.type === "Heading 3" ? (
              <Heading3
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
                }}
              />
            ) : item.type === "Bullet point" ? (
              <BulletPoint
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
                }}
              />
            ) : item.type === "Numbered List" ? (
              <NumberedList
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
                }}
              />
            ) : (
              <Paragraph
                text={texts[item.i]}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => handleKeyDown(item.i, e)}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  el?.addEventListener('focus', () => handleFocus(item.i)); // Log the style on focus
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
