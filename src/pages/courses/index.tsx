import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";

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

      <TopSection title='Our Courses' text1="1000+" text2="Courses Available" />

      <Categories/>

      {/* Content Section */}
      <div className="p-8 min-h-[1000px]">
        {/* Course list or other content goes here */}
      </div>
    </div>
  );
};

export default Index;
