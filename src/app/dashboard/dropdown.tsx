import { RefObject } from "react";

interface DropdownMenuProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ dropdownRef }) => {
  const menuItems = [
    "Profile",
    "Account Security",
    "Notifications",
    "Language",
    "Help",
    "Logout",
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-5 top-12 mt-2 w-64 bg-white text-black shadow-lg"
    >
      <div className="border-b p-4">
        <p className="font-bold">Username</p>
        <p className="text-sm text-gray-600">user@example.com</p>
      </div>
      <div className="flex flex-col">
        {menuItems.map((item) => (
          <button
            key={item}
            className="w-full cursor-pointer p-4 text-left hover:bg-gray-100"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
