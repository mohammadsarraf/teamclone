"use client";
import { useState, useEffect } from "react";
import Navbar from "./navbar";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";

export default function Home() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const options = params.getAll("filter");
    setSelectedOptions(options);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    selectedOptions.forEach((option) => params.append("filter", option));
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [selectedOptions]);

  const handleBgChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleRemoveOption = (option: string) => {
    setSelectedOptions((prev) => prev.filter((item) => item !== option));
  };

  return (
    <div className="min-h-screen w-screen justify-between bg-white">
      <Navbar />
      <Header />
      <div className="flex items-center justify-between px-10 py-4">
        <p className="mr-2 text-black">29 Results</p>
        <div className="flex grow flex-wrap items-center">
          {selectedOptions.map((option) => (
            <span
              key={option}
              className="m-1 flex items-center overflow-auto rounded-full bg-gray-200 px-3 py-1 text-black"
            >
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
        <button className="ml-2 border p-2 text-black">Build with AI</button>
      </div>
      <MainContent
        selectedOptions={selectedOptions}
        handleBgChange={handleBgChange}
      />
      <Footer />
    </div>
  );
}
