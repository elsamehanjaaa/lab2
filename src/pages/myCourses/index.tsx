// Inside pages/my-courses.tsx or similar
import * as enrollmentUtils from "@/utils/enrollment";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const res = await fetch("http://localhost:3000/api/me", {
    headers: {
      cookie: req.headers.cookie || "",
    },
  });

  const { user } = await res.json();

  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const Index = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const res = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      const { user } = await res.json();
      const enrollments = await enrollmentUtils.getByUser(user.id);
      setCourses(Array.isArray(enrollments) ? enrollments : []);
    };

    fetchEnrollments();
  }, []);
  return (
    <div className="p-4  max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">My Courses</h1>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div className="flex">
            <div className="bg-gray-100 p-3 rounded-md shadow mb-4">
              <Link href={`/learn/${course.slug}/${course.id}`} key={course.id}>
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <div className="font-medium mb-1">{course.title}</div>
                <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {course.progress}% completed
                </div>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No courses enrolled.</p>
      )}
    </div>
  );
};

export default Index;
