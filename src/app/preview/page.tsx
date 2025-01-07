"use client";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { TbDeviceImac } from "react-icons/tb";
import Edit from "../utils/edit";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ColorButtonProps {
  colors: string[];
  onClick: () => void;
}

const ColorButton = ({ colors, onClick }: ColorButtonProps) => (
  <button
    className="flex h-10 w-full transition duration-300 hover:shadow-lg"
    onClick={onClick}
  >
    <div className={`h-full w-1/3 rounded-l-full ${colors[0]}`}></div>
    <div className={`h-full w-1/3 ${colors[1]}`}></div>
    <div className={`h-full w-1/3 rounded-r-full ${colors[2]}`}></div>
  </button>
);

export default function Home() {
  const router = useRouter();
  const [colors, setColors] = useState({
    primaryColor: "text-blue-600",
    secondaryColor: "text-white",
    bgColor: "text-white",
  });

  const handleColorChange = (
    primary: string,
    secondary: string,
    bg: string,
  ) => {
    console.log("Primary Color:", primary);
    console.log("Secondary Color:", secondary);
    console.log("Background Color:", bg);
    setColors({
      primaryColor: primary,
      secondaryColor: secondary,
      bgColor: bg,
    });
  };

  return (
    <div className="flex h-screen w-screen flex-row bg-gray-100">
      <div className="m-4 flex w-3/4 flex-col rounded-lg border border-gray-300 bg-gray-200 p-4 text-black shadow-lg">
        <div className="flex h-12 flex-row items-center gap-4 border-b border-gray-500 p-4 text-xl">
          <button
            className="font-semibold text-blue-500 hover:text-blue-700"
            onClick={() => router.push("/templates")}
          >
            {`< Template`}
          </button>
          <div className="flex items-center gap-2">
            <TbDeviceImac className="text-gray-500 hover:text-gray-700" />
            <MdOutlinePhoneIphone className="text-gray-500 hover:text-gray-700" />
          </div>
        </div>
        <div className="m-10 flex-1 rounded-lg">
          <div
            className={`flex size-full overflow-auto rounded-lg ${colors.bgColor} p-4`}
          >
            <Edit
              primaryColor={colors.primaryColor}
              secondaryColor={colors.secondaryColor}
              bgColor={``}
            />
          </div>
        </div>
      </div>
      <div className="m-4 flex w-1/4 flex-col rounded-lg border-l border-gray-300 bg-white px-12 py-10 text-black">
        <p className="mb-4 flex text-lg font-bold text-black">Portfolio</p>
        <p className="mb-6 flex text-black">
          Continue to customize styles, add features, and more when you start a
          trial.
        </p>
        <button className="m-10 flex items-center justify-center rounded-lg border bg-black px-6 py-3 text-white transition duration-300 hover:bg-gray-800">
          Start with this design
        </button>
        <div className="flex">
          <p className="mb-4 flex w-full border-b border-b-black">
            Sample color preset
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <ColorButton
            colors={["bg-red-500", "bg-yellow-500", "bg-blue-500"]}
            onClick={() =>
              handleColorChange(
                `text-red-500`,
                "text-yellow-500",
                "bg-blue-500",
              )
            }
          />
          <ColorButton
            colors={["bg-purple-500", "bg-green-500", "bg-orange-500"]}
            onClick={() =>
              handleColorChange(
                "text-purple-500",
                "text-green-500",
                "bg-orange-500",
              )
            }
          />
          <ColorButton
            colors={["bg-pink-500", "bg-teal-500", "bg-indigo-500"]}
            onClick={() =>
              handleColorChange(
                "text-pink-500",
                "text-teal-500",
                "bg-indigo-500",
              )
            }
          />
          <ColorButton
            colors={["bg-gray-500", "bg-red-500", "bg-yellow-500"]}
            onClick={() =>
              handleColorChange(
                "text-gray-500",
                "text-red-500",
                "bg-yellow-500",
              )
            }
          />
          <ColorButton
            colors={["bg-green-500", "bg-blue-500", "bg-purple-500"]}
            onClick={() =>
              handleColorChange(
                "text-green-500",
                "text-blue-500",
                "bg-purple-500",
              )
            }
          />
          <ColorButton
            colors={["bg-orange-500", "bg-pink-500", "bg-teal-500"]}
            onClick={() =>
              handleColorChange(
                "text-orange-500",
                "text-pink-500",
                "bg-teal-500",
              )
            }
          />
          <ColorButton
            colors={["bg-indigo-500", "bg-gray-500", "bg-red-500"]}
            onClick={() =>
              handleColorChange(
                "text-indigo-500",
                "text-gray-500",
                "bg-red-500",
              )
            }
          />
          <ColorButton
            colors={["bg-yellow-500", "bg-green-500", "bg-blue-500"]}
            onClick={() =>
              handleColorChange(
                "text-yellow-500",
                "text-green-500",
                "bg-blue-500",
              )
            }
          />
          <ColorButton
            colors={["bg-purple-500", "bg-orange-500", "bg-pink-500"]}
            onClick={() =>
              handleColorChange(
                "text-purple-500",
                "text-orange-500",
                "bg-pink-500",
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
