// Inside pages/my-courses.tsx or similar
import * as enrollmentUtils from "@/utils/enrollment";
import * as authUtils from "@/utils/auth";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Image from "next/image";

// CORRECTED: 'categories' is now an array of strings
interface Course {
  _id: string;
  slug: string;
  thumbnail_url: string;
  title: string;
  description: string;
  progress: number;
  categories: string[]; // <-- This is the key change in the interface
  instructor: string;
}

interface PageProps {
  courses: Course[];
  error?: string;
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    const { req } = context;
    const cookie = req.headers.cookie;
    const user = await authUtils.me(cookie);

    if (!user) {
      return {
        redirect: {
          destination: "/?showLogin=true&error=not_authenticated",
          permanent: false,
        },
      };
    }

    const enrollmentsData = await enrollmentUtils.getByUser(
      String(user.id),
      cookie || ""
    );
    const courses = Array.isArray(enrollmentsData) ? enrollmentsData : [];

    return {
      props: {
        courses,
      },
    };
  } catch (error) {
    console.error("Exception in getServerSideProps:", error);
    return {
      redirect: {
        destination: "/?showLogin=true&error=fetch_failed",
        permanent: false,
      },
    };
  }
};

const MyCoursesPage = ({ courses }: PageProps) => {
  // --- STATE FOR FILTERS AND SORTING (variable names cleaned up) ---
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterProgress, setFilterProgress] = useState("All");
  const [filterInstructor, setFilterInstructor] = useState("All");
  const [sortOrder, setSortOrder] = useState("title-asc");

  // --- DYNAMICALLY GET FILTER OPTIONS FROM COURSES ---

  // CORRECTED: Use flatMap to get a single array of all category names
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(courses.flatMap((c) => c.categories)))],
    [courses]
  );

  const instructors = useMemo(
    () => ["All", ...Array.from(new Set(courses.map((c) => c.instructor)))],
    [courses]
  );

  // --- FILTERING AND SORTING LOGIC ---
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // CORRECTED: Filter by checking if the category is INCLUDED in the array
    if (filterCategory !== "All") {
      result = result.filter((course) =>
        course.categories.includes(filterCategory)
      );
    }

    // 2. Filter by Progress
    if (filterProgress === "not-started") {
      result = result.filter((course) => course.progress === 0);
    } else if (filterProgress === "in-progress") {
      result = result.filter(
        (course) => course.progress > 0 && course.progress < 100
      );
    } else if (filterProgress === "completed") {
      result = result.filter((course) => course.progress === 100);
    }

    // 3. Filter by Instructor
    if (filterInstructor !== "All") {
      result = result.filter(
        (course) => course.instructor === filterInstructor
      );
    }

    // 4. Apply Sorting
    switch (sortOrder) {
      case "progress-desc":
        result.sort((a, b) => b.progress - a.progress);
        break;
      case "progress-asc":
        result.sort((a, b) => a.progress - b.progress);
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "title-asc":
      default:
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [courses, filterCategory, filterProgress, filterInstructor, sortOrder]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Courses</h1>

      {courses.length > 0 ? (
        <>
          {/* --- FILTER AND SORT CONTROLS --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
            {/* Filter by Category */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Progress */}
            <div>
              <label
                htmlFor="progress-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Progress
              </label>
              <select
                id="progress-filter"
                value={filterProgress}
                onChange={(e) => setFilterProgress(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Filter by Instructor */}
            <div>
              <label
                htmlFor="instructor-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instructor
              </label>
              <select
                id="instructor-filter"
                value={filterInstructor}
                onChange={(e) => setFilterInstructor(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {instructors.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label
                htmlFor="sort-order"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort By
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="progress-desc">Progress (High-Low)</option>
                <option value="progress-asc">Progress (Low-High)</option>
              </select>
            </div>
          </div>

          {/* --- COURSE GRID --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredAndSortedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl group hover:scale-101"
              >
                <Link
                  href={`/learn/${course.slug}/${course._id}`}
                  legacyBehavior
                >
                  <a className="block">
                    <div className="relative w-full h-48">
                      <Image
                        src={course.thumbnail_url || "/placeholder-image.jpg"}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {course.description || "No description available."}
                      </p>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full "
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
            {/* --- Handle No Results After Filtering --- */}
            {filteredAndSortedCourses.length === 0 && (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10">
                <p className="text-lg text-gray-700">
                  No courses match your current filters.
                </p>
              </div>
            )}
          </div>
        </>
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

export default MyCoursesPage;
