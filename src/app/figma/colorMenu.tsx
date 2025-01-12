export default function ColorMenu() {
  return (
    <div>
      <ul className="flex flex-col gap-2">
        <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
          Color Option 1
        </li>
        <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
          Color Option 2
        </li>
        <li className="cursor-pointer rounded px-4 py-2 hover:bg-gray-100">
          Color Option 3
        </li>
      </ul>{" "}
    </div>
  );
}
