import React, { useEffect, useState } from "react";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";

// Krijojmë një interface për tipin e kursit
interface Course {
  _id: string;
  title: string;
  description?: string;
  // shtoni fushat e tjera që kthen API-ja, p.sh. price, image, etj.
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
      <TopSection title="Our Courses" text1="1000+" text2="Courses Available" />

      {/* Kategoritë (nëse ju nevojitet, mund ta ndani në komponent tjetër) */}
      <Categories />

      {/* Rendi i kurseve */}
      <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          // Përdorim _id për key
          <Card key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Index;
