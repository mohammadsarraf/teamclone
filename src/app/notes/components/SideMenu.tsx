import { useState, useRef, useEffect } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  DocumentIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

interface Note {
  id: string;
  title: string;
  folderId?: string | null;
}

interface Folder {
  id: string;
  name: string;
  isExpanded?: boolean;
}

interface SideMenuProps {
  notes: Note[];
  folders?: Folder[];
  activeNoteId: string;
  onNoteSelect: (id: string) => void;
  onNewNote: (folderId?: string) => void;
  onNewFolder?: () => void;
  onUpdateFolder?: (id: string, name: string) => void;
  onMoveNote?: (noteId: string, folderId: string | null) => void;
  onDeleteFolder?: (id: string) => void;
  onDeleteNote?: (noteId: string) => void;
}

export default function SideMenu({
  notes,
  folders = [],
  activeNoteId,
  onNoteSelect,
  onNewNote,
  onNewFolder,
  onUpdateFolder,
  onMoveNote,
  onDeleteFolder,
  onDeleteNote,
}: SideMenuProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(folders.filter((f) => f.isExpanded).map((f) => f.id)),
  );
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderContextMenu, setFolderContextMenu] = useState<{
    folderId: string;
    x: number;
    y: number;
  } | null>(null);
  const [noteContextMenu, setNoteContextMenu] = useState<{
    noteId: string;
    x: number;
    y: number;
  } | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFolderId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingFolderId]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleFolderEdit = (
    folderId: string,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" && onUpdateFolder) {
      onUpdateFolder(folderId, event.currentTarget.value);
      setEditingFolderId(null);
    } else if (event.key === "Escape") {
      setEditingFolderId(null);
    }
  };

  const handleFolderContextMenu = (
    event: React.MouseEvent,
    folderId: string,
  ) => {
    event.preventDefault();
    setFolderContextMenu({
      folderId,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleNoteContextMenu = (event: React.MouseEvent, noteId: string) => {
    event.preventDefault();
    setNoteContextMenu({
      noteId,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const rootNotes = notes.filter((note) => !note.folderId);

  const renderNoteItem = (note: Note, indent: number = 0) => (
    <button
      key={note.id}
      onClick={() => onNoteSelect(note.id)}
      onContextMenu={(e) => handleNoteContextMenu(e, note.id)}
      className={`group flex w-full items-center px-4 py-1.5 text-left transition-colors ${
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
          handleNoteContextMenu(e, note.id);
        }}
        className="opacity-0 group-hover:opacity-100"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </button>
    </button>
  );

  const renderFolderContent = (folder: Folder) => {
    const folderNotes = notes.filter((note) => note.folderId === folder.id);
    const isExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id}>
        <div
          className="group flex w-full items-center px-4 py-1.5 text-zinc-400 transition-colors hover:bg-zinc-800/30"
          onContextMenu={(e) => handleFolderContextMenu(e, folder.id)}
        >
          <div
            onClick={() => toggleFolder(folder.id)}
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
                onKeyDown={(e) => handleFolderEdit(folder.id, e)}
                onBlur={() => setEditingFolderId(null)}
                className="bg-transparent outline-none"
                onClick={(e) => e.stopPropagation()} // Prevent toggling when editing
              />
            ) : (
              <span className="truncate">{folder.name}</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFolderContextMenu(e, folder.id);
            }}
            className="opacity-0 group-hover:opacity-100"
          >
            <EllipsisHorizontalIcon className="size-5" />
          </button>
        </div>
        {isExpanded && (
          <div className="space-y-0.5">
            {folderNotes.map((note) => renderNoteItem(note, 2))}
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
  };

  // Context Menus
  const renderFolderContextMenu = () => {
    if (!folderContextMenu) return null;

    return (
      <div
        className="fixed z-50 min-w-[160px] rounded-md bg-zinc-800 py-1 shadow-lg"
        style={{ top: folderContextMenu.y, left: folderContextMenu.x }}
      >
        <button
          className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700"
          onClick={() => {
            setEditingFolderId(folderContextMenu.folderId);
            setFolderContextMenu(null);
          }}
        >
          Rename
        </button>
        <button
          className="w-full px-4 py-2 text-left text-red-400 hover:bg-zinc-700"
          onClick={() => {
            onDeleteFolder?.(folderContextMenu.folderId);
            setFolderContextMenu(null);
          }}
        >
          Delete
        </button>
      </div>
    );
  };

  const renderNoteContextMenu = () => {
    if (!noteContextMenu) return null;

    return (
      <div
        className="fixed z-50 min-w-[160px] rounded-md bg-zinc-800 py-1 shadow-lg"
        style={{ top: noteContextMenu.y, left: noteContextMenu.x }}
      >
        <div className="px-4 py-2 text-xs text-zinc-500">Move to folder</div>
        {folders.map((folder) => (
          <button
            key={folder.id}
            className="w-full px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700"
            onClick={() => {
              onMoveNote?.(noteContextMenu.noteId, folder.id);
              setNoteContextMenu(null);
            }}
          >
            {folder.name}
          </button>
        ))}
        <button
          className="w-full border-t border-zinc-700 px-4 py-2 text-left text-zinc-200 hover:bg-zinc-700"
          onClick={() => {
            onMoveNote?.(noteContextMenu.noteId, null);
            setNoteContextMenu(null);
          }}
        >
          Move to root
        </button>
        <button
          className="w-full border-t border-zinc-700 px-4 py-2 text-left text-red-400 hover:bg-zinc-700"
          onClick={() => {
            onDeleteNote?.(noteContextMenu.noteId);
            setNoteContextMenu(null);
          }}
        >
          Delete note
        </button>
      </div>
    );
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = () => {
      setFolderContextMenu(null);
      setNoteContextMenu(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex h-full w-64 flex-shrink-0 flex-col overflow-hidden border-r border-zinc-800 bg-zinc-900">
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
        <h2 className="font-medium text-zinc-200">Notes</h2>
        <div className="flex gap-2">
          <button
            onClick={onNewFolder}
            className="rounded-md p-1 hover:bg-zinc-800"
            title="New folder"
          >
            <FolderIcon className="size-5 text-zinc-400" />
          </button>
          <button
            onClick={() => onNewNote()}
            className="rounded-md p-1 hover:bg-zinc-800"
            title="New note"
          >
            <PlusIcon className="size-5 text-zinc-400" />
          </button>
        </div>
      </div>
      <div className="ml-2 flex-1 space-y-0.5 overflow-y-auto py-2">
        {folders.map(renderFolderContent)}
        {rootNotes.map((note) => renderNoteItem(note))}
        {rootNotes.length === 0 && folders.length === 0 && (
          <div className="px-4 py-2 text-sm text-zinc-500">
            No notes yet. Create one to get started.
          </div>
        )}
      </div>
      {folderContextMenu && renderFolderContextMenu()}
      {noteContextMenu && renderNoteContextMenu()}
    </div>
  );
}
