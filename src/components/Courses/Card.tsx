import Link from "next/link";
import React from "react";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  courseId: string;
}

const Card = ({ course }: { course: Course }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < Math.floor(rating); i++) {
      stars.push(
        <span key={i} className="text-yellow-500 mr-1">
          ★
        </span>
      );
    }
    return stars;
  };
  return (
    <Link
      href={`/course/${course.slug}/${course.courseId}`}
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out"
    >
      <h2 className="text-xl font-bold mb-2">{course.title}</h2>
      <p className="text-gray-600 mb-3">{course.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Price:</strong> ${course.price}
      </p>
      <div className="flex items-center text-sm mb-2">
        {renderStars(course.rating)}
        <span className="text-gray-500 ml-1">({course.rating})</span>
      </div>
      <p className="text-sm text-gray-500 mb-1">
        <strong>Status:</strong> {course.status ? "Available" : "Unavailable"}
      </p>
      <p className="text-sm text-gray-400">
        <strong>Created:</strong>{" "}
        {new Date(course.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
};

export default Card;
