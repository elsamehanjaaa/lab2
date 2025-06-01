// pages/instructor/manage-students.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  FormEvent,
  ChangeEvent,
} from "react";
import Head from "next/head";
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpDown,
  BookOpen,
  Ban,
} from "lucide-react";
import * as studentUtils from "@/utils/student"; // Assuming this utility fetches data

// --- Type Definitions ---

// Represents the status of a student or their enrollment in a course
type StudentStatus = "Active" | "Suspended" | "Completed" | "Pending"; // Added more common statuses

// Details for a single course a student is enrolled in
interface EnrolledCourseItem {
  id: string; // Course ID
  title: string;
  progress: number;
  status: StudentStatus; // Status specific to this course enrollment
  enrolled_at: string; // ISO date string or formatted date string
}

// Main student object structure used in the frontend
interface Student {
  id: string; // Student's unique ID
  name: string;
  email: string;
  avatarUrl?: string; // URL for the student's avatar
  joinDate?: string; // Overall platform join date for the student
  progress?: number; // Overall progress of the student across all activities (if applicable)
  status?: StudentStatus; // Overall status of the student on the platform
  enrolledCourses: EnrolledCourseItem[]; // List of courses the student is enrolled in with details
}

// Structure expected from the backend API (studentUtils.getStudentsFromIntructor)
// This mirrors `StudentWithCourseDetails` from your NestJS backend
interface BackendStudentInfo {
  // Corresponds to the 'student' part of StudentWithCourseDetails
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  joinDate?: string; // Assuming backend provides this for overall student join date
  progress?: number; // Assuming backend provides overall student progress
  status?: StudentStatus; // Assuming backend provides overall student status
}
interface BackendEnrolledCourseItem {
  // Corresponds to 'EnrolledCourseDetail' from backend
  id: string;
  title: string;
  progress: number;
  status: string; // Backend might send as string, frontend casts to StudentStatus
  enrolled_at: string | Date;
}
interface BackendResponseItem {
  student: BackendStudentInfo;
  enrolledCourses: BackendEnrolledCourseItem[];
}

// For the "Add New Student" modal (simplified)
interface NewStudentData {
  name: string;
  email: string;
  // joinDate, status, progress, enrolledCourses for a new student might be set by default or handled differently
}

// For sorting the student table
interface SortConfig {
  key:
    | keyof Pick<Student, "name" | "email" | "joinDate" | "progress" | "status">
    | "actions";
  direction: "ascending" | "descending";
}

// Helper to format date
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

// ProgressBar Component Props
interface ProgressBarProps {
  progress: number;
}
const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// Modal Component Props
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
            <XCircle size={20} />
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

// StudentDetailModal Component Props
interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStudentStatus?: (
    studentId: string,
    newStatus: StudentStatus
  ) => Promise<void>; // For overall student status
}
const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onUpdateStudentStatus,
}) => {
  if (!student) return null;

  // This function would handle updating the OVERALL student status, if applicable
  const handleOverallStatusChange = async (newStatus: StudentStatus) => {
    if (
      onUpdateStudentStatus &&
      window.confirm(
        `Change overall status of ${student.name} to ${newStatus}?`
      )
    ) {
      await onUpdateStudentStatus(student.id, newStatus);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Details for ${student.name}`}
    >
      <div className="space-y-4 text-sm">
        <div className="flex items-center space-x-4">
          <img
            src={
              student.avatarUrl ||
              `https://placehold.co/80x80/E0E0E0/7F7F7F?text=${
                student.name ? student.name.substring(0, 2).toUpperCase() : "NA"
              }`
            }
            alt={student.name || "Student"}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/80x80/E0E0E0/7F7F7F?text=Err`;
            }}
          />
          <div>
            <p className="text-2xl font-semibold text-gray-800 dark:text-white">
              {student.name}
            </p>
            <p className="text-gray-600 dark:text-gray-300">{student.email}</p>
          </div>
        </div>
        <hr className="dark:border-gray-600" />
        {student.enrolledCourses[0].enrolled_at && (
          <p>
            <strong className="text-gray-700 dark:text-gray-200">
              Platform Join Date:
            </strong>{" "}
            {formatDate(student.enrolledCourses[0].enrolled_at)}
          </p>
        )}
        {typeof student.enrolledCourses[0].status !== "undefined" && (
          <p>
            <strong className="text-gray-700 dark:text-gray-200">
              Overall Status:
            </strong>
            <span
              className={`px-2 py-0.5 text-xs font-medium rounded-full ml-2 ${
                student.enrolledCourses[0].status === "Active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : student.enrolledCourses[0].status === "Suspended"
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  : student.enrolledCourses[0].status === "Completed"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {student.enrolledCourses[0].status}
            </span>
            {/* Optional: Button to change overall status */}
            {onUpdateStudentStatus && (
              <button
                onClick={() =>
                  handleOverallStatusChange(
                    student.enrolledCourses[0].status === "Active"
                      ? "Suspended"
                      : "Active"
                  )
                }
                className="ml-2 text-xs text-blue-500 hover:underline"
              >
                Toggle Overall Status
              </button>
            )}
          </p>
        )}
        {typeof student.enrolledCourses[0].progress !== "undefined" && (
          <div>
            <strong className="text-gray-700 dark:text-gray-200">
              Overall Progress:
            </strong>
            <div className="mt-1">
              <ProgressBar
                progress={student.enrolledCourses[0].progress || 0}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {student.enrolledCourses[0].progress || 0}% complete
              </span>
            </div>
          </div>
        )}

        <div>
          <strong className="text-gray-700 dark:text-gray-200 block mb-2">
            Enrolled Courses ({student.enrolledCourses.length}):
          </strong>
          {student.enrolledCourses && student.enrolledCourses.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {student.enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-600"
                >
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enrolled: {formatDate(course.enrolled_at)}
                  </p>
                  <div className="mt-1">
                    <div className="flex justify-between items-center text-xs mb-0.5">
                      <span className="text-gray-600 dark:text-gray-300">
                        Progress: {course.progress}%
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                          course.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-200"
                            : course.status === "Completed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-200"
                            : course.status === "Suspended"
                            ? "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-200"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <ProgressBar progress={course.progress} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No courses enrolled.
            </p>
          )}
        </div>
        <div className="pt-4 flex flex-wrap gap-2 ">
          <button
            //   onClick={handleSuspendStudent()}
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-red-200 border border-gray-200 rounded-lg hover:bg-red-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-red-700 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-gray-500 flex items-center"
          >
            <Ban size={16} className="mr-1" /> Suspend Student
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<StudentStatus | "All">(
    "All"
  ); // For overall student status filter
  const [courseFilter, setCourseFilter] = useState<string>("All");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const studentsPerPage = 7;

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] =
    useState<boolean>(false);

  const [allCourseTitles, setAllCourseTitles] = useState<string[]>([]); // For course filter dropdown

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: "ascending",
  });

  const instructorId: string = "ce023eff-353e-4304-a2c8-27c0a56883d1"; // Example instructor ID

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const backendData = await studentUtils.getStudentsFromIntructor(
        instructorId
      );

      if (!Array.isArray(backendData)) {
        console.error("API did not return an array. Data:", backendData);
        throw new Error("Invalid data format received from API.");
      }

      const formattedStudents: Student[] = backendData
        .map((item) => {
          if (!item) {
            console.warn("Skipping invalid item from backend:", item);
            return null; // Skip this item if it's not in the expected shape
          }
          return {
            id: item.student.id,
            name: item.student.name,
            email: item.student.email,
            avatarUrl: item.student.avatarUrl,
            joinDate: item.student.joinDate
              ? new Date(item.student.joinDate).toISOString()
              : undefined,
            progress: item.student.progress, // Overall progress
            status: item.student.status, // Overall status
            enrolledCourses: Array.isArray(item.enrolledCourses)
              ? item.enrolledCourses.map((ec) => ({
                  id: ec.id,
                  title: ec.title,
                  progress: ec.progress,
                  status: ec.status as StudentStatus, // Cast, ensure backend strings match enum
                  enrolled_at: new Date(ec.enrolled_at).toISOString(),
                }))
              : [], // Default to empty array if enrolledCourses is not an array
          };
        })
        .filter((student) => student !== null) as Student[]; // Filter out any nulls from invalid items

      setStudents(formattedStudents);

      const courseTitles = new Set<string>();
      formattedStudents.forEach((student) => {
        student.enrolledCourses.forEach((course) =>
          courseTitles.add(course.title)
        );
      });
      setAllCourseTitles(["All", ...Array.from(courseTitles).sort()]);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setError(
        err.message || "Failed to fetch students. Please try again later."
      );
      setStudents([]); // Clear students on error
    } finally {
      setIsLoading(false);
    }
  }, [instructorId]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleUpdateOverallStudentStatus = async (
    studentId: string,
    newStatus: StudentStatus
  ) => {
    alert(
      `Overall status update for student ${studentId} to ${newStatus} is a placeholder.`
    );
  };

  const handleAddStudent = async (newStudentData: NewStudentData) => {
    alert("Add student functionality is a placeholder.");
    setIsAddStudentModalOpen(false);
  };

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        // Robust checks for name and email
        const nameMatch =
          typeof student.name === "string" &&
          student.name.toLowerCase().includes(lowerSearchTerm);
        const emailMatch =
          typeof student.email === "string" &&
          student.email.toLowerCase().includes(lowerSearchTerm);

        const overallStatusMatch =
          statusFilter === "All" ||
          (typeof student.status !== "undefined" &&
            student.status === statusFilter);

        const courseTitleMatch =
          courseFilter === "All" ||
          (student.enrolledCourses &&
            student.enrolledCourses.some(
              (course) => course.title === courseFilter
            ));

        const result =
          (searchTerm === "" || nameMatch || emailMatch) &&
          overallStatusMatch &&
          courseTitleMatch;
        // if (students.length > 0) console.log(`Student: ${student.name}, Search: ${searchTerm}, nameMatch: ${nameMatch}, emailMatch: ${emailMatch}, status: ${student.status}, statusFilter: ${statusFilter}, overallStatusMatch: ${overallStatusMatch}, courseFilter: ${courseFilter}, courseTitleMatch: ${courseTitleMatch}, FINAL_FILTER_RESULT: ${result}`); // DEBUG
        return result;
      })
      .sort((a, b) => {
        if (!sortConfig.key || sortConfig.key === "actions") return 0;

        let valA =
          a[
            sortConfig.key as keyof Pick<
              Student,
              "name" | "email" | "joinDate" | "progress" | "status"
            >
          ];
        let valB =
          b[
            sortConfig.key as keyof Pick<
              Student,
              "name" | "email" | "joinDate" | "progress" | "status"
            >
          ];

        if (sortConfig.key === "joinDate") {
          valA = valA ? new Date(valA).getTime() : 0;
          valB = valB ? new Date(valB).getTime() : 0;
        } else if (sortConfig.key === "progress") {
          valA = typeof valA === "number" ? valA : 0;
          valB = typeof valB === "number" ? valB : 0;
        } else if (typeof valA === "string") {
          valA = valA.toLowerCase();
        }
        if (typeof valB === "string") {
          valB = valB.toLowerCase();
        }

        const safeA = valA !== undefined && valA !== null ? valA : "";
        const safeB = valB !== undefined && valB !== null ? valB : "";
        if (safeA < safeB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (safeA > safeB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
  }, [students, searchTerm, statusFilter, courseFilter, sortConfig]);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const requestSort = (
    key:
      | keyof Pick<
          Student,
          "name" | "email" | "joinDate" | "progress" | "status"
        >
      | "actions"
  ) => {
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

  const getSortIndicator = (
    key:
      | keyof Pick<
          Student,
          "name" | "email" | "joinDate" | "progress" | "status"
        >
      | "actions"
  ) => {
    if (key === "actions") return null;
    if (sortConfig.key === key)
      return sortConfig.direction === "ascending" ? " ▲" : " ▼";
    return <ArrowUpDown size={14} className="inline ml-1 opacity-50" />;
  };

  const viewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  if (isLoading && students.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
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
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Loading Students...
          </p>
        </div>
      </div>
    );
  }

  if (error && students.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
          {error}
        </p>
        <button
          onClick={fetchStudents}
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
        <title>Manage Students | Instructor Dashboard</title>
      </Head>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
              <Users
                size={32}
                className="mr-3 text-blue-600 dark:text-blue-500"
              />{" "}
              Manage Students
            </h1>
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="mt-4 sm:mt-0 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-500 flex items-center shadow-md transition-transform hover:scale-105"
            >
              <UserPlus size={20} className="mr-2" /> Add New Student
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Instructor ID: {instructorId}
          </p>
        </header>

        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label
                htmlFor="search-students"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Search Students
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="search-students"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Name or Email..."
                  value={searchTerm}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Filter by Overall Status
              </label>
              <select
                id="status-filter"
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as StudentStatus | "All")
                }
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="course-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Filter by Enrolled Course
              </label>
              <select
                id="course-filter"
                className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
                value={courseFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setCourseFilter(e.target.value)
                }
              >
                {allCourseTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading && students.length > 0 && (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">
            Refreshing data...
          </div>
        )}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {(
                  [
                    "name",
                    "email",
                    "joinDate",
                    "progress",
                    "status",
                    "actions",
                  ] as Array<
                    | keyof Pick<
                        Student,
                        "name" | "email" | "joinDate" | "progress" | "status"
                      >
                    | "actions"
                  >
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
                                    key === "email"
                                      ? "hidden md:table-cell"
                                      : ""
                                  } ${
                      key === "joinDate" ? "hidden lg:table-cell" : ""
                    } ${key === "progress" ? "hidden sm:table-cell" : ""}`}
                    onClick={() =>
                      key !== "actions" &&
                      requestSort(
                        key as keyof Pick<
                          Student,
                          "name" | "email" | "joinDate" | "progress" | "status"
                        >
                      )
                    }
                  >
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                    {key !== "actions" && getSortIndicator(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={
                              student.avatarUrl ||
                              `https://placehold.co/40x40/E2E8F0/4A5568?text=${
                                student.name
                                  ? student.name.substring(0, 2).toUpperCase()
                                  : "NA"
                              }`
                            }
                            alt={student.name || "Student"}
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement, Event>
                            ) => {
                              const t = e.target as HTMLImageElement;
                              t.onerror = null;
                              t.src = `https://placehold.co/40x40/E2E8F0/4A5568?text=Err`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell">
                      {student.enrolledCourses[0].enrolled_at
                        ? formatDate(student.enrolledCourses[0].enrolled_at)
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      {typeof student.enrolledCourses[0].progress !==
                      "undefined" ? (
                        <div className="flex items-center">
                          <div className="w-24 mr-2">
                            <ProgressBar
                              progress={student.enrolledCourses[0].progress}
                            />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-300">
                            {student.enrolledCourses[0].progress}%
                          </span>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.enrolledCourses[0].status ? (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.enrolledCourses[0].status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : student.enrolledCourses[0].status ===
                                "Suspended"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : student.enrolledCourses[0].status ===
                                "Completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {student.enrolledCourses[0].status}
                        </span>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => viewStudentDetails(student)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    <Users
                      size={48}
                      className="mx-auto mb-2 text-gray-400 dark:text-gray-500"
                    />
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav
            className="mt-6 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 bg-white dark:bg-gray-800 rounded-b-lg shadow-md"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">{indexOfFirstStudent + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastStudent, filteredStudents.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredStudents.length}</span>{" "}
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

      {isDetailModalOpen && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateStudentStatus={handleUpdateOverallStudentStatus}
        />
      )}

      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        title="Add New Student (Placeholder)"
      >
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddStudent({
              name: String(formData.get("name") || ""),
              email: String(formData.get("email") || ""),
            });
          }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="new-student-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="new-student-name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="new-student-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="new-student-email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(false)}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Student
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
