import React, { useEffect, useState } from "react";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";
import * as courseUtils from "@/utils/course";
import * as enrollmentUtils from "@/utils/enrollment"; // Assuming you have this utility
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Link from "next/link"; // Import Link for the "Go to Course" button

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

// Define props type for the Index component
interface IndexProps {
  initialCourses: Course[];
  enrolledCourseIds: string[];
  error: string | null;
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async (
  context
) => {
  const cookies = context.req.headers.cookie as string;
  const parsedCookies = parse(cookies || ""); // Handle case where cookies might be undefined
  const access_token = parsedCookies.access_token;

  let initialCourses: Course[] = [];
  let enrolledCourseIds: string[] = [];
  let error: string | null = null;

  try {
    const coursesResponse = await courseUtils.getAll();
    if (coursesResponse.error) {
      error = coursesResponse.error;
    } else if (coursesResponse.courses) {
      initialCourses = coursesResponse.courses;
    }

    if (access_token && initialCourses.length > 0) {
      const enrolledCoursesResponse = await enrollmentUtils.getEnrolledCourses(
        cookies
      ); // Assuming this returns an array of enrolled course IDs
      if (enrolledCoursesResponse.error) {
        console.error(
          "Error fetching enrolled courses:",
          enrolledCoursesResponse.error
        );
        // You might want to handle this error differently, e.g., show a message to the user
      } else if (enrolledCoursesResponse.enrolledCourseIds) {
        enrolledCourseIds = enrolledCoursesResponse.enrolledCourseIds;
      }
    }
  } catch (err: any) {
    console.error("Error in getServerSideProps:", err);
    error = "Failed to fetch data. Please try again later.";
  }

  return {
    props: {
      initialCourses,
      enrolledCourseIds,
      error,
    },
  };
};

const Index = ({
  initialCourses,
  enrolledCourseIds,
  error: initialError,
}: IndexProps) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [loading, setLoading] = useState<boolean>(false); // No longer loading initially as data comes from SSR
  const [error, setError] = useState<string | null>(initialError);

  // If you still want to fetch courses on the client-side for some reason (e.g., filtering),
  // you can keep the useEffect, but for initial display, getServerSideProps is enough.
  // For simplicity, I'm assuming initialCourses from SSR is the primary source.
  useEffect(() => {
    if (initialError) {
      setError(initialError);
    }
  }, [initialError]);

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
          courses.map((course) => (
            <Card
              key={course._id}
              course={course}
              alreadyEnrolled={enrolledCourseIds.includes(course._id)}
            />
          ))
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
