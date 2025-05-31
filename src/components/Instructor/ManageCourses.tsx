import * as courseUtils from "@/utils/course";
import React, { useEffect, useState } from "react";
import EditCourseForm from "./EditCourse";
import ConfirmModal from "@/components/ConfirmModal";

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
const ManageCourses = ({ cookies }: { cookies: string }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          response ? (Array.isArray(response) ? response : [response]) : []
        );
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);
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
      {courses.length === 0 ? (
        <p>No courses created.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course, index) => (
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
      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirm}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ManageCourses;
