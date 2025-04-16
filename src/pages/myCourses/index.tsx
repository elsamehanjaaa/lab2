import { fetchUser } from "@/utils/fetchUser";
import React, { useEffect, useState } from "react";

const Index = () => {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [user, setUser] = useState<string>("");
  useEffect(() => {
    const getUser = async () => {
      const res = await fetchUser();

      setUser(res.user.id);
    };
    getUser();
  }, []);
  useEffect(() => {
    const getUserCourses = async () => {
      const res = await fetch(
        "http://localhost:5000/enrollments/getEnrollmentsByUser",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user,
          }),
        }
      );

      if (res.ok) {
        const courses = await res.json();
        setCourses(courses);
      }
    };

    getUserCourses();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">My Courses</h1>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div
            key={course.id || course.title}
            className="bg-gray-100 p-3 rounded-md shadow mb-2"
          >
            {course.title}
          </div>
        ))
      ) : (
        <p>No courses enrolled.</p>
      )}
    </div>
  );
};

export default Index;
