import { FaPiedPiperAlt } from "react-icons/fa6";

export default function Sidebar() {
  return (
    <aside className="w-1/5 bg-gray-700 p-4 text-white transition-all duration-500">
      <div className="mb-4 flex items-center justify-between">
        <FaPiedPiperAlt className="text-2xl" />
        <span className="icon">🔎</span>
      </div>
      <nav className="space-y-2">
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Website
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Products & Services
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Content & Memberships
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Scheduling
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Donations
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Invoicing
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Marketing
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Contacts
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Analytics
        </button>
        <button className="w-full rounded p-2 text-left hover:bg-gray-500">
          Finance
        </button>
      </nav>
    </aside>
  );
}
