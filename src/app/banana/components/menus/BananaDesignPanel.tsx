"use client";
import { useState, useEffect } from "react";
import { HiX, HiChevronDown } from "react-icons/hi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid } from "react-icons/rx";
import type { HeaderLayout } from "../BananaHeader";

interface DesignToolbarProps {
  onClose: () => void;
  onLayoutChange: (layout: HeaderLayout) => void;
  onHeightChange: (height: number) => void;
  onLinkSpacingChange: (spacing: number) => void;
  onElementSpacingChange: (spacing: number) => void;
  onHeightChangeComplete: (height: number) => void;
  onLinkSpacingChangeComplete: (spacing: number) => void;
  onElementSpacingChangeComplete: (spacing: number) => void;
  initialLayout: HeaderLayout;
  initialHeight: number;
  initialLinkSpacing: number;
  initialElementSpacing: number;
  initialGradientStartColor: string;
  initialGradientEndColor: string;
  initialTextColor: string;
  initialBackgroundType: "solid" | "gradient" | "adaptive";
  initialOpacity: number;
  initialBlurBackground: boolean;
  onGradientStartColorChange: (color: string) => void;
  onGradientEndColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
  onBackgroundTypeChange: (type: "solid" | "gradient" | "adaptive") => void;
  onOpacityChange: (opacity: number) => void;
  onBlurBackgroundChange: (blur: boolean) => void;
}

type MenuView = "design" | "color";

const layoutOptions = [
  {
    name: "Option 1" as const,
    preview: (
      <div className="flex h-12 w-full items-center rounded bg-[#404040] px-3">
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Logo */}
        <div className="ml-6 flex gap-2">
          {[1, 2].map((i /* Navigation */) => (
            <div key={i} className="h-2 w-6 rounded bg-white/60" />
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {[1, 2].map((i /* Dynamic Elements */) => (
            <div key={i} className="size-3 rounded-full bg-white/60" />
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Option 2" as const,
    preview: (
      <div className="flex h-12 w-full items-center justify-between rounded bg-[#404040] px-3">
        <div className="flex gap-2">
          {" "}
          {/* Left Navigation */}
          {[1, 2].map((i) => (
            <div key={i} className="h-2 w-6 rounded bg-white/60" />
          ))}
        </div>
        <div className="absolute left-1/2 h-3 w-8 -translate-x-1/2 rounded bg-white/80" />{" "}
        {/* Centered Logo */}
        <div className="flex gap-2">
          {" "}
          {/* Right Elements */}
          {[1, 2].map((i) => (
            <div key={i} className="size-3 rounded-full bg-white/60" />
          ))}
        </div>
      </div>
    ),
  },
  {
    name: "Option 3" as const,
    preview: (
      <div className="flex h-12 w-full flex-col items-center justify-center rounded bg-[#404040] px-3 py-2">
        <div className="h-3 w-8 rounded bg-white/80" /> {/* Logo Top */}
        <div className="mt-1.5 flex items-center gap-4">
          {" "}
          {/* Nav and Elements Below */}
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-2 w-6 rounded bg-white/60" />
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="size-3 rounded-full bg-white/60" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    name: "Option 4" as const,
    preview: (
      <div className="relative flex h-12 w-full items-center justify-between rounded bg-[#404040] px-3">
        <div className="flex gap-2">
          {" "}
          {/* Left Nav */}
          {[1, 2].map((i) => (
            <div key={i} className="h-2 w-6 rounded bg-white/60" />
          ))}
        </div>
        <div className="absolute left-1/2 h-3 w-8 -translate-x-1/2 rounded bg-white/80" />{" "}
        {/* Center Logo */}
        <div className="flex gap-2">
          {" "}
          {/* Right Elements */}
          {[1, 2].map((i) => (
            <div key={i} className="size-3 rounded-full bg-white/60" />
          ))}
        </div>
      </div>
    ),
  },
];

export default function BananaDesignPanel({
  onClose,
  onLayoutChange,
  onHeightChange,
  onLinkSpacingChange,
  onElementSpacingChange,
  onHeightChangeComplete,
  onLinkSpacingChangeComplete,
  onElementSpacingChangeComplete,
  initialLayout,
  initialHeight,
  initialLinkSpacing,
  initialElementSpacing,
  initialGradientStartColor,
  initialGradientEndColor,
  initialTextColor,
  initialBackgroundType = "solid",
  initialOpacity,
  initialBlurBackground,
  onGradientStartColorChange,
  onGradientEndColorChange,
  onTextColorChange,
  onBackgroundTypeChange,
  onOpacityChange,
  onBlurBackgroundChange,
}: DesignToolbarProps) {
  const [currentView, setCurrentView] = useState<MenuView>("design");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);
  const [selectedLayout, setSelectedLayout] =
    useState<HeaderLayout>(initialLayout);
  const [headerHeight, setHeaderHeight] = useState(initialHeight);
  const [linkSpacing, setLinkSpacing] = useState(initialLinkSpacing);
  const [elementSpacing, setElementSpacing] = useState(initialElementSpacing);
  const [isClosing, setIsClosing] = useState(false);

  // Color tab state
  const [backgroundType, setBackgroundType] = useState<
    "solid" | "gradient" | "adaptive"
  >(initialBackgroundType);
  const [backgroundColor, setBackgroundColor] = useState(
    initialGradientStartColor,
  );
  const [gradientEndColor, setGradientEndColor] = useState(
    initialGradientEndColor,
  );
  const [navigationColor, setNavigationColor] = useState(initialTextColor);
  const [opacity, setOpacity] = useState(initialOpacity);
  const [blurBackground, setBlurBackground] = useState(initialBlurBackground);
  const [activeColorTab, setActiveColorTab] = useState<"color" | "theme">(
    "color",
  );
  const [showBackgroundTypeDropdown, setShowBackgroundTypeDropdown] =
    useState(false);

  // Color picker state
  const [showColorPickerModal, setShowColorPickerModal] = useState(false);
  const [colorPickerTab, setColorPickerTab] = useState<"palette" | "custom">(
    "palette",
  );
  const [activeColorField, setActiveColorField] = useState<
    "background" | "navigation" | "gradientEnd"
  >("background");
  const [selectedHexColor, setSelectedHexColor] = useState(
    initialGradientStartColor,
  );
  const [colorPickerPosition, setColorPickerPosition] = useState({
    x: 0,
    y: 0,
  });
  const [huePosition, setHuePosition] = useState(0);

  // Color palette
  const colorPalette = ["#FFF6ED", "#F3F169", "#D9D6FF", "#E07A5F", "#1A3A21"];

  const handleLayoutChange = (newLayout: HeaderLayout) => {
    setSelectedLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setHeaderHeight(newHeight);
    onHeightChange(newHeight);
  };

  const handleHeightChangeComplete = () => {
    onHeightChangeComplete(headerHeight);
  };

  const handleLinkSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpacing = Number(e.target.value);
    setLinkSpacing(newSpacing);
    onLinkSpacingChange(newSpacing);
  };

  const handleLinkSpacingChangeComplete = () => {
    onLinkSpacingChangeComplete(linkSpacing);
  };

  const handleElementSpacingChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newSpacing = Number(e.target.value);
    setElementSpacing(newSpacing);
    onElementSpacingChange(newSpacing);
  };

  const handleElementSpacingChangeComplete = () => {
    onElementSpacingChangeComplete(elementSpacing);
  };

  // Add cleanup for all dropdowns/pickers when toolbar is closing
  useEffect(() => {
    if (isClosing) {
      setShowLayoutDropdown(false);
      setShowColorPicker(false);
    }
  }, [isClosing]);

  // Helper function to combine class names
  const getTabClass = (isActive: boolean) => {
    return `py-3 px-3 text-center font-medium text-sm ${isActive ? "border-b-2 border-indigo-600 text-indigo-600" : "text-black hover:text-indigo-500"}`;
  };

  const handleClose = () => {
    setShowLayoutDropdown(false);
    setShowColorPicker(false);
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  // Handle color selection
  const handleColorSelect = (color: string | undefined | null) => {
    const formattedColor = ensureValidColorString(color);

    if (activeColorField === "background") {
      setBackgroundColor(formattedColor);
      document.documentElement.style.setProperty(
        "--header-bg-color",
        formattedColor,
      );
      if (backgroundType === "gradient") {
        onGradientStartColorChange(
          `gradient:${formattedColor}:${gradientEndColor}`,
        );
      } else {
        onGradientStartColorChange(formattedColor);
      }
    } else if (activeColorField === "gradientEnd") {
      setGradientEndColor(formattedColor);
      document.documentElement.style.setProperty(
        "--header-gradient-end-color",
        formattedColor,
      );
      if (backgroundType === "gradient") {
        onGradientEndColorChange(
          `gradient:${backgroundColor}:${formattedColor}`,
        );
      }
    } else {
      setNavigationColor(formattedColor);
      document.documentElement.style.setProperty(
        "--header-text-color",
        formattedColor,
      );
      onTextColorChange(formattedColor);
    }
    setSelectedHexColor(formattedColor);
  };

  // Handle color picker interactions
  const handleColorPickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setColorPickerPosition({ x, y });
    updateColorFromPosition(x, y, huePosition);

    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      setColorPickerPosition({ x, y });
      updateColorFromPosition(x, y, huePosition);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleHueSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    setHuePosition(x);
    updateColorFromPosition(colorPickerPosition.x, colorPickerPosition.y, x);

    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      setHuePosition(x);
      updateColorFromPosition(colorPickerPosition.x, colorPickerPosition.y, x);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const updateColorFromPosition = (x: number, y: number, hue: number) => {
    // Convert HSV to RGB
    const h = hue * 360;
    const s = x * 100;
    const v = (1 - y) * 100;

    // HSV to RGB conversion
    const c = (v * s) / 10000;
    const x1 = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v / 100 - c;

    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x1;
      b = 0;
    } else if (h < 120) {
      r = x1;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x1;
    } else if (h < 240) {
      r = 0;
      g = x1;
      b = c;
    } else if (h < 300) {
      r = x1;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x1;
    }

    // Convert to hex
    const toHex = (value: number) => {
      const hex = Math.round((value + m) * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    const formattedColor = ensureValidColorString(hexColor);

    setSelectedHexColor(formattedColor);

    // Apply to the active field
    if (activeColorField === "background") {
      setBackgroundColor(formattedColor);
      document.documentElement.style.setProperty(
        "--header-bg-color",
        formattedColor,
      );
      if (backgroundType === "gradient") {
        onGradientStartColorChange(
          `gradient:${formattedColor}:${gradientEndColor}`,
        );
      } else {
        onGradientStartColorChange(formattedColor);
      }
    } else if (activeColorField === "gradientEnd") {
      setGradientEndColor(formattedColor);
      document.documentElement.style.setProperty(
        "--header-gradient-end-color",
        formattedColor,
      );
      if (backgroundType === "gradient") {
        onGradientEndColorChange(
          `gradient:${backgroundColor}:${formattedColor}`,
        );
      }
    } else {
      setNavigationColor(formattedColor);
      document.documentElement.style.setProperty(
        "--header-text-color",
        formattedColor,
      );
      onTextColorChange(formattedColor);
    }
  };

  // Helper function to ensure color is a valid string for Tailwind's bg-[string]
  const ensureValidColorString = (color: string | undefined | null): string => {
    if (!color) return "#ffffff"; // Default to white if no color

    // If it's already a valid hex color with # prefix, return as is
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      return color;
    }

    // If it's a valid hex without #, add the #
    if (/^([0-9A-F]{3}){1,2}$/i.test(color)) {
      return `#${color}`;
    }

    // If it's 'transparent', return as is
    if (color === "transparent") {
      return color;
    }

    // For other formats (rgb, rgba, hsl, etc.), ensure they're properly formatted
    if (color.startsWith("rgb") || color.startsWith("hsl")) {
      return color;
    }

    // If we can't determine the format, default to a safe color
    return "#ffffff";
  };

  // Add useEffect to apply colors on component mount and when they change
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-bg-color",
      backgroundColor,
    );
    document.documentElement.style.setProperty(
      "--header-text-color",
      navigationColor,
    );
  }, [backgroundColor, navigationColor]);

  // Handle background type change
  const handleBackgroundTypeChange = (
    type: "solid" | "gradient" | "adaptive",
  ) => {
    setBackgroundType(type);

    // Update the background color based on the type
    if (type === "solid") {
      onGradientStartColorChange(backgroundColor);
    } else if (type === "gradient") {
      onGradientEndColorChange(gradientEndColor);
    } else if (type === "adaptive") {
      // For adaptive, we'll just use a placeholder for now
      onGradientStartColorChange("adaptive");
    }

    onBackgroundTypeChange(type);
  };

  // Handle opacity change
  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    onOpacityChange(value);
  };

  // Handle blur background change
  const handleBlurBackgroundChange = (value: boolean) => {
    setBlurBackground(value);
    onBlurBackgroundChange(value);
  };

  // Add useEffect to initialize color picker with initial colors
  useEffect(() => {
    // Set initial colors with validation
    // Remove 'bg-[' and ']' if present in initialGradientStartColor
    let cleanBgColor = initialGradientStartColor;

    // Check if it's a gradient format
    if (cleanBgColor && cleanBgColor.startsWith("gradient:")) {
      const parts = cleanBgColor.split(":");
      if (parts.length === 3) {
        cleanBgColor = parts[1];
        setGradientEndColor(ensureValidColorString(parts[2]));
        setBackgroundType("gradient");
      }
    } else if (
      cleanBgColor &&
      cleanBgColor.startsWith("bg-[") &&
      cleanBgColor.endsWith("]")
    ) {
      cleanBgColor = cleanBgColor.substring(4, cleanBgColor.length - 1);
    }

    const validBgColor = ensureValidColorString(cleanBgColor);
    const validTextColor = ensureValidColorString(initialTextColor);

    setBackgroundColor(validBgColor);
    setNavigationColor(validTextColor);

    // Set initial background type
    setBackgroundType(initialBackgroundType || "solid");

    // Set initial opacity and blur
    setOpacity(initialOpacity || 100);
    setBlurBackground(initialBlurBackground || false);

    // Apply colors to CSS variables
    document.documentElement.style.setProperty(
      "--header-bg-color",
      validBgColor,
    );
    document.documentElement.style.setProperty(
      "--header-gradient-end-color",
      gradientEndColor,
    );
    document.documentElement.style.setProperty(
      "--header-text-color",
      validTextColor,
    );
  }, [
    initialGradientStartColor,
    initialTextColor,
    initialBackgroundType,
    initialOpacity,
    initialBlurBackground,
  ]);

  // Handle opening the color picker
  const handleOpenColorPicker = (
    field: "background" | "navigation" | "gradientEnd",
  ) => {
    setActiveColorField(field);
    const color =
      field === "background"
        ? backgroundColor
        : field === "gradientEnd"
          ? gradientEndColor
          : navigationColor;
    setSelectedHexColor(color || "#ffffff");
    setShowColorPickerModal(true);

    // Set the appropriate color picker tab based on the color
    // Check if the color is in the palette
    if (color && colorPalette.includes(color)) {
      setColorPickerTab("palette");
    } else {
      setColorPickerTab("custom");

      // Try to set the hue position and color picker position based on the color
      try {
        if (color && color.startsWith("#")) {
          // Convert hex to HSV
          const r = parseInt(color.slice(1, 3), 16) / 255;
          const g = parseInt(color.slice(3, 5), 16) / 255;
          const b = parseInt(color.slice(5, 7), 16) / 255;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const d = max - min;

          let h = 0;
          if (d === 0) h = 0;
          else if (max === r) h = ((g - b) / d) % 6;
          else if (max === g) h = (b - r) / d + 2;
          else if (max === b) h = (r - g) / d + 4;

          h = h * 60;
          if (h < 0) h += 360;

          const s = max === 0 ? 0 : d / max;
          const v = max;

          // Set the hue position (0-1)
          setHuePosition(h / 360);

          // Set the color picker position (x=saturation, y=1-value)
          setColorPickerPosition({ x: s, y: 1 - v });
        }
      } catch (error) {
        console.error("Error setting color picker position:", error);
      }
    }
  };

  return (
    <>
      {/* Main Toolbar */}
      <div
        className={`z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-150 ${
          isClosing ? "translate-x-2 opacity-0" : "opacity-100"
        }`}
        style={{
          top: "150px",
          right: "16px",
          width: "320px",
          maxHeight: "85vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute bottom-3 right-3 z-10 rounded-full p-1 hover:bg-gray-100"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>

        {/* Header with Tabs */}
        <div className="border-b">
          <div className="flex flex-wrap">
            <button
              onClick={() => setCurrentView("design")}
              className={getTabClass(currentView === "design")}
            >
              Design
            </button>
            <button
              onClick={() => setCurrentView("color")}
              className={getTabClass(currentView === "color")}
            >
              Color
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 48px)" }}
        >
          {currentView === "design" ? (
            <>
              <div className="p-4">
                {/* Layout Section */}
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase text-black">
                    Layout
                  </h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
                      className="flex w-full flex-col rounded-md border border-gray-200 bg-white p-2 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-black">{selectedLayout}</span>
                        <HiChevronDown
                          className={`transition-transform ${showLayoutDropdown ? "rotate-180" : ""}`}
                        />
                      </div>
                      {/* Preview of selected layout */}
                      <div className="overflow-hidden rounded">
                        {
                          layoutOptions.find(
                            (opt) => opt.name === selectedLayout,
                          )?.preview
                        }
                      </div>
                    </button>
                  </div>
                </div>

                {/* Spacing Section */}
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase text-black">
                    Spacing
                  </h3>

                  {/* Link Spacing Slider */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Link Spacing
                      </label>
                      <div className="w-16 rounded-md bg-gray-100 px-2 py-1 text-center">
                        <span className="text-black">{linkSpacing}px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={48}
                      value={linkSpacing}
                      onChange={handleLinkSpacingChange}
                      onMouseUp={handleLinkSpacingChangeComplete}
                      onTouchEnd={handleLinkSpacingChangeComplete}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                    />
                  </div>

                  {/* Element Spacing Slider */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Element Spacing
                      </label>
                      <div className="w-16 rounded-md bg-gray-100 px-2 py-1 text-center">
                        <span className="text-black">{elementSpacing}px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={32}
                      value={elementSpacing}
                      onChange={handleElementSpacingChange}
                      onMouseUp={handleElementSpacingChangeComplete}
                      onTouchEnd={handleElementSpacingChangeComplete}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Size Section */}
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-semibold uppercase text-black">
                    Size
                  </h3>

                  {/* Height Slider */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Height
                      </label>
                      <div className="w-16 rounded-md bg-gray-100 px-2 py-1 text-center">
                        <span className="text-black">{headerHeight}px</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={80}
                      max={200}
                      value={headerHeight}
                      onChange={handleHeightChange}
                      onMouseUp={handleHeightChangeComplete}
                      onTouchEnd={handleHeightChangeComplete}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-4">
                {/* Background Type Selection */}
                <div className="mb-4">
                  {/* Background Type Dropdown */}
                  <div className="relative mb-3">
                    <button
                      onClick={() =>
                        setShowBackgroundTypeDropdown(
                          !showBackgroundTypeDropdown,
                        )
                      }
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-100 p-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        {backgroundType === "solid" && (
                          <div
                            className="size-10 rounded-lg"
                            style={{
                              backgroundColor:
                                ensureValidColorString(backgroundColor),
                            }}
                          ></div>
                        )}
                        {backgroundType === "gradient" && (
                          <div
                            className="size-10 rounded-lg bg-gradient-to-r"
                            style={{
                              backgroundImage: `linear-gradient(to right, ${ensureValidColorString(backgroundColor)}, ${ensureValidColorString(gradientEndColor)})`,
                            }}
                          ></div>
                        )}
                        {backgroundType === "adaptive" && (
                          <div className="size-10 rounded-lg border border-gray-300 bg-gray-200"></div>
                        )}
                        <span className="font-medium text-black">
                          {backgroundType
                            ? backgroundType.charAt(0).toUpperCase() +
                              backgroundType.slice(1)
                            : "Solid"}
                        </span>
                      </div>
                      <svg
                        className={`transition-transform ${showBackgroundTypeDropdown ? "rotate-180" : ""}`}
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {showBackgroundTypeDropdown && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                        {/* Solid Option */}
                        <div
                          className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
                          onClick={() => {
                            handleBackgroundTypeChange("solid");
                            setShowBackgroundTypeDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="size-10 rounded-lg"
                              style={{
                                backgroundColor:
                                  ensureValidColorString(backgroundColor),
                              }}
                            ></div>
                            <span className="font-medium text-black">
                              Solid
                            </span>
                          </div>
                          {backgroundType === "solid" && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Gradient Option */}
                        <div
                          className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
                          onClick={() => {
                            handleBackgroundTypeChange("gradient");
                            setShowBackgroundTypeDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="size-10 rounded-lg bg-gradient-to-r"
                              style={{
                                backgroundImage: `linear-gradient(to right, ${ensureValidColorString(backgroundColor)}, ${ensureValidColorString(gradientEndColor)})`,
                              }}
                            ></div>
                            <span className="font-medium text-black">
                              Gradient
                            </span>
                          </div>
                          {backgroundType === "gradient" && (
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                fill="currentColor"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Adaptive Option */}
                        {/* <div 
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => {
                            handleBackgroundTypeChange('adaptive');
                            setShowBackgroundTypeDropdown(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-200 border border-gray-300"></div>
                            <span className="text-black font-medium">Adaptive</span>
                          </div>
                          {backgroundType === 'adaptive' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                            </svg>
                          )}
                        </div> */}
                      </div>
                    )}
                  </div>

                  {/* Solid and Gradient Settings */}
                  {(backgroundType === "solid" ||
                    backgroundType === "gradient") && (
                    <>
                      {/* Color/Theme Tabs */}
                      <div className="mb-3 flex w-full border-b">
                        <button
                          className={`flex-1 py-2 text-center text-sm font-medium ${activeColorTab === "color" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                          onClick={() => setActiveColorTab("color")}
                        >
                          Color
                        </button>
                        <button
                          className={`flex-1 py-2 text-center text-sm font-medium ${activeColorTab === "theme" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                          onClick={() => setActiveColorTab("theme")}
                        >
                          Theme
                        </button>
                      </div>

                      {activeColorTab === "color" && (
                        <>
                          {/* Gradient Start Color */}
                          <div className="flex items-center justify-between border-b border-gray-200 py-3">
                            <span className="text-sm font-medium text-black">
                              {backgroundType === "gradient"
                                ? "Gradient start color"
                                : "Background color"}
                            </span>
                            <div
                              className="size-7 cursor-pointer rounded-full border border-gray-300"
                              style={{
                                backgroundColor:
                                  ensureValidColorString(backgroundColor),
                              }}
                              onClick={() =>
                                handleOpenColorPicker("background")
                              }
                            ></div>
                          </div>

                          {/* Gradient End Color - Only show for gradient type */}
                          {backgroundType === "gradient" && (
                            <div className="flex items-center justify-between border-b border-gray-200 py-3">
                              <span className="text-sm font-medium text-black">
                                Gradient end color
                              </span>
                              <div
                                className="size-7 cursor-pointer rounded-full border border-gray-300"
                                style={{
                                  backgroundColor:
                                    ensureValidColorString(gradientEndColor),
                                }}
                                onClick={() =>
                                  handleOpenColorPicker("gradientEnd")
                                }
                              ></div>
                            </div>
                          )}

                          {/* Text Color */}
                          <div className="flex items-center justify-between border-b border-gray-200 py-3">
                            <span className="text-sm font-medium text-black">
                              Text color
                            </span>
                            <div
                              className="size-7 cursor-pointer rounded-full border border-gray-300"
                              style={{
                                backgroundColor:
                                  ensureValidColorString(navigationColor),
                              }}
                              onClick={() =>
                                handleOpenColorPicker("navigation")
                              }
                            ></div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Adaptive Settings */}
                  {/* {backgroundType === 'adaptive' && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                      <p className="text-gray-700 text-sm">
                        Use the color theme of the first section on each page. Go to Styles &gt; Colors to customize the color of the site title and navigation link for each color theme.
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPickerModal && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowColorPickerModal(false)}
        >
          <div
            className="absolute z-50 w-[320px] rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              top: "120px",
              right: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color Picker Tabs */}
            <div className="flex w-full border-b">
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${colorPickerTab === "palette" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                onClick={() => setColorPickerTab("palette")}
              >
                Palette
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${colorPickerTab === "custom" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                onClick={() => setColorPickerTab("custom")}
              >
                Custom
              </button>
            </div>

            {/* Color Picker Content */}
            <div className="p-4">
              {colorPickerTab === "palette" ? (
                <>
                  {/* Color Palette */}
                  <div className="mb-4 flex justify-center gap-4">
                    {colorPalette.map((color, index) => {
                      const formattedColor = ensureValidColorString(color);
                      return (
                        <button
                          key={index}
                          className={`size-12 rounded-full transition-transform hover:scale-110 ${formattedColor === selectedHexColor ? "ring-2 ring-black" : "border border-gray-200"}`}
                          style={{ backgroundColor: formattedColor }}
                          onClick={() => handleColorSelect(formattedColor)}
                        />
                      );
                    })}
                  </div>

                  {/* Transparent Color Option */}
                  <div className="mb-4 flex items-center justify-center">
                    <button
                      className="h-10 w-full rounded border border-gray-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat"
                      onClick={() => handleColorSelect("transparent")}
                    >
                      <div className="flex justify-end pr-2">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* Edit Sitewide Palette Button */}
                  <button className="mt-2 w-full border-t border-gray-200 py-2 pt-4 text-center text-sm font-medium text-black">
                    EDIT SITEWIDE PALETTE
                  </button>
                </>
              ) : (
                <>
                  {/* Custom Color Picker */}
                  <div className="mb-4">
                    {/* Color Selection Area */}
                    <div
                      className="relative mb-3 h-[250px] w-full cursor-crosshair overflow-hidden rounded"
                      onMouseDown={handleColorPickerMouseDown}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundColor: `hsl(${huePosition * 360}, 100%, 50%)`,
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, #fff, rgba(255,255,255,0))",
                          backgroundBlendMode: "multiply",
                        }}
                      ></div>
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, #000, rgba(0,0,0,0))",
                          backgroundBlendMode: "multiply",
                        }}
                      ></div>
                      <div
                        className="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
                        style={{
                          left: `${colorPickerPosition.x * 100}%`,
                          top: `${colorPickerPosition.y * 100}%`,
                          backgroundColor:
                            ensureValidColorString(selectedHexColor),
                        }}
                      ></div>
                    </div>

                    {/* Hue Slider */}
                    <div
                      className="relative mb-3 h-8 cursor-pointer overflow-hidden rounded"
                      onMouseDown={handleHueSliderMouseDown}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                        }}
                      ></div>
                      <div
                        className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 border border-gray-300 bg-white"
                        style={{ left: `${huePosition * 100}%` }}
                      ></div>
                    </div>

                    {/* Hex Input */}
                    <div className="flex items-center text-black">
                      <div className="flex-1">
                        <select className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm">
                          <option>Hex</option>
                          <option>RGB</option>
                          <option>HSL</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={
                            selectedHexColor && selectedHexColor.startsWith("#")
                              ? selectedHexColor
                              : `#${selectedHexColor || ""}`
                          }
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Don't immediately apply the color - wait for onBlur
                            setSelectedHexColor(inputValue);
                          }}
                          onBlur={(e) => {
                            // Apply the color when the input loses focus
                            const formattedColor = ensureValidColorString(
                              e.target.value,
                            );
                            setSelectedHexColor(formattedColor);
                            handleColorSelect(formattedColor);
                          }}
                          onKeyDown={(e) => {
                            // Apply the color when Enter key is pressed
                            if (e.key === "Enter") {
                              const formattedColor = ensureValidColorString(
                                e.currentTarget.value,
                              );
                              setSelectedHexColor(formattedColor);
                              handleColorSelect(formattedColor);
                              e.currentTarget.blur();
                            }
                          }}
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Layout Dropdown Backdrop - Only show if not closing */}
      {showLayoutDropdown && !isClosing && (
        <div
          className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm transition-opacity"
          onClick={() => setShowLayoutDropdown(false)}
        >
          <div
            className="absolute z-50 w-[280px] rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              top: "120px",
              right: "300px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {layoutOptions.map((option) => (
              <button
                key={option.name}
                className={`w-full border-b border-gray-200 p-3 text-left transition-colors last:border-0 hover:bg-gray-50 ${
                  selectedLayout === option.name ? "bg-indigo-50" : ""
                }`}
                onClick={() => {
                  handleLayoutChange(option.name);
                  setShowLayoutDropdown(false);
                }}
              >
                <div className="mb-2 text-black">{option.name}</div>
                <div className="overflow-hidden rounded">{option.preview}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
