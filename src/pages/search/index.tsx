import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TopSection from "@/components/TopSection";
import CourseFilters from "@/components/Search/Filterbar";
import CardHorizontal from "@/components/Search/CardHorizontal";
import SortAndFilter from "@/components/Search/SortAndFilter";

const SearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number] | null
  >(null);
  const [sortOption, setSortOption] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const fetchFilteredCourses = async () => {
    setLoading(true);
    try {
      const filters: any = {
        query,
        rating: selectedRating || undefined,
        categoryId: selectedCategory || undefined,
        startPrice: selectedPriceRange ? selectedPriceRange[0] : undefined,
        endPrice: selectedPriceRange ? selectedPriceRange[1] : undefined,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/getFilteredCourses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(filters),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch filtered courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching filtered courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredCourses();
  }, [query, selectedCategory, selectedRating, selectedPriceRange]);

  const sortCourses = (courses: any[]) => {
    if (sortOption === "rating_desc") {
      return [...courses].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "price_asc") {
      return [...courses].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      return [...courses].sort((a, b) => b.price - a.price);
    } else if (sortOption === "newest") {
      return [...courses].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === "highest_enrolled") {
      return [...courses].sort((a, b) => b.enrollments - a.enrollments);
    }
    return courses;
  };

  const sortedCourses = sortCourses(courses);

  return (
    <div>
      <div className="relative text-white overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-blue-950/20" />{" "}
        {/* Optional: dark overlay for contrast */}
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* Query results (if any) */}
            {query && (
              <div className="mb-6">
                <p className="text-white text-2xl font-semibold mb-1">
                  Showing results for:{" "}
                  <span className="italic font-bold text-blue-900">
                    "{query}"
                  </span>
                </p>
                <p className="text-white text-lg">
                  {courses.length} course{courses.length !== 1 ? "s" : ""} found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 px-4">
        {/* Header with Filter + Sort */}
        <SortAndFilter
          sortOption={sortOption}
          setSortOption={setSortOption}
          showFilters={showFilters}
          toggleFilters={() => setShowFilters((prev) => !prev)}
        />

        <div className="flex gap-8">
          {/* Conditional Filter Bar */}
          {showFilters && (
            <CourseFilters
              onCategoryChange={setSelectedCategory}
              onRatingChange={setSelectedRating}
              onPriceRangeChange={setSelectedPriceRange}
              fetchByQuery={fetchFilteredCourses}
            />
          )}

          {/* Courses Side */}
          <div className={showFilters ? "w-2/3" : "w-full"}>
            {loading ? (
              <p>Loading...</p>
            ) : sortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {sortedCourses.map((course: any, i: number) => (
                  <CardHorizontal key={i} course={course} />
                ))}
              </div>
            ) : (
              <p>No courses found for "{query}"</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
