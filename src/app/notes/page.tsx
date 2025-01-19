"use client";
import React, { useState, useRef, useEffect, RefObject } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import NoteGrid from "./NoteGrid";
import NoteHeader from "./NoteHeader";
import "@fontsource/playfair-display"; // Defaults to weight 400
import "@fontsource/playfair-display/700.css"; // For weight 700
import Title from "./components/Title";

interface Texts {
  [key: string]: string;
}

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type?: string; // Add type property to Layout interface
  showIcons: boolean; // Add showIcons property to Layout interface
}

export default function Note() {
  const defaultLayout = [
    { i: "rect1", x: 0, y: 1, w: 12, h: 1, type: "Paragraph", showIcons: true },
  ]; // Ensure Title is at the top

  const [layout, setLayout] = useState<Layout[]>(() => {
    const savedLayout = localStorage.getItem("layout");
    return savedLayout ? JSON.parse(savedLayout) : defaultLayout;
  });

  const [title, setTitle] = useState<string>(() => {
    const savedTitle = localStorage.getItem("title");
    return savedTitle ? savedTitle : "";
  });

  const [texts, setTexts] = useState<Texts>(() => {
    const savedTexts = localStorage.getItem("texts");
    return savedTexts ? JSON.parse(savedTexts) : {};
  });

  const [iconTypes, setIconTypes] = useState<{ [key: string]: string }>(() => {
    const savedIconTypes = localStorage.getItem("iconTypes");
    return savedIconTypes ? JSON.parse(savedIconTypes) : {};
  });

  useEffect(() => {
    localStorage.setItem("iconTypes", JSON.stringify(iconTypes));
  }, [iconTypes]);

  useEffect(() => {
    localStorage.setItem("title", title);
  }, [title]);

  const newRectRef = useRef<HTMLDivElement | null>(null);
  const [newRectKey, setNewRectKey] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (newRectRef.current) {
      newRectRef.current.focus();
    }
  }, [newRectKey]);

  useEffect(() => {
    localStorage.setItem("layout", JSON.stringify(layout));
  }, [layout]);

  const handleKeyDown = (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const newKey = `rect${layout.length + 1}`;
      const index = layout.findIndex((item) => item.i === key);
      const currentType = layout[index].type;

      const newLayout = [
        ...layout.slice(0, index + 1),
        {
          i: newKey,
          x: 0,
          y: layout[index].y + 1,
          w: 12,
          h: 1,
          type:
            currentType === "Bullet point" || currentType === "Task"
              ? currentType
              : "Paragraph",
          showIcons: true,
        },
        ...layout.slice(index + 1).map((item) => ({ ...item, y: item.y + 1 })),
      ];

      setLayout(newLayout);
      setIconTypes((prevIconTypes) => ({
        ...prevIconTypes,
        [newKey]: currentType === "Bullet point" || currentType === "Task"
          ? currentType
          : "Paragraph",
      }));
      setNewRectKey(newKey);
      setTimeout(() => {
        if (newRectRef.current) {
          newRectRef.current.focus();
        }
      }, 0);
    } else if (
      event.key === "Backspace" &&
      event.currentTarget.textContent === ""
    ) {
      event.preventDefault();
      removeRectangle(key);
    }
  };

  const handleArrowNavigation = (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const index = layout.findIndex((item) => item.i === key);
    if (event.key === "ArrowUp" && index > 0) {
      event.preventDefault();
      const prevKey = layout[index - 1].i;
      setNewRectKey(prevKey);
      setTimeout(() => {
        const prevElement = document.querySelector(
          `[data-grid-id="${prevKey}"]`,
        );
        if (prevElement) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(prevElement);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    } else if (event.key === "ArrowDown" && index < layout.length - 1) {
      event.preventDefault();
      const nextKey = layout[index + 1].i;
      setNewRectKey(nextKey);
      setTimeout(() => {
        const nextElement = document.querySelector(
          `[data-grid-id="${nextKey}"]`,
        );
        if (nextElement) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(nextElement);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  };

  const removeRectangle = (key: string) => {
    const newLayout = layout
      .filter((item) => item.i !== key)
      .map((item) => {
        if (item.y > layout.find((l) => l.i === key)!.y) {
          return { ...item, y: item.y - 1 };
        }
        return item;
      });

    setLayout(newLayout);

    if (newLayout.length === 0) {
      setLayout(defaultLayout);
      setNewRectKey("rect1");
    } else {
      const index = layout.findIndex((item) => item.i === key);
      if (index > 0) {
        const prevKey = layout[index - 1].i;
        setNewRectKey(prevKey);
        setTimeout(() => {
          const prevElement = document.querySelector(
            `[data-grid-id="${prevKey}"]`,
          );
          if (prevElement) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(prevElement);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      } else if (newLayout.length > 0) {
        setNewRectKey(newLayout[0].i);
      }
    }
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (layout.length > 0) {
        const firstKey = layout[0].i;
        setNewRectKey(firstKey);
        setTimeout(() => {
          const firstElement = document.querySelector(
            `[data-grid-id="${firstKey}"]`,
          );
          if (firstElement) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(firstElement);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      }
    }
  };

  const restartCache = () => {
    localStorage.removeItem("layout");
    localStorage.removeItem("title");
    localStorage.removeItem("texts");
    localStorage.removeItem("checkedState");
    setLayout(defaultLayout);
    setTitle("");
    setTexts({}); // Reset the texts state
  };

  const handleMenuSelect = (key: string, option: string) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [key]: prevTexts[key],
    }));
    setLayout((prevLayout) =>
      prevLayout.map((item) =>
        item.i === key ? { ...item, type: option } : item,
      ),
    );
    setIconTypes((prevIconTypes) => ({
      ...prevIconTypes,
      [key]: option,
    }));
  };

  return (
    <div
      className="flex h-screen w-screen flex-col overflow-x-hidden bg-black font-serif sm:h-screen sm:w-screen"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <NoteHeader />
      <button
        onClick={restartCache}
        className="m-4 rounded bg-red-500 p-2 text-white"
      >
        Restart Cache
      </button>
      <div className="mx-72 w-3/5 flex-1 pl-4 pt-4">
        <div className="mb-10">
          <Title
            text={title}
            placeholder="Add a title"
            setTitle={setTitle}
            handleKeyDown={handleTitleKeyDown}
          />
        </div>
        <NoteGrid
          layout={layout}
          handleKeyDown={handleKeyDown}
          handleArrowNavigation={handleArrowNavigation} // Pass the handleArrowNavigation function
          newRectKey={newRectKey}
          newRectRef={newRectRef}
          setLayout={setLayout} // Pass the setLayout function
          texts={texts} // Pass the texts state
          setTexts={setTexts} // Pass the setTexts function
          iconTypes={iconTypes} // Pass the iconTypes state
          handleMenuSelect={handleMenuSelect} // Pass the handleMenuSelect function
        />
      </div>
    </div>
  );
}
