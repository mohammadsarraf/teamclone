import { FaRegHeart } from "react-icons/fa6";

interface SidebarProps {
  selectedOptions: string[];
  handleBgChange: (option: string) => void;
}

const Sidebar = ({ selectedOptions, handleBgChange }: SidebarProps) => {
  return (
    <aside className="custom-scrollbar flex h-screen w-64 flex-col justify-between overflow-y-auto border-r-2 px-4">
      <div>
        <h2 className="mb-4 text-xl font-bold text-black">Types</h2>
        <ul className="border-b-2 p-1 pb-10">
          {[
            "Online Store",
            "Porfolio",
            "Memberships",
            "Blogs",
            "Scheduling",
            "One Page",
            "Courses",
            "Services",
            "Donations",
          ].map((option) => (
            <li
              className="mb-2 flex items-center"
              key={option}
              onClick={() => handleBgChange(option)}
            >
              <div
                className={`mr-2 size-4 border-2 border-gray-400 ${selectedOptions.includes(option) ? "bg-gray-600" : ""}`}
              ></div>
              <button className=" text-gray-400">{option}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center border-t-2 p-4">
        <span className="mr-2 text-black">My Favorites</span>
        <FaRegHeart className="ml-2 text-2xl text-black" />
      </div>
    </aside>
  );
};

export default Sidebar;
