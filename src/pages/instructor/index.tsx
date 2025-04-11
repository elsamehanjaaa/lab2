import { useState } from 'react';
import CreateCourseForm from '../../components/Instructor/Createcourses';

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'create-course':
        return <CreateCourseForm />;
      case 'account-settings':
        return <div>Account Settings Section</div>;
      case 'manage-courses':
        return <div>Manage Courses Section</div>;
      case 'manage-students':
        return <div>Manage Students Section</div>;
      default:
        return <div className="text-gray-500">Select an option from the sidebar</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow p-6">
        <h2 className="text-xl font-bold mb-6">Teacher Dashboard</h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => setActiveTab('account-settings')}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Account Settings
          </button>
          <button
            onClick={() => setActiveTab('create-course')}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Create Course
          </button>
          <button
            onClick={() => setActiveTab('manage-courses')}
            className="text-left px-4 py-2 rounded hover:bg-gray-200"
          >
            Manage Courses
          </button>
          <button
            onClick={() => setActiveTab('manage-students')}
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
