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
import { HiH1, HiH2, HiH3 } from "react-icons/hi2";
import { FaTasks } from "react-icons/fa";
import { PiListBulletsBold } from "react-icons/pi";
import { LiaLine } from "react-icons/lia";
import { TbQuoteOff } from "react-icons/tb";
import { BsClipboard, BsFillFileEarmarkImageFill } from "react-icons/bs";
import SelectionMenu from "./components/SelectionMenu";
import NumberedList from "./components/NumberedList";
import { GoNumber } from "react-icons/go";
import { FileBlock } from './components/FileBlock';
import { Divider } from './components/Divider';

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
    if (distanceTop < menuHeight / 2 + 300) {
      setMenuPositionClass("top-0");
    } else if (distanceBottom < menuHeight / 2 + 120) {
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
  texts,
  setTexts,
  iconTypes,
  handleMenuSelect,
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
  texts: Texts;
  setTexts: React.Dispatch<React.SetStateAction<Texts>>;
  iconTypes: { [key: string]: string };
  handleMenuSelect: (key: string, option: string, fileData?: { data: string; filename: string }) => void;
}) => {
  const initialTexts = layout.reduce((acc, item) => {
    if (item.type === "Title") {
      acc[item.i] = "Title";
    } else {
      acc[item.i] = "";
    }
    return acc;
  }, {} as Texts);

  const initialCheckedState = layout.reduce(
    (acc, item) => {
      if (item.type === "Task") {
        acc[item.i] = false;
      }
      return acc;
    },
    {} as { [key: string]: boolean },
  );

  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    () => {
      if (typeof window !== "undefined") {
        const savedCheckedState = localStorage.getItem("checkedState");
        return savedCheckedState
          ? JSON.parse(savedCheckedState)
          : initialCheckedState;
      }
      return initialCheckedState;
    },
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("checkedState", JSON.stringify(checkedState));
    }
  }, [checkedState]);

  const handleCheckboxChange = (key: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const [menuVisibility, setMenuVisibility] = useState<{
    [key: string]: boolean;
  }>({});
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuVisibility({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("texts", JSON.stringify(texts));
    }
  }, [texts]);

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
          item.i === key && newHeight > item.h
            ? { ...item, h: newHeight }
            : item,
        ),
      );
    }
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

  const getIcon = (type: string) => {
    switch (type) {
      case "Paragraph":
        return <FaParagraph />;
      case "Task":
        return <FaTasks />;
      case "Bullet point":
        return <PiListBulletsBold />;
      case "Heading 1":
        return <HiH1 />;
      case "Heading 2":
        return <HiH2 />;
      case "Heading 3":
        return <HiH3 />;
      case "Divider":
        return <LiaLine />;
      case "Numbered list":
        return <GoNumber />;
      case "Image":
        return <BsFillFileEarmarkImageFill />;
      case "Attachment":
        return <BsClipboard />;
      default:
        return <FaParagraph />;
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize refs after mounting
  useEffect(() => {
    if (mounted) {
      // Initialize your refs and other client-side only logic here
      Object.keys(texts).forEach((key) => {
        if (contentRefs.current[key]) {
          contentRefs.current[key].setAttribute("data-grid-id", key);
        }
      });
    }
  }, [mounted, texts]);

  const handleBold = () => {
    document.execCommand('bold', false);
  };

  const handleItalic = () => {
    document.execCommand('italic', false);
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  const handleClearFormat = () => {
    document.execCommand('removeFormat', false);
  };

  const getNumberedListIndex = (key: string) => {
    const currentIndex = layout.findIndex(item => item.i === key);
    let count = 1;

    // Find the start of the current numbered list sequence
    let sequenceStart = currentIndex;
    while (sequenceStart > 0 && layout[sequenceStart - 1].type === "Numbered list") {
      sequenceStart--;
    }

    // Count from sequence start to current item
    for (let i = sequenceStart; i < currentIndex; i++) {
      if (layout[i].type === "Numbered list") {
        count++;
      }
    }

    return count;
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="size-5 animate-pulse rounded bg-gray-800" />
            <div className="size-5 animate-pulse rounded bg-gray-800" />
            <div className="h-8 w-full animate-pulse rounded bg-gray-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={rowHeight}
        width={gridWidth}
        draggableHandle=".drag-handle"
        useCSSTransforms={true}
        isResizable={false}
        margin={[0, 16]} // Add vertical spacing between items
        onDrag={(layout, oldItem, newItem, placeholder, e, element) => {
          calculateDistance(
            menuRefs.current[newItem.i],
            containerRef.current,
            setMenuPositionClass,
          );
        }}
      >
        {layout.slice(0).map((item, index) => (
          <div
            key={item.i}
            className="group flex items-center"
            style={{
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
                    calculateDistance(
                      menuRefs.current[item.i],
                      containerRef.current,
                      setMenuPositionClass,
                    );
                  }}
                  ref={(el: HTMLDivElement | null) => {
                    menuRefs.current[item.i] = el;
                  }}
                >
                  {getIcon(iconTypes[item.i] || "Paragraph")}
                </div>
              </>
            )}
            {menuVisibility[item.i] && (
              <div className={`absolute left-14 z-20 ${menuPositionClass}`}>
                <Menu
                  closeMenu={() =>
                    setMenuVisibility({ ...menuVisibility, [item.i]: false })
                  }
                  onSelect={(option: string, fileData?: { data: string; filename: string }) =>
                    handleMenuSelect(item.i, option, fileData)
                  }
                  adjustTextareaHeight={() =>
                    handleTextChangeWithHeight(item.i, texts[item.i])
                  }
                />
              </div>
            )}
            {item.type === "Task" ? (
              <Task
                text={texts[item.i]}
                handleTextChange={(text) =>
                  handleTextChangeWithHeight(item.i, text)
                }
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] =
                    el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
                isChecked={checkedState[item.i]}
                handleCheckboxChange={() => handleCheckboxChange(item.i)}
              />
            ) : item.type === "Heading 1" ? (
              <Heading1
                text={texts[item.i]}
                handleTextChange={(text) =>
                  handleTextChangeWithHeight(item.i, text)
                }
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] =
                    el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Heading 2" ? (
              <Heading2
                text={texts[item.i]}
                handleTextChange={(text) =>
                  handleTextChangeWithHeight(item.i, text)
                }
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] =
                    el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Heading 3" ? (
              <Heading3
                text={texts[item.i]}
                handleTextChange={(text) =>
                  handleTextChangeWithHeight(item.i, text)
                }
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] =
                    el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Bullet point" ? (
              <BulletPoint
                text={texts[item.i]}
                handleTextChange={(text) =>
                  handleTextChangeWithHeight(item.i, text)
                }
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] =
                    el as React.RefObject<HTMLElement>;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Numbered list" ? (
              <NumberedList
                text={texts[item.i]}
                number={getNumberedListIndex(item.i)}
                handleTextChange={(text) => handleTextChangeWithHeight(item.i, text)}
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
              />
            ) : item.type === "Image" || item.type === "Attachment" ? (
              <FileBlock
                type={item.type as 'Image' | 'Attachment'}
                data={(() => {
                  try {
                    const fileData = JSON.parse(texts[item.i] || '{}');
                    return fileData.data || '';
                  } catch {
                    return '';
                  }
                })()}
                filename={(() => {
                  try {
                    const fileData = JSON.parse(texts[item.i] || '{}');
                    return fileData.filename || 'Untitled';
                  } catch {
                    return 'Untitled';
                  }
                })()}
                metadata={(() => {
                  try {
                    const fileData = JSON.parse(texts[item.i] || '{}');
                    return {
                      size: fileData.size,
                      uploadDate: fileData.uploadDate,
                      fileType: fileData.type
                    };
                  } catch {
                    return undefined;
                  }
                })()}
              />
            ) : item.type === "Divider" ? (
              <Divider />
            ) : (
              <Paragraph
                text={texts[item.i]}
                handleTextChange={(text) =>
                  handleTextChangeWithHeight(item.i, text)
                }
                handleKeyDown={(e) => {
                  handleKeyDown(item.i, e);
                  handleArrowNavigation(item.i, e);
                }}
                textareaRef={(el) => {
                  contentRefs.current[item.i] = el;
                  if (el) el.setAttribute("data-grid-id", item.i);
                }}
                index={index}
                placeholder="Start typing, or type '/' to choose a different content type"
              />
            )}
          </div>
        ))}
      </GridLayout>
      <SelectionMenu
        onBold={handleBold}
        onItalic={handleItalic}
        onLink={handleLink}
        onClear={handleClearFormat}
      />
    </div>
  );
};

export default NoteGrid;
