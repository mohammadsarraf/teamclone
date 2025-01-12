import { FaPiedPiper, FaPiedPiperAlt, FaSearchengin } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <aside className="w-1/6 bg-gray-700 p-4 text-white transition-all duration-500">
      <div className="mb-20 flex items-center justify-between text-2xl">
        <FaPiedPiper />
        <FaSearchengin className="text-xl" />
      </div>
      <nav className="flex flex-col space-y-2">
        <button className="p-2 text-left hover:underline">Website</button>
        <button className="p-2 text-left hover:underline">
          Products & Services
        </button>
        <button className="p-2 text-left hover:underline">
          Content & Memberships
        </button>
        <button className="p-2 text-left hover:underline">Scheduling</button>
        <button className="p-2 text-left hover:underline">Donations</button>
        <button className="p-2 text-left hover:underline">Invoicing</button>
        <button className="p-2 text-left hover:underline">Marketing</button>
        <button className="p-2 text-left hover:underline">Contacts</button>
        <button className="p-2 text-left hover:underline">Analytics</button>
        <button className="p-2 text-left hover:underline">Finance</button>
      </nav>
    </aside>
  );
}
