const Paragraph = ({ text, handleTextChange, handleKeyDown, textareaRef }) => {
  return (
    <textarea
      value={text}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
      className="w-full resize-none bg-transparent text-lg outline-none"
      rows={1}
      style={{ height: "auto" }}
      ref={textareaRef}
    />
  );
};

export default Paragraph;
