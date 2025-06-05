import React from "react";
import { GetServerSideProps, NextPage } from "next";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";
import * as courseUtils from "@/utils/course";
import * as categoriesUtils from "@/utils/categories";

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
  error?: string;
}
export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (
  context
) => {
  const { category } = context.params || {};

  if (!category || typeof category !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    const fetchedCategory = await categoriesUtils.getBySlug(category as string);

    if (!fetchedCategory || !fetchedCategory._id) {
      return {
        notFound: true,
      };
    }

    const fetchedCourses = await courseUtils.getByCategory(
      fetchedCategory._id as string
    );

    const coursesArray = Array.isArray(fetchedCourses) ? fetchedCourses : [];

    return {
      props: {
        courses: coursesArray,
        category: fetchedCategory,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps for category page:", error);
    return {
      props: {
        courses: [],
        category: null,
        error: "Failed to load category courses. Please try again later.",
      },
    };
  }
};

const CategoryPage: NextPage<CategoryPageProps> = ({
  courses,
  category,
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
            Please try a different category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopSection
        title={category ? `${category.name} Courses` : "Our Courses"}
        text1={courses.length.toString()}
        text2="Courses Available"
      />
      <Categories />
      {courses.length > 0 ? (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course: Course) => (
              <Card key={course._id} course={course} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            No courses found in the &quot;{category.name}&quot; category yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
