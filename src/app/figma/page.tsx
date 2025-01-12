"use client";
import { useState, MouseEvent, JSX } from "react";
import Sidebar from "./Sidebar";
import TopMenue from "./isEdit";
import { MdAccountCircle, MdDragHandle } from "react-icons/md";
import Toolbar from "./Toolbar";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

const HeaderContent = ({
  selectedLayout,
  isButton,
  isSocial,
  isCart,
  isAccount,
}: {
  selectedLayout: string;
  isSocial: boolean;
  isButton: boolean;
  isCart: boolean;
  isAccount: boolean;
}) => {
  const layouts: { [key: string]: JSX.Element } = {
    "Option 1": (
      <>
        <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
        <div className="flex space-x-4">
          <button className="rounded px-2 py-1 text-2xl font-bold text-white">
            Menu
          </button>
          <button className="rounded px-2 py-1 text-2xl font-bold text-white">
            Reservation
          </button>
          <div className="flex gap-2 justify-center items-center text-center">
          {isAccount && <MdAccountCircle className="text-xl"/>}
          {isSocial &&  (
            <div className="flex gap-2">
              <FaTwitter/> <FaInstagram/> <FaGithub/>
            </div>
          )}
          {isCart && <FaShoppingCart />}
          {isButton && <button className="bg-white  rounded-full text-black px-2">Button</button>}
        </div>
        </div>
      </>
    ),
    "Option 2": (
      <>
        <div className="flex space-x-4">
          <h1 className="text-2xl font-bold">Menu</h1>
          <button className="rounded px-2 py-1 text-2xl font-bold text-white">
            YourWebsiteTitle
          </button>
        </div>
        <button className="text-whit rounded px-2 py-1 text-2xl font-bold">
          Reservation
        </button>
        <div className="flex gap-2 justify-center items-center text-center">
          {isAccount && <MdAccountCircle className=""/>}
          {isSocial && <button>Social</button>}
          {isCart && <button>Cart</button>}
          {isButton && <button>Button</button>}
        </div>
      </>
    ),
    "Option 3": (
      <>
        <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
        <h1 className="rounded px-2 py-1 text-2xl font-bold text-white">
          Menu
        </h1>
        <button className="text-whit rounded px-2 py-1 text-2xl font-bold ">
          Reservation
        </button>
        <div className="flex gap-2">
          {isAccount && <MdAccountCircle />
}
          {isSocial && <button>Social</button>}
          {isCart && <button>Cart</button>}
          {isButton && <button>Button</button>}
          </div>
      </>
    ),
    "Option 4": (
      <>
        <button className="rounded px-2 py-1 text-2xl font-bold text-white">
          Menu
        </button>
        <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
        <button className="rounded px-2 py-1 text-2xl font-bold text-white">
          Reservation
        </button>
        <div className="flex gap-2">
          {isAccount && <MdAccountCircle />
}
          {isSocial && <button>Social</button>}
          {isCart && <button>Cart</button>}
          {isButton && <button>Button</button>}
          </div>
      </>
    ),
  };

  return layouts[selectedLayout] || null;
};

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(3); // Initial height of the header
  const [isResizing, setIsResizing] = useState(false);
  const [isDesignMenuVisible, setIsDesignMenuVisible] = useState(false);
  const [isElementMenuVisible, setIsElementMenuVisible] = useState(false);

  const [isButton, setIsButton] = useState(false)
  const [isSocial, setIsSocial] = useState(false);
  const [isCart, setIsCart] = useState(false)
  const [isAccount, setIsAccount] = useState(false)

  const [selectedLayout, setSelectedLayout] = useState("Option 1"); // Default to "Option 1"
  const [bgColor, setBgColor] = useState("bg-black"); // Default background color

  const handleToggleChange = (name: string, isChecked: boolean) => {
    if (name === "Social Links") {
      setIsSocial(!isSocial);
    }
    if (name === "Button") {
      setIsButton(!isButton);
    }
    if (name === "Cart") {
      setIsCart(!isCart);
    }
    if (name === "Account") {
      setIsAccount(!isAccount);
    }
  };

  const handleColorChange = (color: string) => {
    setBgColor(color);
    console.log(color);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      setHeaderHeight((prevHeight) => {
        const newHeight = prevHeight + e.movementY * 0.1; // Adjust the scaling factor as needed
        return newHeight > 12 ? 12 : newHeight; // Ensure the height does not exceed 12vw
      });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleLayoutSelection = (layout: string) => {
    setSelectedLayout(layout);
  };

  const handleHeightChange = (height: number) => {
    setHeaderHeight(height);
  };

  return (
    <div
      className="flex h-screen w-screen bg-white transition-all duration-500"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {!isEditing && <Sidebar />}
      <main
        className={`flex size-full flex-col bg-gray-900 p-4 transition-all duration-500`}
      >
        {!isEditing && <TopMenue setIsEditing={setIsEditing} />}
        <div
          className={`flex grow flex-col bg-gray-500 transition-all duration-500`}
        >
          <header
            className={`relative flex items-center justify-between ${bgColor} p-4 text-white shadow-md hover:bg-opacity-70 ${isHeaderHovered ? "bg-gray-700" : ""}`}
            style={{ height: `${headerHeight}vw` }}
            onMouseEnter={() => setIsHeaderHovered(true)}
            onMouseLeave={() => setIsHeaderHovered(false)}
          >
            <HeaderContent
              selectedLayout={selectedLayout}
              isSocial={isSocial}
              isButton={isButton}
              isCart={isCart}
              isAccount={isAccount}
            />
            {isHeaderHovered && !isHeaderEditing && (
              <button
                className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded bg-blue-500 px-2 py-1 text-white"
                onClick={() => setIsHeaderEditing(true)}
              >
                Edit Header
              </button>
            )}
            {isHeaderEditing && (
              <MdDragHandle
                className="absolute -bottom-2 right-0 cursor-row-resize bg-gray-700"
                size={24} // Set the size of the icon here
                onMouseDown={() => setIsResizing(true)}
              />
            )}
          </header>
          {isHeaderEditing && (
            <div className="my-10 flex flex-col">
              <div className="flex justify-between">
                <button
                  className="mx-10 rounded bg-white px-2 py-1 text-black"
                  onClick={() => setIsElementMenuVisible(!isElementMenuVisible)}
                >
                  Add Element
                  {isElementMenuVisible && (
                    <div
                      className="relative bg-gray-300 text-black"
                      onClick={(e) => e.stopPropagation()} // Prevent click events from propagating
                    >
                      <div
                        className={`absolute left-0  mt-2 flex w-80 flex-col  rounded-lg bg-white p-4 shadow-lg`}
                      >
                        <p className=" mb-4 border-b py-2 text-left">

                          Add Elements
                        </p>
                        <div className="h-full text-left">
                          {["Button", "Social Links", "Cart", "Account"].map(
                            (name, id) => {
                              return (
                                <li
                                  key={id}
                                  className="flex cursor-pointer items-center justify-between rounded py-2 hover:bg-gray-100"
                                >
                                  {name}
                                  <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                      type="checkbox"
                                      className="peer sr-only"
                                      onChange={(e) =>
                                        handleToggleChange(
                                          name,
                                          e.target.checked,
                                        )
                                      } // Change handler
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                                    <span className="absolute left-1 top-1 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-full peer-checked:border-white"></span>
                                  </label>
                                </li>
                              );
                            },
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
                <div className="relative mx-10">
                  <button
                    className="rounded bg-white px-2 py-1 text-black"
                    onClick={() => setIsDesignMenuVisible(!isDesignMenuVisible)}
                  >
                    Edit Design
                  </button>
                  {isDesignMenuVisible && (
                    <Toolbar
                      onOptionChange={handleLayoutSelection}
                      initialHeight={headerHeight}
                      onHeightChange={handleHeightChange}
                      onBgColorChange={(color: string) =>
                        handleColorChange(color)
                      } // Updates `bgColor`
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <section className="grow p-4">
            {/* Section content goes here */}
          </section>
          <footer className="flex bg-blue-600 p-4 text-white shadow-md">
            <p className="text-lg">Footer</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
