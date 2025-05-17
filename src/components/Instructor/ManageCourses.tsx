import * as courseUtils from "@/utils/course";
import React, { useEffect, useState } from "react";
import EditCourseForm from "./EditCourse";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  thumbnail_url: string;
  _id: string;
}
const ManageCourses = ({
  cookies,
  onCreateCourse,
}: {
  cookies: string;
  onCreateCourse: () => void;
}) => {
  const [courses, setCourses] = useState<Course[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string>("");
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const userRes = await fetch("/api/me");
        const userData = await userRes.json();
        const userId = userData?.user?.id;

        if (!userId) {
          console.error("User not found");
          return;
        }

        const response = await courseUtils.getById(userId);
        // adjust this based on your actual console output

        setCourses(
          Array.isArray(response) ? response : response ? [response] : []
        );
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
  const handleCreateCourse = () => {
    onCreateCourse(); // calls setActiveTab("create-course")
  };
  const handleCourseClick = (course_id: string) => {
    setEditingCourseId(course_id);
    setEditing(true);
  };
  if (loading) return <p>Loading...</p>;
  if (editing)
    return (
      <EditCourseForm
        id={editingCourseId}
        cookies={cookies}
        onClose={() => {
          setEditing(false);
          setEditingCourseId("");
        }}
      />
    );
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">My Created Courses</h1>
      {courses?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 border max-w-1/4 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
          <p className="text-lg font-medium text-gray-700 mb-2">
            No courses created.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Start by creating your first course to share your knowledge.
          </p>
          <button
            onClick={handleCreateCourse} // Replace with your actual handler
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Creating
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses?.map((course, index) => (
            <div
              key={index}
              className="bg-white p-4 shadow rounded-lg border"
              onClick={() => handleCourseClick(course._id)}
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-40 object-cover rounded"
              />
              <h2 className="mt-2 text-lg font-medium">{course.title}</h2>
              <h2 className="mt-2 text-lg font-medium">{course.description}</h2>
              <p className="text-sm text-gray-600">${course.price}</p>
              <p className="text-sm text-gray-600">
                Created on: {new Date(course.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
