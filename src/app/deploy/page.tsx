'use client';
import { useSearchParams } from "next/navigation";
import Edit from "../utils/edit";

export default function Home() {
  const searchParams = useSearchParams();
  const primaryColor = searchParams.get("primaryColor");
  const secondaryColor = searchParams.get("secondaryColor");
  const bgColor = searchParams.get("bgColor");

  return (
    <main className="flex h-screen w-screen overflow-auto">
      <Edit
        primaryColor={primaryColor || "text-blue-500"}
        secondaryColor={secondaryColor || "text-red-500"}
        bgColor={bgColor || "bg-gray-900"}
      />
    </main>
  );
}