// Inside pages/my-courses.tsx or similar
import * as enrollmentUtils from "@/utils/enrollment"; // Assuming this utility exists and works
// import { parse } from "cookie"; // Not used in the component directly if fetch handles cookies via 'credentials: "include"'
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image"; // Using next/image for optimized images

// Define a type for your course objects for better type safety
interface Course {
  id: string | number; // Use the actual type of your course ID
  slug: string;
  thumbnail_url: string;
  title: string;
  progress: number;
  // Add any other properties your course object might have
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Fetch user data server-side to protect the route
  const res = await fetch("http://localhost:3000/api/me", {
    // Ensure this URL is correct, consider using env var for domain
    headers: {
      cookie: req.headers.cookie || "",
    },
  });

  // It's good practice to check if the response was ok before parsing JSON
  if (!res.ok) {
    // If /api/me returns 401 or similar for unauthenticated, redirect
    return {
      redirect: {
        destination: "/login", // Redirect to login or home
        permanent: false,
      },
    };
  }

  const data = await res.json();
  const user = data.user;

  if (!user) {
    return {
      redirect: {
        destination: "/", // Or your login page
        permanent: false,
      },
    };
  }

  // You could pass the user ID as a prop if enrollments are fetched client-side based on it
  // Or even fetch enrollments here if they don't change often and pass them as props.
  // For this example, we'll keep client-side fetching for enrollments as in original.
  return { props: { userId: user.id } }; // Pass userId to simplify client-side fetch
};

const MyCoursesPage = ({ userId }: { userId: string | number }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchEnrollments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // No need to fetch /api/me again if userId is passed as a prop
        // const res = await fetch("http://localhost:3000/api/me", {
        //   credentials: "include",
        // });
        // if (!res.ok) throw new Error('Failed to fetch user data');
        // const { user } = await res.json();

        const enrollmentsData = await enrollmentUtils.getByUser(String(userId)); // Ensure userId is a string

        // Ensure enrollmentsData is what you expect (e.g., an array of Course-like objects)
        // You might need to transform enrollmentsData if its structure doesn't match 'Course[]'
        setCourses(Array.isArray(enrollmentsData) ? enrollmentsData : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch enrollments."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchEnrollments();
    }
  }, [userId]); // Re-run if userId changes (though it shouldn't for a page like this post-SSR)

  if (isLoading) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center">
        <p>Loading your courses...</p>
        {/* You could add a spinner here */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-6xl mx-auto text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {" "}
      {/* Increased max-width and padding */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Courses</h1>{" "}
      {/* Updated heading style */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {" "}
          {/* Responsive Grid */}
          {courses.map((course) => (
            <div
              key={course.id} // Key on the outermost element in the map
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group"
            >
              <Link href={`/learn/${course.slug}/${course.id}`} legacyBehavior>
                <a className="block">
                  {" "}
                  {/* Added <a> tag for legacyBehavior or direct styling */}
                  <div className="relative w-full h-48">
                    {" "}
                    {/* Fixed height for image container */}
                    <Image
                      src={course.thumbnail_url || "/placeholder-image.jpg"} // Fallback image
                      alt={course.title}
                      layout="fill"
                      objectFit="cover" // Ensures image covers the area
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h2>
                    {/* Optional: Add a short description if available */}
                    {/* <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {course.description || 'No description available.'}
                    </p> */}

                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500" // Changed color, added transition
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    {/* <div className="text-xs text-gray-500 mt-1">
                      {course.progress}% completed
                    </div> */}
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-lg text-gray-700">
            You are not enrolled in any courses yet.
          </p>
          <Link href="/courses" legacyBehavior>
            <a className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Explore Courses
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage; // Changed component name to PascalCase
