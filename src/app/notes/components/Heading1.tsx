const Heading1 = ({ text, handleTextChange, handleKeyDown, textareaRef }) => {
  return (
    <textarea
      value={text}
      onChange={handleTextChange}
      onKeyDown={handleKeyDown}
      className="w-full resize-none bg-transparent text-3xl outline-none"
      rows={1}
      style={{ height: "auto" }}
      ref={textareaRef}
    />
  );
};

export default Heading1;
