import React from "react";

interface Category {
  _id: string;
  name: string;
}

interface CategoriesProps {
  categories: Category[];
  selectedCategories: number[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

const Categories: React.FC<CategoriesProps> = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  dropdownOpen,
  setDropdownOpen,
  dropdownRef,
}) => {
  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Categories
      </label>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2 text-left"
      >
        {selectedCategories.length === 0 ? (
          <span className="text-gray-500">Select Categories</span>
        ) : (
          selectedCategories.map((categoryId) => {
            const category = categories.find(
              (c) => Number(c._id) == categoryId
            );

            return (
              category && (
                <span
                  key={category._id}
                  className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2"
                >
                  {category.name}
                </span>
              )
            );
          })
        )}
      </button>
      {dropdownOpen && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {categories.map((category) => {
            const categoryId = Number(category._id);
            const isSelected = selectedCategories.includes(categoryId);

            const handleChange = () => {
              setSelectedCategories((prev) =>
                isSelected
                  ? prev.filter((id) => id !== categoryId)
                  : [...prev, categoryId]
              );
            };

            return (
              <label
                key={category._id}
                className={`flex items-center px-4 py-2 cursor-pointer transition rounded ${
                  isSelected
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={handleChange}
                  className="mr-2 accent-blue-600"
                />
                {category.name}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
