import { AiOutlineSearch } from "react-icons/ai";
import { CgScrollH } from "react-icons/cg";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  FaChartSimple,
  FaCode,
  FaGripLinesVertical,
  FaImage,
  FaMarkdown,
  FaShapes,
} from "react-icons/fa6";
import { GiNotebook } from "react-icons/gi";
import { ImEmbed } from "react-icons/im";
import {
  MdAudioFile,
  MdLibraryBooks,
  MdOutlineFormatListBulleted,
  MdOutlineOndemandVideo,
  MdSmartButton,
} from "react-icons/md";
import { RiText } from "react-icons/ri";
import { SlCalender, SlEnvolopeLetter } from "react-icons/sl";
import { TbSocial } from "react-icons/tb";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";

interface AddBlockProps {
  handleClose: () => void;
  handleAddBlock: (blockType: string) => void;
}

export default function AddBlock({
  handleClose,
  handleAddBlock,
}: AddBlockProps) {
  return (
    <div className="absolute -top-[30rem] left-80 size-96 -translate-x-1/2 overflow-auto rounded-xl bg-white p-4 text-black ">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute right-2 top-2 text-red-600 hover:text-red-800"
      >
        ✕
      </button>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2 rounded border px-2 py-1">
        <AiOutlineSearch size={20} className="text-gray-600" />
        <input
          type="text"
          placeholder="Search..."
          className="grow text-sm text-gray-800 outline-none"
        />
      </div>

      {/* Options */}
      <h3 className="mb-2 border-b px-4 text-lg font-bold">Basic</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAddBlock("Text Block")}
          className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400"
        >
          <RiText className="mr-4 flex items-center text-blue-600" size={20} />
          <span className="text-black">Text</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaImage className="mr-4 flex items-center text-blue-600" size={20} />
          <span className="text-black">Image</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <MdSmartButton
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Button</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <MdOutlineOndemandVideo
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Vidoe</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <MdOutlineFormatListBulleted
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Form</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <MdAudioFile
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Audio</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <SlEnvolopeLetter
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Newsletter</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <TfiLayoutAccordionSeparated
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Accordion</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaShapes
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Shape</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <CgScrollH
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Scrolling</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaGripLinesVertical
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Line</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <GiNotebook
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Quote</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaMapMarkerAlt
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Map</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <ImEmbed className="mr-4 flex items-center text-blue-600" size={20} />
          <span className="text-black">Embed</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaMarkdown
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Markdown</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaCode className="mr-4 flex items-center text-blue-600" size={20} />
          <span className="text-black">Code</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <MdLibraryBooks
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Summary</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <SlCalender
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Calender</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <TbSocial
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Social Links</span>
        </button>
        <button className="justify-left flex items-center rounded bg-white px-4 py-2 text-black transition-all hover:bg-blue-400">
          <FaChartSimple
            className="mr-4 flex items-center text-blue-600"
            size={20}
          />
          <span className="text-black">Charts</span>
        </button>
      </div>
    </div>
  );
}
