import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Courses/Card";
import TopSection from "@/components/TopSection";

const SearchPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

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

  return (
    <div>
      {/* Top Section */}
      <TopSection title={`Results for: '${query}'`} text1={`${courses.length}`} text2="Courses Available" />

      <div className="flex gap-8 mt-8">
        {/* Left Side - Pink Background */}
        <div className="w-1/3 bg-pink-500 p-4 text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Random Text Section</h2>
          <p className="text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan arcu. Nulla facilisi. Mauris vulputate lacus nec malesuada tincidunt. Vivamus auctor erat id quam varius, ut consectetur purus vehicula.
          </p>
        </div>

        {/* Right Side - Course Cards in Rows */}
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
