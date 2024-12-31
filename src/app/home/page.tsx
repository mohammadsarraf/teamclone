"use client";
import { useState, useEffect, MouseEvent } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useUser, UserProvider, signOutUser } from "../components/UserContext";
import { useRouter } from "next/navigation";
import { PiFrameCornersBold } from "react-icons/pi";
import { IoLibraryOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa";
import Toolbar from "../components/Toolbar";

const handleH1Click = () => {
  document.execCommand("formatBlock", false, "h1");
};

const handleH2Click = () => {
  document.execCommand("formatBlock", false, "h2");
};

const handleH3Click = () => {
  document.execCommand("formatBlock", false, "h3");
};

const handlePClick = () => {
  document.execCommand("formatBlock", false, "p");
};

function HomeContent() {
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

  const [titleClassName, setTitleClassName] = useState("text-5xl");
  const [subtitleClassName, setSubtitleClassName] = useState("text-2xl");
  const [descriptionClassName, setDescriptionClassName] = useState("text-sm");
  const [skillsTitleClassName, setSkillsTitleClassName] = useState("text-3xl");
  const [skillsDescriptionClassName, setSkillsDescriptionClassName] =
    useState("text-md");

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (evt: ContentEditableEvent) => {
      setter(evt.target.value);
    };

  const handleTextClick = (field: string, event: MouseEvent) => {
    setActiveField(field);
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setToolbarPosition({
      top: rect.top - 40,
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

  const handleH1Click = () => {
    if (activeField === "title") setTitleClassName("text-5xl");
    if (activeField === "subtitle") setSubtitleClassName("text-4xl");
    if (activeField === "description") setDescriptionClassName("text-3xl");
    if (activeField === "skillsTitle") setSkillsTitleClassName("text-5xl");
    if (activeField === "skillsDescription")
      setSkillsDescriptionClassName("text-3xl");
  };

  const handleH2Click = () => {
    if (activeField === "title") setTitleClassName("text-4xl");
    if (activeField === "subtitle") setSubtitleClassName("text-3xl");
    if (activeField === "description") setDescriptionClassName("text-2xl");
    if (activeField === "skillsTitle") setSkillsTitleClassName("text-4xl");
    if (activeField === "skillsDescription")
      setSkillsDescriptionClassName("text-2xl");
  };

  const handleH3Click = () => {
    if (activeField === "title") setTitleClassName("text-3xl");
    if (activeField === "subtitle") setSubtitleClassName("text-2xl");
    if (activeField === "description") setDescriptionClassName("text-xl");
    if (activeField === "skillsTitle") setSkillsTitleClassName("text-3xl");
    if (activeField === "skillsDescription")
      setSkillsDescriptionClassName("text-xl");
  };

  const handlePClick = () => {
    if (activeField === "title") setTitleClassName("text-base");
    if (activeField === "subtitle") setSubtitleClassName("text-base");
    if (activeField === "description") setDescriptionClassName("text-base");
    if (activeField === "skillsTitle") setSkillsTitleClassName("text-base");
    if (activeField === "skillsDescription")
      setSkillsDescriptionClassName("text-base");
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
              onPClick={handlePClick}
            />
          )}
          <div className="mx-auto max-w-2xl p-10 text-center">
            <ContentEditable
              html={title}
              onChange={handleChange(setTitle)}
              onClick={(e: MouseEvent) => handleTextClick("title", e)}
              tagName="h2"
              className={`border-b-2 border-transparent py-2 font-medium text-blue-600 focus:border-blue-600 focus:outline-none ${titleClassName}`}
              aria-label="Page Title"
              placeholder="Enter your title..."
            />
            <ContentEditable
              html={subtitle}
              onChange={handleChange(setSubtitle)}
              onClick={(e: MouseEvent) => handleTextClick("subtitle", e)}
              tagName="h3"
              className={`border-b-2 border-transparent py-2 focus:border-blue-600 focus:outline-none ${subtitleClassName}`}
              aria-label="Subtitle"
              placeholder="Enter your subtitle..."
              style={{ whiteSpace: "pre-wrap" }}
            />
            <ContentEditable
              html={description}
              onChange={handleChange(setDescription)}
              onClick={(e: MouseEvent) => handleTextClick("description", e)}
              tagName="p"
              className={`border-b-2 border-transparent py-5 leading-8 text-white focus:border-blue-600 focus:outline-none ${descriptionClassName}`}
              aria-label="Description"
              placeholder="Enter your description..."
              style={{ whiteSpace: "pre-wrap" }}
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
              className={`py-1 ${skillsTitleClassName}`}
              aria-label="Skills Title"
              placeholder="Enter skills title..."
            />
            <ContentEditable
              html={skillsDescription}
              onChange={handleChange(setSkillsDescription)}
              onClick={(e: MouseEvent) => handleTextClick("skillsDescription", e)}
              tagName="p"
              className={`py-2 leading-8 ${skillsDescriptionClassName}`}
              aria-label="Skills Description"
              placeholder="Enter skills description..."
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
          <div className="gap-10 lg:flex">
            <div className="my-10 flex-1 rounded-xl p-10 text-center shadow-lg">
              <PiFrameCornersBold className="mx-auto size-16 text-teal-600" />
              <ContentEditable
                html={frameworksTitle}
                onChange={handleChange(setFrameworksTitle)}
                onClick={(e: MouseEvent) => handleTextClick("frameworksTitle", e)}
                tagName="h3"
                className="pb-2 pt-8 text-lg font-medium"
                aria-label="Frameworks Title"
                placeholder="Enter frameworks title..."
              />
              <ContentEditable
                html={frameworksDescription}
                onChange={handleChange(setFrameworksDescription)}
                onClick={(e: MouseEvent) => handleTextClick("frameworksDescription", e)}
                tagName="p"
                className="py-2"
                aria-label="Frameworks Description"
                placeholder="Enter frameworks description..."
                style={{ whiteSpace: "pre-wrap" }}
              />
              <ContentEditable
                html="React"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("frameworkReact", e)}
                tagName="p"
                className="py-1 text-inherit"
                aria-label="Framework React"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Next.js"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("frameworkNextjs", e)}
                tagName="p"
                className="py-1 text-inherit"
                aria-label="Framework Next.js"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Figma"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("frameworkFigma", e)}
                tagName="p"
                className="py-1 text-inherit"
                aria-label="Framework Figma"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Firebase"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("frameworkFirebase", e)}
                tagName="p"
                className="py-1 text-inherit"
                aria-label="Framework Firebase"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Material-UI, Tailwind, Bootstrap"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("frameworkMaterialUI", e)}
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
                onClick={(e: MouseEvent) => handleTextClick("librariesTitle", e)}
                tagName="h3"
                className="pb-2 pt-8 text-lg font-medium"
                aria-label="Libraries Title"
                placeholder="Enter libraries title..."
              />
              <ContentEditable
                html={librariesDescription}
                onChange={handleChange(setLibrariesDescription)}
                onClick={(e: MouseEvent) => handleTextClick("librariesDescription", e)}
                tagName="p"
                className="py-2"
                aria-label="Libraries Description"
                placeholder="Enter libraries description..."
                style={{ whiteSpace: "pre-wrap" }}
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
                onClick={(e: MouseEvent) => handleTextClick("libraryTensorFlow", e)}
                tagName="p"
                className="py-1 text-inherit"
                aria-label="Library TensorFlow"
                placeholder="Enter library..."
              />
              <ContentEditable
                html="scikit-learn, matplotlib"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("libraryScikitLearn", e)}
                tagName="p"
                className="py-1 text-inherit"
                aria-label="Library scikit-learn, matplotlib"
                placeholder="Enter library..."
              />
              <ContentEditable
                html="matplotlib"
                onChange={handleChange((value) => console.log(value))}
                onClick={(e: MouseEvent) => handleTextClick("libraryMatplotlib", e)}
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
                onClick={(e: MouseEvent) => handleTextClick("languagesTitle", e)}
                tagName="h3"
                className="pb-2 pt-8 text-lg font-medium"
                aria-label="Languages Title"
                placeholder="Enter languages title..."
              />
              <ContentEditable
                html={languagesDescription}
                onChange={handleChange(setLanguagesDescription)}
                onClick={(e: MouseEvent) => handleTextClick("languagesDescription", e)}
                tagName="p"
                className="py-2"
                aria-label="Languages Description"
                placeholder="Enter languages description..."
                style={{ whiteSpace: "pre-wrap" }}
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
                onClick={(e: MouseEvent) => handleTextClick("languagePython", e)}
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

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  );
}
