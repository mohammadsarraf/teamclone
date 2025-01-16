import { RefObject, useEffect, useState, useRef } from "react";
import GridLayout from "react-grid-layout";
import { FaJediOrder } from "react-icons/fa6";
import { MdOutlineReorder } from "react-icons/md";
import Menu from "./menu";
import Task from "./components/Task";
import Heading1 from "./components/Heading1";
import BulletPoint from "./components/BulletPoint";
import Heading2 from "./components/Heading2";
import Heading3 from "./components/Heading3";

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
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [menuClickTrigger, setMenuClickTrigger] = useState(0);

  const adjustAllTextareasHeight = () => {
    Object.keys(texts).forEach((key) => {
      const textarea = document.getElementById(
        `textarea-${key}`,
      ) as HTMLTextAreaElement;
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    });
  };

  const handleOptionSelect = (key: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [key]: option }));
    adjustAllTextareasHeight(); // Adjust all textareas height
    setMenuClickTrigger((prev) => prev + 1); // Trigger useEffect
  };

  const getClassForOption = (option: string | undefined) => {
    switch (option) {
      case "Task":
        return "bg-red-500 text-white";
      case "Paragraph":
        return "text-md";
      case "Heading 1":
        return "text-3xl";
      case "Heading 2":
        return "text-2xl";
      case "Heading 3":
        return "text-xl";
      case "Divider":
        return "bg-gray-500";
      case "Bullet point":
        return "bg-pink-500";
      case "Numbered List":
        return "bg-orange-500";
      case "Blockquote":
        return "bg-teal-500";
      case "Image":
        return "bg-indigo-500";
      case "Attachment":
        return "bg-cyan-500";
      default:
        return "";
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    Object.keys(texts).forEach((key) => {
      const textarea = document.getElementById(
        `textarea-${key}`,
      ) as HTMLTextAreaElement;
      if (textarea) {
        adjustTextareaHeight(textarea);
      }
    });
  }, [texts, selectedOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(menuRefs.current).forEach((key) => {
        if (
          menuRefs.current[key] &&
          !menuRefs.current[key]?.contains(event.target as Node)
        ) {
          toggleRectMenu(key);
        }
      });
    };

    const handleScroll = () => {
      Object.keys(menuRefs.current).forEach((key) => {
        if (rectMenuStates[key]) {
          toggleRectMenu(key);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [rectMenuStates, toggleRectMenu]);

  useEffect(() => {
    if (newRectKey && rectMenuStates[newRectKey]) {
      const firstMenuItem =
        menuRefs.current[newRectKey]?.querySelector("button");
      firstMenuItem?.focus();
      const lastOption = selectedOptions[newRectKey];
      const defaultOption =
        lastOption === "Bullet point" ? "Bullet point" : "Task"; // Set default option based on last option
      handleOptionSelect(newRectKey, defaultOption);
    }
  }, [rectMenuStates, newRectKey]);

  const handleMenuKeyDown = (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const menuItems = menuRefs.current[key]?.querySelectorAll("button");
    if (!menuItems) return;

    const currentIndex = Array.from(menuItems).indexOf(
      document.activeElement as HTMLButtonElement,
    );

    if (event.key === "ArrowDown") {
      const nextIndex = (currentIndex + 1) % menuItems.length;
      (menuItems[nextIndex] as HTMLButtonElement).focus();
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      const prevIndex =
        (currentIndex - 1 + menuItems.length) % menuItems.length;
      (menuItems[prevIndex] as HTMLButtonElement).focus();
      event.preventDefault();
    } else if (event.key === "Enter") {
      (menuItems[currentIndex] as HTMLButtonElement).click();
      toggleRectMenu(key); // Close the menu
    }
  };

  const closeMenu = (key: string) => {
    toggleRectMenu(key);
  };

  const calculateMenuPosition = (
    itemIndex: number,
    itemsPerPage: number = 23,
  ) => {
    const threshold = itemsPerPage - 3; // Last 3 items need "top"
    return itemIndex >= threshold ? "top" : "bottom";
  };

  const isAnyMenuOpen = Object.values(rectMenuStates).some((state) => state);

  const renderTextarea = (item) => {
    const selectedOption = selectedOptions[item.i];
    const commonProps = {
      text: texts[item.i],
      handleTextChange: (e, index) => handleTextChange(item.i, e, index),
      handleKeyDown: (e, index) => handleKeyDown(item.i, e, index),
      textareaRef: item.i === newRectKey ? newRectRef : null,
      adjustTextareaHeight: adjustTextareaHeight, // Pass the function to adjust textarea height
    };

    switch (selectedOption) {
      case "Task":
        return <Task {...commonProps} />;
      case "Heading 1":
        return <Heading1 {...commonProps} />;
      case "Heading 2":
        return <Heading2 {...commonProps} />;
      case "Heading 3":
        return <Heading3 {...commonProps} />;

      default:
        return (
          <textarea
            value={texts[item.i]}
            onChange={(e) => handleTextChange(item.i, e)}
            onKeyDown={(e) => handleKeyDown(item.i, e)}
            className="w-full resize-none bg-transparent outline-none"
            rows={1}
            style={{ height: "auto" }}
            ref={item.i === newRectKey ? newRectRef : null}
          />
        );
    }
  };

  return (
    <>
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={30}
        width={window.innerWidth} // Ensure the width is set to the window's width
        draggableHandle=".drag-handle"
        useCSSTransforms={true}
        isResizable={false}
        isDroppable={!isAnyMenuOpen}
        isDraggable={!isAnyMenuOpen}
      >
        {layout.map((item, index) => {
          const menuPosition = calculateMenuPosition(index, 23);
          const selectedOption = selectedOptions[item.i];
          const optionClass = getClassForOption(selectedOption);
          const isSelected = rectMenuStates[item.i];

          return (
            <div
              key={item.i}
              className={`flex w-full items-center rounded p-4 text-black `}
              style={{ zIndex: isSelected ? 2 : 1 }} // Set higher z-index when selected
            >
              <MdOutlineReorder className="drag-handle mr-4 cursor-move" />
              <FaJediOrder
                className="z-50 mr-4 cursor-pointer"
                onClick={() => toggleRectMenu(item.i)}
              />
              {isSelected && (
                <div
                  ref={(el) => {
                    menuRefs.current[item.i] = el;
                  }}
                  tabIndex={-1}
                  onKeyDown={(e) => handleMenuKeyDown(item.i, e)}
                  className={`absolute z-50 ${
                    menuPosition === "top" ? "bottom-0 mb-2" : "-top-8 mt-2"
                  } left-20 w-fit rounded bg-gray-900 p-2 text-white`}
                >
                  <div>
                    <Menu
                      closeMenu={() => closeMenu(item.i)}
                      onSelect={(option) => handleOptionSelect(item.i, option)}
                      adjustTextareaHeight={adjustAllTextareasHeight} // Pass the function to adjust all textareas
                    />
                  </div>
                </div>
              )}
              <div className={`w-full flex-1 p-4`}>{renderTextarea(item)}</div>
            </div>
          );
        })}
      </GridLayout>
    </>
  );
};

export default NoteGrid;
