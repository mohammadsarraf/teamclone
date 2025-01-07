"use client";
import { useState } from "react";
import EditableComp from "../components/EditableComp";
import Bananamode from "./bananamode";
import { UserProvider } from "../components/UserContext";

interface Title {
  html: string;
  fontSize: string;
  fontColor: string;
  fontAlignment: string;
  widthSize: string;
  lengthSize: string;
}

export default function Home() {
  const [titleList, setTitleList] = useState<Title[]>([
    {
      html: "Moe Sarraf",
      fontSize: "text-xl",
      fontColor: "text-white",
      fontAlignment: "text-justify",
      widthSize: "22",
      lengthSize: "7",
    },
  ]);
  const [history, setHistory] = useState<Title[][]>([]);
  const [redoHistory, setRedoHistory] = useState<Title[][]>([]);

  const addTitle = () => {
    setHistory([...history, [...titleList]]);
    setRedoHistory([]);
    setTitleList([
      ...titleList,
      {
        html: "New Title",
        fontSize: "text-2xl",
        fontColor: "text-white",
        fontAlignment: "text-justify",
        widthSize: "22",
        lengthSize: "7",
      },
    ]);
  };

  const updateTitleProperty = (
    index: number,
    property: keyof Title,
    value: string,
  ) => {
    setHistory([...history, [...titleList]]);
    setRedoHistory([]);
    setTitleList(
      titleList.map((title, i) =>
        i === index ? { ...title, [property]: value } : title,
      ),
    );
  };

  const resetWork = () => {
    setHistory([...history, [...titleList]]);
    setTitleList([
      {
        html: "Empty...",
        fontSize: "text-xl",
        fontColor: "text-white",
        fontAlignment: "text-justify",
        widthSize: "22",
        lengthSize: "5",
      },
    ]);
    setRedoHistory([]);
  };

  const undoLastChange = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setRedoHistory([...redoHistory, [...titleList]]);
      setTitleList(previousState);
    }
  };

  const redoLastChange = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];
      setRedoHistory(redoHistory.slice(0, -1));
      setHistory([...history, [...titleList]]);
      setTitleList(nextState);
    }
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    setHistory([...history, [...titleList]]);
    setRedoHistory([]);
    const newTitleList = [...titleList];
    const [draggedItem] = newTitleList.splice(draggedIndex, 1);
    newTitleList.splice(index, 0, draggedItem);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTitleList(newTitleList);
  };

  return (
    <UserProvider>
      <div className="m-40 flex-col">
        <Bananamode loadDesign={setTitleList} saveDesign={titleList} />
        <div>
          <button
            onClick={addTitle}
            className="mx-1 mb-4 rounded bg-blue-500 p-2 text-white"
          >
            Add Title
          </button>
          <button
            onClick={resetWork}
            className="mx-1 mb-4 rounded bg-red-500 p-2 text-white"
          >
            Reset
          </button>
          <button
            onClick={undoLastChange}
            className="mx-1 mb-4 rounded bg-yellow-500 p-2 text-white"
          >
            Undo
          </button>
          <button
            onClick={redoLastChange}
            className="mx-1 mb-4 rounded bg-green-500 p-2 text-white"
          >
            Redo
          </button>
        </div>
        {titleList.map((title, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDrop={() => handleDrop(index)}
            className={`max-w-max ${dragOverIndex === index ? "bg-gray-600 bg-opacity-20" : ""}`}
          >
            <EditableComp
              html={title.html}
              onChange={(newTitle: string) =>
                updateTitleProperty(index, "html", newTitle)
              }
              className={`items-center border-2 border-dashed border-gray-700 p-3 font-medium focus:border-blue-600 focus:outline-none`}
              ariaLabel="Page Title"
              placeholder="Enter your title..."
              fontSize={title.fontSize}
              fontColor={title.fontColor}
              fontAlignment={title.fontAlignment}
              widthSize={title.widthSize}
              lengthSize={title.lengthSize}
              // @ts-ignore
              updateProperty={(property: keyof Title, value: string) =>
                updateTitleProperty(index, property, value)
              }
              initialWidth={title.widthSize}
              initialLength={title.lengthSize}
            />
          </div>
        ))}
      </div>
    </UserProvider>
  );
}
