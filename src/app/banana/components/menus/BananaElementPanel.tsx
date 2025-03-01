"use client";
import {
  HiOutlineShoppingCart,
  HiOutlineTemplate,
  HiOutlineUser,
  HiX,
} from "react-icons/hi";
import { TiSocialSkypeOutline } from "react-icons/ti";
import { useState } from "react";

interface ElementToolbarProps {
  onClose: () => void;
  onElementsChange: (elements: {
    isButton: boolean;
    isSocial: boolean;
    isCart: boolean;
    isAccount: boolean;
  }) => void;
  initialElements: {
    isButton: boolean;
    isSocial: boolean;
    isCart: boolean;
    isAccount: boolean;
  };
}

export default function BananaElementPanel({
  onClose,
  onElementsChange,
  initialElements,
}: ElementToolbarProps) {
  const [toggleStates, setToggleStates] = useState(initialElements);

  const handleToggleChange = (key: keyof typeof toggleStates) => {
    const newToggleStates = {
      ...toggleStates,
      [key]: !toggleStates[key],
    };
    setToggleStates(newToggleStates);
    onElementsChange(newToggleStates);
  };

  const elementOptions = [
    {
      key: "isButton" as const,
      label: "Button",
      description: "Add button",
      icon: HiOutlineTemplate,
    },
    {
      key: "isSocial" as const,
      label: "Social",
      description: "Add social links",
      icon: TiSocialSkypeOutline,
    },
    {
      key: "isCart" as const,
      label: "Cart",
      description: "Add cart",
      icon: HiOutlineShoppingCart,
    },
    {
      key: "isAccount" as const,
      label: "Account",
      description: "Add account",
      icon: HiOutlineUser,
    },
  ];

  return (
    <div className="flex w-[280px] flex-col overflow-hidden rounded-lg bg-[#2d2d2d] text-sm shadow-xl">
      <div className="flex items-center justify-between border-b border-[#404040] px-3 py-2">
        <div>
          <h3 className="font-medium text-white">Elements</h3>
          <p className="text-xs text-gray-400">Add to header</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-[#404040] hover:text-white"
        >
          <HiX className="text-lg" />
        </button>
      </div>

      <div className="flex flex-col gap-0.5 p-1">
        {elementOptions.map((option) => (
          <div
            key={option.key}
            className={`group rounded-md transition-colors ${
              toggleStates[option.key] ? "bg-[#404040]" : "hover:bg-[#404040]"
            }`}
          >
            <button
              className="flex w-full items-center gap-2 p-2 text-left"
              onClick={() => handleToggleChange(option.key)}
            >
              <div
                className={`rounded-md bg-[#505050] p-1.5 transition-colors ${
                  toggleStates[option.key]
                    ? "bg-blue-500"
                    : "group-hover:bg-[#606060]"
                }`}
              >
                <option.icon className="text-base text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{option.label}</span>
                  <div className="relative h-4 w-7">
                    <div
                      className={`absolute inset-0 rounded-full transition-colors ${
                        toggleStates[option.key] ? "bg-blue-500" : "bg-gray-600"
                      }`}
                    />
                    <div
                      className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${
                        toggleStates[option.key] ? "left-3.5" : "left-0.5"
                      }`}
                    />
                  </div>
                </div>
                <p className="truncate text-xs text-gray-400">
                  {option.description}
                </p>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}