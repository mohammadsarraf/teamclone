'use client'
import { MdOutlinePhoneIphone } from "react-icons/md";
import { TbDeviceImac } from "react-icons/tb";
import FigmaMode from "../figma/page";
import Edit from "../utils/edit";
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex flex-row h-screen w-screen bg-gray-100">
            <div className="flex flex-col bg-gray-200 text-black w-3/4 border border-gray-300 shadow-lg rounded-lg">
                <div className="flex flex-row h-12 items-center gap-4 text-xl p-4 border-b border-gray-500">
                    <button 
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                        onClick={() => router.push('/templates')}
                    >
                        {`< Template`}
                    </button>
                    <div className="flex items-center gap-2">
                        <TbDeviceImac className="text-gray-500"/>
                        <MdOutlinePhoneIphone className="text-gray-500"/>
                    </div>
                </div>
                <div className="flex-1 m-10 rounded-lg">
                    <div className="flex bg-black overflow-auto rounded-lg w-full h-full">
                        <Edit />
                    </div>
                </div>
            </div>
            <div className="flex bg-white text-black w-1/4 border-l border-gray-300 p-4 rounded-lg">
                {/* Additional content can be added here */}
            </div>
        </div>
    )
}