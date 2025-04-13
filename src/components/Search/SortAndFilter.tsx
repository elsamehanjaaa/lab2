// components/SortAndFilter.tsx

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SortAndFilterProps {
  sortOption: string;
  setSortOption: (option: string) => void;
  showFilters: boolean;
  toggleFilters: () => void;
}

const SortAndFilter: React.FC<SortAndFilterProps> = ({
  sortOption,
  setSortOption,
  showFilters,
  toggleFilters,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sortLabel = (val: string) => {
    switch (val) {
      case "rating_desc":
        return "Highest Rating";
      case "price_asc":
        return "Price: Low to High";
      case "price_desc":
        return "Price: High to Low";
      case "newest":
        return "Newest";
      case "highest_enrolled":
        return "Most Popular";
      default:
        return "Most Relevant";
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="flex items-center gap-4 mb-4 relative">
      {/* Filter Toggle Button */}
      <button
        onClick={toggleFilters}
        className={`flex items-center gap-2 px-4 py-2 border rounded transition ${
          showFilters
            ? "bg-[#f8d5d0] border-[#e9ada4] text-[#a75a50]"
            : "bg-white border-gray-300 text-gray-700"
        } hover:bg-[#f8d5d0]`}
      >
        <div className="flex flex-col justify-between h-4 w-4">
          <span className="block w-full h-0.5 bg-current"></span>
          <span className="block w-2/3 h-0.5 bg-current"></span>
          <span className="block w-1/2 h-0.5 bg-current"></span>
        </div>
        <span>Filters</span>
      </button>

      {/* Sort By Dropdown */}
      <div className="relative text-sm">
        <div
          className={`border rounded px-4 py-2 cursor-pointer w-52 flex flex-col transition ${
            sortOption !== ""
              ? "bg-[#f8d5d0] border-[#e9ada4] text-[#a75a50]"
              : "bg-white border-gray-300 text-gray-700"
          } hover:bg-[#f8d5d0] hover:border-[#e9ada4] hover:text-[#a75a50]`}
          onClick={toggleDropdown}
        >
          <span className="text-gray-500 font-medium mb-1">Sort By</span>
          <div className="flex items-center justify-between text-base">
            <span>{sortLabel(sortOption)}</span>
            {isDropdownOpen ? (
              <ChevronUp size={18} className="ml-2 transition-transform duration-200" />
            ) : (
              <ChevronDown size={18} className="ml-2 transition-transform duration-200" />
            )}
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded shadow z-10">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSortOption("");
                setIsDropdownOpen(false);
              }}
            >
              Most Relevant
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSortOption("rating_desc");
                setIsDropdownOpen(false);
              }}
            >
              Highest Rating
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSortOption("price_asc");
                setIsDropdownOpen(false);
              }}
            >
              Price: Low to High
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSortOption("price_desc");
                setIsDropdownOpen(false);
              }}
            >
              Price: High to Low
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSortOption("newest");
                setIsDropdownOpen(false);
              }}
            >
              Newest
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSortOption("highest_enrolled");
                setIsDropdownOpen(false);
              }}
            >
              Most Popular
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortAndFilter;
