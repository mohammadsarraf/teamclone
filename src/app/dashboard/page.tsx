"use client";
import { useRouter } from "next/navigation";
import Navbar from "./navbar";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen w-screen justify-between bg-white">
      <Navbar />
      <div className="flex items-center px-48">
        <div className="flex w-full items-center justify-between py-24">
          <p className="flex text-3xl text-black">Dashboard</p>
          <button
            className="flex border border-black bg-black p-2 text-xl text-white"
            onClick={() => {
              router.push("/templates");
            }}
          >
            Create Website
          </button>
        </div>
      </div>
      <div className="flex w-full px-48">
        <div className="flex w-full items-center justify-center border py-24">
          <p className="flex text-center text-2xl text-black">
            Create a website with FrozenMango
          </p>
        </div>
      </div>
    </div>
  );
}
