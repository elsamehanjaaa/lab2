import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Courses/Card";
import TopSection from "@/components/TopSection";
import CourseFilters from "@/components/Filterbar";

// Krijoni interface-n për kursin. Shtoni ose ndryshoni fushat sipas API-së suaj.
interface Course {
  _id: string;
  title: string;
  description?: string;
  price?: number; // Shtoni çmimin nëse kërkohet
  rating?: number; // Shtoni vlerësimin nëse kërkohet
  status?: string; // Shtoni statusin nëse kërkohet
  created_at?: string; // Shtoni datën e krijimit nëse kërkohet
  slug?: string; // Shtoni slug nëse kërkohet
}



const SearchPage = () => {
  // Deklarojmë 'courses' si array me tipe Course[]
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [query]);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchCoursesByTopic = async () => {
      try {
        const res = await fetch("http://localhost:5000/courses/getCoursesByCategory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: selectedCategory }),
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const data: Course[] = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesByTopic();
  }, [selectedCategory]);

  return (
    <div>
      <TopSection
        title={`Results for: '${query}'`}
        text1={`${courses.length}`}
        text2="Courses Available"
      />
      <div className="max-w-6xl mx-auto flex gap-8 mt-8 px-4">
        {/* Filtrat */}
        <CourseFilters onCategoryChange={setSelectedCategory} />

        {/* Lista e kurseve */}
        <div className="w-2/3">
          {loading ? (
            <p>Loading...</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {courses.map((course) => (
                <Card key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <p>No courses found for -{query}-</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
