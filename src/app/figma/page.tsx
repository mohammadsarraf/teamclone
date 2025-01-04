"use client";
import { useState } from "react";
import EditableComp from "../components/EditableComp";
import Toolbar from "../components/Toolbar";
import { handleJustifyClick } from "../utils/textHandlers";

export default function Home() {
  const [title, setTitle] = useState(" As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.");
  const [fontSize, setFontSize] = useState("text-xl");
  const [fontColor, setFontColor] = useState("text-white");
  const [fontAlignment, setFontAlignment] = useState("text-justify");

  const handleSizeClick = (size: string) => {
    console.log(size);

    setFontSize(size);
  };
  const handleColorClick = (color: string) => {
    console.log(color);

    setFontColor(color);
  };
  const handleJustifyClick = (alignment: string) => {
    console.log(alignment);
    setFontAlignment(alignment);
  }
  return (
    <div className="flex-col">
      <div className="mb-40 flex">
        <Toolbar
          onSizeClick={handleSizeClick}
          onColorClick={handleColorClick}
          onJustifyClick={handleJustifyClick}
        />
      </div>
      <EditableComp
        html={title}
        onChange={setTitle}
        className={`border-b-2 border-transparent py-2 font-medium focus:border-blue-600 focus:outline-none ${fontSize} ${fontAlignment} ${fontColor} w-80`}
        ariaLabel="Page Title"
        placeholder="Enter your title..."
      />
    </div>
  );
}
