import React, { useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import Toolbar from "./Toolbar";

interface EditableCompProps {
  html: string;
  onChange: (value: string) => void;
  onClick: (event: React.MouseEvent) => void;
  dataField: string;
  className: string;
  ariaLabel: string;
  placeholder: string;
  style: React.CSSProperties;
  showToolbar: boolean;
  toolbarPosition: { top: number; left: number };
  onCloseToolbar?: () => void;
  onBoldClick?: () => void;
  onItalicClick?: () => void;
  onH1Click?: () => void;
  onH2Click?: () => void;
  onH3Click?: () => void;
  onH4Click?: () => void;
  onH5Click?: () => void;
  onH6Click?: () => void;
  onJustifyClick?: (option: string) => void;
  onColorChange?: (color: string) => void;
  onTextSizeChange?: (size: string) => void;
}

const EditableComp: React.FC<EditableCompProps> = ({
  html,
  onChange,
  onClick,
  dataField,
  className,
  ariaLabel,
  placeholder,
  style,
  showToolbar,
  toolbarPosition,
  onCloseToolbar = () => document.execCommand("undo"),
  onBoldClick = () => document.execCommand("bold"),
  onItalicClick = () => document.execCommand("italic"),
  onH1Click = () => document.execCommand("formatBlock", false, "h1"),
  onH2Click = () => document.execCommand("formatBlock", false, "h2"),
  onH3Click = () => document.execCommand("formatBlock", false, "h3"),
  onH4Click = () => document.execCommand("formatBlock", false, "h4"),
  onH5Click = () => document.execCommand("formatBlock", false, "h5"),
  onH6Click = () => document.execCommand("formatBlock", false, "h6"),
  onJustifyClick = (option: string) => {
    switch (option) {
      case "left":
        document.execCommand("justifyLeft");
        break;
      case "center":
        document.execCommand("justifyCenter");
        break;
      case "right":
        document.execCommand("justifyRight");
        break;
      case "justify":
        document.execCommand("justifyFull");
        break;
      default:
        break;
    }
  },
  onColorChange = (color: string) =>
    document.execCommand("foreColor", false, color),
  onTextSizeChange = (size: string) => document.execCommand("fontSize", false, size),
}) => {
  const contentEditableRef = useRef<HTMLElement>(null);

  const handleChange = (evt: ContentEditableEvent) => {
    onChange(evt.target.value);
  };

  const handleToolbarAction = (action: () => void) => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
    action();
  };

  return (
    <>
      <ContentEditable
        innerRef={contentEditableRef}
        html={html}
        onChange={handleChange}
        onClick={onClick}
        data-field={dataField}
        tagName="p"
        className={className} // Ensure className is applied
        aria-label={ariaLabel}
        style={{ ...style, lineHeight: 1.5 }}
        placeholder={placeholder}
      />
      {showToolbar && (
        <Toolbar
          position={toolbarPosition}
          onClose={onCloseToolbar}
          onH1Click={() => handleToolbarAction(onH1Click)}
          onH2Click={() => handleToolbarAction(onH2Click)}
          onH3Click={() => handleToolbarAction(onH3Click)}
          onH4Click={() => handleToolbarAction(onH4Click)}
          onH5Click={() => handleToolbarAction(onH5Click)}
          onH6Click={() => handleToolbarAction(onH6Click)}
          onJustifyClick={(option: string) =>
            handleToolbarAction(() => onJustifyClick(option))
          }
          onColorChange={(color: string) =>
            handleToolbarAction(() => onColorChange(color))
          }
          onTextSizeChange={(size: string) =>
            handleToolbarAction(() => onTextSizeChange(size))
          }
        />
      )}
    </>
  );
};

export default EditableComp;
