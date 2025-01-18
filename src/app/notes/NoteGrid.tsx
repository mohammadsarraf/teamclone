import React, { useRef, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import { FaJediOrder, FaParagraph } from "react-icons/fa6";
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

const calculateDistance = ( // TODO: barely works
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
    console.log(`Distance from top of container to center of Jedi icon: ${distanceTop}px`);

    const menuHeight = 100; // Assume the menu height is 100px
    if (distanceTop < (menuHeight / 2) + 300) {
      setMenuPositionClass("top-0");
    } else if (distanceBottom < (menuHeight / 2) + 120) {
      setMenuPositionClass("bottom-0");
    } else {
      setMenuPositionClass(""); // No change in position
    }
  }
};

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
  const [menuPositionClass, setMenuPositionClass] = useState<string>("");
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

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
    <div ref={containerRef}>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={rowHeight} // Use the updated row height
        width={window.innerWidth}
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
            className={`flex items-center group`} // Add group class for hover effect
            style={{
              height: item.h * rowHeight,
              zIndex: menuVisibility[item.i] ? 10 : 1, // Conditionally apply zIndex to the rectangle
            }}
          >
            <MdOutlineReorder className="drag-handle mr-4 cursor-move opacity-0 group-hover:opacity-100" /> {/* Add hover effect */}
            <FaParagraph
              className="mr-4 cursor-pointer opacity-0 group-hover:opacity-100" // Add hover effect
              onClick={() => {
                toggleRectMenu(item.i);
                calculateDistance(menuRefs.current[item.i], containerRef.current, setMenuPositionClass);
              }}
              ref={(el) => (menuRefs.current[item.i] = el)}
            />
            {menuVisibility[item.i] && (
              <div className={`absolute left-14 z-20 ${menuPositionClass}`}> {/* Apply the dynamic position class */}
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
    </div>
  );
};

export default NoteGrid;
