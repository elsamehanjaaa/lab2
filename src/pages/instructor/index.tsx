import { useEffect, useState } from "react";
import CreateCourseForm from "../../components/Instructor/Createcourses";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { checkInstructorRole } from "@/utils/checkInstructorRole";
import ManageCourses from "@/components/Instructor/ManageCourses";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const parsedCookies = parse(req.headers.cookie || "");
  const access_token = parsedCookies["access_token"];

  if (!access_token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const access = await checkInstructorRole(access_token);

  if (!access) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const cookies = req.headers.cookie;
  return {
    props: { cookies }, // Return an empty props object as a fallback
  };
};
export default function TeacherDashboard({ cookies }: { cookies: string }) {
  const [activeTab, setActiveTab] = useState("");
  const renderContent = () => {
    switch (activeTab) {
      case "create-course":
        return <CreateCourseForm />;
      case "account-settings":
        return <div>Account Settings Section</div>;
      case "manage-courses":
        return <ManageCourses cookies={cookies} />;
      case "manage-students":
        return <div>Manage Students Section</div>;
      default:
        return (
          <div className="text-gray-500">Select an option from the sidebar</div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow p-6">
        <h2 className="text-xl font-bold mb-6">Teacher Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("account-settings")}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab("create-course")}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Create Course
          </button>
          <button
            onClick={() => setActiveTab("manage-courses")}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("manage-students")}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Manage Students
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">{renderContent()}</main>
    </div>
  );
}
