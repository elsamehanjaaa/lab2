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

const CardHorizontal = ({ course }: { course: Course }) => {
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
      className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition duration-300 ease-in-out flex gap-4 w-full max-w-4xl"
    >
      <div className="flex-shrink-0">
        <Image
          src={course.thumbnail_url || "/images/no-thumbnail.png"}
          width={160}
          height={120}
          alt={course.title}
          className="rounded-lg object-cover max-w-40 max-h-32"
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div>
          <h2 className="text-xl font-bold mb-1">{course.title}</h2>
          <p className="text-gray-600 mb-2 text-sm line-clamp-2">
            {course.description}
          </p>
        </div>
        <div className="text-sm text-gray-600 flex flex-wrap gap-2">
          <span>
            <strong>Price:</strong> ${course.price}
          </span>
          <span className="flex items-center">
            {renderStars(course.rating)}
            <span className="ml-1">({course.rating})</span>
          </span>
          <span>
            <strong>Status:</strong>{" "}
            {course.status ? "Available" : "Unavailable"}
          </span>
          <span>
            <strong>Created:</strong>{" "}
            {new Date(course.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CardHorizontal;
