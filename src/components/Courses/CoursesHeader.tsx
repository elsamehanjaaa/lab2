// components/Courses/CourseHeader.tsx

import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  slug: string;
  thumbnail_url?: string;
  instructor_name?: string;
  categories?: Categories[];
  updatedAt?: string;
  languages?: string[];
}
interface Categories {
  name: string;
  slug: string;
}
interface CourseHeaderProps {
  course: Course | null;
  hoverThumbnail: boolean;
  setHoverThumbnail: React.Dispatch<React.SetStateAction<boolean>>;
  handleThumbnailClick: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  hoverThumbnail,
  setHoverThumbnail,
  handleThumbnailClick,
}) => {
  const router = useRouter();

  return (
    <div className="w-full bg-[#201c24] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-10 flex-wrap">
        {/* Left: Title and Info */}
        <div className="flex-1 min-w-[250px]">
          {course?.categories && (
            <div className="flex gap-3 mb-4 flex-wrap">
              {course.categories.map((cat) => (
                <Link
                  key={cat.name}
                  className="bg-purple-700 cursor-pointer px-4 py-1 rounded text-sm"
                  href={`/courses/${encodeURIComponent(cat.slug)}`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className="text-3xl font-bold mb-4">{course?.title}</h1>
          <p className="text-gray-300 mb-4">{course?.description}</p>

          {course && (
            <div className="flex items-center mb-3">
              {/* {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(course.rating) ? "text-yellow-400" : "text-gray-500"
                  }
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-gray-400">{course.rating.toFixed(1)}</span> */}
            </div>
          )}

          <div className="text-sm text-gray-400">
            <p className="mb-1">
              Created by{" "}
              <span className="text-blue-400">
                {course?.instructor_name || "Unknown"}
              </span>
            </p>
            <p>
              Updated:{" "}
              {course?.updatedAt
                ? new Date(course.updatedAt).toLocaleDateString()
                : "N/A"}{" "}
              | Language
              {course?.languages?.length! > 1 ? "s" : ""}:{" "}
              <span className="text-blue-300">
                {course?.languages?.join(", ") || "English"}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Thumbnail */}
        <div
          className="relative w-96 cursor-pointer"
          onMouseEnter={() => setHoverThumbnail(true)}
          onMouseLeave={() => setHoverThumbnail(false)}
          onClick={handleThumbnailClick}
        >
          <Image
            src={course?.thumbnail_url || "/images/no-thumbnail.png"}
            alt="Course Thumbnail"
            className="rounded-md shadow-lg object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            width={400}
            height={225}
          />
          {hoverThumbnail && (
            <div className="absolute inset-0 backdrop-blur-md flex items-center justify-center text-[#201c24] font-bold text-xl rounded-md">
              Preview this course
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
