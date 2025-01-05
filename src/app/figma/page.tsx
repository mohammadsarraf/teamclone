"use client";
import { useState, useRef } from "react";
import EditableComp from "../components/EditableComp";

export default function Home() {
  const [title, setTitle] = useState(
    " As a Computer Science student deeply engaged with Data Science, AI, and Full-Stack Development, I am driven by a passion to blend creativity and technology. My portfolio, featuring diverse projects such as an interactive React mini-game and an innovative NBA MVP prediction model, is a testament to my commitment to crafting engaging user experiences and leveraging the power of data-driven insights.",
  );
  const editableCompRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-col m-40">
      <div ref={editableCompRef}>
        <EditableComp
          html={title}
          onChange={setTitle}
          onClick={() => setIsclicked(!isclicked)}
          className={`border-b-2 border-transparent py-2 font-medium focus:border-blue-600 focus:outline-none`}
          ariaLabel="Page Title"
          placeholder="Enter your title..."
          fontSize="text-xl"
          fontColor="text-white"
          fontAlignment="text-justify"
          widthSize="22"
          lengthSize="10"
        />
      </div>
    </div>
  );
}
