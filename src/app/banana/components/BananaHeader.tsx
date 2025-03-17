"use client";

import ContentEditable from "react-contenteditable";
import {
  HiOutlineShoppingCart,
  HiOutlineTemplate,
  HiOutlineUser,
} from "react-icons/hi";
import { TiSocialSkypeOutline } from "react-icons/ti";
import { useRef } from "react";

export type HeaderLayout = "Option 1" | "Option 2" | "Option 3" | "Option 4";

interface HeaderProps {
  className?: string;
  layout?: HeaderLayout;
  height?: number;
  linkSpacing?: number;
  elementSpacing?: number;
  bgColor ?: string;
  gradientEndColor?: string;
  isGradient?: boolean;
  textColor?: string;
  bgOpacity?: string;
  isEditing?:boolean;
  enabledElements?: {
    isButton: boolean;
    isSocial: boolean;
    isCart: boolean;
    isAccount: boolean;
  };
}

export default function BananaHeader({
  enabledElements = {
    isButton: false,
    isSocial: false,
    isCart: false,
    isAccount: false,
  },
  isEditing,
  layout = "Option 1",
  height = 80,
  linkSpacing = 12,
  elementSpacing = 8,
  bgColor = `bg-black`,
  gradientEndColor,
  isGradient = false,
  textColor = `#ffffff`,
  bgOpacity,
}: HeaderProps) {
  // Add state for ContentEditable text
  const button1 = useRef("Menu");
  const button2 = useRef("Reservation");
  const button3 = useRef("YourWebsiteTitle");

  // Extract the actual color from the Tailwind class if needed
  const extractedBgColor = bgColor.startsWith('bg-[') && bgColor.endsWith(']') 
    ? bgColor.substring(4, bgColor.length - 1) 
    : bgColor.startsWith('bg-') 
      ? 'black' // Default for non-dynamic Tailwind classes
      : bgColor;
  
  const headerStyle = isGradient && gradientEndColor
    ? {
        height: `${height}px`,
        minHeight: `${height}px`,
        backgroundImage: `linear-gradient(to right, ${extractedBgColor}, ${gradientEndColor})`,
      }
    : {
        height: `${height}px`,
        minHeight: `${height}px`,
        backgroundColor: extractedBgColor,
      };

  const Logo = () => (
    <ContentEditable 
      html={button3.current} 
      onChange={(e) => button3.current = e.target.value}
      disabled={!isEditing}
      className="text-2xl font-bold"
      style={{ color: textColor }}
    />
  );

  const Navigation = () => (
    <nav style={{ gap: `${linkSpacing}px` }} className="flex">
      <ContentEditable 
        html={button1.current} 
        onChange={(e) => button1.current = e.target.value}
        disabled={!isEditing}
        className="text-lg font-medium text-white/90 transition-colors hover:text-white" 
        style={{ color: textColor }}
      />
        
        <ContentEditable 
        html={button2.current} 
        onChange={(e) => button2.current = e.target.value}
        disabled={!isEditing}
        className="text-lg font-medium text-white/90 transition-colors hover:text-white" 
        style={{ color: textColor }}
      />
    </nav>
  );

  const DynamicElements = () => (
    <div style={{ gap: `${elementSpacing}px` }} className="flex items-center">
      {enabledElements.isButton && (
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
          <HiOutlineTemplate className="size-5" />
        </button>
      )}
      {enabledElements.isSocial && (
        <button className="rounded-full p-2 hover:bg-white/10" style={{ color: textColor }}>
          <TiSocialSkypeOutline className="size-5" />
        </button>
      )}
      {enabledElements.isCart && (
        <button className="rounded-full p-2 hover:bg-white/10" style={{ color: textColor }}>
          <HiOutlineShoppingCart className="size-5" />
        </button>
      )}
      {enabledElements.isAccount && (
        <button className="rounded-full p-2 hover:bg-white/10" style={{ color: textColor }}>
          <HiOutlineUser className="size-5" />
        </button>
      )}
    </div>
  );

  // Layout Option 1: Logo Left, Nav Center, Elements Right
  if (layout === "Option 1") {
    return (
      <header
        className="flex w-full items-center justify-between px-6 transition-[height] duration-75"
        style={headerStyle}
      >
        <div style={{ gap: `${linkSpacing}px` }} className="flex items-center">
          <Logo />
          <Navigation />
        </div>
        <DynamicElements />
      </header>
    );
  }

  // Layout Option 2: Nav Left, Logo Center, Elements Right
  if (layout === "Option 2") {
    return (
      <header
        className="flex w-full items-center justify-between px-6 transition-[height] duration-75"
        style={headerStyle}
      >
        <Navigation />
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo />
        </div>
        <DynamicElements />
      </header>
    );
  }

  // Layout Option 3: Logo Top, Nav Bottom (Centered)
  if (layout === "Option 3") {
    return (
      <header
        className="flex w-full flex-col items-center justify-center px-6 transition-[height] duration-75"
        style={headerStyle}
      >
        <Logo />
        <div
          style={{ gap: `${elementSpacing}px` }}
          className="mt-4 flex items-center"
        >
          <Navigation />
          <DynamicElements />
        </div>
      </header>
    );
  }

  // Layout Option 4: Nav Split, Logo Center
  if (layout === "Option 4") {
    return (
      <header
        className="relative flex w-full items-center justify-between px-6 transition-[height] duration-75"
        style={headerStyle}
      >
        <div className="flex-1">
          <Navigation />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo />
        </div>
        <div className="flex flex-1 justify-end">
          <DynamicElements />
        </div>
      </header>
    );
  }

  return null;
}
