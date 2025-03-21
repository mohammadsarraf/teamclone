import { JSX } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";

interface LayoutProps {
  isButton: boolean;
  isSocial: boolean;
  isCart: boolean;
  isAccount: boolean;
}

export const layouts: { [key: string]: (props: LayoutProps) => JSX.Element } = {
  "Option 1": ({ isButton, isSocial, isCart, isAccount }) => (
    <>
      <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
      <div className="flex space-x-4">
        <button className="rounded px-2 py-1 text-2xl font-bold text-white">
          Menu
        </button>
        <button className="rounded px-2 py-1 text-2xl font-bold text-white">
          Reservation
        </button>
        <div className="flex items-center justify-center gap-2 text-center">
          {isAccount && <MdAccountCircle className="text-xl" />}
          {isSocial && (
            <div className="flex gap-2">
              <FaTwitter /> <FaInstagram /> <FaGithub />
            </div>
          )}
          {isCart && <FaShoppingCart />}
          {isButton && (
            <button className="rounded-full  bg-white px-2 text-black">
              Button
            </button>
          )}
        </div>
      </div>
    </>
  ),
  "Option 2": ({ isButton, isSocial, isCart, isAccount }) => (
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
      <div className="flex items-center justify-center gap-2 text-center">
        {isAccount && <MdAccountCircle className="text-xl" />}
        {isSocial && (
          <div className="flex gap-2">
            <FaTwitter /> <FaInstagram /> <FaGithub />
          </div>
        )}
        {isCart && <FaShoppingCart />}
        {isButton && (
          <button className="rounded-full  bg-white px-2 text-black">
            Button
          </button>
        )}
      </div>
    </>
  ),
  "Option 3": ({ isButton, isSocial, isCart, isAccount }) => (
    <>
      <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
      <h1 className="rounded px-2 py-1 text-2xl font-bold text-white">Menu</h1>
      <button className="text-whit rounded px-2 py-1 text-2xl font-bold ">
        Reservation
      </button>
      <div className="flex items-center justify-center gap-2 text-center">
        {isAccount && <MdAccountCircle className="text-xl" />}
        {isSocial && (
          <div className="flex gap-2">
            <FaTwitter /> <FaInstagram /> <FaGithub />
          </div>
        )}
        {isCart && <FaShoppingCart />}
        {isButton && (
          <button className="rounded-full  bg-white px-2 text-black">
            Button
          </button>
        )}
      </div>
    </>
  ),
  "Option 4": ({ isButton, isSocial, isCart, isAccount }) => (
    <>
      <button className="rounded px-2 py-1 text-2xl font-bold text-white">
        Menu
      </button>
      <h1 className="text-2xl font-bold">YourWebsiteTitle</h1>
      <button className="rounded px-2 py-1 text-2xl font-bold text-white">
        Reservation
      </button>
      <div className="flex items-center justify-center gap-2 text-center">
        {isAccount && <MdAccountCircle className="text-xl" />}
        {isSocial && (
          <div className="flex gap-2">
            <FaTwitter /> <FaInstagram /> <FaGithub />
          </div>
        )}
        {isCart && <FaShoppingCart />}
        {isButton && (
          <button className="rounded-full  bg-white px-2 text-black">
            Button
          </button>
        )}
      </div>
    </>
  ),
};
