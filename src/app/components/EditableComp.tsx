import React, { useState, useEffect, useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import Toolbar from "../components/Toolbar";

interface EditableCompProps {
  html: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onClick: (event: MouseEvent) => void;
  dataField: string;
  className: string;
  ariaLabel: string;
  placeholder: string;
  fontSize: string;
  fontColor: string;
  fontAlignment: string;
  widthSize: string;
  lengthSize: string;
}

const EditableComp: React.FC<EditableCompProps> = ({
  html,
  onChange,
  onClick,
  dataField,
  className,
  widthSize,
  lengthSize,
  ariaLabel,
  placeholder,
  fontSize,
  fontColor,
  fontAlignment,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentFontColor, setCurrentFontColor] = useState(fontColor);
  const [currentFontAlignment, setCurrentFontAlignment] = useState(fontAlignment);
  const [currentWidth, setCurrentWidth] = useState(widthSize);
  const [currentLength, setCurrentLength] = useState(lengthSize);
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

  return (
    <div>
      {isClicked && (
        <div ref={toolbarRef} className="mb-40 flex">
          <Toolbar
            onSizeClick={(size) => {
              setCurrentFontSize(size);
            }}
            onColorClick={(color) => {
              setCurrentFontColor(color);
            }}
            onJustifyClick={(alignment) => {
              setCurrentFontAlignment(alignment);
            }}
            onWidthChange={(newWidth) => {
              console.log(newWidth);
              setCurrentWidth(newWidth);
            }}
            onLengthChange={(newLength) => {
              console.log(newLength);
              setCurrentLength(newLength);
            }}
          />
        </div>
      )}
      <div ref={editableCompRef}>
        <ContentEditable
          html={html}
          onChange={handleChange}
          onClick={() => setIsClicked(!isClicked)}
          data-field={dataField}
          tagName="p"
          className={`${className} ${currentFontSize} ${currentFontColor} ${currentFontAlignment}`}
          aria-label={ariaLabel}
          style={{
            lineHeight: 1.5,
            width: `${currentWidth}rem`,
            height: `${currentLength}rem`,
          }}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default EditableComp;
