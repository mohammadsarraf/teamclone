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

export default function HomeContent() {
  const [title, setTitle] = useState("Moe Sarraf");
  const [subtitle, setSubtitle] = useState("Developer and designer.");
  const [description, setDescription] = useState(
    `As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.`,
  );
  const router = useRouter();

  const [activeField, setActiveField] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const [titleClassName, setTitleClassName] = useState("text-6xl");
  const [subtitleClassName, setSubtitleClassName] = useState("text-4xl");
  const [descriptionClassName, setDescriptionClassName] = useState("text-xl");

  const [titleAlignment, setTitleAlignment] = useState("center");
  const [subtitleAlignment, setSubtitleAlignment] = useState("center");
  const [descriptionAlignment, setDescriptionAlignment] = useState("center");

  const handleTextClick = (event: MouseEvent) => {
    const field = (event.target as HTMLElement).getAttribute("data-field");
    if (field) {
      setActiveField(field);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      setToolbarPosition({
        top: rect.top + scrollY - 40,
        left: rect.left + rect.width / 2,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCloseToolbar = () => {
    setActiveField(null);
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseToolbar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const setClassNames = {
    title: setTitleClassName,
    subtitle: setSubtitleClassName,
    description: setDescriptionClassName,
  };

  const setAlignments = {
    title: setTitleAlignment,
    subtitle: setSubtitleAlignment,
    description: setDescriptionAlignment,
  };

  return (
    <>
      <div>
        <title>{title || "Untitled Page"}</title>
        <meta
          name="description"
          content={description || "No description available."}
        />
        <link rel="icon" href="/favicon.ico" />
      </div>
      <main className="bg-black px-10 lg:px-40">
        <section className="min-h-screen">
          <nav className="mb-12 flex justify-between py-10">
            <h1 className="cursor-pointer text-xl" onClick={handleSignOut}>
              Lilglu4e
            </h1>
          </nav>
          {activeField && (
            <Toolbar
              position={toolbarPosition}
              onClose={handleCloseToolbar}
              onH1Click={() =>
                handleHClick(activeField, setClassNames, "text-6xl")
              }
              onH2Click={() =>
                handleHClick(activeField, setClassNames, "text-5xl")
              }
              onH3Click={() =>
                handleHClick(activeField, setClassNames, "text-4xl")
              }
              onH4Click={() =>
                handleHClick(activeField, setClassNames, "text-3xl")
              }
              onH5Click={() =>
                handleHClick(activeField, setClassNames, "text-2xl")
              }
              onH6Click={() =>
                handleHClick(activeField, setClassNames, "text-xl")
              }
              onJustifyClick={(option: string) =>
                handleJustifyClick(option, activeField, setAlignments)
              }
              onColorChange={(color: string) =>
                handleColorChange(color, activeField, setClassNames)
              }
            />
          )}
          <div className="mx-auto max-w-2xl p-10 text-center">
          <EditableComp
              html={title}
              onChange={setTitle}
              onClick={handleTextClick}
              dataField="title"
              className={`border-b-2 border-transparent py-2 font-medium text-blue-600 focus:border-blue-600 focus:outline-none ${titleClassName} ${getAlignmentClass(titleAlignment)}`}
              ariaLabel="Page Title"
              placeholder="Enter your title..."
            />
            <EditableComp
              html={subtitle}
              onChange={setSubtitle}
              onClick={handleTextClick}
              dataField="subtitle"
              className={`border-b-2 border-transparent py-2 focus:border-blue-600 focus:outline-none ${subtitleClassName} ${getAlignmentClass(subtitleAlignment)}`}
              ariaLabel="Subtitle"
              placeholder="Enter your subtitle..."
            />
            <EditableComp
              html={description}
              onChange={setDescription}
              onClick={handleTextClick}
              dataField="description"
              className={`border-b-2 border-transparent py-5 focus:border-blue-600 focus:outline-none ${descriptionClassName} ${getAlignmentClass(descriptionAlignment)}`}
              ariaLabel="Description"
              placeholder="Enter your description..."
            />
          </div>
        </section>
      </main>
    </>
  );
}
