import { useEffect, useState } from "react";
import CreateCourseForm from "../../components/Instructor/Createcourses";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import * as instructorUtils from "@/utils/instructor";
import ManageCourses from "@/components/Instructor/ManageCourses";
import {
  Settings,
  Plus,
  ListChecks,
  Users,
  Home,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Dashboard from "@/components/Instructor/Dashboard";
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
  const [activeTab, setActiveTab] = useState("Overview");
  const renderContent = () => {
    switch (activeTab) {
      case "create-course":
        return (
          <CreateCourseForm
            cookies={cookies}
            onCourseCreated={() => setActiveTab("manage-courses")}
          />
        );
      case "account-settings":
        return <div>Account Settings Section</div>;
      case "manage-courses":
        return (
          <ManageCourses
            cookies={cookies}
            onCreateCourse={() => setActiveTab("create-course")}
          />
        );
      case "manage-students":
        return <div>Manage Students Section</div>;
      case "Overview":
        return <Dashboard />;
      default:
        return (
          <div className="text-gray-500">Select an option from the sidebar</div>
        );
    }
  };
  return (
    <div className="flex max-h-screen bg-gray-100 overflow-hidden">
      <aside className="w-70 bg-gray-900 text-white shadow-lg p-6 rounded-r-2xl h-screen max-h-screen flex flex-col">
        <h2 className="text-2xl font-bold mb-8 tracking-wide">
          Teacher Dashboard
        </h2>

        <nav className="flex flex-col flex-grow gap-4">
          {/* Top nav buttons */}
          <button
            onClick={() => setActiveTab("Overview")}
            className={`flex items-center cursor-pointer gap-3 px-4 py-2 rounded-md transition-all ${
              activeTab === "Overview"
                ? "bg-blue-400 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            onClick={() => setActiveTab("create-course")}
            className={`flex items-center cursor-pointer gap-3 px-4 py-2 rounded-md transition-all ${
              activeTab === "create-course"
                ? "bg-blue-400 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <Plus size={18} /> Create Course
          </button>
          <button
            onClick={() => setActiveTab("manage-courses")}
            className={`flex items-center cursor-pointer gap-3 px-4 py-2 rounded-md transition-all ${
              activeTab === "manage-courses"
                ? "bg-blue-400 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <ListChecks size={18} /> Manage Courses
          </button>
          <button
            onClick={() => setActiveTab("manage-students")}
            className={`flex items-center cursor-pointer gap-3 px-4 py-2 rounded-md transition-all ${
              activeTab === "manage-students"
                ? "bg-blue-400 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <Users size={18} /> Manage Students
          </button>

          <button
            onClick={() => setActiveTab("account-settings")}
            className={`flex items-center cursor-pointer gap-3 px-4 py-2 rounded-md transition-all mt-auto ${
              activeTab === "account-settings"
                ? "bg-blue-400 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <Settings size={18} /> Account Settings
          </button>
          {/* Home button pushed to bottom */}
          <Link
            href="/"
            onClick={() => setActiveTab("")}
            className="flex items-center cursor-pointer gap-3 px-4 py-2 rounded-md transition-all  hover:bg-gray-800"
          >
            <Home size={18} /> Home
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-scroll">{renderContent()}</main>
    </div>
  );
}
