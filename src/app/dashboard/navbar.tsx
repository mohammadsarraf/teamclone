"use client";
import { FaPiedPiper } from "react-icons/fa6";
import { UserProvider } from "../components/UserContext";
import { PiUserCircleDuotone } from "react-icons/pi";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-5 top-12 mt-2 w-80 bg-white text-black shadow-lg"
          >
            <div className="border-b p-4">
              <p className="font-bold">Username</p>
              <p className="text-sm text-gray-600">user@example.com</p>
            </div>
            <div className="cursor-pointer p-4 hover:bg-gray-100">Profile</div>
            <div className="cursor-pointer p-4 hover:bg-gray-100">
              Account Security
            </div>
            <div className="cursor-pointer p-4 hover:bg-gray-100">
              Notifications
            </div>
            <div className="cursor-pointer p-4 hover:bg-gray-100">Language</div>
            <div className="cursor-pointer p-4 hover:bg-gray-100">Help</div>
            <div className="cursor-pointer p-4 hover:bg-gray-100">Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
}
