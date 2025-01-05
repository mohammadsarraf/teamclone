"use client";
import { useState, useEffect } from "react";
import EditableComp from "../components/EditableComp";

export default function Home() {
  const [titleList, setTitleList] = useState([
    {
      html: "Moe Sarraf",
      fontSize: "text-xl",
      fontColor: "text-white",
      fontAlignment: "text-justify",
      widthSize: "22",
      lengthSize: "10",
    },
  ]);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const addTitle = () => {
    setHistory([...history, titleList]);
    setRedoHistory([]);
    setTitleList([
      ...titleList,
      {
        html: "New Title",
        fontSize: "text-2xl",
        fontColor: "text-white",
        fontAlignment: "text-justify",
        widthSize: "22",
        lengthSize: "10",
      },
    ]);
  };

  const updateTitleProperty = (index, property, value) => {
    setHistory([...history, titleList]);
    setRedoHistory([]);
    setTitleList(
      titleList.map((title, i) =>
        i === index ? { ...title, [property]: value } : title
      )
    );
  };

  const saveWork = () => {
    const savedData = JSON.stringify(titleList);
    localStorage.setItem("savedTitles", savedData);
    console.log("Work saved!", savedData);
  };

  const resetWork = () => {
    localStorage.removeItem("savedTitles");
    setTitleList([
      {
        html: "Empty...",
        fontSize: "text-xl",
        fontColor: "text-white",
        fontAlignment: "text-justify",
        widthSize: "22",
        lengthSize: "10",
      },
    ]);
    setHistory([]);
    setRedoHistory([]);
  };

  const undoLastChange = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setRedoHistory([...redoHistory, titleList]);
      setTitleList(previousState);
    }
  };

  const redoLastChange = () => {
    if (redoHistory.length > 0) {
      const nextState = redoHistory[redoHistory.length - 1];
      setRedoHistory(redoHistory.slice(0, -1));
      setHistory([...history, titleList]);
      setTitleList(nextState);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem("savedTitles");
    if (savedData) {
      setTitleList(JSON.parse(savedData));
      console.log("Work loaded!", savedData);
    }
  }, []);

  useEffect(() => {
    saveWork();
  }, [titleList]);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    setHistory([...history, titleList]);
    setRedoHistory([]);
    const newTitleList = [...titleList];
    const [draggedItem] = newTitleList.splice(draggedIndex, 1);
    newTitleList.splice(index, 0, draggedItem);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTitleList(newTitleList);
  };

  return (
    <div className="m-40 flex-col">
      <div>
        <button onClick={addTitle} className="mb-4 mx-1 p-2 bg-blue-500 text-white rounded">
          Add Title
        </button>
        <button onClick={resetWork} className="mb-4 mx-1 p-2 bg-red-500 text-white rounded">
          Reset
        </button>
        <button onClick={undoLastChange} className="mb-4 mx-1 p-2 bg-yellow-500 text-white rounded">
          Undo
        </button>
        <button onClick={redoLastChange} className="mb-4 mx-1 p-2 bg-green-500 text-white rounded">
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
            onChange={(newTitle) => updateTitleProperty(index, "html", newTitle)}
            className={`border-2 border-dashed border-gray-700 p-3 font-medium focus:border-blue-600 focus:outline-none`}
            ariaLabel="Page Title"
            placeholder="Enter your title..."
            fontSize={title.fontSize}
            fontColor={title.fontColor}
            fontAlignment={title.fontAlignment}
            widthSize={title.widthSize}
            lengthSize={title.lengthSize}
            updateProperty={(property, value) => updateTitleProperty(index, property, value)}
          />
        </div>
      ))}
    </div>
  );
}
