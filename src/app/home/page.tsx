"use client";
import { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useUser, UserProvider, signOutUser } from "../components/UserContext";
import { useRouter } from "next/navigation";
import { PiFrameCornersBold } from "react-icons/pi";
import { IoLibraryOutline } from "react-icons/io5";
import { FaCode } from "react-icons/fa";

function HomeContent() {
  const [title, setTitle] = useState("Moe Sarraf");
  const [subtitle, setSubtitle] = useState("Developer and designer.");
  const [description, setDescription] = useState(
    `As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.`,
  );
  const { currentUser } = useUser();
  const router = useRouter(); // Initialize the router

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (evt: ContentEditableEvent) => {
      setter(evt.target.value);
    };

  const handleSignOut = async () => {
    try {
      await signOutUser(); // Call the signOut function
      router.push("/"); // Redirect to the home page after signing out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
      <main className="bg-black px-10 md:px-20 lg:px-40">
        <section className="min-h-screen">
          <nav className="mb-12 flex justify-between py-10">
            <h1 className="text-xl cursor-pointer" onClick={handleSignOut}>
              Lilglu4e
            </h1>
          </nav>
          <div className="mx-auto max-w-2xl p-10 text-center">
            <ContentEditable
              html={title}
              onChange={handleChange(setTitle)}
              tagName="h2"
              className="border-b-2 border-transparent py-2 text-5xl font-medium text-blue-600 focus:border-blue-600 focus:outline-none md:text-6xl"
              aria-label="Page Title"
              placeholder="Enter your title..."
            />
            <ContentEditable
              html={subtitle}
              onChange={handleChange(setSubtitle)}
              tagName="h3"
              className="border-b-2 border-transparent py-2 text-2xl focus:border-blue-600 focus:outline-none md:text-3xl"
              aria-label="Subtitle"
              placeholder="Enter your subtitle..."
              style={{ whiteSpace: "pre-wrap" }}
            />
            <ContentEditable
              html={description}
              onChange={handleChange(setDescription)}
              tagName="p"
              className="border-b-2 border-transparent py-5 text-sm leading-8 text-white focus:border-blue-600 focus:outline-none md:text-xl"
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
              tagName="h3"
              className={`text-3xl py-1 `}
              aria-label="Skills Title"
              placeholder="Enter skills title..."
            />
            <ContentEditable
              html={skillsDescription}
              onChange={handleChange(setSkillsDescription)}
              tagName="p"
              className={`text-md py-2 leading-8`}
              aria-label="Skills Description"
              placeholder="Enter skills description..."
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
          <div className="lg:flex gap-10">
            <div
              className={`text-center shadow-lg p-10 rounded-xl my-10 flex-1`}
            >
              <PiFrameCornersBold
                className={`w-16 h-16 text-teal-600 mx-auto`}
              />
              <ContentEditable
                html={frameworksTitle}
                onChange={handleChange(setFrameworksTitle)}
                tagName="h3"
                className="text-lg font-medium pt-8 pb-2"
                aria-label="Frameworks Title"
                placeholder="Enter frameworks title..."
              />
              <ContentEditable
                html={frameworksDescription}
                onChange={handleChange(setFrameworksDescription)}
                tagName="p"
                className="py-2"
                aria-label="Frameworks Description"
                placeholder="Enter frameworks description..."
                style={{ whiteSpace: "pre-wrap" }}
              />
              <ContentEditable
                html="React"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Framework React"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Next.js"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Framework Next.js"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Figma"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Framework Figma"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Firebase"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Framework Firebase"
                placeholder="Enter framework..."
              />
              <ContentEditable
                html="Material-UI, Tailwind, Bootstrap"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Framework Material-UI, Tailwind, Bootstrap"
                placeholder="Enter framework..."
              />
            </div>
            <div
              className={`text-center shadow-lg p-10 rounded-xl my-10 flex-1`}
            >
              <IoLibraryOutline className={`w-16 h-16 text-teal-600 mx-auto`} />
              <ContentEditable
                html={librariesTitle}
                onChange={handleChange(setLibrariesTitle)}
                tagName="h3"
                className="text-lg font-medium pt-8 pb-2"
                aria-label="Libraries Title"
                placeholder="Enter libraries title..."
              />
              <ContentEditable
                html={librariesDescription}
                onChange={handleChange(setLibrariesDescription)}
                tagName="p"
                className="py-2"
                aria-label="Libraries Description"
                placeholder="Enter libraries description..."
                style={{ whiteSpace: "pre-wrap" }}
              />
              <ContentEditable
                html="Pandas"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Library Pandas"
                placeholder="Enter library..."
              />
              <ContentEditable
                html="NumPy"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Library NumPy"
                placeholder="Enter library..."
              />
              <ContentEditable
                html="TensorFlow"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Library TensorFlow"
                placeholder="Enter library..."
              />
              <ContentEditable
                html="scikit-learn, matplotlib"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Library scikit-learn, matplotlib"
                placeholder="Enter library..."
              />
              <ContentEditable
                html="matplotlib"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Library matplotlib"
                placeholder="Enter library..."
              />
            </div>
            <div
              className={`text-center shadow-lg p-10 rounded-xl my-10 flex-1`}
            >
              <FaCode className={`w-16 h-16 text-teal-600 mx-auto`} />
              <ContentEditable
                html={languagesTitle}
                onChange={handleChange(setLanguagesTitle)}
                tagName="h3"
                className="text-lg font-medium pt-8 pb-2"
                aria-label="Languages Title"
                placeholder="Enter languages title..."
              />
              <ContentEditable
                html={languagesDescription}
                onChange={handleChange(setLanguagesDescription)}
                tagName="p"
                className="py-2"
                aria-label="Languages Description"
                placeholder="Enter languages description..."
                style={{ whiteSpace: "pre-wrap" }}
              />
              <ContentEditable
                html="C/C++"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Language C/C++"
                placeholder="Enter language..."
              />
              <ContentEditable
                html="Python"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Language Python"
                placeholder="Enter language..."
              />
              <ContentEditable
                html="SQL"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
                aria-label="Language SQL"
                placeholder="Enter language..."
              />
        <ContentEditable
          html="Java"
          onChange={handleChange((value) => console.log(value))}
          tagName="p"
          className="text-inherit py-1"
          aria-label="Language Java"
          placeholder="Enter language..."
        />
              <ContentEditable
                html="HTML/CSS/JavaScript"
                onChange={handleChange((value) => console.log(value))}
                tagName="p"
                className="text-inherit py-1"
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
