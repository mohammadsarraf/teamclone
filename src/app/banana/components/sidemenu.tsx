import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SideMenu() {
  const [activeItem, setActiveItem] = useState("Design");

  const menuItems = [
    { text: "Home" },
    { text: "Design" },
    { text: "Commerce" },
    { text: "Pages" },
    { text: "Scheduling" },
    { text: "Campaigns" },
    { text: "Payments" },
    { text: "Marketing" },
    { text: "Customers" },
    { text: "Analytics" },
    { text: "Billing" },
  ];
  return (
    <div>
      <aside className="h-full w-[280px] bg-[#2d2d2d] text-[#e8e8e8] shadow-2xl transition-all duration-500">
        {/* Header */}
        <div className="border-b border-[#404040] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="size-8 rounded-sm bg-white/90"></div>
              <span className="text-sm font-medium text-white">My Website</span>
            </div>
            <button className="rounded-full p-2 text-[#999999] hover:bg-[#404040] hover:text-white">
              <FaSearch className="text-lg" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveItem(item.text)}
                className={`group flex w-full items-center py-2 text-left transition-all
                  ${
                    activeItem === item.text
                      ? "text-white"
                      : "text-[#999999] hover:text-white"
                  }`}
              >
                <span className="relative">
                  <span className="text-sm font-medium tracking-wide">
                    {item.text}
                  </span>
                  {/* Hover underline */}
                  <span className="absolute inset-x-0 bottom-[-3px] h-[2px] scale-x-0 bg-white transition-transform duration-200 group-hover:scale-x-100" />
                  {/* Active underline */}
                  {activeItem === item.text && (
                    <span className="absolute inset-x-0 bottom-[-3px] h-[2px] bg-white" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}
