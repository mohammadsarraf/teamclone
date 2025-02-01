interface MenuBarProps {
  cols: number;
  rows: number;
  setCols: (cols: number) => void;
  setRows: (rows: number) => void;
  onReset: () => void;
  onAddShape: (type: "triangle" | "circle" | "square") => void;
  onAddTextBox: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  cols,
  rows,
  setCols,
  setRows,
  onReset,
  onAddShape,
  onAddTextBox,
}: MenuBarProps) => {
  return (
    <div className="flex h-14 items-center justify-between border-b border-gray-700 bg-gray-800 px-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <h1 className="font-bold text-white">Shape Editor</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onReset}
            className="rounded bg-red-500 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-600"
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
                className="w-16 rounded bg-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-sm">Rows:</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => {
                  const newRows = Math.max(1, Number(e.target.value));
                  setRows(newRows);
                }}
                min="1"
                max="50"
                className="w-16 rounded bg-gray-700 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onAddShape("triangle")}
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Add Triangle
        </button>
        <button
          onClick={() => onAddShape("circle")}
          className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
        >
          Add Circle
        </button>
        <button
          onClick={() => onAddShape("square")}
          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        >
          Add Square
        </button>
        <button
          onClick={onAddTextBox}
          className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
        >
          Add Text
        </button>
      </div>
    </div>
  );
};
