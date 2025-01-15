"use client";
import React, { useState, useRef, useEffect, RefObject } from "react";
import GridLayout from "react-grid-layout";
import { MdOutlineReorder } from "react-icons/md";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

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

const NoteHeader = ({ addRectangle }: { addRectangle: () => void }) => (
  <header className="flex items-center justify-between p-4 bg-blue-800 text-white">
    <h1 className="text-xl">Note App</h1>
    <button onClick={addRectangle} className="bg-white p-2 text-black">
      Add Rectangle
    </button>
  </header>
);

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

export default function Note() {
  const defaultTexts = { rect1: "" };
  const defaultLayout = [{ i: "rect1", x: 0, y: 0, w: 12, h: 1 }];

  const [texts, setTexts] = useState<Texts>(defaultTexts);
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  const newRectRef = useRef<HTMLTextAreaElement | null>(null);
  const [newRectKey, setNewRectKey] = useState<string | null>(null);

  useEffect(() => {
    if (newRectRef.current) {
      newRectRef.current.focus();
      newRectRef.current.selectionStart = newRectRef.current.value.length;
      newRectRef.current.selectionEnd = newRectRef.current.value.length;
    }
  }, [newRectKey]);

  const handleTextChange = (key: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTexts({
      ...texts,
      [key]: event.target.value,
    });
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;

    const newLayout = layout.map((item) => {
      if (item.i === key) {
        return { ...item, h: Math.ceil(event.target.scrollHeight / 30) };
      }
      return item;
    });
    setLayout(newLayout);
  };

  const handleKeyDown = (key: string, event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const newKey = `rect${Object.keys(texts).length + 1}`;
      const index = layout.findIndex(item => item.i === key);

      const newLayout = [
        ...layout.slice(0, index + 1),
        { i: newKey, x: 0, y: layout[index].y + 1, w: 12, h: 1 },
        ...layout.slice(index + 1).map(item => ({ ...item, y: item.y + 1 }))
      ];

      setTexts({
        ...texts,
        [newKey]: ``,
      });
      setLayout(newLayout);
      setNewRectKey(newKey);
    } else if (event.key === 'Backspace' && texts[key] === "") {
      event.preventDefault();
      removeRectangle(key);
    }
  };

  const removeRectangle = (key: string) => {
    const newTexts = { ...texts };
    delete newTexts[key];

    const newLayout = layout
      .filter(item => item.i !== key)
      .map(item => {
        if (item.y > layout.find(l => l.i === key)!.y) {
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
      const index = layout.findIndex(item => item.i === key);
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

  return (
    <div className="flex h-screen w-screen flex-col bg-blue-600">
      <NoteHeader addRectangle={addRectangle} />
      <div className="flex-1 overflow-auto p-4">
        <NoteGrid
          layout={layout}
          texts={texts}
          handleTextChange={handleTextChange}
          handleKeyDown={handleKeyDown}
          newRectKey={newRectKey}
          newRectRef={newRectRef}
        />
      </div>
    </div>
  );
}
