import React, { useState, useEffect } from "react";
import {
  BiHorizontalCenter,
  BiVerticalBottom,
  BiVerticalCenter,
} from "react-icons/bi";
import { BsGrid3X3, BsGrid3X3Gap, BsGrid3X3GapFill } from "react-icons/bs";
import { IoMdMore } from "react-icons/io";
import { HiChevronDown } from "react-icons/hi";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { RxTransparencyGrid, RxPadding } from "react-icons/rx";
import { GridSettings } from "../../types";

interface GridSettingsMenuProps {
  initialSettings: GridSettings;
  onSettingsChange: (settings: GridSettings) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

const GridSettingsMenu: React.FC<GridSettingsMenuProps> = ({
  initialSettings,
  onSettingsChange,
  onClose,
  position,
}) => {
  const [activeTab, setActiveTab] = useState("design");
  const [settings, setSettings] = useState<GridSettings>({
    ...initialSettings,
    fillScreen: initialSettings.fillScreen || false,
    heightSetting:
      (initialSettings.heightSetting as
        | "small"
        | "medium"
        | "large"
        | "custom") || "medium",
    customHeight: initialSettings.customHeight || 50,
  });
  const [moreGap, setMoreGap] = useState(false);
  const [selectedGap, setSelectedGap] = useState("large");

  // Background tab state
  const [backgroundType, setBackgroundType] = useState<
    "solid" | "gradient" | "adaptive"
  >("solid");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [gradientEndColor, setGradientEndColor] = useState("#e0e0e0");
  const [opacity, setOpacity] = useState(100);
  const [blurBackground, setBlurBackground] = useState(false);
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
    "background" | "gradientEnd"
  >("background");
  const [selectedHexColor, setSelectedHexColor] = useState("#ffffff");

  // Explicitly type the colorPickerPosition to fix TypeScript errors
  interface ColorPickerPosition {
    x: number;
    y: number;
  }

  const [colorPickerPosition, setColorPickerPosition] =
    useState<ColorPickerPosition>({
      x: 0,
      y: 0,
    });

  const [huePosition, setHuePosition] = useState(0);

  // Color palette
  const colorPalette = ["#FFF6ED", "#F3F169", "#D9D6FF", "#E07A5F", "#1A3A21"];

  const handleChange = (key: keyof GridSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };

    // Keep margin in sync with horizontal/vertical for backward compatibility
    if (key === "horizontalMargin" || key === "verticalMargin") {
      // If both horizontal and vertical are the same, update margin too
      if (key === "horizontalMargin" && value === settings.verticalMargin) {
        newSettings.margin = value;
      } else if (
        key === "verticalMargin" &&
        value === settings.horizontalMargin
      ) {
        newSettings.margin = value;
      }
    } else if (key === "margin") {
      // If margin is updated, update both horizontal and vertical
      newSettings.horizontalMargin = value;
      newSettings.verticalMargin = value;
    }

    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Default position if not provided
  const menuPosition = position || { top: 60, left: "auto" };

  // Helper function to ensure color is a valid string
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

  // Handle color selection
  const handleColorSelect = (color: string | undefined | null) => {
    const formattedColor = ensureValidColorString(color);

    if (activeColorField === "background") {
      setBackgroundColor(formattedColor);
      if (backgroundType === "gradient") {
        // Update local state
        const newSettings = {
          ...settings,
          backgroundGradientStart: formattedColor,
        };
        setSettings(newSettings);
        // Don't call onSettingsChange yet - will be called on Apply
      } else {
        // Update local state
        const newSettings = {
          ...settings,
          backgroundColor: formattedColor,
        };
        setSettings(newSettings);
        // Don't call onSettingsChange yet - will be called on Apply
      }
    } else if (activeColorField === "gradientEnd") {
      setGradientEndColor(formattedColor);
      // Update local state
      const newSettings = {
        ...settings,
        backgroundGradientEnd: formattedColor,
      };
      setSettings(newSettings);
      // Don't call onSettingsChange yet - will be called on Apply
    }
    setSelectedHexColor(formattedColor);
  };

  // Handle color picker interactions
  const handleColorPickerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent event from bubbling up and closing the modal
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setColorPickerPosition({ x, y });
    updateColorFromPosition(x, y, huePosition);

    const handleMouseMove = (e: MouseEvent) => {
      // Prevent the default behavior to ensure smooth dragging
      e.preventDefault();

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
    // Prevent event from bubbling up and closing the modal
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    setHuePosition(x);
    updateColorFromPosition(colorPickerPosition.x, colorPickerPosition.y, x);

    const handleMouseMove = (e: MouseEvent) => {
      // Prevent the default behavior to ensure smooth dragging
      e.preventDefault();

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
    handleColorSelect(formattedColor);
  };

  // Handle background type change
  const handleBackgroundTypeChange = (
    type: "solid" | "gradient" | "adaptive",
  ) => {
    setBackgroundType(type);

    // Update the settings based on the type
    if (type === "solid") {
      const newSettings = {
        ...settings,
        backgroundType: type,
        backgroundColor: backgroundColor,
      };
      setSettings(newSettings);
      onSettingsChange(newSettings);
    } else if (type === "gradient") {
      const newSettings = {
        ...settings,
        backgroundType: type,
        backgroundGradientStart: backgroundColor,
        backgroundGradientEnd: gradientEndColor,
      };
      setSettings(newSettings);
      onSettingsChange(newSettings);
    }
  };

  // Handle opening the color picker
  const handleOpenColorPicker = (
    field: "background" | "gradientEnd",
    e?: React.MouseEvent,
  ) => {
    // Stop event propagation to prevent closing the main menu
    if (e) {
      e.stopPropagation();
    }

    // Prevent any existing color picker from closing the main menu
    const color = field === "background" ? backgroundColor : gradientEndColor;
    setActiveColorField(field);
    setSelectedHexColor(color || "#ffffff");

    // Show the color picker modal without closing the main menu
    setShowColorPickerModal(true);

    // Set the appropriate color picker tab based on the color
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

  // Initialize background colors from settings on component mount
  useEffect(() => {
    // Initialize background type
    if (initialSettings.backgroundType) {
      setBackgroundType(
        initialSettings.backgroundType as "solid" | "gradient" | "adaptive",
      );
    }

    // Initialize colors
    if (initialSettings.backgroundType === "gradient") {
      if (initialSettings.backgroundGradientStart) {
        setBackgroundColor(
          ensureValidColorString(initialSettings.backgroundGradientStart),
        );
      }
      if (initialSettings.backgroundGradientEnd) {
        setGradientEndColor(
          ensureValidColorString(initialSettings.backgroundGradientEnd),
        );
      }
    } else {
      if (initialSettings.backgroundColor) {
        setBackgroundColor(
          ensureValidColorString(initialSettings.backgroundColor),
        );
      }
    }

    // Initialize opacity and blur
    if (initialSettings.backgroundOpacity !== undefined) {
      setOpacity(initialSettings.backgroundOpacity);
    }
    if (initialSettings.backgroundBlur !== undefined) {
      setBlurBackground(initialSettings.backgroundBlur);
    }
  }, [initialSettings]);

  // Add useEffect to handle clicks outside the color picker modal
  useEffect(() => {
    if (showColorPickerModal) {
      const handleColorPickerOutsideClick = (e: MouseEvent) => {
        // Get references to the color picker modal
        const colorPickerModal = document.querySelector(".color-picker-modal");

        // If we click outside the color picker modal, close ONLY the color picker - not the parent menu
        if (colorPickerModal && !colorPickerModal.contains(e.target as Node)) {
          // Don't stop propagation here - we only want to close the color picker
          // but the parent menu should remain open if the click is inside it
          setShowColorPickerModal(false);
        }
      };

      // Add the event listener
      document.addEventListener("mousedown", handleColorPickerOutsideClick);

      // Clean up
      return () => {
        document.removeEventListener(
          "mousedown",
          handleColorPickerOutsideClick,
        );
      };
    }
  }, [showColorPickerModal]);

  // Add an effect to ensure any changes to settings are immediately applied to the parent component
  useEffect(() => {
    // Call onSettingsChange with the current settings
    // This ensures that changes like color updates are immediately reflected
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  // Define separate positions for each color picker type
  const palettePickerPosition = {
    top: "280px",
    right: "340px",
  };

  const customPickerPosition = {
    top: "180px",
    right: "340px",
  };

  return (
    <>
      <div
        className="grid-settings-menu fixed z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        style={{
          top: `${menuPosition.top}px`,
          right: "16px",
          width: "320px",
          maxHeight: "85vh",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full p-1 hover:bg-gray-100"
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
              className={`p-3 text-center text-sm font-medium ${activeTab === "design" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-black hover:text-indigo-500"}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("design");
              }}
            >
              Design
            </button>
            <button
              className={`p-3 text-center text-sm font-medium ${activeTab === "background" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-black hover:text-indigo-500"}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab("background");
              }}
            >
              Background
            </button>
          </div>
        </div>

        <div
          className="overflow-y-auto"
          style={{ maxHeight: "calc(85vh - 48px)" }}
        >
          {/* Design Tab Content */}
          {activeTab === "design" && (
            <div className="p-4">
              {/* GRID Section */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase text-black">
                  Grid
                </h3>

                {/* Row Count */}
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-black">
                      Row Count
                    </label>

                    <button
                      className="rounded-md border bg-white p-1.5 text-black"
                      onClick={() => {
                        if (settings.rows > 0)
                          handleChange("rows", settings.rows - 1);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 5L9 11L15 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="w-10 rounded-md bg-gray-100 px-3 py-1 text-center">
                      <span className="text-black">{settings.rows}</span>
                    </div>
                    <button
                      className="rounded-md border bg-white p-1.5 text-black"
                      onClick={() => handleChange("rows", settings.rows + 1)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 5L15 11L9 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Gap */}
                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-black">
                      Gap
                    </label>
                    <div className="flex space-x-1">
                      <button
                        className={`p-1.5 ${selectedGap === "large" ? "border-indigo-300 bg-indigo-50" : "bg-white"} rounded-md border`}
                        onClick={() => {
                          handleChange("margin", parseInt("0"));
                          setMoreGap(false);
                          setSelectedGap("large");
                        }}
                      >
                        <BsGrid3X3 className="text-black" />
                      </button>

                      <button
                        className={`p-1.5 ${selectedGap === "medium" ? "border-indigo-300 bg-indigo-50" : "bg-white"} rounded-md border`}
                        onClick={() => {
                          handleChange("margin", parseInt("10"));
                          setMoreGap(false);
                          setSelectedGap("medium");
                        }}
                      >
                        <BsGrid3X3Gap className="text-black" />
                      </button>
                      <button
                        className={`p-1.5 ${selectedGap === "small" ? "border-indigo-300 bg-indigo-50" : "bg-white"} rounded-md border`}
                        onClick={() => {
                          setMoreGap(true);
                          handleChange("margin", parseInt("8"));
                          setSelectedGap("small");
                        }}
                      >
                        <IoMdMore className="text-black" />
                      </button>
                    </div>
                  </div>
                  {moreGap && (
                    <div>
                      <div className="my-4 flex items-center gap-2">
                        <span>
                          <BiVerticalCenter className="text-black" />
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={settings.verticalMargin}
                          onChange={(e) =>
                            handleChange(
                              "verticalMargin",
                              parseInt(e.target.value),
                            )
                          }
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                        />
                        <span className="w-8 text-right text-xs text-gray-500">
                          {settings.verticalMargin}px
                        </span>
                      </div>
                      <div className=" mb-4 flex items-center gap-2">
                        <span>
                          <BiHorizontalCenter className="text-black" />
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="30"
                          value={settings.horizontalMargin}
                          onChange={(e) =>
                            handleChange(
                              "horizontalMargin",
                              parseInt(e.target.value),
                            )
                          }
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                        />
                        <span className="w-8 text-right text-xs text-gray-500">
                          {settings.horizontalMargin}px
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>
                          <RxPadding className="text-black" />
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={settings.padding}
                          onChange={(e) =>
                            handleChange("padding", parseInt(e.target.value))
                          }
                          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                        />
                        <span className="w-8 text-right text-xs text-gray-500">
                          {settings.padding}px
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* SECTION Section */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase text-black">
                  Section
                </h3>

                {/* Fill Screen Toggle */}
                <div className="mb-4 flex items-center justify-between">
                  <label className="text-sm font-medium text-black">
                    Fill Screen
                  </label>
                  <button
                    className={`h-5 w-10 rounded-full p-0.5 transition-colors ${settings.fillScreen ? "bg-indigo-500" : "bg-gray-300"}`}
                    onClick={() => {
                      const newSettings = {
                        ...settings,
                        fillScreen: !settings.fillScreen,
                      };
                      setSettings(newSettings);
                      onSettingsChange(newSettings);
                    }}
                  >
                    <div
                      className={`size-4 rounded-full bg-white transition-transform${settings.fillScreen ? "translate-x-5" : "translate-x-0"}`}
                    ></div>
                  </button>
                </div>

                {/* Height Options - Only show when Fill Screen is enabled */}
                {settings.fillScreen && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Height
                      </label>
                      <div className="flex space-x-1">
                        <button
                          className={`px-3 py-1 text-sm ${settings.heightSetting === "small" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              heightSetting: "small" as "small",
                              customHeight: 50, // 50vh
                              minHeight: 300, // Minimum height in pixels
                              maxHeight: 600, // Maximum height in pixels
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          S
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${settings.heightSetting === "medium" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              heightSetting: "medium" as "medium",
                              customHeight: 75, // 75vh
                              minHeight: 400,
                              maxHeight: 800,
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          M
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${settings.heightSetting === "large" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              heightSetting: "large" as "large",
                              customHeight: 100, // 100vh
                              minHeight: 500,
                              maxHeight: 1000,
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          L
                        </button>
                        <button
                          className={`px-2 py-1 text-sm ${settings.heightSetting === "custom" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              heightSetting: "custom" as "custom",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          •••
                        </button>
                      </div>
                    </div>

                    {/* Custom Height Controls - Only show when custom is selected */}
                    {settings.heightSetting === "custom" && (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Viewport Height
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="30"
                              max="100"
                              value={settings.customHeight || 50}
                              onChange={(e) => {
                                const newHeight = parseInt(e.target.value);
                                const newSettings = {
                                  ...settings,
                                  customHeight: newHeight,
                                };
                                setSettings(newSettings);
                                onSettingsChange(newSettings);
                              }}
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                            />
                            <span className="w-12 text-right text-xs text-gray-500">
                              {settings.customHeight}vh
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Minimum Height
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="200"
                              max="800"
                              step="50"
                              value={settings.minHeight || 300}
                              onChange={(e) => {
                                const newSettings = {
                                  ...settings,
                                  minHeight: parseInt(e.target.value),
                                };
                                setSettings(newSettings);
                                onSettingsChange(newSettings);
                              }}
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                            />
                            <span className="w-12 text-right text-xs text-gray-500">
                              {settings.minHeight}px
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-black">
                            Maximum Height
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min="400"
                              max="1200"
                              step="50"
                              value={settings.maxHeight || 600}
                              onChange={(e) => {
                                const newSettings = {
                                  ...settings,
                                  maxHeight: parseInt(e.target.value),
                                };
                                setSettings(newSettings);
                                onSettingsChange(newSettings);
                              }}
                              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                            />
                            <span className="w-12 text-right text-xs text-gray-500">
                              {settings.maxHeight}px
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visual height indicator */}
                    <div className="mt-4 rounded-md bg-gray-100 p-1">
                      <div
                        className="flex h-6 items-center justify-center rounded border border-indigo-200 bg-indigo-100 text-xs font-medium text-indigo-700"
                        style={{ width: `${settings.customHeight}%` }}
                      >
                        {settings.heightSetting === "small"
                          ? "50vh"
                          : settings.heightSetting === "medium"
                            ? "75vh"
                            : settings.heightSetting === "large"
                              ? "100vh"
                              : `${settings.customHeight}vh`}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Width - Only show when Fill Screen is enabled */}
                {settings.fillScreen && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Content Width
                      </label>
                      <div className="flex space-x-1">
                        <button
                          className={`px-3 py-1 text-sm ${settings.contentWidth === "narrow" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              contentWidth: "narrow" as "narrow",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          Narrow
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${settings.contentWidth === "medium" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              contentWidth: "medium" as "medium",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          Medium
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${settings.contentWidth === "wide" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              contentWidth: "wide" as "wide",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          Wide
                        </button>
                        <button
                          className={`px-3 py-1 text-sm ${settings.contentWidth === "full" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              contentWidth: "full" as "full",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          Full
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alignment - Only show when Fill Screen is enabled */}
                {settings.fillScreen && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Alignment
                      </label>
                      <div className="flex space-x-1">
                        <button
                          className={`p-1.5 ${settings.verticalAlignment === "top" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              verticalAlignment: "top" as "top",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 4H20M12 20V8"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <button
                          className={`p-1.5 ${settings.verticalAlignment === "middle" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              verticalAlignment: "middle" as "middle",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 12H20M12 20V4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                        <button
                          className={`p-1.5 ${settings.verticalAlignment === "bottom" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "bg-white text-black"} rounded-md border`}
                          onClick={() => {
                            const newSettings = {
                              ...settings,
                              verticalAlignment: "bottom" as "bottom",
                            };
                            setSettings(newSettings);
                            onSettingsChange(newSettings);
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 20H20M12 4V16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-black">
                  Fill screen will expand the section height to fill a portion
                  of the viewport height (vh). You can set minimum and maximum
                  heights to ensure consistent appearance across different
                  screen sizes.
                </p>
              </div>
            </div>
          )}

          {/* Background Tab Content */}
          {activeTab === "background" && (
            <div className="p-4">
              {/* Background Type Selection */}
              <div className="mb-4">
                {/* Background Type Dropdown */}
                <div className="relative mb-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowBackgroundTypeDropdown(
                        !showBackgroundTypeDropdown,
                      );
                    }}
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
                    <HiChevronDown
                      className={`transition-transform ${showBackgroundTypeDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showBackgroundTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                      {/* Solid Option */}
                      <div
                        className="flex cursor-pointer items-center justify-between p-3 hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
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
                          <span className="font-medium text-black">Solid</span>
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
                        onClick={(e) => {
                          e.stopPropagation();
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
                    </div>
                  )}
                </div>

                {/* Color Tab Settings */}
                {(backgroundType === "solid" ||
                  backgroundType === "gradient") && (
                  <>
                    {/* Color Settings */}
                    <div className="mb-3">
                      {/* Gradient Start Color / Background Color */}
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
                          onClick={(e) =>
                            handleOpenColorPicker("background", e)
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
                            onClick={(e) =>
                              handleOpenColorPicker("gradientEnd", e)
                            }
                          ></div>
                        </div>
                      )}
                    </div>

                    {/* Opacity Slider */}
                    <div className="mb-4">
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-sm font-medium text-black">
                          Opacity
                        </label>
                        <div className="w-16 rounded-md bg-gray-100 px-2 py-1 text-center">
                          <span className="text-black">{opacity}%</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={opacity}
                        onChange={(e) => {
                          e.stopPropagation();
                          const newOpacity = parseInt(e.target.value);
                          setOpacity(newOpacity);
                          const newSettings = {
                            ...settings,
                            backgroundOpacity: newOpacity,
                          };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
                      />
                    </div>

                    {/* Blur Background Toggle */}
                    <div className="mb-4 flex items-center justify-between">
                      <label className="text-sm font-medium text-black">
                        Blur Background
                      </label>
                      <button
                        className={`h-5 w-10 rounded-full p-0.5 transition-colors ${blurBackground ? "bg-indigo-500" : "bg-gray-300"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          const newBlurBackground = !blurBackground;
                          setBlurBackground(newBlurBackground);
                          const newSettings = {
                            ...settings,
                            backgroundBlur: newBlurBackground,
                          };
                          setSettings(newSettings);
                          onSettingsChange(newSettings);
                        }}
                      >
                        <div
                          className={`size-4 rounded-full bg-white transition-transform ${blurBackground ? "translate-x-5" : "translate-x-0"}`}
                        ></div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Color Picker Modal */}
      {showColorPickerModal && (
        <div
          className="fixed inset-0 z-50"
          onClick={(e) => {
            // Only close if clicking the backdrop, not the modal itself
            if (e.target === e.currentTarget) {
              setShowColorPickerModal(false);
            }
          }}
        >
          <div
            className="color-picker-modal absolute z-50 w-[320px] rounded-lg border border-gray-200 bg-white shadow-lg"
            style={
              colorPickerTab === "palette"
                ? palettePickerPosition
                : customPickerPosition
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* Color Picker Tabs */}
            <div className="flex w-full border-b">
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${colorPickerTab === "palette" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setColorPickerTab("palette");
                }}
              >
                Palette
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm font-medium ${colorPickerTab === "custom" ? "border-b-2 border-black text-black" : "text-gray-500"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setColorPickerTab("custom");
                }}
              >
                Custom
              </button>
            </div>

            {/* Color Picker Content */}
            <div className="p-4" onClick={(e) => e.stopPropagation()}>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorSelect(formattedColor);
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Transparent Color Option */}
                  <div className="mb-4 flex items-center justify-center">
                    <button
                      className="h-10 w-full rounded border border-gray-200 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC')] bg-repeat"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorSelect("transparent");
                      }}
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
                </>
              ) : (
                <>
                  {/* Custom Color Picker */}
                  <div className="mb-4">
                    {/* Color Selection Area */}
                    <div
                      className="relative mb-3 h-[250px] w-full cursor-crosshair overflow-hidden rounded"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleColorPickerMouseDown(e);
                      }}
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
                        className="size-6-translate-x-1/2 pointer-events-none absolute -translate-y-1/2 rounded-full border-2 border-white"
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
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleHueSliderMouseDown(e);
                      }}
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
                        <select
                          className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                            e.stopPropagation();
                            const inputValue = e.target.value;
                            setSelectedHexColor(inputValue);
                          }}
                          onBlur={(e) => {
                            e.stopPropagation();
                            const formattedColor = ensureValidColorString(
                              e.target.value,
                            );
                            setSelectedHexColor(formattedColor);
                            handleColorSelect(formattedColor);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            e.stopPropagation();
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
    </>
  );
};

export default GridSettingsMenu;
