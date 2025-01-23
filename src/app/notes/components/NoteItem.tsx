import {
  DocumentIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

export interface Note {
  id: string;
  title: string;
  folderId: string;
}

interface NoteItemProps {
  note: Note;
  activeNoteId: string;
  indent?: number;
  onNoteSelect: (id: string) => void;
  onContextMenu: (event: React.MouseEvent, noteId: string) => void;
}

export function NoteItem({
  note,
  activeNoteId,
  indent = 0,
  onNoteSelect,
  onContextMenu,
}: NoteItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onNoteSelect(note.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onNoteSelect(note.id);
        }
      }}
      onContextMenu={(e) => onContextMenu(e, note.id)}
      className={`group flex w-full cursor-pointer items-center px-4 py-1.5 text-left transition-colors ${
        activeNoteId === note.id
          ? "bg-zinc-800/50 text-zinc-100"
          : "text-zinc-400 hover:bg-zinc-800/30"
      }`}
      style={{ paddingLeft: `${indent}rem` }}
    >
      <DocumentIcon className="mr-2 size-4" />
      <span className="flex-1 truncate">{note.title || "Untitled Note"}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu(e, note.id);
        }}
        className="opacity-0 group-hover:opacity-100"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </button>
    </div>
  );
}
