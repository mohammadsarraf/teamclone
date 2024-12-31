"use client";
import { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { useUser, UserProvider, signOutUser } from "../components/UserContext";
import { useRouter } from "next/navigation";

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
      router.push('/'); // Redirect to the home page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
      <main className="bg-black px-10 md:px-20 lg:px-40">
        <section className="min-h-screen">
          <nav className="mb-12 flex justify-between py-10">
            <h1 className="text-xl cursor-pointer" onClick={handleSignOut}>Lilglu4e</h1>
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
