"use client";
import { useEffect, useState } from "react";
import { signOutUser } from "../components/UserContext";
import { useRouter } from "next/navigation";
import Toolbar from "../components/Toolbar";
import { PiFrameCornersBold } from "react-icons/pi";
import { IoLibraryOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";
import {
  handleHClick,
  handleJustifyClick,
  handleColorChange,
  getAlignmentClass,
} from "./textHandlers";
import EditableComp from "../components/EditableComp";

interface Title {
  html: string;
  fontSize: string;
  fontColor: string;
  fontAlignment: string;
  widthSize: string;
  lengthSize: string;
  className: string;
}

export default function Edit() {
  const [titleList, setTitleList] = useState<Title[]>([
    {
      html: "Moe Sarraf",
      fontSize: "text-6xl",
      fontColor: "text-blue-600",
      fontAlignment: "text-justify",
      widthSize: "22",
      lengthSize: "7",
      className:
        "items-center border-2 border-dashed border-gray-700 p-3 font-medium focus:border-blue-600 focus:outline-none",
    },
    {
      html: "Software Developer",
      fontSize: "text-4xl",
      fontColor: "text-white",
      fontAlignment: "text-justify",
      widthSize: "22",
      lengthSize: "7",
      className:
        "items-center border-2 border-dashed border-gray-700 p-3 font-medium focus:border-blue-600 focus:outline-none",
    },
    {
      html: "As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.",
      fontSize: "text-xl",
      fontColor: "text-white",
      fontAlignment: "text-justify",
      widthSize: "22",
      lengthSize: "7",
      className:
        "items-center border-2 border-dashed border-gray-700 p-3 font-medium focus:border-blue-600 focus:outline-none",
    },
  ]);

  const router = useRouter();

  const [activeField, setActiveField] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const updateTitleProperty = (
    index: number,
    property: keyof Title,
    value: string,
  ) => {
    setTitleList(
      titleList.map((title, i) =>
        i === index ? { ...title, [property]: value } : title,
      ),
    );
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
    <div className="size-full">
      <div>
        <title>{"Untitled Page"}</title>
        <meta name="description" content={"No description available."} />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <main className="size-full bg-black px-10 lg:px-40">
        <section className="size-full">
          <nav className="mb-12 flex justify-between py-10">
            <h1 className="cursor-pointer text-xl" onClick={() => {}}>
              Lilglu4e
            </h1>
          </nav>
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
        </section>
      </main>
    </div>
  );
}
