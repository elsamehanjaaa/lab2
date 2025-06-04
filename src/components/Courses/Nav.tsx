import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

interface Course {
  title: string;
  rating: number;
  price: number;
  slug: string;
  _id: string;
}

interface NavProps {
  course: Course | null;
  alreadyEnrolled: boolean;
}

const Nav: React.FC<NavProps> = ({ course, alreadyEnrolled }) => {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-all bg-[#201c24] text-white px-6 py-4 backdrop-blur-md w-full ${
        showNav ? "shadow-md" : ""
      } sticky top-[100px] z-40`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {course && (
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-semibold">{course.title}</h1>
            <div className="flex items-center mt-2">
              {/* Star Rating Logic Here */}
            </div>
          </div>
        )}

        {alreadyEnrolled ? (
          <Link
            href={`/learn/${course?.slug}/${course?._id}`}
            className="bg-white text-[#201c24] font-bold py-2 px-4 rounded transition-all duration-300 hover:bg-[#e9ada4] hover:text-white"
          >
            Go to Course
          </Link>
        ) : (
          <Link
            href={`/course/subscribe/${course?._id}`}
            className="bg-white text-[#201c24] font-bold py-2 px-4 rounded transition-all duration-300 hover:bg-[#e9ada4] hover:text-white"
          >
            Enroll for ${course?.price.toFixed(2)}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;
