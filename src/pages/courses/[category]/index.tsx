import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";
import Card from "@/components/Courses/Card";

const CategoryPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);
  const router = useRouter();
  const { category } = router.query;

  useEffect(() => {
    async function getAll() {
      try {
        const categoryName = category?.toString().replaceAll("-", " ");
        const res = await fetch(
          "http://localhost:5000/categories/checkCategoryName",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name: categoryName }),
          }
        );

        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const result = await res.json();
        setCategoryId(result._id);
        console.log(result._id);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    getAll();
  }, [category]);

  useEffect(() => {
    if (!categoryId) return;

    async function getCourses() {
      try {
        const res = await fetch(
          "http://localhost:5000/courses/getCoursesByCategory",
          {
            // SHËNIM: ndrysho URL-në në endpointin e saktë
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ id: categoryId }),
          }
        );

        if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
        const result = await res.json();

        // Sigurohu që result është array, jo objekt i vetëm
        setCourses(result);
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
