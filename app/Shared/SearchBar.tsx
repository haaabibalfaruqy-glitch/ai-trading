"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  delay?: number; // debounce delay (ms)
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search coins...",
  onSearch,
  delay = 300,
}) => {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), delay);
    return () => clearTimeout(timer);
  }, [query, delay]);

  // Emit search
  useEffect(() => {
    if (onSearch) onSearch(debounced.trim());
  }, [debounced, onSearch]);

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Input */}
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full pl-9 pr-9 py-2 text-sm rounded-xl
          bg-[#0B1220] border border-[#1F2937]
          text-white placeholder-gray-500
          focus:outline-none focus:border-[#22ff88]/60
          focus:shadow-[0_0_0_1px_rgba(34,255,136,0.25)]
          transition-all
        "
      />

      {/* Clear Button */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
