import { FaSearch } from "react-icons/fa";
import { 
  HiHome,
  HiTemplate,
  HiShoppingBag,
  HiDocumentText,
  HiCalendar,
  HiHeart,
  HiCreditCard,
  HiSpeakerphone,
  HiUserGroup,
  HiChartBar,
  HiCurrencyDollar
} from "react-icons/hi";

export default function Sidebar() {
  const menuItems = [
    { icon: <HiHome className="size-5" />, text: "Home" },
    { icon: <HiTemplate className="size-5" />, text: "Design" },
    { icon: <HiShoppingBag className="size-5" />, text: "Commerce" },
    { icon: <HiDocumentText className="size-5" />, text: "Pages" },
    { icon: <HiCalendar className="size-5" />, text: "Scheduling" },
    { icon: <HiHeart className="size-5" />, text: "Campaigns" },
    { icon: <HiCreditCard className="size-5" />, text: "Payments" },
    { icon: <HiSpeakerphone className="size-5" />, text: "Marketing" },
    { icon: <HiUserGroup className="size-5" />, text: "Customers" },
    { icon: <HiChartBar className="size-5" />, text: "Analytics" },
    { icon: <HiCurrencyDollar className="size-5" />, text: "Billing" },
  ];

  return (
    <aside className="w-[250px] bg-[#1b1b1b] text-[#999999] shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="border-b border-[#2d2d2d] px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="size-8 rounded-sm bg-white"></div>
            <span className="text-sm font-medium text-white">My Website</span>
          </div>
          <FaSearch className="text-lg hover:text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="group mb-1 flex w-full items-center rounded-md px-3 py-2.5 text-left transition-all hover:bg-[#2d2d2d]"
          >
            <span className="mr-3 text-[#999999] transition-colors group-hover:text-white">
              {item.icon}
            </span>
            <span className="text-sm font-medium tracking-wide transition-colors group-hover:text-white">
              {item.text}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
