import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import Categories from "@/components/Courses/Categories"; // Import the Categories component

const Dropdown = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 text-black px-4 py-2 rounded-md font-medium text-left flex items-center justify-between hover:border-gray-500 transition bg-transparent"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <div className="mt-2 border border-gray-200 p-3 rounded-md text-black shadow-sm bg-transparent">
          {children ? (
            children
          ) : (
            <p className="text-sm leading-relaxed">
              Zgedhe ni kategori tjeter se hala su ndreq qikjo!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const CourseFilters = ({ onCategoryChange }: { onCategoryChange: (id: string) => void }) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]); // Add categories state
  const [selectedPrice, setSelectedPrice] = useState<string>(""); // Price state



  // Fetch categories from API
  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch("http://localhost:5000/categories", {
        method: "GET",
        credentials: "include",
      });
      const result = await res.json();
      setCategories(result);
    };
    getCategories();
    
  }, []);

  const handleTopicChange = (category: any) => {
    onCategoryChange(category._id);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
  };

  const handlePriceChange = (price: string) => {
    setSelectedPrice(price);
  };

  return (
    <div className="w-1/3 p-4 text-black rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Filters</h2>

      {/* Rating Dropdown with Custom Radio Button */}
      <Dropdown title="Rating">
        <div className="space-x-2 text-sm">
          {Array.from({ length: 4 }, (_, index) => {
            const stars = 4 - index;
            return (
              <div
                key={stars}
                className={`flex items-center gap-2 cursor-pointer ${selectedRating === stars ? "bg-[#e9ada4]" : ""} rounded-md p-2 transition`}
                onClick={() => handleRatingChange(stars)}
              >
                <input
                  type="radio"
                  name="rating"
                  value={stars}
                  checked={selectedRating === stars}
                  onChange={() => handleRatingChange(stars)}
                  className="hidden peer"
                />
                <label
                  className={`w-4 h-4 rounded-full cursor-pointer
                    ${selectedRating === stars ? "bg-white border-[white]" : "bg-white border-black"}
                    border-[1px] transition duration-200 ease-in-out peer-checked:border-[white]`}
                />
                <span>{stars}</span>
                {Array.from({ length: stars }, (_, i) => (
                  <Star key={i} size={16} color={selectedRating === stars ? "#fff" : "#e9ada4"} />
                ))}
              </div>
            );
          })}
        </div>
      </Dropdown>

      {/* Topics Dropdown */}
      <Dropdown title="Topic">
        <div className="space-y-2 max-h-48 overflow-y-auto"> 
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleTopicChange(category)}
            className="block text-black hover:bg-[#e9ada4] hover:text-white px-4 py-2 rounded-md transition-all cursor-pointer"
          >
            {category.name}
          </div>
        ))}
        </div>
      </Dropdown>

      <Dropdown title="Video Duration" />

      {/* Price Dropdown */}
      <Dropdown title="Price">
        <div className="space-y-2 text-sm">
          <div
            onClick={() => handlePriceChange("free")}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all ${
              selectedPrice === "free" ? "bg-[#e9ada4]" : ""
            }`}
          >
            Free
          </div>
          <div
            onClick={() => handlePriceChange("paid")}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all ${
              selectedPrice === "paid" ? "bg-[#e9ada4]" : ""
            }`}
          >
            Paid
          </div>
        </div>
      </Dropdown>

    </div>
  );
};

export default CourseFilters;
