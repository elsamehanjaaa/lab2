import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getAll() {
      try {
        const res = await fetch("http://localhost:5000/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const result = await res.json();
        console.log(result);
        setCourses(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    getAll();
  }, []);

  return (
    <div>
      <TopSection title="Our Courses" text1="1000+" text2="Courses Available" />

      <Categories />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 &&
          courses.map((course: any, index: number) => <Card course={course} />)}
      </div>
    </div>
  );
};

export default Index;
