// pages/course/not-found.tsx
import Head from "next/head";
import Link from "next/link";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Head>
        <title>Course Not Found</title>
      </Head>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Course Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Sorry, the course you are looking for doesn't exist.
      </p>
      <Link
        href="/courses"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go Back to Courses
      </Link>
    </div>
  );
}
