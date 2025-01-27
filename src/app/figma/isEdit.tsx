import { HiDesktopComputer, HiDeviceMobile, HiEye } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";

interface TopMenuProps {
  setIsEditing: (isEditing: boolean) => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
}

export default function TopMenu({ setIsEditing, viewMode, setViewMode }: TopMenuProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-[#2d2d2d] bg-[#1b1b1b] px-4">
      <button 
        onClick={() => setIsEditing(true)}
        className="flex items-center space-x-2 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
      >
        <span className="text-sm">Edit</span>
      </button>

      <div className="flex items-center space-x-2">
        {/* View Mode Toggles */}
        <div className="flex items-center rounded bg-[#2d2d2d] p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center rounded px-3 py-1.5 text-sm ${
              viewMode === 'desktop' 
                ? 'bg-[#404040] text-white' 
                : 'text-[#999999] hover:text-white'
            }`}
          >
            <HiDesktopComputer className="mr-2 size-4" />
            Desktop
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center rounded px-3 py-1.5 text-sm ${
              viewMode === 'mobile' 
                ? 'bg-[#404040] text-white' 
                : 'text-[#999999] hover:text-white'
            }`}
          >
            <HiDeviceMobile className="mr-2 size-4" />
            Mobile
          </button>
        </div>

        {/* Settings and Preview buttons */}
        <button className="rounded p-2 text-[#999999] hover:bg-[#2d2d2d] hover:text-white">
          <FiSettings className="size-5" />
        </button>
        <button className="rounded p-2 text-[#999999] hover:bg-[#2d2d2d] hover:text-white">
          <HiEye className="size-5" />
        </button>
      </div>
    </div>
  );
}
