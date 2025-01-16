const Heading2 = ({ text, handleTextChange, handleKeyDown, textareaRef }) => {
  return (
    <textarea
      value={text}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
      className="w-full resize-none bg-transparent text-2xl outline-none"
      rows={1}
      style={{ height: "auto" }}
      ref={textareaRef}
    />
  );
};

export default Heading2;
