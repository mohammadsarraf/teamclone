const updateClassName = (prev: string, newSize: string) => {
  const classes = prev.split(" ");
  const sizeClass = classes.find(
    (cls) => cls.startsWith("text-") && cls.includes("xl"),
  );
  if (sizeClass) {
    return prev.replace(sizeClass, newSize);
  }
  return `${prev} ${newSize}`;
};

export const updateColorClassName = (prev: string, newColor: string) => {
  const classes = prev.split(" ");
  const colorClass = classes.find(
    (cls) => cls.startsWith("text-") && !cls.includes("xl"),
  );
  if (colorClass) {
    return prev.replace(colorClass, newColor);
  }
  return `${prev} ${newColor}`;
};

export const getAlignmentClass = (alignment: string) => {
  switch (alignment) {
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    case "justify":
      return "text-justify";
    default:
      return "";
  }
};

type SetClassName = React.Dispatch<React.SetStateAction<string>>;

export const handleJustifyClick = (
  option: string,
  activeField: string,
  setAlignments: {
    [key: string]: React.Dispatch<React.SetStateAction<string>>;
  },
) => {
  const setter = setAlignments[activeField];
  if (setter) {
    setter(option);
  }
};

export const handleColorChange = (
  color: string,
  activeField: string,
  setClassNames: { [key: string]: SetClassName },
) => {
  const setter = setClassNames[activeField];
  if (setter) {
    setter((prev) => updateColorClassName(prev, color));
  }
};

export const handleHClick = (
  activeField: string,
  setClassNames: { [key: string]: SetClassName },
  newSize: string,
) => {
  const setter = setClassNames[activeField];
  if (setter) {
    setter((prev) => updateClassName(prev, newSize));
  }
};
