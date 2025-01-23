import { Layout } from "react-grid-layout";

interface Texts {
  [key: string]: string;
}

export interface Note {
  id: string;
  title: string;
  // Add other required properties
}

export const handleTextChange = (
  key: string,
  event: React.ChangeEvent<HTMLTextAreaElement>,
  texts: Texts,
  setTexts: React.Dispatch<React.SetStateAction<Texts>>,
  layout: Layout[],
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>,
) => {
  setTexts({
    ...texts,
    [key]: event.target.value,
  });
  event.target.style.height = "auto";
  event.target.style.height = `${event.target.scrollHeight}px`;

  const newLayout = layout.map((item) => {
    if (item.i === key) {
      return { ...item, h: Math.ceil(event.target.scrollHeight / 30) };
    }
    return item;
  });
  setLayout(newLayout);
};

export const handleKeyDown = (
  key: string,
  event: React.KeyboardEvent<HTMLTextAreaElement>,
  texts: Texts,
  setTexts: React.Dispatch<React.SetStateAction<Texts>>,
  layout: Layout[],
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>,
  setNewRectKey: React.Dispatch<React.SetStateAction<string | null>>,
  removeRectangle: (key: string) => void,
) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const newKey = `rect${Object.keys(texts).length + 1}`;
    const index = layout.findIndex((item) => item.i === key);

    const newLayout = [
      ...layout.slice(0, index + 1),
      { i: newKey, x: 0, y: layout[index].y + 1, w: 12, h: 1 },
      ...layout.slice(index + 1).map((item) => ({ ...item, y: item.y + 1 })),
    ];

    setTexts({
      ...texts,
      [newKey]: ``,
    });
    setLayout(newLayout);
    setNewRectKey(newKey);
  } else if (event.key === "Backspace" && texts[key] === "") {
    event.preventDefault();
    removeRectangle(key);
  }
};

export const addRectangle = (
  texts: Texts,
  setTexts: React.Dispatch<React.SetStateAction<Texts>>,
  layout: Layout[],
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>,
  setNewRectKey: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const newKey = `rect${Object.keys(texts).length + 1}`;
  setTexts({
    ...texts,
    [newKey]: ``,
  });
  setLayout([...layout, { i: newKey, x: 0, y: layout.length, w: 12, h: 1 }]);
  setNewRectKey(newKey);
};

export const removeRectangle = (
  key: string,
  texts: Texts,
  setTexts: React.Dispatch<React.SetStateAction<Texts>>,
  layout: Layout[],
  setLayout: React.Dispatch<React.SetStateAction<Layout[]>>,
  setNewRectKey: React.Dispatch<React.SetStateAction<string | null>>,
  defaultTexts: Texts,
  defaultLayout: Layout[],
) => {
  const newTexts = { ...texts };
  delete newTexts[key];

  const newLayout = layout
    .filter((item) => item.i !== key)
    .map((item) => {
      if (item.y > layout.find((l) => l.i === key)!.y) {
        return { ...item, y: item.y - 1 };
      }
      return item;
    });

  setTexts(newTexts);
  setLayout(newLayout);

  if (newLayout.length === 0) {
    setTexts(defaultTexts);
    setLayout(defaultLayout);
    setNewRectKey("rect1");
  } else {
    const index = layout.findIndex((item) => item.i === key);
    if (index > 0) {
      setNewRectKey(layout[index - 1].i);
    } else if (newLayout.length > 0) {
      setNewRectKey(newLayout[0].i);
    }
  }
};
