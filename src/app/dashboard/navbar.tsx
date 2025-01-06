"use client";
import { FaPiedPiper } from "react-icons/fa6";
import { PiUserCircleDuotone } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import DropdownMenu from "./dropdown";

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
    <nav className="border-box flex w-full items-center border-b bg-gray-800 px-10 py-4 text-white">
      <FaPiedPiper className="mr-4 text-4xl text-green-600" />
      <div className="flex items-center gap-2">
        <p
          className={`border-b-2 pb-1 hover:cursor-pointer hover:text-green-400 ${
            pathname === "/dashboard"
              ? "border-green-400"
              : "border-transparent"
          }`}
        >
          Dashboard
        </p>
        <p className="border-b-2 border-transparent pb-1 hover:cursor-pointer hover:border-green-400 hover:text-green-400">
          Domains
        </p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <p className="hover:cursor-pointer hover:text-green-400 hover:underline">
          Help
        </p>
        <p className="hover:cursor-pointer hover:text-green-400 hover:underline">
          Account Settings
        </p>
        <PiUserCircleDuotone
          className="cursor-pointer text-4xl text-green-600"
          onClick={toggleDropdown}
        />
        {dropdownOpen && <DropdownMenu dropdownRef={dropdownRef} />}
      </div>
    </nav>
  );
}
