import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Nav from "../../../../components/Courses/Nav";
import CourseHeader from "../../../../components/Courses/CoursesHeader";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  slug: string;
  courseId: string;
  thumbnail_url?: string;
  instructorName?: string;
  instructorPicture?: string;
  instructorBio?: string;
  categories?: string[];
  updatedAt?: string;
  languages?: string[];
}

const Index = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverThumbnail, setHoverThumbnail] = useState(false);
  const courseContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!courseId) return;


    async function fetchCourse() {
      try {
        const res = await fetch(`http://localhost:5000/courses/${courseId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });


        if (!res.ok) throw new Error("Failed to fetch course");

        const result = await res.json();
        // Fetch category names
        const categoryNames = await Promise.all(
          result.categories.map(async (categoryId: string) => {
            const categoryRes = await fetch(`http://localhost:5000/categories/${categoryId}`);
            if (!categoryRes.ok) throw new Error("Failed to fetch category");
            const category = await categoryRes.json();
            return category.name;
          })
        );

        // Merge category names into the course object
        const courseWithCategoryNames = {
          ...result,
          categories: categoryNames,
        };
        console.log(courseWithCategoryNames);

        setCourse(courseWithCategoryNames);
      } catch (err) {
        setError("An error occurred while fetching the course.");
      } finally {
        setLoading(false);
      }
    }


    fetchCourse();
  }, [courseId]);


  const handleThumbnailClick = () => {
    if (courseContentRef.current) {
      const navHeight = document.querySelector("div.fixed")?.clientHeight || 0;
      window.scrollTo({
        top: courseContentRef.current.offsetTop - navHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Top Navigation */}
      <Nav course={course} />

      {/* ✅ Course Header */}
      {course && (
        <CourseHeader
          course={course}
          hoverThumbnail={hoverThumbnail}
          setHoverThumbnail={setHoverThumbnail}
          handleThumbnailClick={handleThumbnailClick}
        />
      )}

      {/* ✅ Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {loading && <p className="text-center text-lg text-gray-700">Loading course...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && course && (


          <div className="space-y-10">
            {/* What You'll Learn */}
            <div className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Understand core concepts of Next.js</li>
              </ul>
            </div>

            {/* Explore Related Content */}
            {course.categories && course.categories.length > 0 && (
              <div className="bg-white shadow p-6 rounded-md">
                <h3 className="text-xl font-semibold mb-4">Explore Related Content</h3>
                <div className="flex gap-3 flex-wrap">
                  {course.categories.map((category) => (
                    <button
                      key={category}
                      className="bg-purple-700 hover:bg-purple-800 px-4 py-1 rounded text-sm"
                      onClick={() =>
                        router.push(`/courses/category/${encodeURIComponent(category)}`)
                      }
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Understand core concepts of Next.js</li>
              </ul>
            </div>
            {/* Course Content */}
            <div ref={courseContentRef} className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>1. Welcome & Introduction</span>
                  <span>5 min</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>2. What is Next.js?</span>
                  <span>12 min</span>
                </div>
                {/* Add more lessons here dynamically if needed */}
              </div>
            </div>
            {/* Instructor Section */}
            <div className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Instructor</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img
                    src={"/images/default-avatar.png"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold">Name here</h4>
                  <p className="text-gray-600">instruktor bio</p>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </main >
    </div >
  );
};

export default Index;