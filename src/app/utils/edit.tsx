import { useEffect, useState } from "react";
import { signOutUser, useUser } from "../components/UserContext";
import { useRouter } from "next/navigation";
import Toolbar from "../components/Toolbar";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { PiFrameCornersBold } from "react-icons/pi";
import { IoLibraryOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa6";

export default function HomeContent() {
    const [title, setTitle] = useState("Moe Sarraf");
    const [subtitle, setSubtitle] = useState("Developer and designer.");
    const [description, setDescription] = useState(
      `As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.`,
    );
    const { currentUser } = useUser();
    const router = useRouter();
  
    const [skillsTitle, setSkillsTitle] = useState("Skills");
    const [skillsDescription, setSkillsDescription] = useState(
      `I bring a diverse skill set to the table, encompassing brand design programming,and. My expertise lies not only in creating visually appealing designs and efficient code but also in imparting this knowledge through teaching.`,
    );
    const [frameworksTitle, setFrameworksTitle] = useState("FrameWorks");
    const [frameworksDescription, setFrameworksDescription] = useState(
      "My technical proficiency is anchored in a variety of frameworks that enhance the development process",
    );
    const [librariesTitle, setLibrariesTitle] = useState("Libraries");
    const [librariesDescription, setLibrariesDescription] = useState(
      "I leverage powerful libraries to process data, create machine learning models, and visualize results",
    );
    const [languagesTitle, setLanguagesTitle] = useState("Programming Languages");
    const [languagesDescription, setLanguagesDescription] = useState(
      "Proficient in multiple programming languages, enabling versatility across various projects",
    );
    const [activeField, setActiveField] = useState<string | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  
    const [titleClassName, setTitleClassName] = useState("text-6xl");
    const [subtitleClassName, setSubtitleClassName] = useState("text-4xl");
    const [descriptionClassName, setDescriptionClassName] = useState("text-xl");
    const [skillsTitleClassName, setSkillsTitleClassName] = useState("text-3xl");
    const [skillsDescriptionClassName, setSkillsDescriptionClassName] =
      useState("text-md");
  
    const [titleAlignment, setTitleAlignment] = useState("center");
    const [subtitleAlignment, setSubtitleAlignment] = useState("center");
    const [descriptionAlignment, setDescriptionAlignment] = useState("center");
    const [skillsTitleAlignment, setSkillsTitleAlignment] = useState("left");
    const [skillsDescriptionAlignment, setSkillsDescriptionAlignment] =
      useState("left");
  
    const handleChange =
      (setter: React.Dispatch<React.SetStateAction<string>>) =>
      (evt: ContentEditableEvent) => {
        setter(evt.target.value);
      };
  
    const handleTextClick = (field: string, event: MouseEvent) => {
      setActiveField(field);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      setToolbarPosition({
        top: rect.top + scrollY - 40,
        left: rect.left + rect.width / 2,
      });
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
  
    const handleBoldClick = () => {
      document.execCommand("bold");
    };
  
    const handleItalicClick = () => {
      document.execCommand("italic");
    };
  
    const updateClassName = (prev: string, newSize: string) => {
      const classes = prev.split(" ");
      const sizeClass = classes.find(
        (cls) => cls.startsWith("text-") && cls.includes("xl"),
      );
      if (sizeClass) {
        return prev.replace(sizeClass, newSize);
      }
      return `${prev} ${newSize}`;
    };
  
    const updateColorClassName = (prev: string, newColor: string) => {
      const classes = prev.split(" ");
      const colorClass = classes.find(
        (cls) => cls.startsWith("text-") && !cls.includes("xl"),
      );
      if (colorClass) {
        return prev.replace(colorClass, newColor);
      }
      return `${prev} ${newColor}`;
    };
  
    const handleH1Click = () => {
      if (activeField === "title")
        setTitleClassName((prev) => updateClassName(prev, "text-6xl"));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateClassName(prev, "text-6xl"));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateClassName(prev, "text-6xl"));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateClassName(prev, "text-6xl"));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) =>
          updateClassName(prev, "text-6xl"),
        );
    };
  
    const handleH2Click = () => {
      if (activeField === "title")
        setTitleClassName((prev) => updateClassName(prev, "text-5xl"));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateClassName(prev, "text-5xl"));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateClassName(prev, "text-5xl"));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateClassName(prev, "text-5xl"));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) =>
          updateClassName(prev, "text-5xl"),
        );
    };
  
    const handleH3Click = () => {
      if (activeField === "title")
        setTitleClassName((prev) => updateClassName(prev, "text-4xl"));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateClassName(prev, "text-4xl"));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateClassName(prev, "text-4xl"));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateClassName(prev, "text-4xl"));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) =>
          updateClassName(prev, "text-4xl"),
        );
    };
  
    const handleH4Click = () => {
      if (activeField === "title")
        setTitleClassName((prev) => updateClassName(prev, "text-3xl"));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateClassName(prev, "text-3xl"));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateClassName(prev, "text-3xl"));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateClassName(prev, "text-3xl"));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) =>
          updateClassName(prev, "text-3xl"),
        );
    };
  
    const handleH5Click = () => {
      if (activeField === "title")
        setTitleClassName((prev) => updateClassName(prev, "text-2xl"));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateClassName(prev, "text-2xl"));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateClassName(prev, "text-2xl"));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateClassName(prev, "text-2xl"));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) =>
          updateClassName(prev, "text-2xl"),
        );
    };
  
    const handleH6Click = () => {
      if (activeField === "title")
        setTitleClassName((prev) => updateClassName(prev, "text-xl"));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateClassName(prev, "text-xl"));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateClassName(prev, "text-xl"));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateClassName(prev, "text-xl"));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) => updateClassName(prev, "text-xl"));
    };
  
    const handleJustifyClick = (option: string) => {
      if (activeField === "title") setTitleAlignment(option);
      if (activeField === "subtitle") setSubtitleAlignment(option);
      if (activeField === "description") setDescriptionAlignment(option);
      if (activeField === "skillsTitle") setSkillsTitleAlignment(option);
      if (activeField === "skillsDescription")
        setSkillsDescriptionAlignment(option);
    };
  
    const handleColorChange = (color: string) => {
      if (activeField === "title")
        setTitleClassName((prev) => updateColorClassName(prev, color));
      if (activeField === "subtitle")
        setSubtitleClassName((prev) => updateColorClassName(prev, color));
      if (activeField === "description")
        setDescriptionClassName((prev) => updateColorClassName(prev, color));
      if (activeField === "skillsTitle")
        setSkillsTitleClassName((prev) => updateColorClassName(prev, color));
      if (activeField === "skillsDescription")
        setSkillsDescriptionClassName((prev) =>
          updateColorClassName(prev, color),
        );
    };
  
    const getAlignmentClass = (alignment: string) => {
      switch (alignment) {
        case "left":
          return "text-left";
        case "center":
          return "text-center";
        case "right":
          return "text-right";
        case "justify":
          return "text-justify";
        default:
          return "";
      }
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
                onBoldClick={handleBoldClick}
                onItalicClick={handleItalicClick}
                onH1Click={handleH1Click}
                onH2Click={handleH2Click}
                onH3Click={handleH3Click}
                onH4Click={handleH4Click}
                onH5Click={handleH5Click}
                onH6Click={handleH6Click}
                onJustifyClick={handleJustifyClick}
                onColorChange={handleColorChange} // Pass the new handler
              />
            )}
            <div className="mx-auto max-w-2xl p-10 text-center">
              <ContentEditable
                html={title}
                onChange={handleChange(setTitle)}
                onClick={(e: MouseEvent) => handleTextClick("title", e)}
                tagName="p"
                className={`border-b-2 border-transparent py-2 font-medium text-blue-600 focus:border-blue-600 focus:outline-none ${titleClassName} ${getAlignmentClass(titleAlignment)}`}
                aria-label="Page Title"
                style={{ lineHeight: 1.5 }}
                placeholder="Enter your title..."
              />
              <ContentEditable
                html={subtitle}
                onChange={handleChange(setSubtitle)}
                onClick={(e: MouseEvent) => handleTextClick("subtitle", e)}
                tagName="p"
                className={`border-b-2 border-transparent py-2 focus:border-blue-600 focus:outline-none ${subtitleClassName} ${getAlignmentClass(subtitleAlignment)}`}
                aria-label="Subtitle"
                style={{ lineHeight: 1.5 }}
                placeholder="Enter your subtitle..."
              />
              <ContentEditable
                html={description}
                onChange={handleChange(setDescription)}
                onClick={(e: MouseEvent) => handleTextClick("description", e)}
                tagName="p"
                className={`border-b-2 border-transparent py-5 focus:border-blue-600 focus:outline-none ${descriptionClassName} ${getAlignmentClass(descriptionAlignment)}`}
                aria-label="Description"
                style={{ lineHeight: 1.5 }} // Use dynamic line-height
                placeholder="Enter your description..."
              />
            </div>
          </section>
          <section>
            <div>
              <ContentEditable
                html={skillsTitle}
                onChange={handleChange(setSkillsTitle)}
                onClick={(e: MouseEvent) => handleTextClick("skillsTitle", e)}
                tagName="h3"
                className={`py-1 ${skillsTitleClassName} ${getAlignmentClass(skillsTitleAlignment)}`}
                aria-label="Skills Title"
                placeholder="Enter skills title..."
              />
              <ContentEditable
                html={skillsDescription}
                onChange={handleChange(setSkillsDescription)}
                onClick={(e: MouseEvent) =>
                  handleTextClick("skillsDescription", e)
                }
                tagName="p"
                className={`py-2 ${skillsDescriptionClassName} ${getAlignmentClass(skillsDescriptionAlignment)}`}
                aria-label="Skills Description"
                placeholder="Enter skills description..."
              />
            </div>
            <div className="gap-10 lg:flex">
              <div className="my-10 flex-1 rounded-xl p-10 text-center shadow-lg">
                <PiFrameCornersBold className="mx-auto size-16 text-teal-600" />
                <ContentEditable
                  html={frameworksTitle}
                  onChange={handleChange(setFrameworksTitle)}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworksTitle", e)
                  }
                  tagName="h3"
                  className="pb-2 pt-8 text-lg font-medium"
                  aria-label="Frameworks Title"
                  placeholder="Enter frameworks title..."
                />
                <ContentEditable
                  html={frameworksDescription}
                  onChange={handleChange(setFrameworksDescription)}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworksDescription", e)
                  }
                  tagName="p"
                  className="py-2"
                  aria-label="Frameworks Description"
                  placeholder="Enter frameworks description..."
                />
                <ContentEditable
                  html="React"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworkReact", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Framework React"
                  placeholder="Enter framework..."
                />
                <ContentEditable
                  html="Next.js"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworkNextjs", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Framework Next.js"
                  placeholder="Enter framework..."
                />
                <ContentEditable
                  html="Figma"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworkFigma", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Framework Figma"
                  placeholder="Enter framework..."
                />
                <ContentEditable
                  html="Firebase"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworkFirebase", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Framework Firebase"
                  placeholder="Enter framework..."
                />
                <ContentEditable
                  html="Material-UI, Tailwind, Bootstrap"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("frameworkMaterialUI", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Framework Material-UI, Tailwind, Bootstrap"
                  placeholder="Enter framework..."
                />
              </div>
              <div className="my-10 flex-1 rounded-xl p-10 text-center shadow-lg">
                <IoLibraryOutline className="mx-auto size-16 text-teal-600" />
                <ContentEditable
                  html={librariesTitle}
                  onChange={handleChange(setLibrariesTitle)}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("librariesTitle", e)
                  }
                  tagName="h3"
                  className="pb-2 pt-8 text-lg font-medium"
                  aria-label="Libraries Title"
                  placeholder="Enter libraries title..."
                />
                <ContentEditable
                  html={librariesDescription}
                  onChange={handleChange(setLibrariesDescription)}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("librariesDescription", e)
                  }
                  tagName="p"
                  className="py-2"
                  aria-label="Libraries Description"
                  placeholder="Enter libraries description..."
                />
                <ContentEditable
                  html="Pandas"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) => handleTextClick("libraryPandas", e)}
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Library Pandas"
                  placeholder="Enter library..."
                />
                <ContentEditable
                  html="NumPy"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) => handleTextClick("libraryNumPy", e)}
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Library NumPy"
                  placeholder="Enter library..."
                />
                <ContentEditable
                  html="TensorFlow"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("libraryTensorFlow", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Library TensorFlow"
                  placeholder="Enter library..."
                />
                <ContentEditable
                  html="scikit-learn, matplotlib"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("libraryScikitLearn", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Library scikit-learn, matplotlib"
                  placeholder="Enter library..."
                />
                <ContentEditable
                  html="matplotlib"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("libraryMatplotlib", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Library matplotlib"
                  placeholder="Enter library..."
                />
              </div>
              <div className="my-10 flex-1 rounded-xl p-10 text-center shadow-lg">
                <FaCode className="mx-auto size-16 text-teal-600" />
                <ContentEditable
                  html={languagesTitle}
                  onChange={handleChange(setLanguagesTitle)}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("languagesTitle", e)
                  }
                  tagName="h3"
                  className="pb-2 pt-8 text-lg font-medium"
                  aria-label="Languages Title"
                  placeholder="Enter languages title..."
                />
                <ContentEditable
                  html={languagesDescription}
                  onChange={handleChange(setLanguagesDescription)}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("languagesDescription", e)
                  }
                  tagName="p"
                  className="py-2"
                  aria-label="Languages Description"
                  placeholder="Enter languages description..."
                />
                <ContentEditable
                  html="C/C++"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) => handleTextClick("languageC", e)}
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Language C/C++"
                  placeholder="Enter language..."
                />
                <ContentEditable
                  html="Python"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) =>
                    handleTextClick("languagePython", e)
                  }
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Language Python"
                  placeholder="Enter language..."
                />
                <ContentEditable
                  html="SQL"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) => handleTextClick("languageSQL", e)}
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Language SQL"
                  placeholder="Enter language..."
                />
                <ContentEditable
                  html="Java"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) => handleTextClick("languageJava", e)}
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Language Java"
                  placeholder="Enter language..."
                />
                <ContentEditable
                  html="HTML/CSS/JavaScript"
                  onChange={handleChange((value) => console.log(value))}
                  onClick={(e: MouseEvent) => handleTextClick("languageHTML", e)}
                  tagName="p"
                  className="py-1 text-inherit"
                  aria-label="Language HTML/CSS/JavaScript"
                  placeholder="Enter language..."
                />
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }