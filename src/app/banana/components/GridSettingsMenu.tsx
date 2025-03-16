import React, { useState } from "react";
import {
  BiHorizontalCenter,
  BiVerticalBottom,
  BiVerticalCenter,
} from "react-icons/bi";
import { BsGrid3X3, BsGrid3X3Gap, BsGrid3X3GapFill } from "react-icons/bs";
import { IoMdMore } from "react-icons/io";
import { GridSettings } from "../types";

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
  const [selectedAlignment, setSelectedAlignment] = useState("top");

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

  return (
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
            onClick={() => setActiveTab("design")}
          >
            Design
          </button>
          <button
            className={`p-3 text-center text-sm font-medium ${activeTab === "grid" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-black hover:text-indigo-500"}`}
            onClick={() => setActiveTab("grid")}
          >
            Grid Settings
          </button>
          <button
            className={`p-3 text-center text-sm font-medium ${activeTab === "background" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-black hover:text-indigo-500"}`}
            onClick={() => setActiveTab("background")}
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
                  <label className="text-sm font-medium text-black">Gap</label>
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
                    <div className="mb-4 flex items-center gap-2">
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
                    <div className="flex items-center gap-2">
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
                Fill screen will expand the section height to fill a portion of
                the viewport height (vh). You can set minimum and maximum
                heights to ensure consistent appearance across different screen
                sizes.
              </p>
            </div>
          </div>
        )}

        {/* Grid Settings Tab Content */}
        {activeTab === "grid" && (
          <div className="p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase text-black">
              Grid Configuration
            </h3>

            {/* Rows Setting */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-black">Rows</label>
                <div className="w-16 rounded-md bg-gray-100 px-3 py-1 text-center">
                  <span className="text-black">{settings.rows}</span>
                </div>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={settings.rows}
                onChange={(e) => handleChange("rows", parseInt(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>

            {/* Columns Setting */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-black">
                  Columns
                </label>
                <div className="w-16 rounded-md bg-gray-100 px-3 py-1 text-center">
                  <span className="text-black">{settings.columns}</span>
                </div>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                value={settings.columns}
                onChange={(e) =>
                  handleChange("columns", parseInt(e.target.value))
                }
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>

            {/* Margin Setting */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-black">
                  Margin (px)
                </label>
                <div className="w-16 rounded-md bg-gray-100 px-3 py-1 text-center">
                  <span className="text-black">{settings.margin}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={settings.margin}
                onChange={(e) =>
                  handleChange("margin", parseInt(e.target.value))
                }
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>

            {/* Padding Setting */}
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-black">
                  Padding (px)
                </label>
                <div className="w-16 rounded-md bg-gray-100 px-3 py-1 text-center">
                  <span className="text-black">{settings.padding}</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={settings.padding}
                onChange={(e) =>
                  handleChange("padding", parseInt(e.target.value))
                }
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
              />
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSettings({ ...initialSettings });
                onSettingsChange({ ...initialSettings });
              }}
              className="mt-2 w-full rounded-md bg-gray-100 px-4 py-2 font-medium text-black transition-colors hover:bg-gray-200"
            >
              Reset to Default
            </button>
          </div>
        )}

        {/* Background Tab Content (placeholder) */}
        {activeTab === "background" && (
          <div className="p-4">
            <p className="text-sm text-black">
              Background settings will be available here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridSettingsMenu;
