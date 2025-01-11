"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EditableComp from "../components/EditableComp";
import { PiFrameCornersBold } from "react-icons/pi";
import { IoLibraryOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";

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
  isEdit: boolean;
}

export default function Edit({
  primaryColor,
  secondaryColor,
  bgColor,
  isEdit,
}: EditProps) {
  const [titleList, setTitleList] = useState<Title[]>([
    {
      html: "Moe Sarraf",
      fontSize: "text-6xl",
      fontColor: primaryColor,
      fontAlignment: "text-center",
      widthSize: "",
      lengthSize: "",
      className: `py-2`,
    },
    {
      html: "Software Developer",
      fontSize: "text-4xl",
      fontColor: secondaryColor,
      fontAlignment: "text-center",
      widthSize: "",
      lengthSize: "",
      className: `py-2`,
    },
    {
      html: "As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.",
      fontSize: "text-xl",
      fontColor: secondaryColor,
      fontAlignment: "text-center",
      widthSize: "",
      lengthSize: "",
      className: ` py-5 leading-8 max-w-xl mx-auto `,
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
    const newTitleList = [...titleList];
    const [draggedItem] = newTitleList.splice(draggedIndex, 1);
    newTitleList.splice(index, 0, draggedItem);
    setDraggedIndex(null);
    setDragOverIndex(null);
    setTitleList(newTitleList);
  };

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

  return (
    <div className={`size-full ${bgColor}`}>
      <div>
        <title>{"Untitled Page"}</title>
        <meta name="description" content={"No description available."} />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <main
        className={`size-full px-10`}
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
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={() => handleDrop(index)}
                className={`max-w-max ${dragOverIndex === index ? "bg-gray-600 bg-opacity-20" : ""}`}
              >
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
                  edit={isEdit}
                />
              </div>
            ))}
          </section>
          <section>
          <div>
            <h3 className={`text-3xl py-1 `}>Skills</h3>
            <p className={`text-md py-2 leading-8`}>
              {/* Since the beginning of my journey as a freelance designer and
							developer, I've done remote work for */}
              I bring a diverse skill set to the table, encompassing 
              <span className="text-teal-500"> brand design </span>, <span className="text-teal-500"> programming </span>, 
              and <span className="text-teal-500"> education </span>. My expertise lies not only in creating visually appealing designs 
              and efficient code but also in imparting this knowledge through teaching.
            </p>
            {/* <p className={`text-md py-2 leading-8 text-gray-800`}>
              I offer from a wide range of services, including brand design,
              programming and teaching.
            </p> */}
          </div>
          <div className="flex gap-10 overflow-auto">
            <div className={`text-center  shadow-lg p-10 rounded-xl my-10  bg-gray-700 flex-1`}>
              <PiFrameCornersBold className={`w-16 h-16 text-teal-600 mx-auto`} />
              <h3 className="text-lg font-medium pt-8 pb-2  ">
                FrameWorks
              </h3>
              <p className="py-2">
My technical proficiency is anchored in a variety of frameworks that enhance the development process
              </p>
              {/* <h4 className="text-teal-300 py-4">#####</h4> */}
              <p className="text-inherit py-1">React</p>
              <p className="text-inherit py-1">Next.js</p>
              <p className="text-inherit py-1">Figma</p>
              <p className="text-inherit py-1">Firebase</p>
              <p className="text-inherit py-1">Material-UI, Tailwind, BootsTrap</p>
            </div>
            <div className={`text-center  shadow-lg p-10 rounded-xl my-10   bg-gray-700 flex-1`}>
              <IoLibraryOutline className={`w-16 h-16 text-teal-600 mx-auto`} />
              <h3 className="text-lg font-medium pt-8 pb-2 ">
                Libraries
              </h3>
              <p className="py-2">
I leverage powerful libraries to process data, create machine learning models, and visualize results
              </p>
              {/* <h4 className="text-teal-300 py-4">#####</h4> */}
              <p className="text-inherit py-1">Pandas</p>
              <p className="text-inherit py-1">NumPy</p>
              <p className="text-inherit py-1">TensorFlow</p>
              <p className="text-inherit py-1">sci-kitlearn, matplotlib</p>
              <p className="text-inherit py-1">matplotlib</p>
            </div>
            <div className={`text-center  shadow-lg p-10 rounded-xl my-10   bg-gray-700 flex-1`}>
              <FaCode className={`w-16 h-16 text-teal-600 mx-auto`} />
              <h3 className="text-lg font-medium pt-8 pb-2 ">Programming Languages</h3>
              <p className="py-2">
Proficient in multiple programming languages, enabling versatility across various projects
              </p>
              {/* <h4 className="text-teal-300 py-4">##### </h4> */}
              <p className="text-inherit py-1">C/C++</p>
              <p className="text-inherit py-1">Python</p>
              <p className="text-inherit py-1">SQL</p>
              <p className="text-inherit py-1">Java</p>
              <p className="text-inherit py-1">HTML/CSS/JavaScript</p>
            </div>
          </div>
        </section>
        <section className="py-10">
          <div>
            <h3 className={`text-3xl py-1`}>Portofolio</h3>
            <p className={`text-md py-2 leading-8 text-gray-800`}>
              {`As a dedicated Computer Science student at Wilfrid Laurier University and an 
              experienced IT Systems and Automation Specialist at Caseware, I, Moe Sarraf, have 
              developed a unique blend of skills in Data Science, AI, and Full-Stack Development. 
              My portfolio showcases diverse projects, such as an NBA MVP prediction model where 
              I harnessed data analytics and machine learning, and a React-based mini-game that 
              demonstrates my proficiency in creating dynamic, user-focused applications. These 
              projects reflect not just my technical acumen but also my passion for blending creativity 
              with functionality, offering a glimpse into my journey 
              of continuous learning and innovation in the ever-evolving tech landscape.`}

            </p>

          </div>

        </section>
        </section>
      </main>
    </div>
  );
}
