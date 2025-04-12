import Link from "next/link";
import React from "react";
import Image from "next/image";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  thumbnail_url?: string;
  slug: string;
  _id: string;
}

const Card = ({ course }: { course: Course }) => {
  console.log(course.thumbnail_url);
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
      href={`/course/${course.slug}/${course._id}`}
      className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 ease-in-out max-w-80"
    >
      <Image
        src={course.thumbnail_url || "/images/no-thumbnail.png"}
        width={300}
        height={200}
        alt={course.title}
      />
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
