"use client";
import { useSearchParams } from "next/navigation";
import Edit from "../utils/edit";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const searchParams = useSearchParams();
  const primaryColor = searchParams.get("primaryColor");
  const secondaryColor = searchParams.get("secondaryColor");
  const bgColor = searchParams.get("bgColor");

  return (
    <div className="flex overflow-auto">
      <Edit
        primaryColor={primaryColor || "text-blue-500"}
        secondaryColor={secondaryColor || "text-red-500"}
        bgColor={bgColor || "bg-gray-900"}
        isEdit={true}
      />
    </div>
  );
}
