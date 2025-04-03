import React, { useEffect, useState } from "react";

const Index = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function getAll() {
      try {
        const res = await fetch("http://localhost:3000/courses", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP Error! Status: ${res.status}`);
        }

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
      <h1>Courses</h1>
      {/* Display list of courses */}
      {courses.map((course, index) => (
        <div key={index}>
          <p>{course.title}</p>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Index;
