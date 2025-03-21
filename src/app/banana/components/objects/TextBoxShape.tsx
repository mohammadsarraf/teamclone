import React, { useRef, useEffect } from "react";
import ShapeBase, {
  ShapeProps,
  getBaseStyles,
  GroupIndicator,
} from "./ShapeBase";
import { GridItem } from "../../types";

interface TextBoxProps extends ShapeProps {
  handleContentChange: (itemId: string, newContent: string) => void;
  textboxContentRef: React.MutableRefObject<{ [key: string]: string }>;
  isTextStyleMenuOpen?: boolean;
}

export default function TextBoxShape({
  item,
  isBeingDragged,
  isFocused,
  isHovered,
  shadowClasses,
  handleContentChange,
  textboxContentRef,
  isTextStyleMenuOpen = false,
}: TextBoxProps) {
  const baseStyles = getBaseStyles(item);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get text style classes based on the textStyle property
  const getTextStyleClasses = () => {
    switch (item.textStyle) {
      case "heading-1":
        return "text-3xl font-bold";
      case "heading-2":
        return "text-2xl font-semibold";
      case "heading-3":
        return "text-xl font-medium";
      case "paragraph-2":
        return "text-base";
      case "paragraph-1":
      default:
        return "text-sm";
    }
  };

  // Apply custom styles from the item properties
  const getCustomStyles = () => {
    return {
      display: "block", // Override flex display for proper text alignment
      textAlign: item.textAlign || "left",
      fontWeight: item.fontWeight || "normal",
      fontStyle: item.fontStyle || "normal",
      textDecoration: item.textDecoration || "none",
      lineHeight: item.lineHeight ? `${item.lineHeight}` : "normal",
      letterSpacing: item.letterSpacing ? `${item.letterSpacing}px` : "normal",
      fontFamily: item.fontFamily || "inherit",
      fontSize: item.fontSize ? `${item.fontSize}px` : "inherit",
      color: item.textColor || "inherit",
      cursor: isTextStyleMenuOpen ? "text" : "inherit", // Change cursor to text when TextStyleMenu is open
    };
  };

  // Use useEffect to apply content whenever item.content changes
  useEffect(() => {
    // Always apply content to ensure formatting is preserved
    if (contentRef.current) {
      // IMPORTANT: Always set the innerHTML to apply the formatted content
      // This ensures bold, italic, and other HTML formatting tags are displayed
      contentRef.current.innerHTML = item.content || "";

      // Log for debugging
      if (item.content && item.content.includes("<")) {
        // Log with ID to help identify footer vs content textboxes
        const isFooter = item.i.startsWith("footer-");
        console.log(
          `Applied formatted HTML to ${isFooter ? "FOOTER" : "CONTENT"} textbox ${item.i}:`,
          item.content.substring(0, 50) +
            (item.content.length > 50 ? "..." : ""),
        );
      }

      // Track the content in the ref
      textboxContentRef.current[item.i] = item.content || "";
    }
  }, [item.i, item.content]);

  // Additional useEffect to handle reapplication of content on focus changes
  useEffect(() => {
    // When an item becomes focused, ensure its formatted content is correctly displayed
    if (isFocused && contentRef.current && item.content) {
      // Force reapplication of HTML content to fix any display issues
      contentRef.current.innerHTML = item.content;
      console.log(`Reapplied content on focus for ${item.i}`);
    }
  }, [isFocused, item.i, item.content]);

  return (
    <ShapeBase
      item={item}
      isBeingDragged={isBeingDragged}
      isFocused={isFocused}
      isHovered={isHovered}
      shadowClasses={shadowClasses}
      isDraggingDisabled={isTextStyleMenuOpen}
    >
      <div
        contentEditable
        suppressContentEditableWarning
        className={`size-full empty:before:text-gray-400 empty:before:opacity-70 empty:before:content-[attr(data-placeholder)] focus:outline-none ${getTextStyleClasses()} ${isTextStyleMenuOpen ? "editing-with-menu" : ""}`}
        style={getCustomStyles()}
        ref={contentRef}
        onFocus={() => {
          // Store the current content when focusing
          if (contentRef.current) {
            textboxContentRef.current[item.i] =
              contentRef.current.innerHTML || "";
          }
        }}
        onBlur={(e) => {
          // Get the HTML content to preserve formatting
          const newContent = e.currentTarget.innerHTML || "";
          const oldContent = textboxContentRef.current[item.i] || "";

          // Always update content to ensure formatting changes are saved
          // This is important for inline formatting like bold, italic, etc.
          handleContentChange(item.i, newContent);
          textboxContentRef.current[item.i] = newContent;

          // Log to confirm the content being saved has formatting preserved
          console.log(
            `Saving textbox ${item.i} content with formatting:`,
            newContent,
          );
        }}
        data-placeholder={item.placeholder || "Click to edit text"}
      >
        {/* Content is managed by the ref and contentEditable */}
      </div>
    </ShapeBase>
  );
}
