// Inside pages/my-courses.tsx or similar

import { fetchUser } from "@/utils/fetchUser";
import { getEnrollmentsByUser } from "@/utils/getEnrollmentsByUser";
import { parse } from "cookie";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = parse(req.headers.cookie || "");
  const access_token = cookies["access_token"];

  if (!access_token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const user = await fetchUser(access_token);
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { user }, // 👈 Pass user to the component
  };
};

interface Props {
  user: { id: string; username: string };
  access_token: string;
}

const Index = ({ user, access_token }: Props) => {
  const [courses, setCourses] = useState<
    {
      id: string;
      title: string;
      slug: string;
      progress: number;
      thumbnail_url: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const enrollments = await getEnrollmentsByUser(user.id); // optionally pass user.id if needed
      if (Array.isArray(enrollments)) {
        setCourses(
          enrollments as {
            id: string;
            title: string;
            slug: string;
            progress: number;
            thumbnail_url: string;
          }[]
        );
      } else {
        console.error("Unexpected response format:", enrollments);
        setCourses([]);
      }
    };

    fetchEnrollments();
  }, [user.id]); // 👈 Trigger useEffect when user.id is available

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
