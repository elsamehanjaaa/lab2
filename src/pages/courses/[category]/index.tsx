import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TopSection from "@/components/TopSection";
import Categories from "@/components/Courses/Categories";

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
          const res = await fetch("http://localhost:5000/categories/checkCategoryName", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: categoryName })
        });
        
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
    if (!categoryId) return; // Mos thirr API-n nëse categoryId është null
  
    async function getCourses() {
      try {
        const res = await fetch("http://localhost:5000/courses/getCoursesByCategory", { // SHËNIM: ndrysho URL-në në endpointin e saktë
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: categoryId })
        });
  
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
        {courses.length > 0 && courses.map((course: any, index: number) => (
    <div key={index} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out">
      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
      <p className="text-gray-600 mb-3">{course.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Price:</strong> ${course.price}
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Rating:</strong> {course.rating}/5
      </p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Status:</strong> {course.status ? "Available" : "Unavailable"}
      </p>
      <p className="text-sm text-gray-400">
        <strong>Created:</strong> {new Date(course.created_at).toLocaleDateString()}
      </p>
    </div>
  ))}
</div>

    </div>
  );
};

export default CategoryPage;
