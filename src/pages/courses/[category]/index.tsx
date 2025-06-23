import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { parse } from "cookie";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";
import * as courseUtils from "@/utils/course";
import * as categoriesUtils from "@/utils/categories";
import * as enrollmentUtils from "@/utils/enrollment"; // Make sure this utility is created

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  thumbnail_url?: string;
  slug: string;
  _id: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryPageProps {
  courses: Course[];
  category: Category | null;
  enrolledCourseIds: string[];
  error?: string;
}
export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (
  context
) => {
  const { category } = context.params || {};
  const cookies = context.req.headers.cookie || "";
  const parsedCookies = parse(cookies);
  const access_token = parsedCookies.access_token;

  if (typeof category !== "string") {
    return { notFound: true };
  }

  try {
    const fetchedCategory = await categoriesUtils.getBySlug(category);

    if (!fetchedCategory?._id) {
      return { notFound: true };
    }

    const fetchedCourses = await courseUtils.getByCategory(fetchedCategory._id);
    const coursesArray = Array.isArray(fetchedCourses) ? fetchedCourses : [];

    let enrolledCourseIds: string[] = [];
    if (access_token && coursesArray.length > 0) {
      const enrolledResponse = await enrollmentUtils.getEnrolledCourses(
        cookies
      );
      if (enrolledResponse.enrolledCourseIds) {
        enrolledCourseIds = enrolledResponse.enrolledCourseIds;
      } else {
        console.error(
          "Failed to fetch enrolled courses:",
          enrolledResponse.error
        );
      }
    }

    return {
      props: {
        courses: coursesArray,
        category: fetchedCategory,
        enrolledCourseIds,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps for category page:", error);
    return {
      props: {
        courses: [],
        category: null,
        enrolledCourseIds: [],
        error: "Failed to load category courses. Please try again later.",
      },
    };
  }
};

// The page component
const CategoryPage: NextPage<CategoryPageProps> = ({
  courses,
  category,
  enrolledCourseIds,
  error,
}) => {
  if (error) {
    return (
      <div>
        <TopSection title="Error" text1="Oops!" text2={error} />
        <Categories />
        <div className="text-center py-10">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div>
        <TopSection
          title="Category Not Found"
          text1="Oops!"
          text2="We couldn't find the category you're looking for."
        />
        <Categories />
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            Please select a different category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopSection
        title={`${category.name} Courses`}
        text1={String(courses.length)}
        text2="Courses Available"
      />
      <Categories />
      {courses.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course: Course) => (
              <Card
                key={course._id}
                course={course}
                alreadyEnrolled={enrolledCourseIds.includes(course._id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            No courses are available in the &quot;{category.name}&quot; category
            at this time.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
