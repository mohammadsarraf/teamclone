import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { NoteItem } from "./NoteItem";

export interface Note {
    id: string;
    title: string;
    folderId: string;
  }
  
  export interface Folder {
    id: string;
    name: string;
  } 
  
interface FolderItemProps {
  folder: Folder;
  notes: Note[];
  isExpanded: boolean;
  editingFolderId: string | null;
  activeNoteId: string;
  editInputRef: React.RefObject<HTMLInputElement>;
  onToggle: (folderId: string) => void;
  onFolderEdit: (folderId: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onContextMenu: (event: React.MouseEvent, folderId: string) => void;
  onNoteSelect: (id: string) => void;
  onNoteContextMenu: (event: React.MouseEvent, noteId: string) => void;
  onNewNote: (folderId: string) => void;
  setEditingFolderId: (id: string | null) => void;
}

export function FolderItem({
  folder,
  notes,
  isExpanded,
  editingFolderId,
  activeNoteId,
  editInputRef,
  onToggle,
  onFolderEdit,
  onContextMenu,
  onNoteSelect,
  onNoteContextMenu,
  onNewNote,
  setEditingFolderId,
}: FolderItemProps) {
  const folderNotes = notes.filter((note) => note.folderId === folder.id);

  return (
    <div>
      <div
        className="group flex w-full items-center px-4 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-800/30"
        onContextMenu={(e) => onContextMenu(e, folder.id)}
      >
        <div
          onClick={() => onToggle(folder.id)}
          className="flex flex-1 cursor-pointer items-center"
        >
          <button className="mr-2">
            {isExpanded ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </button>
          <FolderIcon className="mr-2 size-4" />
          {editingFolderId === folder.id ? (
            <input
              ref={editInputRef}
              defaultValue={folder.name}
              onKeyDown={(e) => onFolderEdit(folder.id, e)}
              onBlur={() => setEditingFolderId(null)}
              className="bg-transparent outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate">{folder.name}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, folder.id);
          }}
          className="opacity-0 group-hover:opacity-100"
        >
          <EllipsisHorizontalIcon className="size-5" />
        </button>
      </div>
      {isExpanded && (
        <div className="space-y-0.5">
          {folderNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              activeNoteId={activeNoteId}
              indent={2}
              onNoteSelect={onNoteSelect}
              onContextMenu={onNoteContextMenu}
            />
          ))}
          <button
            onClick={() => onNewNote(folder.id)}
            className="flex w-full items-center px-8 py-1.5 text-left text-zinc-500 hover:bg-zinc-800/30"
          >
            <PlusIcon className="mr-2 size-4" />
            <span>New note</span>
          </button>
        </div>
      )}
    </div>
  );
} 