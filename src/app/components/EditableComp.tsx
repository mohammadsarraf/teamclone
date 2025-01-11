import React, { useState, useEffect, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import Toolbar from "../components/Toolbar";

interface EditableCompProps {
  html: string;
  onChange: (newTitle: string) => void;
  className: string;
  ariaLabel: string;
  placeholder: string;
  fontSize: string;
  fontColor: string;
  fontAlignment: string;
  widthSize: string;
  lengthSize: string;
  updateProperty: (property: string, value: string) => void;
  edit: boolean;
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
  edit,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editableCompRef = useRef<HTMLDivElement>(null);
  const [formatClass, setFormatClass] = useState<string>("");

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

  const applyFormat = (format: string) => {
    let newFormatClass = "";
    switch (format) {
      case "bold":
        newFormatClass = "font-bold";
        break;
      case "underline":
        newFormatClass = "underline";
        break;
      case "italic":
        newFormatClass = "italic";
        break;
      default:
        newFormatClass = "";
    }
    setFormatClass(newFormatClass);
  };

  return (
    <div>
      {edit ? (
        <div style={{ position: "relative" }}>
          {isClicked && (
            <div
              ref={toolbarRef}
              className="flex"
              style={{
                position: "absolute",
                top: "-40px",
                left: "0",
                zIndex: 20,
              }}
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
                initialWidth={widthSize}
                initialLength={lengthSize}
                onFormatClick={(format) => {
                  console.log(`Format changed to: ${format}`);
                  applyFormat(format);
                }}
              />
            </div>
          )}
          <div ref={editableCompRef}>
            <ContentEditable
              html={html}
              onChange={handleChange}
              onClick={handleClick}
              tagName="p"
              className={`${className} ${fontSize} ${fontColor} ${fontAlignment} ${formatClass}`}
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
      ) : (
        <p
          className={`${className} ${fontSize} ${fontColor} ${fontAlignment} ${formatClass}`}
        >
          {html}
        </p>
      )}
    </div>
  );
};

export default EditableComp;
