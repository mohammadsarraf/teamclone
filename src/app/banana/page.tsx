"use client";
import HeaderEdit from "./components/headerEdit";
import MainEdit from "./components/mainEdit";
import FooterEdit from "./components/footerEdit";
import SideMenu from "./components/sidemenu";

export default function Banana() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SideMenu />

      {/* Main Content with Window Bar */}
      <div className="flex flex-1 flex-col">
        {/* Main Content Area */}
        <div className="flex-1 bg-[#1b1b1b] p-8">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between rounded-t-lg bg-blue-800 p-3">
              <div className="flex items-center space-x-2">
                {/* Window Controls */}
                <div className="flex items-center space-x-2">
                  <button className="size-3 rounded-full bg-red-500 hover:bg-red-600" />
                  <button className="size-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
                  <button className="size-3 rounded-full bg-green-500 hover:bg-green-600" />
                </div>
              </div>

              {/* Window Title */}
              <span className="text-sm text-gray-400">My Project</span>

              {/* Right Side Actions (optional) */}
              <div className="flex items-center space-x-2" />
            </div>
            <div className="flex flex-1 flex-col rounded-b-lg bg-red-400">
              <HeaderEdit />
              <MainEdit />
              <div className="flex-1">
                <FooterEdit />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
