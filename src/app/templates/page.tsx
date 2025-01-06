'use client'
import { useState } from "react";
import Navbar from "./navbar";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";

export default function Home() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleBgChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleRemoveOption = (option: string) => {
    setSelectedOptions((prev) => prev.filter((item) => item !== option));
  };

  return (
    <div className="min-h-screen w-screen justify-between bg-white">
      <Navbar />
      <Header />
      <div className="flex justify-between items-center px-10 py-4">
        <p className="text-black mr-2">29 Results</p>
        <div className="flex flex-wrap items-center flex-grow">
          {selectedOptions.map((option) => (
            <span key={option} className="bg-gray-200 text-black px-3 py-1 m-1 rounded-full flex items-center overflow-auto">
              {option}
              <button
                className="ml-2 text-gray-500"
                onClick={() => handleRemoveOption(option)}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <button className="text-black p-2 border ml-2">Build with AI</button>
      </div>
      <MainContent selectedOptions={selectedOptions} handleBgChange={handleBgChange} />
      <Footer />
    </div>
  );
}
