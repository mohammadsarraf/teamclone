import { FaRegHeart } from "react-icons/fa6";
import Sidebar from "./Sidebar";
import TemplateList from "./TemplateList";

interface MainContentProps {
  selectedOptions: string[];
  handleBgChange: (option: string) => void;
}

export default function MainContent({
  selectedOptions,
  handleBgChange,
}: MainContentProps) {
  return (
    <main className="flex px-10">
      <Sidebar
        selectedOptions={selectedOptions}
        handleBgChange={handleBgChange}
      />
      <TemplateList />
    </main>
  );
}
