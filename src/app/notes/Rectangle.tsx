import React, { useState } from "react";
import { FaParagraph } from "react-icons/fa6";
import { MdOutlineReorder, MdOutlineTaskAlt } from "react-icons/md";
import { RiH1, RiH2, RiH3 } from "react-icons/ri";
import GridLayout from "react-grid-layout";

interface RectangleProps {
  id: string;
  text: string;
  onTextChange: (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

const OptionsMenu = ({ setFontSize, setIsTask, closeMenu }) => (
  <div className="absolute left-16 flex w-fit flex-col rounded-md bg-gray-900 p-2 text-white shadow-lg">
    <button
      className="flex items-center rounded p-2 hover:bg-gray-600"
      onClick={() => {
        setFontSize("text-xl");
        setIsTask(false);
        closeMenu();
      }}
    >
      <FaParagraph className="mr-2" /> Paragraph
    </button>
    <button
      className="flex items-center rounded p-2 hover:bg-gray-600"
      onClick={() => {
        setFontSize("text-xl");
        setIsTask(true);
        closeMenu();
      }}
    >
      <MdOutlineTaskAlt className="mr-2" /> Task
    </button>
    <button
      className="flex items-center rounded p-2 hover:bg-gray-600"
      onClick={() => {
        setFontSize("text-3xl");
        setIsTask(false);
        closeMenu();
      }}
    >
      <RiH1 className="mr-2 flex" /> Heading 1
    </button>
    <button
      className="flex items-center rounded p-2 hover:bg-gray-600"
      onClick={() => {
        setFontSize("text-2xl");
        setIsTask(false);
        closeMenu();
      }}
    >
      <RiH2 className="mr-2" /> Heading 2
    </button>
    <button
      className="flex items-center rounded p-2 hover:bg-gray-600"
      onClick={() => {
        setFontSize("text-xl");
        setIsTask(false);
        closeMenu();
      }}
    >
      <RiH3 className="mr-2" /> Heading 3
    </button>
  </div>
);

export default function Rectangle({ id, text, onTextChange }: RectangleProps) {
  const [options, setOptions] = useState(false);
  const [fontSize, setFontSize] = useState("text-xl");
  const [isTask, setIsTask] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  const toggleOptions = () => setOptions(!options);

  return (
    <div className="relative flex items-center gap-2 rounded-md bg-gray-800 p-4 shadow-md transition-colors hover:bg-gray-700">
      <MdOutlineReorder className="drag-handle cursor-move text-white" />
      <FaParagraph
        className="cursor-pointer text-white"
        onClick={toggleOptions}
      />
      {options && (
        <OptionsMenu
          setFontSize={setFontSize}
          setIsTask={setIsTask}
          closeMenu={toggleOptions}
        />
      )}
      <div className="flex flex-1 items-center">
        {isTask && (
          <input
            type="checkbox"
            checked={isTaskCompleted}
            onChange={() => setIsTaskCompleted(!isTaskCompleted)}
            className="mr-2"
          />
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => onTextChange(id, e)}
          className={`w-full bg-transparent text-white outline-none ${fontSize} ${isTaskCompleted ? "line-through" : ""}`}
        />
      </div>
    </div>
  );
}

export function ParentComponent() {
  const [texts, setTexts] = useState<{ [key: string]: string }>({
    a: "Rectangle A",
  });

  const [layout, setLayout] = useState([
    { i: "a", x: 0, y: 0, w: 1, h: 1 },
    // Add more items as needed
  ]);

  const handleTextChange = (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTexts({
      ...texts,
      [key]: event.target.value,
    });
  };

  const addRectangle = () => {
    const newKey = `rect${Object.keys(texts).length + 1}`;
    setTexts({
      ...texts,
      [newKey]: `Rectangle ${newKey.toUpperCase()}`,
    });
    setLayout([...layout, { i: newKey, x: 0, y: layout.length, w: 1, h: 1 }]);
  };

  return (
    <div>
      <button onClick={addRectangle}>Add Rectangle</button>
      <GridLayout
        className="layout"
        layout={layout}
        cols={1}
        rowHeight={100}
        width={1200}
        draggableHandle=".drag-handle"
        onLayoutChange={(newLayout) => setLayout(newLayout)}
      >
        {layout.map((item) => (
          <div key={item.i} className="size-full">
            <Rectangle
              id={item.i}
              text={texts[item.i]}
              onTextChange={handleTextChange}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
