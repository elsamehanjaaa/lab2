// components/Sidebar.js
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="bg-gray-100 w-64 h-screen p-4 flex flex-col">
      {/* Adjust width and height as needed */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">MATERIO</h1>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-2 rounded-md  bg-gradient-to-r from-slate-50 to-[#9257FF] text-indigo-800"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7a2 2 0 012.828 0l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7m2 2l-2 2"
                ></path>
              </svg>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/account"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Account Settings
            </Link>
          </li>
          <li className="mt-4">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Pages
            </span>
          </li>
          <li>
            <Link
              href="/login"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                ></path>
              </svg>
              Login
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1h-3a9 9 0 00-6-0h-3v-1zm0 0v-1a3 3 0 013-3h3a3 3 0 013 3v1"
                ></path>
              </svg>
              Register
            </Link>
          </li>
          <li>
            <Link
              href="/error"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Error
            </Link>
          </li>
          <li className="mt-4">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              User Interface
            </span>
          </li>
          <li>
            <Link
              href="/typography"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5z"
                ></path>
              </svg>
              Typography
            </Link>
          </li>
          <li>
            <Link
              href="/icons"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 13.636 6.318 6.318z"
                ></path>
              </svg>
              Icons
            </Link>
          </li>
          <li>
            <Link
              href="/cards"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 10h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2zm13 2h-4A2 2 0 0115 12v-2a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2zm-6 4H7a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2zm13 0h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 01-2 2z"
                ></path>
              </svg>
              Cards
            </Link>
          </li>
          <li>
            <Link
              href="/tables"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
              Tables
            </Link>
          </li>
          <li>
            <Link
              href="/form-layouts"
              className="flex items-center p-2 rounded-md hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Form Layouts
            </Link>
          </li>
        </ul>
      </nav>
      <Link
        href="/"
        className="mt-8 p-4 bg-purple-600 text-white text-center rounded-md py-2 px-4 w-full block"
      >
        Go Back
      </Link>
    </aside>
  );
};

export default Sidebar;
