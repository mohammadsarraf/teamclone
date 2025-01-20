"use client";
import React, { useState, useRef, useEffect, RefObject } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import NoteGrid from "./NoteGrid";
import NoteHeader from "./NoteHeader";
import "@fontsource/playfair-display"; // Defaults to weight 400
import "@fontsource/playfair-display/700.css"; // For weight 700
import Title from "./components/Title";
import Skeleton from "./components/Skeleton";
import SideMenu from './components/SideMenu';

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
  const [notes, setNotes] = useState<Array<{
    id: string;
    title: string;
    layout: Layout[];
    texts: Texts;
    iconTypes: { [key: string]: string };
  }>>([]);
  const [activeNoteId, setActiveNoteId] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    const savedNotes = localStorage.getItem("notes");
    const savedActiveNoteId = localStorage.getItem("activeNoteId");

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
          setTitle(activeNote.title || '');
          setTexts(activeNote.texts || {});
          setIconTypes(activeNote.iconTypes || {});
        }
      }
    } else {
      // Initialize with a default note
      const initialNote = {
        id: 'note1',
        title: '',
        layout: defaultLayout,
        texts: {},
        iconTypes: {}
      };
      setNotes([initialNote]);
      setActiveNoteId('note1');
      setLayout(defaultLayout);
    }
  }, []);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (activeNoteId && notes.length > 0) {
        saveCurrentNote();
      }
    }, 1000); // Debounce save for 1 second

    return () => clearTimeout(autoSave);
  }, [title, layout, texts, iconTypes]);

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
      const newKey = `rect${layout.length + 1}`;
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
            currentType === "Bullet point" || currentType === "Task"
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
          currentType === "Bullet point" || currentType === "Task"
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
      id: 'note1',
      title: '',
      layout: defaultLayout,
      texts: {},
      iconTypes: {}
    };
    setNotes([initialNote]);
    setActiveNoteId('note1');
    setLayout(defaultLayout);
    setTitle('');
    setTexts({});
    setIconTypes({});
  };

  const handleMenuSelect = (key: string, option: string) => {
    setTexts((prevTexts) => ({
      ...prevTexts,
      [key]: prevTexts[key],
    }));
    setLayout((prevLayout) =>
      prevLayout.map((item) =>
        item.i === key ? { ...item, type: option } : item,
      ),
    );
    setIconTypes((prevIconTypes) => ({
      ...prevIconTypes,
      [key]: option,
    }));
  };

  const handleNoteSelect = (noteId: string) => {
    saveCurrentNote(); // Save current note before switching
    setActiveNoteId(noteId);
    const selectedNote = notes.find(note => note.id === noteId);
    if (selectedNote) {
      setLayout(selectedNote.layout || defaultLayout);
      setTitle(selectedNote.title || '');
      setTexts(selectedNote.texts || {});
      setIconTypes(selectedNote.iconTypes || {});
    }
  };

  const createNewNote = () => {
    saveCurrentNote(); // Save current note before creating new one
    const newNoteId = `note${Date.now()}`; // Use timestamp for unique IDs
    const newNote = {
      id: newNoteId,
      title: '',
      layout: defaultLayout,
      texts: {},
      iconTypes: {}
    };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    setActiveNoteId(newNoteId);
    setLayout(defaultLayout);
    setTitle('');
    setTexts({});
    setIconTypes({});
  };

  const saveCurrentNote = () => {
    const updatedNotes = notes.map(note => 
      note.id === activeNoteId
        ? { ...note, title, layout, texts, iconTypes }
        : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    localStorage.setItem("activeNoteId", activeNoteId);
  };

  if (!isClient) {
    return <Skeleton />;
  }

  return (
    <div className="flex h-screen w-screen overflow-x-hidden bg-black font-serif">
      <SideMenu
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteSelect={handleNoteSelect}
        onNewNote={createNewNote}
      />
      <div className="flex-1">
        <div>
          <NoteHeader />
          <button
            onClick={restartCache}
            className="m-4 rounded bg-red-500 p-2 text-white"
          >
            Restart Cache
          </button>
          <div className="mx-72 w-3/5 flex-1 pl-4 pt-4">
            <div className="mb-10">
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
              handleArrowNavigation={handleArrowNavigation} // Pass the handleArrowNavigation function
              newRectKey={newRectKey}
              newRectRef={newRectRef}
              setLayout={setLayout} // Pass the setLayout function
              texts={texts} // Pass the texts state
              setTexts={setTexts} // Pass the setTexts function
              iconTypes={iconTypes} // Pass the iconTypes state
              handleMenuSelect={handleMenuSelect} // Pass the handleMenuSelect function
            />
          </div>
        </div>
      </div>
    </div>
  );
}
