import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";
import * as courseUtils from "@/utils/course";
import * as categoryUtils from "@/utils/category";

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
const CategoryPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>();
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) return;
    async function getAll() {
      try {
        const fetchedCategory = await categoryUtils.checkCategoryName(
          slug as string
        );

        setCategoryId(fetchedCategory._id);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    getAll();
  }, [slug]);

  useEffect(() => {
    if (!categoryId) return;

    async function getCourses() {
      try {
        const fetched_categories = await courseUtils.getByCategory(
          categoryId as string
        );

        // Sigurohu që result është array, jo objekt i vetëm
        setCourses(fetched_categories);
        setLoading(false); // ndal loading-un
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    }

    getCourses();
  }, [categoryId]); // Thirret vetëm kur categoryId ndryshon

  return (
    <div>
      <TopSection title="Our Courses" text1="1000+" text2="Courses Available" />
      <Categories />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 &&
          courses.map((course: any, index: number) => <Card course={course} />)}
      </div>
    </div>
  );
};

export default CategoryPage;
