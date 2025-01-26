interface NoteHeaderProps {
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
}

export default function NoteHeader({
  isSaving,
  hasUnsavedChanges,
}: NoteHeaderProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
      <div className="flex items-center gap-4">
        {/* ... other header content ... */}
      </div>

      <div className="flex items-center gap-2 px-4">
        {isSaving ? (
          <div className="flex items-center gap-2">
            <div className="size-2 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
            <span className="text-sm text-zinc-400">Saving...</span>
          </div>
        ) : hasUnsavedChanges ? (
          <span className="text-sm text-zinc-500">Unsaved changes</span>
        ) : (
          <span className="text-sm text-zinc-600">All changes saved</span>
        )}
      </div>
    </header>
  );
}
