interface BaseToolbarProps {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function BaseToolbar({ title, description, onClose, children }: BaseToolbarProps) {
  return (
    <div className="flex w-[280px] flex-col overflow-hidden rounded-lg bg-[#2d2d2d] text-sm shadow-xl">
      <div className="flex items-center justify-between border-b border-[#404040] px-3 py-2">
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
        <button 
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-[#404040] hover:text-white"
        >
          <HiX className="text-lg" />
        </button>
      </div>
      {children}
    </div>
  );
} 