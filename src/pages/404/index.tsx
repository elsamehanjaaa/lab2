import React from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

const index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 py-10 bg-gray-100">
      <BookOpen size={80} className="text-indigo-600 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Lost in Learning?</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        Oops! We couldn’t find the page you’re looking for.
        <br />
        But every mistake is just a new lesson — let’s get back on track.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl text-base font-medium transition"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Home
      </Link>
    </div>
  );
};

export default index;
