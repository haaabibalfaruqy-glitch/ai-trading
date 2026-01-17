"use client";

import { SearchBarProps } from "@/lib/componentTypes";

export default function SearchBar({ search, setSearch, filteredCoins }: SearchBarProps) {
  return (
    <div className="container mx-auto mt-6 flex items-center gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search coin..."
        className="w-full p-3 rounded-lg bg-[#0B1220] border border-[#1F2937] text-white placeholder:text-gray-400"
      />
      <span className="text-gray-400 text-sm">{filteredCoins.length} coins</span>
    </div>
  );
}
