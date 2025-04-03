import React, { useEffect, useState } from 'react';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAll() {
      try {
        const res = await fetch("http://localhost:3000/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

        const result = await res.json();
        setCourses(result);
      } catch (error) {
        setError(error.message);
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    getAll();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="px-6 md:px-20 py-12 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-8">All Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course, i) => (
          <div key={i} className="bg-white rounded-xl shadow overflow-hidden transition-transform hover:-translate-y-1">
            <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{course.title}</h3>
              <div className="flex items-center text-sm mb-2">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-semibold">{course.rating}</span>
                <span className="text-gray-500 ml-1">({course.reviews})</span>
              </div>
              <div className="mb-2">
                <span className="font-bold text-xl text-blue-600">{course.price}</span>
                {course.oldPrice && (
                  <span className="line-through text-gray-500 ml-2">{course.oldPrice}</span>
                )}
              </div>
              {course.bestSeller && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                  Bestseller
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
