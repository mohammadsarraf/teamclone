"use client";
import { useState, useEffect, useRef } from "react";
import EditableComp from "../components/EditableComp";
import Toolbar from "../components/Toolbar";
import { handleJustifyClick } from "../utils/textHandlers";

export default function Home() {
  const [title, setTitle] = useState(
    " As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.",
  );
  const [fontSize, setFontSize] = useState("text-xl");
  const [fontColor, setFontColor] = useState("text-white");
  const [fontAlignment, setFontAlignment] = useState("text-justify");
  const [isclicked, setIsclicked] = useState(false);
  const [width, setWidth] = useState("w-[22rem]");
  const [length, setLength] = useState("h-[10rem]");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editableCompRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node) &&
        editableCompRef.current &&
        !editableCompRef.current.contains(event.target as Node)
      ) {
        setIsclicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // check later

  return (
    <div className="flex-col m-40">
      {isclicked ? (
        <>
          <div ref={toolbarRef} className="mb-40 flex">
            <Toolbar
              onSizeClick={(size) => {
                setFontSize(size);
              }}
              onColorClick={(color) => {
                setFontColor(color);
              }}
              onJustifyClick={(alignment) => {
                setFontAlignment(alignment);
              }}
              onWidthChange={(newWidth) => {
                console.log(newWidth);
                setWidth(newWidth);
              }}
              onLengthChange={(newLength) => {
                console.log(newLength);
                setLength(newLength);
              }}
            />
          </div>
          <div ref={editableCompRef}>
            <EditableComp
              html={title}
              onChange={setTitle}
              onClick={() => setIsclicked(!isclicked)} // Add onClick handler here
              className={`border-b-2 border-transparent py-2 font-medium focus:border-blue-600 focus:outline-none ${width} ${length}`}
              ariaLabel="Page Title"
              placeholder="Enter your title..."
              fontSize={fontSize} // Passed prop
              fontColor={fontColor} // Passed prop
              fontAlignment={fontAlignment} // Passed prop
              widthSize={width}
              lengthSize={length}
            />
          </div>
        </>
      ) : (
        <div ref={editableCompRef}>
          <EditableComp
            html={title}
            onChange={setTitle}
            onClick={() => setIsclicked(!isclicked)}
            className={`border-b-2 border-transparent py-2 font-medium focus:border-blue-600 focus:outline-none ${width} ${length}`}
            ariaLabel="Page Title"
            placeholder="Enter your title..."
            fontSize={fontSize} // Passed prop
            fontColor={fontColor} // Passed prop
            fontAlignment={fontAlignment} // Passed prop
            widthSize={width}
            lengthSize={length}
          />
        </div>
      )}
    </div>
  );
}
