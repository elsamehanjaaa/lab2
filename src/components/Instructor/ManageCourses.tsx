// components/InstructorDashboard/ManageCoursesPage.tsx
// This component is styled to match the ManageStudentsPage.
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
  ChangeEvent,
} from "react";
import Head from "next/head"; // Assuming this might be part of a larger page structure
import {
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PlusCircle,
  AlertCircle,
  ArrowUpDown,
  Eye,
  DollarSign,
  CheckCircle,
  XCircle as IconXCircle,
} from "lucide-react"; // Renamed XCircle to avoid conflict

// Assuming these utilities and contexts are correctly pathed
import * as courseUtils from "@/utils/course"; // Placeholder for your actual course utility functions
import { useAuth } from "@/contexts/AuthContext"; // Placeholder for your AuthContext

// Assuming EditCourseForm and ConfirmModal (or a replacement) are available
// For EditCourseForm, we'll keep the existing rendering logic.
// For ConfirmModal, we'll create a version based on the Modal component.
import EditCourseForm from "./EditCourse"; // Placeholder path

// Define interfaces for our data structures
type CourseStatus = "Published" | "Draft"; // Or true/false if your API uses boolean

interface Course {
  _id: string; // Using _id as the unique identifier
  title: string;
  description: string;
  price: number;
  rating?: number; // Optional, as it's not in the original table
  status: boolean; // true for Published, false for Draft (as an example)
  created_at: string;
  slug?: string; // Optional
  thumbnail_url: string;
  // Add instructorId if it's part of your Course model and needed for filtering/security
  instructorId?: string;
}

interface SortConfig {
  key: keyof Course | "actions";
  direction: "ascending" | "descending";
}

// Helper to format date (can be shared or defined locally)
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.warn("Date formatting failed for:", dateString, e);
    return dateString;
  }
};

// Generic Modal Component (adapted from ManageStudentsPage)
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalshow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <IconXCircle size={20} />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {children}
      </div>
      <style jsx global>{`
        @keyframes modalshow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalshow {
          animation: modalshow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

// Confirm Delete Modal
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  courseTitle: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  courseTitle,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Course">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        <p className="mb-4">
          Are you sure you want to delete the course "
          <strong>{courseTitle}</strong>"? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

interface ManageCoursesProps {
  cookies: string; // Or your specific cookie type
  onCreateCourse: () => void; // Callback to switch to create course view
}

const ManageCoursesPage: React.FC<ManageCoursesProps> = ({
  cookies,
  onCreateCourse,
}) => {
  const { user } = useAuth(); // Assuming useAuth provides { id: string, ... } or null
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // State for search, filter, pagination
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "All">("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const coursesPerPage = 7; // Similar to students page

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "descending",
  });

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!user?.id) {
      setError("User not authenticated. Cannot fetch courses.");
      setIsLoading(false);
      setCourses([]); // Clear courses if user is not available
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await courseUtils.getByInstructor(user.id); // Pass user.id
      // Ensure response is always an array
      const fetchedCourses = Array.isArray(response)
        ? response
        : response
        ? [response]
        : [];
      setCourses(fetchedCourses as Course[]); // Add type assertion if necessary
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.message || "Failed to fetch courses.");
      setCourses([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEditCourse = (courseId: string) => {
    setEditingCourseId(courseId);
  };

  const handleCloseEditForm = () => {
    setEditingCourseId(null);
    fetchCourses(); // Refetch courses after editing
  };

  const handleDeleteCourse = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await courseUtils.remove(courseToDelete._id);
      setCourses((prev) => prev.filter((c) => c._id !== courseToDelete._id));
      // Show success message (similar to ManageStudentsPage)
      const messageBox = document.createElement("div");
      messageBox.textContent = `Course "${courseToDelete.title}" deleted successfully!`;
      messageBox.className =
        "fixed top-5 right-5 bg-green-500 text-white p-3 rounded-md shadow-lg z-[100]";
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);
    } catch (err: any) {
      console.error("Error deleting course:", err);
      // Show error message
      const messageBox = document.createElement("div");
      messageBox.textContent = err.message || "Failed to delete course.";
      messageBox.className =
        "fixed top-5 right-5 bg-red-500 text-white p-3 rounded-md shadow-lg z-[100]";
      document.body.appendChild(messageBox);
      setTimeout(() => messageBox.remove(), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
    }
  };

  // Filtering and Sorting Logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const titleMatch =
          course.title &&
          course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const descriptionMatch =
          course.description &&
          course.description.toLowerCase().includes(searchTerm.toLowerCase()); // Optional: search description
        const currentStatus: CourseStatus = course.status
          ? "Published"
          : "Draft";
        const statusMatch =
          statusFilter === "All" || currentStatus === statusFilter;
        return (titleMatch || descriptionMatch) && statusMatch;
      })
      .sort((a, b) => {
        if (!sortConfig.key || sortConfig.key === "actions") return 0;

        let valA =
          a[
            sortConfig.key as keyof Omit<
              Course,
              "_id" | "instructorId" | "slug" | "thumbnail_url" | "rating"
            >
          ];
        let valB =
          b[
            sortConfig.key as keyof Omit<
              Course,
              "_id" | "instructorId" | "slug" | "thumbnail_url" | "rating"
            >
          ];

        if (sortConfig.key === "created_at") {
          valA = new Date(valA as string).getTime();
          valB = new Date(valB as string).getTime();
        } else if (sortConfig.key === "price" || sortConfig.key === "rating") {
          valA = Number(valA);
          valB = Number(valB);
        } else if (typeof valA === "string") {
          valA = valA.toLowerCase();
        }
        if (typeof valB === "string") {
          valB = valB.toLowerCase();
        }
        // For boolean status, treat Published (true) as greater than Draft (false)
        if (sortConfig.key === "status") {
          valA = a.status ? 1 : 0;
          valB = b.status ? 1 : 0;
        }

        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
  }, [courses, searchTerm, statusFilter, sortConfig]);

  // Pagination Logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const requestSort = (key: keyof Course | "actions") => {
    if (key === "actions") return;
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Course | "actions") => {
    if (key === "actions") return null;
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    }
    return <ArrowUpDown size={14} className="inline ml-1 opacity-50" />;
  };

  // If editing, show the EditCourseForm
  if (editingCourseId) {
    return (
      <EditCourseForm
        id={editingCourseId}
        cookies={cookies} // Pass cookies if your form needs it
        onClose={handleCloseEditForm}
      />
    );
  }

  // Main loading state
  if (isLoading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-semibold">Loading Courses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && courses.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] bg-gray-100 dark:bg-gray-900 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">
          Failed to Load Courses
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
          {error}
        </p>
        <button
          onClick={fetchCourses}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Manage Courses | Instructor Dashboard</title>
      </Head>
      {/* Head might be managed by the parent page */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <BookOpen
                size={32}
                className="mr-3 text-blue-600 dark:text-blue-500"
              />{" "}
              Manage Courses
            </h1>
            <button
              onClick={onCreateCourse} // This calls setActiveTab("create-course") in parent
              className="mt-4 sm:mt-0 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 flex items-center shadow-md transition-transform hover:scale-105"
            >
              <PlusCircle size={20} className="mr-2" /> Add New Course
            </button>
          </div>
          {user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Instructor: {user.id}
            </p>
          )}
        </header>

        {/* Filters and Search */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            {" "}
            {/* Adjusted to 2 cols for courses */}
            <div>
              <label
                htmlFor="search-courses"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search Courses
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="search-courses"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Title or Description..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="status-filter-courses"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="status-filter-courses"
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as CourseStatus | "All")
                }
              >
                <option value="All">All Statuses</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table or No Courses Message */}
        {isLoading && courses.length > 0 && (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">
            Refreshing courses...
          </div>
        )}

        {!isLoading &&
          currentCourses.length === 0 &&
          courses.length === 0 &&
          !error && (
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-center shadow-md min-h-[300px]">
              <BookOpen size={48} className="text-blue-500 mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                You haven't created any courses yet.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                It's time to share your knowledge with the world! Click the
                button below to start creating your first course.
              </p>
              <button
                onClick={onCreateCourse}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 flex items-center shadow-lg transition-transform hover:scale-105"
              >
                <PlusCircle size={20} className="mr-2" /> Start Creating Course
              </button>
            </div>
          )}

        {currentCourses.length > 0 && (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {/* Adjusted headers for courses */}
                  {(
                    [
                      "thumbnail_url",
                      "title",
                      "price",
                      "status",
                      "created_at",
                      "actions",
                    ] as Array<keyof Course | "actions">
                  ).map((key) => (
                    <th
                      key={key}
                      scope="col"
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                        key !== "actions"
                          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          : ""
                      }
                                  ${
                                    key === "price"
                                      ? "hidden sm:table-cell"
                                      : ""
                                  }
                                  ${
                                    key === "created_at"
                                      ? "hidden md:table-cell"
                                      : ""
                                  }
                                `}
                      onClick={() => key !== "actions" && requestSort(key)}
                    >
                      {key === "thumbnail_url"
                        ? "Thumbnail"
                        : key.charAt(0).toUpperCase() +
                          key
                            .slice(1)
                            .replace(/_at$/, " At")
                            .replace(/([A-Z])/g, " $1")}
                      {key !== "actions" && getSortIndicator(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentCourses.map((course) => (
                  <tr
                    key={course._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={
                          course.thumbnail_url ||
                          "https://placehold.co/128x80/E0E0E0/7F7F7F?text=No+Image"
                        }
                        alt={course.title}
                        className="h-16 w-28 object-cover rounded-md shadow-sm"
                        onError={(
                          e: React.SyntheticEvent<HTMLImageElement, Event>
                        ) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src =
                            "https://placehold.co/128x80/E0E0E0/7F7F7F?text=Error";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {" "}
                      {/* Removed whitespace-nowrap for title to wrap */}
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </div>
                      <div
                        className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate"
                        title={course.description}
                      >
                        {course.description.length > 60
                          ? course.description.substring(0, 60) + "..."
                          : course.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">
                      ${course.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          course.status
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {course.status ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                      {formatDate(course.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditCourse(course._id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Edit Course"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Delete Course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredCourses.length === 0 && courses.length > 0 && (
          <tr>
            <td
              colSpan={6}
              className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              <Search
                size={48}
                className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
              />
              No courses found matching your current filters.
            </td>
          </tr>
        )}

        {/* Pagination */}
        {totalPages > 1 && currentCourses.length > 0 && (
          <nav
            className="mt-6 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 bg-white dark:bg-gray-800 rounded-b-lg shadow-md"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{indexOfFirstCourse + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCourse, filteredCourses.length)}
                </span>{" "}
                of <span className="font-medium">{filteredCourses.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-2" /> Previous
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} className="ml-2" />
              </button>
            </div>
          </nav>
        )}
      </div>

      {courseToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          courseTitle={courseToDelete.title}
        />
      )}
    </>
  );
};

export default ManageCoursesPage;
