import React from "react";
import NoteHeader from "../NoteHeader";

const Skeleton = () => {
  return (
    <div
      className="flex h-screen w-screen flex-col overflow-x-hidden bg-black font-serif sm:h-screen sm:w-screen"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      <NoteHeader />
      <div className="m-4 h-10 w-24 animate-pulse rounded bg-gray-800" />{" "}
      {/* Restart Cache button */}
      <div className="mx-72 w-3/5 flex-1 pl-4 pt-4">
        <div className="mb-10">
          <div className="h-16 w-2/3 animate-pulse rounded bg-gray-800" />{" "}
          {/* Title skeleton */}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="size-5 animate-pulse rounded bg-gray-800" />{" "}
              {/* Icon */}
              <div className="size-5 animate-pulse rounded bg-gray-800" />{" "}
              {/* Menu icon */}
              <div className="h-8 w-full animate-pulse rounded bg-gray-800" />{" "}
              {/* Content */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
