import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

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

const CourseFilters = ({
  onCategoryChange,
  onRatingChange,
  onPriceRangeChange,
  fetchByQuery,
}: {
  onCategoryChange: (id: string) => void;
  onRatingChange: (rating: number) => void;
  onPriceRangeChange: (priceRange: [any, any]) => void;
  fetchByQuery: () => void;
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedPrice, setSelectedPrice] = useState<string>(""); // Track free/paid
  const [isPriceRangeVisible, setIsPriceRangeVisible] =
    useState<boolean>(false);
  const [startPrice, setStartPrice] = useState<number | string>(""); // Start price can be string (empty) or number
  const [endPrice, setEndPrice] = useState<number | string>(""); // End price can be string (empty) or number

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
    setSelectedCategoryId(category._id);
    onCategoryChange(category._id);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    onRatingChange(rating);
  };

  const handlePriceChange = (price: string) => {
    setSelectedPrice(price);
    if (price === "paid") {
      setIsPriceRangeVisible(true); // Show price fields when "Paid" is selected
    } else {
      setIsPriceRangeVisible(false); // Hide price fields when "Free" is selected
      onPriceRangeChange([0, 0]); // Reset price range if "Free" is selected
    }
  };

  const handleClearFilters = () => {
    setSelectedRating(null);
    setSelectedCategoryId(null);
    setSelectedPrice("");
    setStartPrice(""); // Reset start price
    setEndPrice("");
    onCategoryChange("");
    onRatingChange(0);
    onPriceRangeChange([undefined, undefined]);
    fetchByQuery();
  };

  const handlePriceRangeChange = () => {
    if (startPrice && endPrice) {
      onPriceRangeChange([Number(startPrice), Number(endPrice)]); // Passing price range to parent
    }
  };

  // Handle change for the start and end price
  const handleStartPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartPrice(value === "" ? "" : Number(value)); // Allow empty value or convert to number
  };

  const handleEndPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndPrice(value === "" ? "" : Number(value)); // Allow empty value or convert to number
  };

  return (
    <div className="w-1/3 p-4 text-black rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex justify-between items-center">
        Filters
        <button
          onClick={handleClearFilters}
          className="text-sm text-[#e9ada4] hover:underline"
        >
          Clear Filters
        </button>
      </h2>

      {/* Rating Dropdown */}
      <Dropdown title="Rating">
        <div className="space-x-2 text-sm">
          {Array.from({ length: 5 }, (_, index) => {
            const stars = 5 - index;
            const isSelected = selectedRating === stars;

            return (
              <div
                key={stars}
                className={`group flex items-center gap-2 cursor-pointer rounded-md p-2 transition 
                  ${isSelected ? "bg-[#e9ada4]" : "hover:bg-[#e9ada4]"}`}
                onClick={() => handleRatingChange(stars)}
              >
                <input
                  type="radio"
                  name="rating"
                  value={stars}
                  className="hidden peer"
                />
                <label
                  className={`w-4 h-4 rounded-full cursor-pointer transition duration-200 ease-in-out
                    ${
                      isSelected
                        ? "bg-white"
                        : "bg-[#e9ada4] group-hover:bg-white"
                    }`}
                />
                <span
                  className={`transition-colors duration-200 
                    ${isSelected ? "text-white" : "group-hover:text-white"}`}
                >
                  {stars}
                </span>
                {Array.from({ length: stars }, (_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`transition-colors duration-200 
                      ${
                        isSelected
                          ? "text-white"
                          : "text-[#e9ada4] group-hover:text-white"
                      }`}
                  />
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
              className={`block px-4 py-2 rounded-md transition-all cursor-pointer 
                ${
                  selectedCategoryId === category._id
                    ? "bg-[#e9ada4] text-white"
                    : "text-black hover:bg-[#e9ada4] hover:text-white"
                }`}
            >
              {category.name}
            </div>
          ))}
        </div>
      </Dropdown>

      {/* Price Dropdown */}
      <Dropdown title="Price">
        <div className="space-y-2 text-sm">
          <div
            onClick={() => handlePriceChange("free")}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all ${
              selectedPrice === "free"
                ? "bg-[#e9ada4] text-white"
                : "hover:bg-[#e9ada4] hover:text-white"
            }`}
          >
            Free
          </div>
          <div
            onClick={() => handlePriceChange("paid")}
            className={`cursor-pointer px-4 py-2 rounded-md transition-all ${
              selectedPrice === "paid"
                ? "bg-[#e9ada4] text-white"
                : "hover:bg-[#e9ada4] hover:text-white"
            }`}
          >
            Paid
          </div>
        </div>

        {/* Price Range Inputs (visible when "Paid" is selected) */}
        {isPriceRangeVisible && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Start Price:</span>
              <span>End Price:</span>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                value={startPrice}
                onChange={handleStartPriceChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Start Price"
              />
              <input
                type="number"
                value={endPrice}
                onChange={handleEndPriceChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                placeholder="End Price"
              />
            </div>

            <div className="mt-2 text-sm text-center">
              {startPrice}€ - {endPrice}€
            </div>

            <button
              onClick={handlePriceRangeChange}
              className="mt-2 px-4 py-2 bg-[#e9ada4] text-white rounded-md"
            >
              Apply
            </button>
          </div>
        )}
      </Dropdown>
    </div>
  );
};

export default CourseFilters;
