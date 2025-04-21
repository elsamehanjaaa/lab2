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
      className="
        bg-white rounded-2xl shadow-md p-4 sm:p-6 
        hover:shadow-lg transition duration-300 ease-in-out 
        w-full max-w-sm
      "
    >
      {/* 
        Make the image fill the card width and maintain aspect ratio.
        You can adjust objectFit to "cover" or "contain" depending on your preference.
      */}
      <div className="relative w-full h-48 sm:h-52 md:h-60 mb-4">
        <Image
          src={course.thumbnail_url || "/images/no-thumbnail.png"}
          alt={course.title}
          fill
          className="rounded-t-xl object-cover"
          sizes="(max-width: 640px) 100vw,
                 (max-width: 768px) 50vw,
                 33vw"
        />
      </div>
      <h2 className="text-lg sm:text-xl font-bold mb-2">{course.title}</h2>
      <p className="text-gray-600 text-sm sm:text-base mb-3">
        {course.description}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mb-1">
        <strong>Price:</strong> ${course.price}
      </p>
      <div className="flex items-center text-xs sm:text-sm mb-2">
        {renderStars(course.rating)}
        <span className="text-gray-500 ml-1">({course.rating})</span>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 mb-1">
        <strong>Status:</strong>{" "}
        {course.status ? "Available" : "Unavailable"}
      </p>
      <p className="text-xs sm:text-sm text-gray-400">
        <strong>Created:</strong>{" "}
        {new Date(course.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
};

export default Card;
