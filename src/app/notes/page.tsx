"use client";
import React, { useState, useRef, useEffect, RefObject } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { FaJediOrder } from "react-icons/fa6";
import NoteGrid from "./NoteGrid";

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

const NoteHeader = ({
  addRectangle,
  isClicked,
}: {
  addRectangle: () => void;
  isClicked: boolean;
}) => (
  <header className="flex items-center justify-between bg-gray-800 p-4 text-white">
    <h1 className="text-xl">Note App</h1>
    <button onClick={addRectangle} className="bg-white p-2 text-black">
      Add Rectangle
    </button>
  </header>
);

export default function Note() {
  const defaultTexts = { rect1: "" };
  const defaultLayout = [{ i: "rect1", x: 0, y: 0, w: 12, h: 1 }];

  const [texts, setTexts] = useState<Texts>(defaultTexts);
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  const newRectRef = useRef<HTMLTextAreaElement | null>(null);
  const [newRectKey, setNewRectKey] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [rectMenuStates, setRectMenuStates] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (newRectRef.current) {
      newRectRef.current.focus();
      newRectRef.current.selectionStart = newRectRef.current.value.length;
      newRectRef.current.selectionEnd = newRectRef.current.value.length;
    }
  }, [newRectKey]);

  const handleTextChange = (
    key: string,
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTexts({
      ...texts,
      [key]: event.target.value,
    });
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;

    const newLayout = layout.map((item) => {
      if (item.i === key) {
        return { ...item, h: Math.ceil(event.target.scrollHeight / 30) };
      }
      return item;
    });
    setLayout(newLayout);
  };

  const handleKeyDown = (
    key: string,
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const newKey = `rect${Object.keys(texts).length + 1}`;
      const index = layout.findIndex((item) => item.i === key);

      const newLayout = [
        ...layout.slice(0, index + 1),
        { i: newKey, x: 0, y: layout[index].y + 1, w: 12, h: 1 },
        ...layout.slice(index + 1).map((item) => ({ ...item, y: item.y + 1 })),
      ];

      setTexts({
        ...texts,
        [newKey]: ``,
      });
      setLayout(newLayout);
      setNewRectKey(newKey);
    } else if (event.key === "Backspace" && texts[key] === "") {
      event.preventDefault();
      removeRectangle(key);
    }
  };

  const removeRectangle = (key: string) => {
    const newTexts = { ...texts };
    delete newTexts[key];

    const newLayout = layout
      .filter((item) => item.i !== key)
      .map((item) => {
        if (item.y > layout.find((l) => l.i === key)!.y) {
          return { ...item, y: item.y - 1 };
        }
        return item;
      });

    setTexts(newTexts);
    setLayout(newLayout);

    if (newLayout.length === 0) {
      setTexts(defaultTexts);
      setLayout(defaultLayout);
      setNewRectKey("rect1");
    } else {
      const index = layout.findIndex((item) => item.i === key);
      if (index > 0) {
        setNewRectKey(layout[index - 1].i);
      } else if (newLayout.length > 0) {
        setNewRectKey(newLayout[0].i);
      }
    }
  };

  const addRectangle = () => {
    const newKey = `rect${Object.keys(texts).length + 1}`;
    setTexts({
      ...texts,
      [newKey]: ``,
    });
    setLayout([...layout, { i: newKey, x: 0, y: layout.length, w: 12, h: 1 }]);
    setNewRectKey(newKey);
  };

  const toggleRectMenu = (key: string) => {
    setRectMenuStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-600">
      <NoteHeader addRectangle={addRectangle} isClicked={isClicked} />
      <div className="flex-1 overflow-auto p-4">
        <NoteGrid
          layout={layout}
          texts={texts}
          handleTextChange={handleTextChange}
          handleKeyDown={handleKeyDown}
          newRectKey={newRectKey}
          newRectRef={newRectRef}
          rectMenuStates={rectMenuStates}
          toggleRectMenu={toggleRectMenu}
        />
      </div>
    </div>
  );
}
