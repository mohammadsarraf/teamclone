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
}

const EditableComp: React.FC<EditableCompProps> = ({
  html,
  onChange,
  onClick,
  dataField,
  className,
  ariaLabel,
  placeholder,
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
      className={className}
      aria-label={ariaLabel}
      style={{ lineHeight: 1.5 }}
      placeholder={placeholder}
    />
  );
};

export default EditableComp;
