import { useEffect, useState } from "react";
import CreateCourseForm from "../../components/Instructor/Createcourses";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import * as instructorUtils from "@/utils/instructor";
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

  const access = await instructorUtils.checkInstructorRole(access_token);

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
      <aside className="w-70 bg-gray-900 text-white shadow-lg p-6 rounded-r-2xl min-h-screen">
  <h2 className="text-2xl font-bold mb-8 tracking-wide">Teacher Dashboard</h2>
  <nav className="flex flex-col gap-4">
    <button
      onClick={() => setActiveTab("account-settings")}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
        activeTab === "account-settings"
          ? "bg-blue-400 text-white"
          : "hover:bg-gray-800"
      }`}
    >
      <i className="fas fa-cog" /> Account Settings
    </button>
    <button
      onClick={() => setActiveTab("create-course")}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
        activeTab === "create-course"
          ? "bg-blue-400 text-white"
          : "hover:bg-gray-800"
      }`}
    >
      <i className="fas fa-plus" /> Create Course
    </button>
    <button
      onClick={() => setActiveTab("manage-courses")}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
        activeTab === "manage-courses"
          ? "bg-blue-400 text-white"
          : "hover:bg-gray-800"
      }`}
    >
      <i className="fas fa-tasks" /> Manage Courses
    </button>
    <button
      onClick={() => setActiveTab("manage-students")}
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
        activeTab === "manage-students"
          ? "bg-blue-400 text-white"
          : "hover:bg-gray-800"
      }`}
    >
      <i className="fas fa-users" /> Manage Students
    </button>
  </nav>
</aside>

      <main className="flex-1 p-10">{renderContent()}</main>
    </div>
  );
}
