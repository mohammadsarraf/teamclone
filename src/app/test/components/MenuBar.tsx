interface MenuBarProps {
  cols: number;
  rows: number;
  setCols: (cols: number) => void;
  setRows: (rows: number) => void;
  onReset: () => void;
}

export const MenuBar = ({ cols, rows, setCols, setRows, onReset }: MenuBarProps) => {
  return (
    <div className="h-14 bg-gray-800 border-b border-gray-700 px-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center space-x-4">
        <h1 className="text-white font-bold">Shape Editor</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-red-500 text-sm text-white rounded hover:bg-red-600 transition-colors"
          >
            Reset Layout
          </button>
          
          <div className="flex items-center space-x-2 text-white">
            <div className="flex items-center space-x-1">
              <label className="text-sm">Cols:</label>
              <input
                type="number"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                min="1"
                max="50"
                className="w-16 px-2 py-1 bg-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-sm">Rows:</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                min="1"
                max="50"
                className="w-16 px-2 py-1 bg-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 