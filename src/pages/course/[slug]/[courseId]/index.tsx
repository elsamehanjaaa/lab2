import React, { useEffect, useState, useRef } from "react";
import router, { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Nav from "../../../../components/Courses/Nav";
import CourseHeader from "../../../../components/Courses/CoursesHeader";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import * as courseUtils from "@/utils/course";
import * as enrollmentUtils from "@/utils/enrollment";
import { CornerDownRight, UserCircle2 } from "lucide-react";
import Link from "next/link";
interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  slug: string;
  learn: string[];
  requirements: string[];
  fullDescription: string;
  thumbnail_url?: string;
  instructor_name?: string;
  instructorPicture?: string;
  instructor_bio?: string;
  categories?: Categories[];
  updatedAt?: string;
  status: boolean;
  languages?: string[];
  sections: Sections[];
}
interface Sections {
  title: string;
  index: number;
  lessons: Lessons[];
}
interface Lessons {
  title: string;
}
interface Categories {
  name: string;
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie as string;
  const parsedCookies = parse(cookies);
  const access_token = parsedCookies.access_token;
  let alreadyEnrolled = false;
  const { courseId } = context.query;

  if (!courseId || typeof courseId !== "string") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const course = await courseUtils.getById(courseId);
  if (!course) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  if (access_token) {
    alreadyEnrolled = await enrollmentUtils.checkAccess(
      courseId,
      cookies as string
    );
  }
  return {
    props: { course, alreadyEnrolled },
  };
};

const Index = ({
  course,
  alreadyEnrolled,
}: {
  course: Course;
  alreadyEnrolled: boolean;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoverThumbnail, setHoverThumbnail] = useState(false);
  const courseContentRef = useRef<HTMLDivElement>(null);
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };
  const handleThumbnailClick = () => {
    if (courseContentRef.current) {
      const navHeight = document.querySelector("div.fixed")?.clientHeight || 0;
      window.scrollTo({
        top: courseContentRef.current.offsetTop - 184,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (course) {
      setLoading(false);
    }
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Top Navigation */}

      {/* ✅ Course Header */}
      {course && (
        <>
          <CourseHeader
            course={course}
            hoverThumbnail={hoverThumbnail}
            setHoverThumbnail={setHoverThumbnail}
            handleThumbnailClick={handleThumbnailClick}
          />
          <Nav course={course} alreadyEnrolled={alreadyEnrolled} />
        </>
      )}

      {/* ✅ Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {loading && (
          <p className="text-center text-lg text-gray-700">Loading course...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && course && (
          <div className="space-y-10">
            {/* What You'll Learn */}
            <div className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {course.learn &&
                  course.learn.map((learn, index) => {
                    return <li key={index}>{learn}</li>;
                  })}
              </ul>
            </div>

            {/* Explore Related Content */}
            {course.categories && course.categories.length > 0 && (
              <div className="bg-white shadow p-6 rounded-md">
                <h3 className="text-xl font-semibold mb-4">
                  Explore Related Content
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {course.categories &&
                    course.categories.map((category) => (
                      <Link
                        href={`/courses/${encodeURIComponent(category.slug)}`}
                        key={category.name}
                        className=" text-purple-700 border-1 border-purple-600 hover:text-white hover:bg-purple-600 cursor-pointer px-4 py-1 rounded "
                      >
                        {category.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            <div className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {course.requirements &&
                  course.requirements.map((requirement, index) => {
                    return <li key={index}>{requirement}</li>;
                  })}
              </ul>
            </div>
            {/* Course Content */}
            <div
              ref={courseContentRef}
              className="bg-white shadow p-6 rounded-md"
            >
              <h3 className="text-xl font-semibold mb-4">Course Content</h3>
              <div className="space-y-4">
                {course.sections.map((section, index) => (
                  <div key={index} className="border-b pb-2">
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() => toggleSection(index)}
                    >
                      <span>
                        {section.index}. {section.title}
                      </span>
                      <span>{openSection === index ? "▲" : "▼"}</span>
                    </div>

                    {/* Lessons Dropdown */}
                    {openSection === index && section.lessons && (
                      <ul className="mt-2 pl-4 text-sm text-gray-600">
                        {section.lessons.map((lesson, i) => (
                          <li key={i} className="flex items-start py-1 gap-1">
                            <CornerDownRight size={18} />
                            <span>{lesson.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                {/* Add more lessons here dynamically if needed */}
              </div>
            </div>
            {/* Instructor Section */}
            <div className="bg-white shadow p-6 rounded-md">
              <h3 className="text-xl font-semibold mb-4">Instructor</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <UserCircle2 size={96} />
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    {course.instructor_name}
                  </h4>
                  <p className="text-gray-600">{course.instructor_bio}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
