import { useState } from "react";

interface ElementToolbarProps {
  setIsButton: (value: boolean) => void;
  setIsSocial: (value: boolean) => void;
  setIsCart: (value: boolean) => void;
  setIsAccount: (value: boolean) => void;
}

export default function ElementToolbar({
  setIsButton,
  setIsSocial,
  setIsCart,
  setIsAccount,
}: ElementToolbarProps) {
  const handleToggleChange = (name: string, isChecked: boolean) => {
    if (name === "Social Links") {
      setIsSocial(isChecked);
    }
    if (name === "Button") {
      setIsButton(isChecked);
    }
    if (name === "Cart") {
      setIsCart(isChecked);
    }
    if (name === "Account") {
      setIsAccount(isChecked);
    }
  };
  return (
    <div className="z-20 h-full text-left">
      {["Button", "Social Links", "Cart", "Account"].map((name, id) => {
        return (
          <li
            key={id}
            className="flex cursor-pointer items-center justify-between rounded py-2 hover:bg-gray-100"
          >
            {name}
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                onChange={(e) => handleToggleChange(name, e.target.checked)} // Change handler
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
              <span className="absolute left-1 top-1 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-full peer-checked:border-white"></span>
            </label>
          </li>
        );
      })}
    </div>
  );
}
