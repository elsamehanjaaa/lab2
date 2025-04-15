import React, { useEffect, useState } from "react";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";

// Krijojmë një interface për tipin e kursit
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
  // Deklarojmë gjendjen e kurseve me tipin Course[]
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    async function getAll() {
      try {
        const res = await fetch("http://localhost:5000/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }

        const result = await res.json();
        setCourses(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    getAll();
  }, []);

  return (
    <div>
      {/* TopSection për titullin dhe nën-titullin */}
      <div className="relative text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/background.PNG')] bg-cover bg-center" />
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-6 text-blue-950 hover:text-blue-200 transition duration-300">
              Our Courses
            </h1>
            <p className="text-xl font-semibold md:text-xl mb-8">
              1000+ | available courses | 100% free | 100% online
            </p>
          
          </div>
        </div>
      </div>


      {/* Kategoritë (nëse ju nevojitet, mund ta ndani në komponent tjetër) */}
      <Categories />

      {/* Rendi i kurseve */}
      <div className="grid mt-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
        {courses.map((course) => (
          // Përdorim _id për key
          <Card key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Index;
