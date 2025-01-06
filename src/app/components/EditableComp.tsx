import React, { useState, useEffect, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import Toolbar from "../components/Toolbar";

interface EditableCompProps {
  html: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  className: string;
  ariaLabel: string;
  placeholder: string;
  fontSize: string;
  fontColor: string;
  fontAlignment: string;
  widthSize: string;
  lengthSize: string;
  updateProperty: (property: string, value: string) => void;
  initialWidth: string; // Add this line
  initialLength: string; // Add this line
}

const EditableComp: React.FC<EditableCompProps> = ({
  html,
  onChange,
  className,
  fontSize,
  fontColor,
  fontAlignment,
  widthSize,
  lengthSize,
  updateProperty,
  ariaLabel,
  placeholder,
  initialWidth, // Add this line
  initialLength, // Add this line
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editableCompRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node) &&
        editableCompRef.current &&
        !editableCompRef.current.contains(event.target as Node)
      ) {
        setIsClicked(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (evt: ContentEditableEvent) => {
    onChange(evt.target.value);
  };

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <div style={{ position: "relative" }}>
      {isClicked && (
        <div
          ref={toolbarRef}
          className="flex"
          style={{ position: "absolute", top: "-40px", left: "0", zIndex: 20 }}
        >
          <Toolbar
            onClose={() => setIsClicked(false)}
            onSizeClick={(size) => {
              console.log(`Font size changed to: ${size}`);
              updateProperty("fontSize", size);
            }}
            onColorClick={(color) => {
              console.log(`Font color changed to: ${color}`);
              updateProperty("fontColor", color);
            }}
            onJustifyClick={(alignment) => {
              console.log(`Font alignment changed to: ${alignment}`);
              updateProperty("fontAlignment", alignment);
            }}
            onWidthChange={(newWidth) => {
              console.log(`Width changed to: ${newWidth}rem`);
              updateProperty("widthSize", newWidth);
            }}
            onLengthChange={(newLength) => {
              console.log(`Length changed to: ${newLength}rem`);
              updateProperty("lengthSize", newLength);
            }}
            initialWidth={initialWidth} // Add this line
            initialLength={initialLength} // Add this line
          />
        </div>
      )}
      <div ref={editableCompRef}>
        <ContentEditable
          html={html}
          onChange={handleChange}
          onClick={handleClick}
          tagName="p"
          className={`${className} ${fontSize} ${fontColor} ${fontAlignment}`}
          aria-label={ariaLabel}
          style={{
            lineHeight: 1.5,
            width: `${widthSize}rem`,
            height: `${lengthSize}rem`,
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default EditableComp;
