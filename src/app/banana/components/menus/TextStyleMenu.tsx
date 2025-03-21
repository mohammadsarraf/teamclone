import React, { useEffect, useState, useRef } from "react";
import { GridItem } from "../../types";
import { FiMinus, FiPlus } from "react-icons/fi";
import { createPortal } from "react-dom";

// Add timestamp to force refresh: ${Date.now()}
interface TextStyleMenuProps {
  item: GridItem;
  onUpdate: (updates: Partial<GridItem>) => void;
  onClose: () => void;
  position?: { top: number; left: number };
  className?: string; // Add className prop for positioning
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

// Dropdown component that uses a portal
const StyleDropdown = ({
  isOpen,
  onClose,
  styles,
  currentStyle,
  onSelect,
  buttonRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  styles: any[];
  currentStyle: string;
  onSelect: (style: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      className="h-fit w-40 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 10001,
      }}
    >
      {styles.map((style) => (
        <button
          key={style.id}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(style.id);
          }}
          className={`block w-full px-4 py-2 text-left text-black hover:bg-gray-100 ${currentStyle === style.id ? "bg-gray-100" : ""}`}
        >
          <div>{style.label}</div>
          <div className="mt-1 text-xs text-gray-500">
            {style.fontFamily ? `• ${style.fontFamily}` : ""}
          </div>
        </button>
      ))}
    </div>,
    document.body,
  );
};

const TextStyleMenu: React.FC<TextStyleMenuProps> = ({
  item,
  onUpdate,
  onClose,
  position,
  className = "", // Default to empty string
}) => {
  // Log when the component is rendered
  console.log("TextStyleMenu rendered with item:", item.i);

  // State for font size
  const [fontSize, setFontSize] = useState(item.fontSize || 16);

  // State to track if text is currently selected
  const [hasTextSelection, setHasTextSelection] = useState(false);

  // State to track if the text style dropdown is open
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);

  // Reference to the style dropdown button
  const styleButtonRef = useRef<HTMLButtonElement>(null);

  // Text style options with their corresponding font sizes
  const textStyles = [
    { id: "heading1", label: "Heading 1", fontSize: 32, fontWeight: 700 },
    { id: "heading2", label: "Heading 2", fontSize: 28, fontWeight: 700 },
    { id: "heading3", label: "Heading 3", fontSize: 24, fontWeight: 600 },
    { id: "heading4", label: "Heading 4", fontSize: 20, fontWeight: 600 },
    { id: "paragraph1", label: "Paragraph 1", fontSize: 18, fontWeight: 400 },
    { id: "paragraph2", label: "Paragraph 2", fontSize: 16, fontWeight: 400 },
    { id: "paragraph3", label: "Paragraph 3", fontSize: 14, fontWeight: 400 },
    { id: "monospace", label: "Monospace", fontSize: 16, fontWeight: 400 },
  ];

  // Check for text selection when the menu is open
  useEffect(() => {
    const checkForSelection = () => {
      const selection = window.getSelection();
      const hasSelection =
        selection &&
        selection.rangeCount > 0 &&
        selection.toString().length > 0;
      setHasTextSelection(!!hasSelection);
    };

    // Check initially
    checkForSelection();

    // Set up event listeners to check when selection changes
    document.addEventListener("selectionchange", checkForSelection);

    return () => {
      document.removeEventListener("selectionchange", checkForSelection);
    };
  }, []);

  // Handle text style change
  const handleTextStyleChange = (style: string) => {
    console.log("Changing text style to:", style);

    // Find the selected style to get its properties
    const selectedStyle = textStyles.find((s) => s.id === style);

    if (selectedStyle) {
      // Update multiple properties at once
      onUpdate({
        textStyle: style,
        fontSize: selectedStyle.fontSize,
        fontWeight: selectedStyle.fontWeight as any,
      });

      // Update the local font size state
      setFontSize(selectedStyle.fontSize);
    } else {
      onUpdate({ textStyle: style });
    }

    // Close the dropdown
    setIsStyleDropdownOpen(false);
  };

  // Apply formatting to selected text using document.execCommand
  const applyFormatToSelection = (command: string, value: string = "") => {
    // Check if there's a selection
    const selection = window.getSelection();
    if (
      !selection ||
      selection.rangeCount === 0 ||
      selection.toString().length === 0
    ) {
      console.log("No text selected for formatting");
      return false;
    }

    // Apply the command to the selected text
    document.execCommand(command, false, value);
    console.log(`Applied ${command} to selected text`);
    
    // CRITICAL: Force immediate content update to ensure formatting is saved
    // Find the contentEditable div inside the textbox
    const textboxElement = document.getElementById(item.i);
    if (textboxElement) {
      // Log to help debug section conflicts
      const isFooter = item.i.startsWith('footer-');
      console.log(`Found ${isFooter ? 'FOOTER' : 'CONTENT'} textbox element with ID: ${item.i}`);
      
      const contentElement = textboxElement.querySelector('[contenteditable]');
      if (contentElement) {
        // Get the updated HTML content with formatting
        const updatedContent = contentElement.innerHTML;

        // Force an update to the item's content in the layout
        onUpdate({ 
          content: updatedContent 
        });
        
        console.log(`Updated content after ${command} formatting:`, updatedContent.substring(0, 50) + (updatedContent.length > 50 ? '...' : ''));
      }
    } else {
      console.error(`Cannot find textbox element with ID: ${item.i}`);
    }
    
    return true;
  };

  // Handle font weight toggle (bold)
  const toggleBold = () => {
    if (applyFormatToSelection("bold")) {
      // The formatting was applied to the selection
      console.log("Applied bold formatting to selection");
      
      // Find the text element to get the complete updated content with bold tags
      const textboxElement = document.getElementById(item.i);
      if (textboxElement) {
        const isFooter = item.i.startsWith('footer-');
        console.log(`Checking bold format in ${isFooter ? 'FOOTER' : 'CONTENT'} textbox: ${item.i}`);
        
        const contentElement = textboxElement.querySelector('[contenteditable]');
        if (contentElement) {
          // The updated HTML content including <b> or <strong> tags
          const formattedContent = contentElement.innerHTML;
          console.log("Bold formatted content:", formattedContent.substring(0, 50) + (formattedContent.length > 50 ? '...' : ''));
        }
      }
    } else {
      // No text selected, do nothing
      console.log("No text selected for bold formatting");
    }
  };

  // Handle font style toggle (italic)
  const toggleItalic = () => {
    if (applyFormatToSelection("italic")) {
      // The formatting was applied to the selection
      console.log("Applied italic formatting to selection");
      
      // Find the text element to get the complete updated content with italic tags
      const textboxElement = document.getElementById(item.i);
      if (textboxElement) {
        const isFooter = item.i.startsWith('footer-');
        console.log(`Checking italic format in ${isFooter ? 'FOOTER' : 'CONTENT'} textbox: ${item.i}`);
        
        const contentElement = textboxElement.querySelector('[contenteditable]');
        if (contentElement) {
          // The updated HTML content including <i> or <em> tags
          const formattedContent = contentElement.innerHTML;
          console.log("Italic formatted content:", formattedContent.substring(0, 50) + (formattedContent.length > 50 ? '...' : ''));
        }
      }
    } else {
      // No text selected, do nothing
      console.log("No text selected for italic formatting");
    }
  };

  // Handle text alignment
  const setTextAlign = (align: "left" | "center" | "right" | "justify") => {
    console.log("Setting text alignment to:", align);
    onUpdate({ textAlign: align });
  };

  // Handle text decoration (underline)
  const toggleTextDecoration = (
    decoration: "underline" | "line-through" | "none",
  ) => {
    if (decoration === "underline" && applyFormatToSelection("underline")) {
      // The formatting was applied to the selection
      console.log("Applied underline formatting to selection");
    } else if (
      decoration === "line-through" &&
      applyFormatToSelection("strikeThrough")
    ) {
      // The formatting was applied to the selection
      console.log("Applied strikethrough formatting to selection");
    } else {
      // No text selected, do nothing
      console.log("No text selected for text decoration");
    }
  };

  // Color options
  const colorOptions = [
    { color: "#000000", label: "Black" },
    { color: "#FFFFFF", label: "White" },
    { color: "#4B5563", label: "Gray" },
    { color: "#EF4444", label: "Red" },
    { color: "#F59E0B", label: "Orange" },
    { color: "#10B981", label: "Green" },
    { color: "#3B82F6", label: "Blue" },
    { color: "#8B5CF6", label: "Purple" },
    { color: "#EC4899", label: "Pink" },
  ];

  // Handle text color change
  const setTextColor = (color: string) => {
    if (applyFormatToSelection("foreColor", color)) {
      // The color was applied to the selection
      console.log("Applied color formatting to selection:", color);
    } else {
      // No text selected, apply to the entire textbox as this is a common expectation
      console.log(
        "No selection, setting text color for entire textbox to:",
        color,
      );
      onUpdate({ textColor: color });
    }
  };

  // Handle font size change
  const handleFontSizeChange = (newSize: number) => {
    // Update the font size
    onUpdate({ fontSize: newSize });

    // Reset the text style if the font size doesn't match the selected style
    const currentStyle = textStyles.find(
      (style) => style.id === item.textStyle,
    );
    if (currentStyle && currentStyle.fontSize !== newSize) {
      onUpdate({ textStyle: "" });
    }
  };

  // Increase font size
  const increaseFontSize = () => {
    const newSize = Math.min((item.fontSize || 16) + 2, 48);
    handleFontSizeChange(newSize);
  };

  // Decrease font size
  const decreaseFontSize = () => {
    const newSize = Math.max((item.fontSize || 16) - 2, 8);
    handleFontSizeChange(newSize);
  };

  // Prevent clicks inside the menu from bubbling up to the container
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Close menu when Escape key is pressed or clicking outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsStyleDropdownOpen(false);
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      // Debug log
      console.log("Click detected, dropdown state:", isStyleDropdownOpen);

      // Don't do anything if the dropdown is not open
      if (!isStyleDropdownOpen) return;

      // Get references to our elements
      const dropdownButton = document.querySelector(
        ".text-style-dropdown-button",
      );
      const dropdownMenu = document.querySelector(".text-style-dropdown-menu");

      // Check if the click was outside both elements
      const clickedOutside = !(
        (dropdownButton && dropdownButton.contains(e.target as Node)) ||
        (dropdownMenu && dropdownMenu.contains(e.target as Node))
      );

      console.log("Clicked outside:", clickedOutside);

      // Only close if clicked outside
      if (clickedOutside) {
        console.log("Closing dropdown due to outside click");
        setIsStyleDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isStyleDropdownOpen]);

  // Get current text style label
  const getCurrentStyleLabel = () => {
    const style = textStyles.find((s) => s.id === item.textStyle);
    return style ? style.label : "Paragraph 1";
  };

  return (
    <div
      className={`text-style-menu overflow-x-auto rounded-md border border-gray-200 bg-white shadow-md ${className}`}
      onClick={handleMenuClick}
      style={{
        zIndex: 9999,
        position: "relative", // Ensure proper stacking context
      }}
    >
      <div className="flex h-10 items-center gap-0.5 px-1.5">
        {/* Text Style Dropdown */}
        <div className="relative ">
          <button
            ref={styleButtonRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log(
                "Style dropdown button clicked, current state:",
                isStyleDropdownOpen,
              );
              setIsStyleDropdownOpen(!isStyleDropdownOpen);
              console.log(
                "Style dropdown state after click:",
                !isStyleDropdownOpen,
              );
            }}
            className="flex items-center space-x-1 rounded px-2 py-1 text-black hover:bg-gray-100"
            title="Text Style"
          >
            <span className="w-20 truncate text-sm">
              {item.textStyle
                ? textStyles.find((style) => style.id === item.textStyle)
                    ?.label || "Style"
                : "Style"}
            </span>
            <svg
              className={`size-4 transition-transform ${isStyleDropdownOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Portal-based dropdown */}
          <StyleDropdown
            isOpen={isStyleDropdownOpen}
            onClose={() => setIsStyleDropdownOpen(false)}
            styles={textStyles}
            currentStyle={item.textStyle || ""}
            onSelect={handleTextStyleChange}
            buttonRef={styleButtonRef}
          />
        </div>

        <div className="mx-1 h-4 w-px bg-gray-200"></div>

        {/* Text formatting buttons */}
        <button
          onClick={toggleBold}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${!hasTextSelection ? "cursor-not-allowed opacity-50" : ""} ${item.fontWeight === "bold" ? "text-gray-700" : ""}`}
          title={hasTextSelection ? "Bold" : "Select text first"}
          disabled={!hasTextSelection}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12h8a4 4 0 0 0 0-8H6v8zm0 0v8h9a4 4 0 0 0 0-8H6z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={toggleItalic}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${!hasTextSelection ? "cursor-not-allowed opacity-50" : ""} ${item.fontStyle === "italic" ? "bg-gray-100" : ""}`}
          title={hasTextSelection ? "Italic" : "Select text first"}
          disabled={!hasTextSelection}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 4h-9M14 20H5M15 4L9 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Font Size Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={decreaseFontSize}
            className="rounded p-1 text-black hover:bg-gray-100"
            title="Decrease font size"
          >
            <FiMinus size={16} />
          </button>
          <div className="w-10 text-center text-black">
            {item.fontSize || 16}
          </div>
          <button
            onClick={increaseFontSize}
            className="rounded p-1 text-black hover:bg-gray-100"
            title="Increase font size"
          >
            <FiPlus size={16} />
          </button>
        </div>

        <div className="mx-1 h-4 w-px bg-gray-200"></div>

        {/* Color picker dropdown */}
        <div className="group relative">
          <button
            className="flex items-center rounded p-1.5 text-black hover:bg-gray-100"
            title="Text Color"
          >
            <div
              className="size-4 rounded-sm border border-gray-300"
              style={{ backgroundColor: item.textColor || "#000000" }}
            ></div>
          </button>
          <div className="absolute left-0 top-full z-10 mt-1 hidden rounded-md border border-gray-200 bg-white p-2 shadow-lg group-hover:block">
            <div className="grid grid-cols-3 gap-1">
              {[
                "#000000",
                "#FFFFFF",
                "#4B5563",
                "#EF4444",
                "#F59E0B",
                "#10B981",
                "#3B82F6",
                "#8B5CF6",
                "#EC4899",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setTextColor(color)}
                  className={`size-6 rounded-full border text-black ${item.textColor === color ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
                  style={{
                    backgroundColor: color,
                    borderColor: color === "#FFFFFF" ? "#E5E7EB" : color,
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => toggleTextDecoration("underline")}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${!hasTextSelection ? "cursor-not-allowed opacity-50" : ""} ${item.textDecoration === "underline" ? "bg-gray-100" : ""}`}
          title={hasTextSelection ? "Underline" : "Select text first"}
          disabled={!hasTextSelection}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 3v7a6 6 0 0 0 12 0V3M4 21h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => {}}
          className="rounded p-1.5 text-black hover:bg-gray-100"
          title="Link"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200"></div>

        {/* Alignment buttons */}
        <button
          onClick={() => setTextAlign("left")}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${!item.textAlign || item.textAlign === "left" ? "bg-gray-100" : ""}`}
          title="Align Left"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M4 12h10M4 18h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => setTextAlign("center")}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${item.textAlign === "center" ? "bg-gray-100" : ""}`}
          title="Align Center"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M7 12h10M6 18h12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => setTextAlign("right")}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${item.textAlign === "right" ? "bg-gray-100" : ""}`}
          title="Align Right"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M10 12h10M6 18h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => setTextAlign("justify")}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${item.textAlign === "justify" ? "bg-gray-100" : ""}`}
          title="Justify"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200"></div>

        {/* List buttons */}
        <button
          onClick={() => {}}
          className="rounded p-1.5 text-black hover:bg-gray-100"
          title="Bullet List"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 6h12M8 12h12M8 18h12M3 6h.01M3 12h.01M3 18h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => {}}
          className="rounded p-1.5 text-black hover:bg-gray-100"
          title="Numbered List"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 6h12M8 12h12M8 18h12M3 6h1v4M3 12h2l-2 4h2M3 18h1.5l1-2v4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="mx-1 h-4 w-px bg-gray-200"></div>

        {/* Additional buttons */}
        <button
          onClick={() => {}}
          className="rounded p-1.5 text-black hover:bg-gray-100"
          title="Split"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3v18M3 12h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => toggleTextDecoration("line-through")}
          className={`rounded p-1.5 text-black hover:bg-gray-100 ${!hasTextSelection ? "cursor-not-allowed opacity-50" : ""} ${item.textDecoration === "line-through" ? "bg-gray-100" : ""}`}
          title={hasTextSelection ? "Strikethrough" : "Select text first"}
          disabled={!hasTextSelection}
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12h16M17.5 8.5C17.5 6.5 15 6 12 6s-5.5.5-5.5 2.5c0 1.5 2 2 3 2.5m8 0c1 .5 3 1 3 2.5 0 2-2.5 2.5-5.5 2.5s-5.5-.5-5.5-2.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={onClose}
          className="rounded p-1.5 text-red-500 hover:bg-gray-100"
          title="Close"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TextStyleMenu;
