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
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number] | null>(null); // Added price range state
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  // Fetch all courses (default or when filters are reset)
  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/courses", { // Adjust the URL accordingly
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCourses(data); // Set courses state to all courses
    } catch (error) {
      console.error("Error fetching all courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses by search query
  useEffect(() => {
    if (!query) return;

    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/courses/GetCoursesByQuery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [query]);

  // Fetch courses by rating filter
  useEffect(() => {
    if (!selectedRating) return;

    const fetchCoursesByRating = async () => {
      try {
        const res = await fetch("http://localhost:5000/courses/getCoursesByRating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ rating: selectedRating }),
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Rating filter error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByRating();
  }, [selectedRating]);

  // Fetch courses by category filter
  useEffect(() => {
    if (!selectedCategory) return;

    const fetchCoursesByCategory = async () => {
      try {
        const res = await fetch("http://localhost:5000/courses/getCoursesByCategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: selectedCategory }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Category filter error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByCategory();
  }, [selectedCategory]);

  // Fetch courses by price range filter
  useEffect(() => {
    if (!selectedPriceRange) return;

    const fetchCoursesByPriceRange = async () => {
      try {
        const res = await fetch("http://localhost:5000/courses/getCoursesByPriceRange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ startPrice: selectedPriceRange[0], endPrice: selectedPriceRange[1] }), // Pass the correct params
        });
    
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Price range filter error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByPriceRange();
  }, [selectedPriceRange]);

  return (
    <div>
      <TopSection
        title={`Results for: '${query}'`}
        text1={`${courses.length}`}
        text2="Courses Available"
      />
      <div className="max-w-6xl mx-auto flex gap-8 mt-8 px-4">
        {/* Filter Bar */}
        <CourseFilters
          onCategoryChange={setSelectedCategory}
          onRatingChange={setSelectedRating}
          onPriceRangeChange={setSelectedPriceRange}  // Pass price range change handler
          fetchAllCourses={fetchAllCourses}
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
