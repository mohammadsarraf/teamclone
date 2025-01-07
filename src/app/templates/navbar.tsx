"use client";
import { FaPiedPiper } from "react-icons/fa6";
import { PiUserCircleDuotone } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import DropdownMenu from "./dropdown";
import { TiArrowSortedDown } from "react-icons/ti";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="border-box flex w-full items-center border-b bg-gray-900 px-10 py-4 text-white shadow-lg">
      <div className="flex items-center">
        <FaPiedPiper className="mr-4 text-6xl text-green-500" />
        <p className="text-3xl font-bold text-green-500">FrozenMango</p>
      </div>
      <div className="flex grow justify-center">
        <button className="bg-transparnet flex items-center rounded-md px-4  py-2 text-white">
          PRODUCTS
          <TiArrowSortedDown className="ml-1 flex" />
        </button>
        <button className="bg-transparnet flex items-center rounded-md px-4  py-2 text-white">
          TEMPLATES
        </button>
        <button className="bg-transparnet flex items-center rounded-md px-4  py-2 text-white">
          RESOURCES
          <TiArrowSortedDown className="ml-1 flex" />
        </button>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <p className="hover:cursor-pointer hover:text-green-400 hover:underline">
          Help
        </p>
        <p className="hover:cursor-pointer hover:text-green-400 hover:underline">
          Account Settings
        </p>
        <PiUserCircleDuotone
          className="cursor-pointer text-4xl text-green-500"
          onClick={toggleDropdown}
        />
        {dropdownOpen && <DropdownMenu dropdownRef={dropdownRef} />}
      </div>
    </nav>
  );
}
