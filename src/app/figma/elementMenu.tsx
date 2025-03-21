import {
  HiOutlineShoppingCart,
  HiOutlineTemplate,
  HiOutlineUser,
} from "react-icons/hi";
import { TiSocialSkypeOutline } from "react-icons/ti";

interface ElementToolbarProps {
  elements: {
    isButton: boolean;
    isSocial: boolean;
    isCart: boolean;
    isAccount: boolean;
  };
  onElementChange: (
    elementType: "isButton" | "isSocial" | "isCart" | "isAccount",
    value: boolean,
  ) => void;
}

export default function ElementToolbar({
  elements,
  onElementChange,
}: ElementToolbarProps) {
  const menuItems = [
    {
      id: "isButton",
      name: "Button",
      icon: <HiOutlineTemplate className="size-5" />,
      description: "Add call-to-action button",
    },
    {
      id: "isSocial",
      name: "Social Links",
      icon: <TiSocialSkypeOutline className="size-5" />,
      description: "Add social media links",
    },
    {
      id: "isCart",
      name: "Shopping Cart",
      icon: <HiOutlineShoppingCart className="size-5" />,
      description: "Add shopping cart",
    },
    {
      id: "isAccount",
      name: "Account",
      icon: <HiOutlineUser className="size-5" />,
      description: "Add account access",
    },
  ];

  return (
    <div className="space-y-4">
      {menuItems.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-gray-500">{item.icon}</div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={elements[item.id as keyof typeof elements]}
              onChange={(e) =>
                onElementChange(
                  item.id as "isButton" | "isSocial" | "isCart" | "isAccount",
                  e.target.checked,
                )
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600">
              <span
                className={`absolute left-1 top-1 size-4 rounded-full bg-white transition-transform duration-200 ${
                  elements[item.id as keyof typeof elements]
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>
      ))}
    </div>
  );
}
