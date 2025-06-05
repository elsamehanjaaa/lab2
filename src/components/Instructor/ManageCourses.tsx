import * as courseUtils from "@/utils/course";
import React, { useEffect, useState } from "react";
import EditCourseForm from "./EditCourse";
import ConfirmModal from "@/components/ConfirmModal";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(
    () => () => {}
  );
  const [courses, setCourses] = useState<Course[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user) {
          console.error("User not found");
          return;
        }
        const userId = user.id;

        const response = await courseUtils.getByInstructor(userId);

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
  const handleCourseClick = (course_id: string) => {
    setEditingCourseId(course_id);
    setEditing(true);
  };
  const handleCreateCourse = () => {
    onCreateCourse(); // calls setActiveTab("create-course")
  };
  const handleDelete = (courseId: string) => {
    setPendingAction(() => async () => {
      console.log("Deleting course with ID:", courseId);
      try {
        await courseUtils.remove(courseId);

        setCourses((prev) => prev?.filter((c) => c._id !== courseId) || []);
      } catch (err) {
        setIsModalOpen(false);
        return;
      }
    });
    setIsModalOpen(true);
  };
  const confirm = () => {
    pendingAction();
    setIsModalOpen(false);
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
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Thumbnail</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-2 border">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-20 w-32 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2 border">{course.title}</td>
                  <td className="px-4 py-2 border">{course.description}</td>
                  <td className="px-4 py-2 border">${course.price}</td>
                  <td className="px-4 py-2 border">
                    {new Date(course.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(course._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
