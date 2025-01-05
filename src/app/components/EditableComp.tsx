import React from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

interface EditableCompProps {
  html: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onClick: (event: MouseEvent) => void;
  dataField: string;
  className: string;
  ariaLabel: string;
  placeholder: string;
  fontSize: string; // Added prop
  fontColor: string; // Added prop
  fontAlignment: string; // Added prop
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
  fontSize, // Added prop
  fontColor, // Added prop
  fontAlignment, // Added prop
}) => {
  const handleChange = (evt: ContentEditableEvent) => {
    onChange(evt.target.value);
  };

  return (
    <ContentEditable
      html={html}
      onChange={handleChange}
      onClick={onClick}
      data-field={dataField}
      tagName="p"
      className={`${className} ${fontSize} ${fontColor} ${fontAlignment}`} // Applied props
      aria-label={ariaLabel}
      style={{ lineHeight: 1.5, width: `${widthSize}rem`, height: `${lengthSize}rem` }}
      placeholder={placeholder}
    />
  );
};

export default EditableComp;
