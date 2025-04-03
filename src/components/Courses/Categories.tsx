import React, { useEffect, useState, useRef } from "react";

// Define the type for each category
interface Category {
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Use Category[] for the categories state
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Explicitly type the refs
  const navRef = useRef<HTMLDivElement | null>(null);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current && placeholderRef.current) {
        const navTop = placeholderRef.current.getBoundingClientRect().top;
        setIsSticky(navTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:5000/categories", {
        method: "GET", // Corrected the method to "GET"
        credentials: "include",
      });

      const result = await res.json();
      setCategories(result);
    };
    getCategories();
  }, []);

  // Split the categories into two parts: the first 7 categories and the rest
  const visibleCategories = categories.slice(0, 7); // First 7 categories
  const hiddenCategories = categories.slice(7); // Remaining categories

  return (
    <>
      <div ref={placeholderRef} className="h-[50px] -mt-[50px]" />

      {/* Navigation Menu */}
      <div
        ref={navRef}
        className={`inset-x-0 bg-[#e9ada4] m-0 p-0 transition-all ${
          isSticky ? "fixed top-[70px] left-0 w-full shadow-lg z-50" : "relative"
        }`}
      >
        <nav className="flex justify-between py-2 text-white">
          {visibleCategories.map((category, i) => (
            <a
              key={i} // Add a key to the elements for better React handling
              href="#"
              className="text-white hover:bg-white hover:text-[#e9ada4] px-4 py-2 rounded-l-full rounded-r-full transition-all flex-grow text-center"
            >
              {category.name}
            </a>
          ))}

          {/* Dropdown for remaining categories */}
          {hiddenCategories.length > 0 && (
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="text-white hover:bg-white hover:text-[#e9ada4] px-4 py-2 rounded-l-full rounded-r-full transition-all flex-grow text-center">
                ...
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-0 w-48 bg-[#e9ada4] text-white shadow-lg rounded-lg z-50">
                  {hiddenCategories.map((category, i) => (
                    <a
                      key={i} // Add a key to the elements for better React handling
                      href="#"
                      className="block px-4 py-2 hover:bg-white hover:text-[#e9ada4] rounded-lg"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Categories;
