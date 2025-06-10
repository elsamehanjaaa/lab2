import React, { useEffect, useState } from "react";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";
import * as courseUtils from "@/utils/course";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  _id: string;
}

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      const { courses, error } = await courseUtils.getAll();
      if (error) {
        setError(error);
      } else {
        setCourses(courses);
      }
      setLoading(false);
    }

    fetchCourses();
  }, []);

  return (
    <div>
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center" />
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-950 hover:text-blue-200 transition duration-300">
              Our Courses
            </h1>
            <p className="text-xl font-semibold md:text-xl mb-8">
              1000+ | Available Courses
            </p>
            <p className="text-xl font-semibold md:text-xl mb-8">
              Free Courses
            </p>
          </div>
        </div>
      </div>

      <Categories />

      {loading && <p className="text-center text-xl">Loading courses...</p>}
      {error && <p className="text-center text-xl text-red-500">{error}</p>}

      <div className="grid mt-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
        {courses.length > 0 ? (
          courses.map((course) => <Card key={course._id} course={course} />)
        ) : (
          <p className="col-span-full text-center text-xl">
            No courses available at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
