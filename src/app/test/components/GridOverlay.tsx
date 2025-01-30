interface GridOverlayProps {
  show: boolean;
  cols: number;
  rows: number;
  unitSize: number;
}

export const GridOverlay = ({ show, cols, rows, unitSize }: GridOverlayProps) => {
  if (!show) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${unitSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${unitSize}px)`,
        position: 'absolute',
        top: '0',
        left: '0',
        width: `${cols * unitSize}px`,
        height: `${rows * unitSize}px`,
        minWidth: '100%',
        minHeight: '100%'
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div 
          key={i}
          className="border border-blue-500/20 bg-blue-500/5"
          style={{
            margin: 0,
            padding: 0,
          }}
        />
      ))}
    </div>
  );
}; 