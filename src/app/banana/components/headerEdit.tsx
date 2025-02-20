"use client";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";

export default function HeaderEdit() {
    return (
        <header className="flex w-full items-center justify-between px-6 py-4 bg-slate-600">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-6">
                <h1 className="text-2xl font-bold text-white">YourWebsiteTitle</h1>
                <nav className="flex space-x-4">
                    <button className="text-lg font-medium text-white/90 transition-colors hover:text-white">
                        Menu
                    </button>
                    <button className="text-lg font-medium text-white/90 transition-colors hover:text-white">
                        Reservation
                    </button>
                </nav>
            </div>

        </header>
    )
}