import React from 'react';
import { ShapeProps } from './ShapeBase';

export default function TriangleShape({ item, isBeingDragged, isFocused, isHovered, shadowClasses }: ShapeProps) {
  // Determine shadow class based on item's shadow property
  const shadowClass = item.shadow && item.shadow !== 'custom' && !item.shadow.startsWith('object-blur') && 
    typeof shadowClasses[item.shadow as keyof typeof shadowClasses] === 'string' 
    ? shadowClasses[item.shadow as keyof typeof shadowClasses] 
    : '';
  
  // Determine blur filter based on object-blur values
  let blurFilter = '';
  if (item.shadow) {
    if (item.shadow === 'object-blur-sm') {
      blurFilter = 'blur(4px)';
    } else if (item.shadow === 'object-blur') {
      blurFilter = 'blur(8px)';
    } else if (item.shadow === 'object-blur-lg') {
      blurFilter = 'blur(16px)';
    }
  }

  // Calculate shadow properties for the custom shadow approach
  let shadowX = 0;
  let shadowY = 0;
  let shadowBlur = 0;
  let shadowColor = 'rgba(0, 0, 0, 0.5)';
  let showShadow = false;
  
  if (item.shadow === 'custom' && item.shadowDistance !== undefined) {
    showShadow = true;
    const angle = item.shadowAngle || 0;
    const distance = item.shadowDistance || 0;
    shadowBlur = item.shadowBlur || 0;
    shadowColor = item.shadowColor || 'rgba(0, 0, 0, 0.5)';
    
    // Convert angle to x and y offsets
    const angleInRadians = (angle * Math.PI) / 180;
    shadowX = Math.round(Math.cos(angleInRadians) * distance);
    shadowY = Math.round(Math.sin(angleInRadians) * distance);
  }

  // Determine border style
  const borderWidth = item.borderWidth || 0;
  const borderStyleValue = item.borderStyle || 'solid';
  // @ts-ignore - borderColor might not be in the type
  const borderColor = item.borderColor || '#000000';
  const showBorder = borderWidth > 0 && borderStyleValue !== 'none';
  
  // Calculate opacity
  const opacity = item.opacity !== undefined ? item.opacity : 1;
  
  // Create triangle points that fill the container
  // We'll use a simpler approach that fills the container better
  const createTrianglePoints = (inset: number = 0) => {
    // For a triangle that fills the container better
    // We'll use the full width and height
    
    // Calculate inset as percentage
    const insetPercent = (inset / 100) * 50; // Convert to % of container size
    
    // Top point
    const x1 = 50; // Center horizontally
    const y1 = 0 + insetPercent; // Top with inset
    
    // Bottom left point
    const x2 = 0 + insetPercent; // Left with inset
    const y2 = 100 - insetPercent; // Bottom with inset
    
    // Bottom right point
    const x3 = 100 - insetPercent; // Right with inset
    const y3 = 100 - insetPercent; // Bottom with inset
    
    return `${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%`;
  };
  
  // Create the clip paths for both triangles
  const outerTrianglePoints = createTrianglePoints(0); // Full size
  const innerTrianglePoints = createTrianglePoints(borderWidth); // Inset by border width
  
  // Create the clip paths
  const outerTriangleClipPath = `polygon(${outerTrianglePoints})`;
  const innerTriangleClipPath = `polygon(${innerTrianglePoints})`;

  return (
    <div 
      id={item.i}
      className={`
        ${shadowClass}
        ${isBeingDragged ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isFocused ? 'ring-2 ring-blue-500' : ''}
        ${isHovered && !isFocused ? 'ring-1 ring-blue-300' : ''}
        transition-shadow duration-200
      `}
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
        zIndex: item.layer,
        filter: blurFilter || undefined,
        opacity: opacity,
        overflow: 'visible', // Allow shadow to extend outside
      }}
    >
      {/* Container for the triangle */}
      <div
        style={{
          height: '100%',
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Shadow triangle - only shown when custom shadow is enabled */}
        {showShadow && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translate(${shadowX}px, ${shadowY}px)`,
              zIndex: 1,
              filter: shadowBlur > 0 ? `blur(${shadowBlur}px)` : undefined,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: shadowColor,
                clipPath: outerTriangleClipPath, // Use the outer triangle for shadow
              }}
            />
          </div>
        )}
        
        {/* Border triangle (outer triangle) - only shown when border is enabled */}
        {showBorder && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
            }}
          >
            {/* For solid border */}
            {borderStyleValue !== 'dash' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: borderColor, // Use the border color from item properties
                  clipPath: outerTriangleClipPath,
                }}
              />
            )}
            
            {/* For dashed border - using SVG with proper dashed stroke */}
            {borderStyleValue === 'dash' && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 2,
                }}
              >
                <svg 
                  width="100%" 
                  height="100%" 
                  style={{ position: 'absolute', top: 0, left: 0 }}
                >
                  {/* Draw a triangle with dashed stroke */}
                  <polygon 
                    points={`50% ${0 + borderWidth/2}%, ${0 + borderWidth/2}% ${100 - borderWidth/2}%, ${100 - borderWidth/2}% ${100 - borderWidth/2}%`}
                    fill="none"
                    stroke={borderColor}
                    strokeWidth={borderWidth}
                    strokeDasharray={`${borderWidth * 2} ${borderWidth * 2}`}
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Create a solid background triangle that's slightly smaller */}
                <div
                  style={{
                    position: 'absolute',
                    top: borderWidth,
                    left: borderWidth,
                    right: borderWidth,
                    bottom: borderWidth,
                    backgroundColor: item.backgroundColor || '#3B82F6',
                    clipPath: innerTriangleClipPath,
                    zIndex: 3,
                  }}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Main triangle (inner triangle) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
            backgroundColor: item.backgroundColor || '#3B82F6',
            clipPath: showBorder ? innerTriangleClipPath : outerTriangleClipPath,
          }}
        />
      </div>
      
      {/* Add text content if needed */}
      {item.content && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -30%)', // Adjusted to look better in a triangle
            color: item.textColor || '#FFFFFF',
            fontSize: `${item.fontSize || 16}px`,
            fontWeight: item.fontWeight || 'normal',
            textAlign: (item.textAlign as 'left' | 'center' | 'right') || 'center',
            textDecoration: item.textDecoration,
            fontFamily: item.fontFamily,
            width: '80%', // Limit text width to avoid overflow
            pointerEvents: 'none', // Make text non-interactive
            zIndex: 4 // Ensure text is above the triangle
          }}
        >
          {item.content}
        </div>
      )}
    </div>
  );
}