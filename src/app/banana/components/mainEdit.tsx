"use client";

export default function MainEdit() {
  return (
    <main className="flex w-full flex-col items-center justify-center bg-gray-700 p-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Sample Content Blocks */}
        <div className="h-48 rounded-lg bg-gray-600 p-4">
          <h2 className="text-xl font-bold text-white">Section 1</h2>
          <p className="mt-2 text-white/80">Content goes here</p>
        </div>
        <div className="h-48 rounded-lg bg-gray-600 p-4">
          <h2 className="text-xl font-bold text-white">Section 2</h2>
          <p className="mt-2 text-white/80">Content goes here</p>
        </div>
        <div className="h-48 rounded-lg bg-gray-600 p-4">
          <h2 className="text-xl font-bold text-white">Section 3</h2>
          <p className="mt-2 text-white/80">Content goes here</p>
        </div>
        <div className="h-48 rounded-lg bg-gray-600 p-4">
          <h2 className="text-xl font-bold text-white">Section 4</h2>
          <p className="mt-2 text-white/80">Content goes here</p>
        </div>
      </div>
    </main>
  );
}
