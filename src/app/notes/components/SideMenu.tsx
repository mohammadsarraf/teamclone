import React from 'react';

interface Note {
  id: string;
  title: string;
  layout: any[];
  texts: { [key: string]: string };
}

interface SideMenuProps {
  notes: Note[];
  activeNoteId: string;
  onNoteSelect: (noteId: string) => void;
  onNewNote: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ notes, activeNoteId, onNoteSelect, onNewNote }) => {
  return (
    <div className="w-64 h-screen bg-zinc-900 text-white p-4 border-r border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Notes</h2>
        <button 
          onClick={onNewNote}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
        >
          + New
        </button>
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onNoteSelect(note.id)}
            className={`p-3 rounded-lg cursor-pointer ${
              activeNoteId === note.id ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
            }`}
          >
            <h3 className="font-medium">{note.title || 'Untitled'}</h3>
            <p className="text-sm text-zinc-400 truncate">
              {Object.values(note.texts)[0] || 'No content'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
