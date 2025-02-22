"use client";
import { useState } from "react";
import HeaderEdit from "./components/BananaHeaderEditor";
import MainEdit from "./components/BananaContentEditor";
import FooterEdit from "./components/BananaFooterEditor";
import SideMenu from "./components/sidemenu";
import Edit from "./components/BananaEditor";

export default function Banana() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar - Hide in fullscreen */}
      {!isFullscreen && <SideMenu />}

      {/* Main Content with Window Bar */}
      <div className={`flex flex-col ${isFullscreen ? "w-screen" : "flex-1"}`}>
        {/* Main Content Area */}
        <div
          className={`flex-1 ${isFullscreen ? "" : "bg-[#1b1b1b] p-8"} overflow-hidden`}
        >
          <div className="flex h-full flex-col">
            {/* Window Bar */}
            <div
              className={`flex items-center justify-between ${isFullscreen ? "" : "rounded-t-lg"} bg-blue-800 p-3`}
            >
              <div className="flex items-center space-x-2">
                {/* Window Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    className="size-3 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={() => isFullscreen && setIsFullscreen(false)}
                  />
                  <button className="size-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
                  <button
                    className="size-3 rounded-full bg-green-500 hover:bg-green-600"
                    onClick={() => !isFullscreen && setIsFullscreen(true)}
                  />
                </div>
              </div>

              {/* Window Title */}
              <span className="text-sm text-gray-400">My Project</span>

              {/* Right Side Actions (optional) */}
              <div className="flex items-center space-x-2" />
            </div>

            {/* Content Container */}
            <div
              className={`flex-1 ${isFullscreen ? "" : "rounded-b-lg"} overflow-hidden bg-red-400`}
            >
              <Edit isFullscreen={isFullscreen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
