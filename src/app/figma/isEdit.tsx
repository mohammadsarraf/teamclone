import { FaMobileAlt, FaPaintBrush, FaDesktop, FaExpand } from "react-icons/fa";

interface TopMenueProps {
  setIsEditing: (isEditing: boolean) => void;
}

export default function TopMenue({ setIsEditing }: TopMenueProps) {
  return (
    <div className="flex items-center justify-between bg-white p-2">
      <button className="text-black" onClick={() => setIsEditing(true)}>
        Edit
      </button>
      <p className="text-black">Template Name</p>
      <div className="flex space-x-2">
        <FaDesktop className="text-black" />
        <FaMobileAlt className="text-black" />
        <FaPaintBrush className="text-black" />
        <FaExpand className="text-black" />
      </div>
    </div>
  );
}
