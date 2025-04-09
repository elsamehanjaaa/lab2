import { set } from "mongoose";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
}

const index = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course>();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    async function getAll() {
      try {
        const res = await fetch(`http://localhost:5000/courses/${courseId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const result = await res.json();
        setCourse(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    getAll();
  }, [courseId]);

  async function handleEnrollment() {
    try {
      const res = await fetch("http://localhost:5000/auth/protected", {
        method: "POST",
        credentials: "include",
      });

      const auth = await res.json();

      setUser(auth.user.id);
      if (res.ok) {
        const res = await fetch(`http://localhost:5000/enrollments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            user_id: auth.user.id,
            course_id: courseId,
          }),
        });

        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const result = await res.json();
        console.log(result);
        router.push("/");
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-3xl font-bold text-gray-900">
          Next.js Course Enrollment
        </h1>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2">
            <div className="shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 bg-white sm:p-6">
                <div className="flex justify-center mb-6">
                  <div className="relative w-full aspect-w-16 aspect-h-9">
                    <img
                      src="/images/course.jpg"
                      alt="Course Image"
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4">{course?.title}</h2>
                <p>{course?.description}</p>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleEnrollment}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default index;
