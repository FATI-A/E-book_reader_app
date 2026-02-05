import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative mt-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="py-4 pl-12 pr-4 text-base sm:text-lg text-gray-900" />
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for a book…"
        className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus:border-gray-300 focus:shadow-md"
      />
    </div>
  );
}
