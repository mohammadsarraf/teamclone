"use client";
import {
  HiOutlineShoppingCart,
  HiOutlineTemplate,
  HiOutlineUser,
  HiX,
} from "react-icons/hi";
import { TiSocialSkypeOutline } from "react-icons/ti";
import { FaShoppingCart } from "react-icons/fa";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";

interface ElementToolbarProps {
  onClose: () => void;
}

export default function ElementToolbar({ onClose }: ElementToolbarProps) {
  const [toggleStates, setToggleStates] = useState({
    isButton: false,
    isSocial: false,
    isCart: false,
    isAccount: false,
  });

  const elementOptions = [
    {
      key: "isButton" as const,
      label: "Button",
      icon: HiOutlineTemplate,
      preview: (
        <button className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90">
          Button
        </button>
      ),
    },
    {
      key: "isSocial" as const,
      label: "Social",
      icon: TiSocialSkypeOutline,
      preview: (
        <div className="flex gap-3">
          <FaTwitter />
          <FaInstagram />
          <FaGithub />
        </div>
      ),
    },
    {
      key: "isCart" as const,
      label: "Cart",
      icon: HiOutlineShoppingCart,
      preview: <FaShoppingCart className="text-xl" />,
    },
    {
      key: "isAccount" as const,
      label: "Account",
      icon: HiOutlineUser,
      preview: <MdAccountCircle className="text-xl" />,
    },
  ];

  return (
    <div className="flex w-[320px] flex-col gap-4 rounded-lg bg-[#2d2d2d] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Elements</h3>
        <button 
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-[#404040] hover:text-white"
        >
          <HiX className="text-xl" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {elementOptions.map((option) => (
          <div key={option.key} className="group relative">
            <button 
              className="flex w-full items-center justify-between rounded-lg bg-[#404040] p-3 text-white hover:bg-[#4a4a4a]"
              onClick={() => setToggleStates(prev => ({ ...prev, [option.key]: !prev[option.key] }))}
            >
              <div className="flex items-center gap-2">
                <option.icon className="text-xl" />
                <span>{option.label}</span>
              </div>
              <div className="relative">
                <div className={`h-6 w-11 rounded-full transition-colors ${
                  toggleStates[option.key] ? 'bg-blue-500' : 'bg-gray-600'
                }`} />
                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                  toggleStates[option.key] ? 'left-6' : 'left-1'
                }`} />
              </div>
            </button>
            {/* <div className="absolute left-0 top-full z-10 hidden w-full rounded-lg bg-[#404040] p-2 group-hover:block">
              <div className="flex items-center justify-center rounded bg-[#2d2d2d] p-2 text-white">
                {option.preview}
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
} 