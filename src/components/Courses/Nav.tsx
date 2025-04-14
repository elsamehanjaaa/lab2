import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface Course {
  title: string;
  rating: number;
  price: number;
  courseId: string;
}

interface NavProps {
  course: Course | null;
}

const Nav: React.FC<NavProps> = ({ course }) => {
  const router = useRouter();
  const [showNav, setShowNav] = useState(false); // State to control nav visibility

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowNav(true); // Show nav after scrolling 50px
      } else {
        setShowNav(false); // Hide nav if scroll is less than 50px
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        showNav ? "top-0 z-10" : "-top-[100px]"
      } transition-all fixed bg-[#201c24] text-white px-6 py-4 backdrop-blur-md w-full`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {course && (
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-semibold">{course.title}</h1>

            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={i < Math.round(course.rating) ? "text-yellow-400" : "text-gray-500"}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-gray-400">{course.rating.toFixed(1)}</span>
            </div>
          </div>
        )}

        <button
          className="bg-white text-[#201c24] font-bold py-2 px-4 rounded transition-all duration-300 hover:bg-[#e9ada4] hover:text-white"
          onClick={() => router.push(`/course/subscribe/${course?.courseId}`)}
        >
          Enroll for ${course?.price.toFixed(2)}
        </button>
      </div>
    </div>
  );
};

export default Nav;
