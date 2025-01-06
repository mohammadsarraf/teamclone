import { FaRegHeart } from "react-icons/fa6";

interface SidebarProps {
  selectedOptions: string[];
  handleBgChange: (option: string) => void;
}

const Sidebar = ({ selectedOptions, handleBgChange }: SidebarProps) => {
  return (
    <aside className="w-64 h-screen flex flex-col justify-between overflow-y-auto custom-scrollbar border-r-2 px-4">
      <div>
        <h2 className="text-xl font-bold mb-4 text-black">Types</h2>
        <ul className="p-1 border-b-2 pb-10">
          {["Online Store", "Porfolio", "Memberships", "Blogs", "Scheduling", "One Page", "Courses", "Services", "Donations"].map((option) => (
            <li className="mb-2 flex items-center" key={option} onClick={() => handleBgChange(option)}>
              <div
                className={`w-4 h-4 mr-2 border-2 border-gray-400 ${selectedOptions.includes(option) ? "bg-gray-600" : ""}`}
              ></div>
              <button className=" text-gray-400">{option}</button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center p-4 border-t-2">
        <span className="text-black mr-2">My Favorites</span>
        <FaRegHeart className="text-2xl ml-2 text-black" />
      </div>
    </aside>
  );
};

export default Sidebar;
