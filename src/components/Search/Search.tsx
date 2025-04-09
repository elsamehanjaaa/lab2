"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react"; // Importing the search icon from lucide-react

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Redirect to the search page with the query
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  // Determine if the input is filled to apply the hover effect on the icon
  const iconColor = searchQuery ? "text-[#e9ada4]" : "text-[#47d6e8]";

  return (
    <form onSubmit={handleSearch} className="flex-1 mx-6 flex justify-end">
  <div className="flex items-center border-2 border-white rounded-full overflow-hidden">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search courses..."
      className="px-4 py-1 w-130 focus:outline-none text-white bg-transparent rounded-l-full"
    />
    <button
      type="submit"
      className="p-2 bg-white hover:bg-gray-200 transition-colors duration-300 rounded-r-full h-full flex items-center justify-center"
      aria-label="Search"
    >
      <SearchIcon
        className={`text-gray-800 ${iconColor} hover:text-[#e9ada4]`}
        size={20}
      />
    </button>
  </div>
</form>

  );
};

export default Search;
