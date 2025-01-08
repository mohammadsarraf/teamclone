"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface EditProps {
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
}

export default function Edit({
  primaryColor,
  secondaryColor,
  bgColor,
}: EditProps) {
  const [titleList, setTitleList] = useState<Title[]>([
    {
      html: "Moe Sarraf",
      fontSize: "text-6xl",
      fontColor: primaryColor,
      fontAlignment: "text-center",
      widthSize: ``,
      lengthSize: "",
      className: `text-5xl py-2 font-medium md:text-6xl`,
    },
    {
      html: "Software Developer",
      fontSize: "text-4xl",
      fontColor: secondaryColor,
      fontAlignment: "text-center",
      widthSize: "",
      lengthSize: "",
      className: `text-2xl py-2`,
    },
    {
      html: "As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.",
      fontSize: "text-md",
      fontColor: secondaryColor,
      fontAlignment: "text-center",
      widthSize: "",
      lengthSize: "",
      className: `text-xl py-5 leading-8 max-w-xl mx-auto `,
    },
  ]);

  useEffect(() => {
    setTitleList((prevTitleList) =>
      prevTitleList.map((title, index) => ({
        ...title,
        fontColor: index === 0 ? primaryColor : secondaryColor,
      })),
    );
  }, [primaryColor, secondaryColor]);

  console.log(typeof primaryColor, typeof secondaryColor, typeof bgColor);


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

  return (
    <div className="size-full">
      <div>
        <title>{"Untitled Page"}</title>
        <meta name="description" content={"No description available."} />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <main
        className={`size-full ${bgColor} px-10`}
        style={{ backgroundColor: bgColor }}
      >
        <section className="flex size-full flex-col">
          <nav className="mb-5 flex justify-between py-10">
            <h1
              className={`cursor-pointer text-xl ${secondaryColor}`}
              onClick={() => {}}
            >
              Lilglu4e
            </h1>
          </nav>
          <section className="flex grow flex-col items-center justify-center">
            {titleList.map((title, index) => (
              <EditableComp
                key={index}
                html={title.html}
                onChange={(newTitle: string) =>
                  updateTitleProperty(index, "html", newTitle)
                }
                className={title.className}
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
                edit={false}
              />
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
