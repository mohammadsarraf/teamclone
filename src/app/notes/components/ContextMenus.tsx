interface FolderContextMenuProps {
  x: number;
  y: number;
  folderId: string;
  onRename: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

export function FolderContextMenu({
  x,
  y,
  folderId,
  onRename,
  onDelete,
}: FolderContextMenuProps) {
  return (
    <div
      className="fixed z-50 min-w-[160px] rounded-md bg-zinc-800 py-1 shadow-lg"
      style={{ top: y, left: x }}
    >
      <button
        className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700"
        onClick={() => onRename(folderId)}
      >
        Rename
      </button>
      <button
        className="w-full px-4 py-2 text-left text-red-400 hover:bg-zinc-700"
        onClick={() => onDelete(folderId)}
      >
        Delete
      </button>
    </div>
  );
}

interface NoteContextMenuProps {
  x: number;
  y: number;
  noteId: string;
  folders: Array<{ id: string; name: string }>;
  onMove: (noteId: string, folderId: string | null) => void;
  onDelete: (noteId: string) => void;
}

export function NoteContextMenu({
  x,
  y,
  noteId,
  folders,
  onMove,
  onDelete,
}: NoteContextMenuProps) {
  return (
    <div
      className="fixed z-50 min-w-[160px] rounded-md bg-zinc-800 py-1 shadow-lg"
      style={{ top: y, left: x }}
    >
      <div className="px-4 py-2 text-xs text-zinc-500">Move to folder</div>
      {folders.map((folder) => (
        <button
          key={folder.id}
          className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700"
          onClick={() => onMove(noteId, folder.id)}
        >
          {folder.name}
        </button>
      ))}
      <button
        className="w-full border-t border-zinc-700 px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700"
        onClick={() => onMove(noteId, null)}
      >
        Move to root
      </button>
      <button
        className="w-full border-t border-zinc-700 px-4 py-2 text-left text-red-400 hover:bg-zinc-700"
        onClick={() => onDelete(noteId)}
      >
        Delete note
      </button>
    </div>
  );
} 