"use client";
import React, { useState, useRef, useEffect, RefObject } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import NoteGrid from "./NoteGrid";
import NoteHeader from "./components/NoteHeader";
import "@fontsource/playfair-display"; // Defaults to weight 400
import "@fontsource/playfair-display/700.css"; // For weight 700
import Title from "./components/Title";
import Skeleton from "./components/Skeleton";
import SideMenu from "./components/SideMenu";
import { v4 as uuidv4 } from "uuid";

interface Texts {
  [key: string]: string;
}

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type?: string; // Add type property to Layout interface
  showIcons: boolean; // Add showIcons property to Layout interface
}

export default function Note() {
  const defaultLayout = [
    { i: "rect1", x: 0, y: 1, w: 12, h: 1, type: "Paragraph", showIcons: true },
  ]; // Ensure Title is at the top

  const [isClient, setIsClient] = useState(false);
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);
  const [title, setTitle] = useState<string>("");
  const [texts, setTexts] = useState<Texts>({});
  const [iconTypes, setIconTypes] = useState<{ [key: string]: string }>({});
  const [notes, setNotes] = useState<
    Array<{
      id: string;
      title: string;
      layout: Layout[];
      texts: Texts;
      iconTypes: { [key: string]: string };
      folderId?: string | null; // Add this line
    }>
  >([]);
  const [activeNoteId, setActiveNoteId] = useState<string>("");
  const [folders, setFolders] = useState<
    Array<{
      id: string;
      name: string;
      isExpanded?: boolean;
    }>
  >([]);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedNotes = localStorage.getItem("notes");
    const savedActiveNoteId = localStorage.getItem("activeNoteId");
    const savedFolders = localStorage.getItem("folders");

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);

      // Set active note
      const noteId = savedActiveNoteId || parsedNotes[0]?.id;
      if (noteId) {
        const activeNote = parsedNotes.find((n: any) => n.id === noteId);
        if (activeNote) {
          setActiveNoteId(noteId);
          setLayout(activeNote.layout || defaultLayout);
          setTitle(activeNote.title || "");
          setTexts(activeNote.texts || {});
          setIconTypes(activeNote.iconTypes || {});
        }
      }
    } else {
      // Initialize with a default note
      const initialNote = {
        id: "note1",
        title: "",
        layout: defaultLayout,
        texts: {},
        iconTypes: {},
      };
      setNotes([initialNote]);
      setActiveNoteId("note1");
      setLayout(defaultLayout);
    }
  }, []);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (activeNoteId && notes.length > 0) {
        saveCurrentNote();
        localStorage.setItem("folders", JSON.stringify(folders));
      }
    }, 1000); // Debounce save for 1 second

    return () => clearTimeout(autoSave);
  }, [title, layout, texts, iconTypes, folders]);

  const newRectRef = useRef<HTMLDivElement | null>(null);
  const [newRectKey, setNewRectKey] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (newRectRef.current) {
      newRectRef.current.focus();
    }
  }, [newRectKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("layout", JSON.stringify(layout));
    }
  }, [layout]);

  const handleKeyDown = (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const newKey = `rect${Object.keys(texts).length + 1}`;
      const index = layout.findIndex((item) => item.i === key);
      const currentType = layout[index].type;

      const newLayout = [
        ...layout.slice(0, index + 1),
        {
          i: newKey,
          x: 0,
          y: layout[index].y + 1,
          w: 12,
          h: 1,
          type:
            currentType === "Bullet point" ||
            currentType === "Task" ||
            currentType === "Numbered list"
              ? currentType
              : "Paragraph",
          showIcons: true,
        },
        ...layout.slice(index + 1).map((item) => ({ ...item, y: item.y + 1 })),
      ];

      setLayout(newLayout);
      setIconTypes((prevIconTypes) => ({
        ...prevIconTypes,
        [newKey]:
          currentType === "Bullet point" ||
          currentType === "Task" ||
          currentType === "Numbered list"
            ? currentType
            : "Paragraph",
      }));
      setNewRectKey(newKey);
      setTimeout(() => {
        if (newRectRef.current) {
          newRectRef.current.focus();
        }
      }, 0);
    } else if (
      event.key === "Backspace" &&
      event.currentTarget.textContent === ""
    ) {
      event.preventDefault();
      removeRectangle(key);
    }
  };

  const handleArrowNavigation = (
    key: string,
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    const index = layout.findIndex((item) => item.i === key);
    if (event.key === "ArrowUp" && index > 0) {
      event.preventDefault();
      const prevKey = layout[index - 1].i;
      setNewRectKey(prevKey);
      setTimeout(() => {
        const prevElement = document.querySelector(
          `[data-grid-id="${prevKey}"]`,
        );
        if (prevElement) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(prevElement);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    } else if (event.key === "ArrowDown" && index < layout.length - 1) {
      event.preventDefault();
      const nextKey = layout[index + 1].i;
      setNewRectKey(nextKey);
      setTimeout(() => {
        const nextElement = document.querySelector(
          `[data-grid-id="${nextKey}"]`,
        );
        if (nextElement) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(nextElement);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }, 0);
    }
  };

  const removeRectangle = (key: string) => {
    const newLayout = layout
      .filter((item) => item.i !== key)
      .map((item) => {
        if (item.y > layout.find((l) => l.i === key)!.y) {
          return { ...item, y: item.y - 1 };
        }
        return item;
      });

    setLayout(newLayout);

    if (newLayout.length === 0) {
      setLayout(defaultLayout);
      setNewRectKey("rect1");
    } else {
      const index = layout.findIndex((item) => item.i === key);
      if (index > 0) {
        const prevKey = layout[index - 1].i;
        setNewRectKey(prevKey);
        setTimeout(() => {
          const prevElement = document.querySelector(
            `[data-grid-id="${prevKey}"]`,
          );
          if (prevElement) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(prevElement);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      } else if (newLayout.length > 0) {
        setNewRectKey(newLayout[0].i);
      }
    }
  };

  const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (layout.length > 0) {
        const firstKey = layout[0].i;
        setNewRectKey(firstKey);
        setTimeout(() => {
          const firstElement = document.querySelector(
            `[data-grid-id="${firstKey}"]`,
          );
          if (firstElement) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(firstElement);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 0);
      }
    }
  };

  const restartCache = () => {
    localStorage.removeItem("notes");
    localStorage.removeItem("activeNoteId");
    const initialNote = {
      id: "note1",
      title: "",
      layout: defaultLayout,
      texts: {},
      iconTypes: {},
    };
    setNotes([initialNote]);
    setActiveNoteId("note1");
    setLayout(defaultLayout);
    setTitle("");
    setTexts({});
    setIconTypes({});
  };

  const handleMenuSelect = (
    key: string,
    option: string,
    fileData?: { data: string; filename: string },
  ) => {
    if (option === "Image" || option === "Attachment") {
      if (fileData) {
        const base64Size = fileData.data.length * 0.75;
        const fileSizeMB = (base64Size / (1024 * 1024)).toFixed(2);
        const newFileKey = `rect${Date.now()}`; // Create key here at the top level

        if (option === "Image") {
          const img = new Image();
          img.src = fileData.data;
          img.onload = () => {
            const maxWidth = 200;
            const scaledHeight =
              (img.height * Math.min(maxWidth, img.width)) / img.width;
            const gridHeight = Math.max(3, Math.ceil(scaledHeight / 20) + 1);

            setLayout((prevLayout) => {
              const currentIndex = prevLayout.findIndex(
                (item) => item.i === key,
              );
              const currentY = prevLayout[currentIndex].y;

              // Adjust all blocks at and after the current position
              const adjustedLayout = prevLayout.map((item) => {
                if (item.y < currentY) return item;
                return {
                  ...item,
                  y: item.y + gridHeight,
                };
              });

              return [
                ...adjustedLayout.slice(0, currentIndex),
                {
                  i: newFileKey,
                  x: 0,
                  y: currentY,
                  w: 12,
                  h: gridHeight,
                  type: option,
                  showIcons: true,
                },
                ...adjustedLayout.slice(currentIndex),
              ];
            });

            // Update texts and iconTypes with the new file data
            setTexts((prev) => ({
              ...prev,
              [newFileKey]: JSON.stringify({
                data: fileData.data,
                filename: fileData.filename,
                size: fileSizeMB,
                type: fileData.filename.split(".").pop()?.toLowerCase(),
                uploadDate: new Date().toISOString(),
              }),
            }));

            setIconTypes((prev) => ({
              ...prev,
              [newFileKey]: option,
            }));

            setTimeout(() => {
              if (!isSaving) {
                saveCurrentNote();
              }
            }, 100);
          };
        } else {
          // For non-image attachments
          const blockHeight = 2;

          setLayout((prevLayout) => {
            const currentIndex = prevLayout.findIndex((item) => item.i === key);
            const currentY = prevLayout[currentIndex].y;

            const adjustedLayout = prevLayout.map((item) => {
              if (item.y < currentY) return item;
              return {
                ...item,
                y: item.y + blockHeight,
              };
            });

            return [
              ...adjustedLayout.slice(0, currentIndex),
              {
                i: newFileKey,
                x: 0,
                y: currentY,
                w: 12,
                h: blockHeight,
                type: option,
                showIcons: true,
              },
              ...adjustedLayout.slice(currentIndex),
            ];
          });

          // Update texts and iconTypes with the new file data
          setTexts((prev) => ({
            ...prev,
            [newFileKey]: JSON.stringify({
              data: fileData.data,
              filename: fileData.filename,
              size: fileSizeMB,
              type: fileData.filename.split(".").pop()?.toLowerCase(),
              uploadDate: new Date().toISOString(),
            }),
          }));

          setIconTypes((prev) => ({
            ...prev,
            [newFileKey]: option,
          }));

          setTimeout(() => {
            if (!isSaving) {
              saveCurrentNote();
            }
          }, 100);
        }
      }
    } else if (option === "Divider") {
      const newDividerKey = `rect${Date.now()}`;
      const dividerHeight = 3; // Standard height for divider

      setLayout((prevLayout) => {
        const currentIndex = prevLayout.findIndex((item) => item.i === key);
        const currentY = prevLayout[currentIndex].y;

        // Adjust all blocks at and after the current position
        const adjustedLayout = prevLayout.map((item) => {
          if (item.y < currentY) return item;
          return {
            ...item,
            y: item.y + dividerHeight,
          };
        });

        return [
          ...adjustedLayout.slice(0, currentIndex),
          {
            i: newDividerKey,
            x: 0,
            y: currentY,
            w: 12,
            h: dividerHeight,
            type: "Divider",
            showIcons: true,
          },
          // Add a new paragraph block after the divider
          {
            i: `rect${Date.now() + 1}`,
            x: 0,
            y: currentY + dividerHeight,
            w: 12,
            h: 1,
            type: "Paragraph",
            showIcons: true,
          },
          ...adjustedLayout.slice(currentIndex),
        ];
      });

      // Set empty text for divider
      setTexts((prev) => ({
        ...prev,
        [newDividerKey]: "",
      }));

      setIconTypes((prev) => ({
        ...prev,
        [newDividerKey]: "Divider",
      }));

      setTimeout(() => {
        if (!isSaving) {
          saveCurrentNote();
        }
      }, 100);
    } else {
      // For all other types (Task, Bullet point, Numbered list, etc.)
      setIconTypes((prev) => ({
        ...prev,
        [key]: option,
      }));
      // Keep existing text
      setTexts((prev) => ({
        ...prev,
        [key]: prev[key] || "",
      }));
      // Update layout type if needed
      setLayout((prev) =>
        prev.map((item) => (item.i === key ? { ...item, type: option } : item)),
      );
    }
  };

  const handleNoteSelect = (noteId: string) => {
    saveCurrentNote(); // Save current note before switching
    setActiveNoteId(noteId);
    const selectedNote = notes.find((note) => note.id === noteId);
    if (selectedNote) {
      setLayout(selectedNote.layout || defaultLayout);
      setTitle(selectedNote.title || "");
      setTexts(selectedNote.texts || {});
      setIconTypes(selectedNote.iconTypes || {});
    }
  };

  const createNewNote = (folderId?: string) => {
    saveCurrentNote(); // Save current note before creating new one
    const newNoteId = `note${Date.now()}`; // Use timestamp for unique IDs
    const newNote = {
      id: newNoteId,
      title: "",
      layout: defaultLayout,
      texts: {},
      iconTypes: {},
      folderId,
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    setActiveNoteId(newNoteId);
    setLayout(defaultLayout);
    setTitle("");
    setTexts({});
    setIconTypes({});
  };

  const createNewFolder = () => {
    const newFolder = {
      id: uuidv4(),
      name: "New Folder",
      isExpanded: true,
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  const saveCurrentNote = async () => {
    setIsSaving(true);
    try {
      const updatedNotes = notes.map((note) =>
        note.id === activeNoteId
          ? { ...note, title, layout, texts, iconTypes }
          : note,
      );
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      localStorage.setItem("activeNoteId", activeNoteId);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [title, layout, texts, iconTypes]);

  const handleUpdateFolder = (folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, name: newName } : folder,
      ),
    );
  };

  const handleMoveNote = (noteId: string, folderId: string | null) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === noteId ? { ...note, folderId } : note)),
    );
  };

  const handleDeleteFolder = (folderId: string) => {
    // Move all notes from this folder to root
    setNotes((prev) =>
      prev.map((note) =>
        note.folderId === folderId ? { ...note, folderId: null } : note,
      ),
    );

    // Remove the folder
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
  };

  // Add new handler function
  const handleDeleteNote = (noteId: string) => {
    // If deleting active note, switch to another note
    if (noteId === activeNoteId) {
      const remainingNotes = notes.filter((note) => note.id !== noteId);
      if (remainingNotes.length > 0) {
        handleNoteSelect(remainingNotes[0].id);
      } else {
        // If no notes left, create a new one
        createNewNote();
      }
    }

    // Remove the note from the list
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
  };

  if (!isClient) {
    return <Skeleton />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950">
      <SideMenu
        notes={notes}
        folders={folders}
        activeNoteId={activeNoteId}
        onNoteSelect={handleNoteSelect}
        onNewNote={createNewNote}
        onNewFolder={createNewFolder}
        onUpdateFolder={handleUpdateFolder}
        onMoveNote={handleMoveNote}
        onDeleteFolder={handleDeleteFolder}
        onDeleteNote={handleDeleteNote}
      />
      <div className="flex size-full flex-col overflow-y-auto">
        <NoteHeader isSaving={isSaving} hasUnsavedChanges={hasUnsavedChanges} />
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
          <div className="mb-8">
            <Title
              text={title}
              placeholder="Add a title"
              setTitle={setTitle}
              handleKeyDown={handleTitleKeyDown}
            />
          </div>
          <NoteGrid
            layout={layout}
            handleKeyDown={handleKeyDown}
            handleArrowNavigation={handleArrowNavigation}
            newRectKey={newRectKey}
            newRectRef={newRectRef}
            setLayout={setLayout}
            texts={texts}
            setTexts={setTexts}
            iconTypes={iconTypes}
            handleMenuSelect={handleMenuSelect}
          />
        </main>
      </div>
    </div>
  );
}
