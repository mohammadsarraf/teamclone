import React from 'react';

interface SettingsMenuProps {
  cols: number;
  rows: number;
  onColsChange: (cols: number) => void;
  onRowsChange: (rows: number) => void;
  handleClose: () => void;
}

export const SettingsMenu = ({
  cols,
  rows,
  onColsChange,
  onRowsChange,
  handleClose,
}: SettingsMenuProps) => {
  return (
    <div className="w-96 rounded-xl bg-white p-4 shadow-2xl">
      <div className="flex max-h-[400px] flex-col overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Settings</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Grid Settings */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Grid</h4>
            
            {/* Columns */}
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Columns: {cols}
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={cols}
                onChange={(e) => onColsChange(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              />
            </div>

            {/* Rows */}
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Rows: {rows}
              </label>
              <input
                type="range"
                min="12"
                max="48"
                value={rows}
                onChange={(e) => onRowsChange(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 