import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Courses/Card";
import TopSection from "@/components/TopSection";
import CourseFilters from "@/components/Filterbar";

const SearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number] | null
  >(null); // Added price range state
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  // Fetch filtered courses based on all filters
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

      // Send filters to the backend to get the filtered courses
      const res = await fetch(
        "http://localhost:5000/courses/getFilteredCourses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(filters),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch filtered courses");
      const data = await res.json();
      // console.log(data);
      setCourses(data); // Set courses state to the filtered courses
    } catch (error) {
      console.error("Error fetching filtered courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when filters or search query change
  useEffect(() => {
    fetchFilteredCourses();
  }, [query, selectedCategory, selectedRating, selectedPriceRange]);

  const fetchCoursesByQuery = async (query: string | null) => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/courses/GetCoursesByQuery",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query }),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopSection
        title={`Results for: '${query}'`}
        text1={`${courses.length}`}
        text2="Courses Available"
      />
      <div className="max-w-6xl mx-auto flex gap-8 mt-8 px-4">
        s{/* Filter Bar */}
        <CourseFilters
          onCategoryChange={setSelectedCategory}
          onRatingChange={setSelectedRating}
          onPriceRangeChange={setSelectedPriceRange}
          fetchByQuery={fetchFilteredCourses}
        />
        {/* Courses Side */}
        <div className="w-2/3">
          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course: any, i: number) => (
                <Card key={i} course={course} />
              ))}
            </div>
          ) : (
            <p>No courses found for "{query}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
