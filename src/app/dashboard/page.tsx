"use client";
import Navbar from "./navbar";

export default function Home() {
  return (
    <div className="w-screen min-h-screen justify-between bg-white">
      <Navbar />
      <div className="flex px-48 items-center">
        <div className="flex py-24 items-center justify-between w-full">
          <p className="flex text-3xl text-black">Dashboard</p>
          <button className="flex text-xl border border-black p-2 text-white bg-black">Create Website</button>
        </div>
      </div>
      <div className="flex w-full px-48">
        <div className="flex py-24 border justify-center items-center w-full">
          <p className="flex text-center text-2xl text-black">Create a website with FrozenMango</p>
        </div>
      </div>
    </div>
  );
}