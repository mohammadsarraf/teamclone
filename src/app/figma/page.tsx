"use client";
import { useState, useRef, MouseEvent, ChangeEvent } from "react";
import { UserProvider } from "../components/UserContext";
import EditableComp from "../components/EditableComp";

interface Textbox {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  textSize: string; // Add textSize property
  textAlign: string; // Add textAlign property
  textColor: string; // Add textColor property
}

export default function CreatePage() {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [textboxes, setTextboxes] = useState<Textbox[]>([]);
  const [activeTextboxIndex, setActiveTextboxIndex] = useState<number | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current) {
      setIsDrawing(true);
      const newTextbox: Textbox = {
        x: e.clientX - containerRef.current!.offsetLeft,
        y: e.clientY - containerRef.current!.offsetTop,
        width: 0,
        height: 0,
        text: "", // No placeholder text
        textSize: "text-xl", // Default text size
        textAlign: "left", // Default text alignment
        textColor: "#ffffff", // Default text color (visible)
      };
      setTextboxes([...textboxes, newTextbox]);
      setToolbarPosition({
        top: e.clientY - containerRef.current!.offsetTop - 40,
        left: e.clientX - containerRef.current!.offsetLeft,
      });
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDrawing) {
      const updatedTextboxes = [...textboxes];
      const currentTextbox = updatedTextboxes[updatedTextboxes.length - 1];
      currentTextbox.width =
        e.clientX - containerRef.current!.offsetLeft - currentTextbox.x;
      currentTextbox.height =
        e.clientY - containerRef.current!.offsetTop - currentTextbox.y;
      setTextboxes(updatedTextboxes);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (containerRef.current) {
      const lastTextboxIndex = textboxes.length - 1;
      const lastTextbox = containerRef.current.querySelector(`[data-field="textbox-${lastTextboxIndex}"]`);
      if (lastTextbox) {
        (lastTextbox as HTMLElement).focus();
      }
    }
  };

  const handleTextChange = (index: number, text: string) => {
    const updatedTextboxes = [...textboxes];
    if (updatedTextboxes[index].text === "Enter text...") {
      updatedTextboxes[index].text = ""; // Remove placeholder text
      updatedTextboxes[index].textColor = "#ffffff"; // Change text color to white
    }
    updatedTextboxes[index].text = text;
    setTextboxes(updatedTextboxes);
  };

  const handleTextClick = (index: number, event: MouseEvent<HTMLDivElement>) => {
    setActiveTextboxIndex(index);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    setToolbarPosition({
      top: rect.top + scrollY - 40,
      left: rect.left + rect.width / 2,
    });
  };

  const handleCloseToolbar = () => {
    setActiveTextboxIndex(null);
  };

  const handleColorChange = (newColor: string) => {
    if (activeTextboxIndex !== null) {
      const updatedTextboxes = [...textboxes];
      updatedTextboxes[activeTextboxIndex].textColor = newColor;
      setTextboxes(updatedTextboxes);
    }
  };

  const handleJustifyClick = (option: "left" | "center" | "right" | "justify") => {
    if (activeTextboxIndex !== null) {
      const updatedTextboxes = [...textboxes];
      updatedTextboxes[activeTextboxIndex].textAlign = option;
      setTextboxes(updatedTextboxes);
    }
  };

  const handleTextSizeChange = (newSize: string) => {
    if (activeTextboxIndex !== null) {
      const updatedTextboxes = [...textboxes];
      updatedTextboxes[activeTextboxIndex].textSize = newSize;
      setTextboxes(updatedTextboxes);
    }
  };

  const handleHeadingClick = (heading: string) => {
    document.execCommand("formatBlock", false, heading);
  };
  const [descriptionClassName, setDescriptionClassName] = useState("text-xl");

  return (
    <UserProvider>
      <div className="p-10">
        <h1 className="mb-5 text-3xl">Create Components</h1>
        <button
          onClick={() => setIsDrawing(!isDrawing)}
          className="mb-5 bg-blue-500 p-2"
        >
          {isDrawing ? "Stop Drawing" : "Create Textbox"}
        </button>
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`relative h-screen w-full border ${isDrawing ? "cursor-crosshair" : "cursor-default"}`}
        >
          {textboxes.map((textbox, index) => (
            <div
              key={index}
              className="absolute border border-dashed border-red-500 bg-transparent"
              style={{
                left: textbox.x,
                top: textbox.y,
                width: textbox.width,
                height: textbox.height,
              }}
            >
              <EditableComp
                html={textbox.text}
                onChange={(text) => handleTextChange(index, text)}
                onClick={(event) => handleTextClick(index, event)}
                dataField={`textbox-${index}`}
                className={`size-full border-b-2 border-transparent py-2 focus:border-blue-600 focus:outline-none ${textbox.textSize} ${textbox.textAlign}`} // Ensure textSize is included
                ariaLabel={`Textbox ${index}`}
                style={{ color: textbox.textColor }}
                showToolbar={activeTextboxIndex === index} // Show toolbar when focused
                toolbarPosition={toolbarPosition}
                onCloseToolbar={handleCloseToolbar}
                onBoldClick={() => document.execCommand("bold")}
                onItalicClick={() => document.execCommand("italic")}
                onH1Click={() => document.execCommand("formatBlock", false, "h1")}
                onH2Click={() => document.execCommand("formatBlock", false, "h2")}
                onH3Click={() => document.execCommand("formatBlock", false, "h3")}
                onH4Click={() => document.execCommand("formatBlock", false, "h4")}
                onH5Click={() => document.execCommand("formatBlock", false, "h5")}
                onH6Click={() => document.execCommand("formatBlock", false, "h6")}
                onJustifyClick={(option) => document.execCommand(`justify${option.charAt(0).toUpperCase() + option.slice(1)}`)}
                onColorChange={(color) => document.execCommand("foreColor", false, color)}
                onTextSizeChange={(size) => handleTextSizeChange(size)}
              />
            </div>
          ))}
        </div>
      </div>
    </UserProvider>
  );
}
