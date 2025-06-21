import * as courseUtils from "@/utils/course";
import VideoPlayer from "@/components/learn/VideoPlayer";
import { ArrowDown, SquarePlay } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import * as enrollmentUtils from "@/utils/enrollment";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Link from "next/link";
import Image from "next/image";
import * as progressUtils from "@/utils/progress";

// --- Interfaces (remain unchanged) ---
interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  sections: SectionsWithLessons[];
  _id: string;
}
interface Lesson {
  title: string;
  index: number;
  content?: string;
  status: string; // "completed", "incomplete", "not_started"
  video_url?: string;
  created_at: string;
  _id: string;
}
interface SectionsWithLessons {
  index: number;
  title: string;
  created_at: string;
  _id: string;
  lessons: Lesson[];
}

// --- getServerSideProps (remain unchanged) ---
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const courseId = params?.courseId as string;

  if (!courseId) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const cookies = req.headers.cookie as string;
  const parsedCookies = parse(cookies);
  const access_token = parsedCookies["access_token"];

  if (!access_token) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const access = await enrollmentUtils.checkAccess(courseId, cookies);
  if (!access) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  const course = await courseUtils.getById(courseId, cookies);
  if (!course) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      course,
    },
  };
};

// --- CoursePage Component ---
const CoursePage = ({ course }: { course: Course }) => {
  const router = useRouter();
  const [video, setVideo] = useState<{ url: string; title: string } | null>(
    null
  );
  const [currentLesson, setCurrectLesson] = useState<Lesson | null>(null);
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(0); // Default open first section
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [courseState, setCourseState] = useState<Course>(course);

  const toggleSection = (index: number) => {
    setOpenSectionIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (currentLesson) {
      setVideo({
        url: currentLesson.video_url || "",
        title: currentLesson.title,
      });
    }
  }, [currentLesson]);

  // Set initial lesson and section on component mount/course change
  useEffect(() => {
    setCourseState(course);
    if (
      course?.sections?.length > 0 &&
      course.sections[0]?.lessons?.length > 0
    ) {
      setCurrectLesson(course.sections[0].lessons[0]);
      setCurrentSectionIndex(0);
      setCurrentLessonIndex(0);
    }
  }, [course]);

  const goToNextLesson = () => {
    if (!course) return;
    const currentSection = course.sections[currentSectionIndex];
    const nextLessonIndex = currentLessonIndex + 1;

    if (nextLessonIndex < currentSection.lessons.length) {
      const nextLesson = currentSection.lessons[nextLessonIndex];
      setCurrectLesson(nextLesson);
      setCurrentLessonIndex(nextLessonIndex);
    } else if (currentSectionIndex + 1 < course.sections.length) {
      const nextSection = course.sections[currentSectionIndex + 1];
      const nextLesson = nextSection.lessons[0];
      setCurrectLesson(nextLesson);
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentLessonIndex(0);
      setOpenSectionIndex(currentSectionIndex + 1); // Auto-open next section
    }
  };

  const goToPreviousLesson = () => {
    if (!course) return;

    if (currentLessonIndex > 0) {
      const prevLesson =
        course.sections[currentSectionIndex].lessons[currentLessonIndex - 1];
      setCurrectLesson(prevLesson);
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentSectionIndex > 0) {
      const prevSection = course.sections[currentSectionIndex - 1];
      const lastLessonIndex = prevSection.lessons.length - 1;
      const prevLesson = prevSection.lessons[lastLessonIndex];
      setCurrectLesson(prevLesson);
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentLessonIndex(lastLessonIndex);
      setOpenSectionIndex(currentSectionIndex - 1); // Auto-open previous section
    }
  };

  const handleProgressChange = async (progress: string) => {
    if (currentLesson?._id) {
      if (progress === "not_started" && currentLesson.status) return;
      if (progress !== "completed" && currentLesson.status === "incomplete")
        return;
      if (currentLesson.status === "completed") return;

      const cookies = parse(document.cookie || "");
      const access_token = cookies["access_token"];

      await progressUtils.update(progress, currentLesson?._id, course._id);

      const updatedCourse = {
        ...courseState,
        sections: courseState.sections.map((section) => ({
          ...section,
          lessons: section.lessons.map((lesson) =>
            lesson._id === currentLesson._id
              ? { ...lesson, status: progress }
              : lesson
          ),
        })),
      };
      setCourseState(updatedCourse);
    }
  };

  const allLessonsCompleted = courseState.sections.every((section) =>
    section.lessons.every((lesson) => lesson.status === "completed")
  );

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {" "}
      {/* Dark background for the whole page */}
      {/* Main Top Bar: Logo, Course Title, Back to Courses */}
      <header className="bg-gray-800 p-4 flex items-center justify-between shadow-lg sticky top-0 z-20">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/icons/logo.png" // Assumes white logo on dark background is good
              alt="Your Logo"
              width={90}
              height={90}
              quality={100}
            />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-100 truncate ml-4">
            {course?.title}
          </h1>
        </div>
        <Link
          href="/myCourses"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 flex items-center gap-1"
        >
          <ArrowDown className="rotate-90" size={16} />{" "}
          {/* Rotated arrow for "back" icon */}
          Back to Courses
        </Link>
      </header>
      {/* Main Content Area (Video Player + Sidebar) */}
      <div className="flex-grow flex overflow-hidden">
        {/* Video Player Column */}
        <div className="w-2/3 bg-gray-900 flex flex-col relative">
          {/* Current Lesson Info Bar: "Currently Playing" and Lesson Title */}
          <div className="bg-gray-700 text-gray-100 p-4  z-10 ">
            <p className="text-sm text-gray-400 mb-1">Currently Playing:</p>
            <h2 className="text-2xl md:text-3xl font-semibold truncate">
              {video?.title || "Select a Lesson to Begin"}
            </h2>
          </div>

          {/* Video Player */}
          <div className="flex-grow bg-gray-700 flex items-center justify-center">
            {video?.url ? (
              <VideoPlayer
                src={video.url}
                onNext={goToNextLesson}
                onPrev={goToPreviousLesson}
                onProgressChange={handleProgressChange}
              />
            ) : (
              <div className="text-gray-400 text-lg text-center p-4">
                No video selected. Please choose a lesson from the sidebar.
                <br />
                Or, if this is the first lesson, click to start.
              </div>
            )}
          </div>
        </div>

        {/* Course Content Column (Scrollable Sidebar) */}
        <div className="w-1/3 bg-gray-700 p-4 overflow-y-auto   ">
          {courseState &&
            courseState.sections.map((section, index) => (
              <div key={section._id} className="mb-3">
                {/* Section Header Button */}
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex justify-between items-center text-left py-3 px-4 bg-gray-700  text-gray-800 hover:bg-gray-800  hover:text-gray-700 border-2 border-gray-800 font-semibold cursor-pointer rounded-md shadow-sm  transition-colors duration-200"
                >
                  {section.title}
                  <ArrowDown
                    className={`transition-transform duration-300 text-gray-600 ${
                      openSectionIndex === index ? "rotate-180" : ""
                    }`}
                    size={20}
                  />
                </button>

                {/* Animated Dropdown Content */}
                <div
                  className={`
                     rounded-b-md mt-0 overflow-hidden  border-t-0  bg-gray-700 
                    transition-all duration-300 ease-in-out
                    ${
                      openSectionIndex === index
                        ? "max-h-screen opacity-100 py-2"
                        : "max-h-0 opacity-0"
                    }
                  `}
                >
                  {section.lessons.map((lesson, i) => (
                    <div
                      key={lesson._id}
                      onClick={() => {
                        setCurrectLesson(lesson);
                        setCurrentSectionIndex(index);
                        setCurrentLessonIndex(i);
                      }}
                      className={`
                        py-2 px-4 mx-2 rounded-md mb-1 last:mb-0
                        flex items-center justify-between transition-colors duration-200 cursor-pointer
                        ${
                          currentLesson?._id === lesson._id
                            ? " bg-gray-800  text-gray-700 "
                            : "bg-gray-700 text-gray-800 hover:bg-gray-800  hover:text-gray-700 font-semibold"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Progress Indicator */}
                        <div
                          className={`w-4 h-4 rounded-full border-2
                            ${
                              lesson.status === "completed"
                                ? "bg-emerald-500 border-emerald-500"
                                : lesson.status === "incomplete"
                                ? "bg-orange-400 border-orange-400"
                                : "bg-transparent border-gray-400"
                            }
                          `}
                        />
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <SquarePlay
                        className={`
                          ${
                            currentLesson?._id === lesson._id
                              ? "text-blue-600"
                              : "text-gray-500"
                          }
                        `}
                        size={18}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

          {/* "Complete Course" Button */}
          <div className="sticky bottom-0  p-4 -mx-4 mt-auto bg-gray-700font-semibold">
            <button
              className={`w-full rounded-xl p-4 text-center font-bold text-white transition-all duration-300 shadow-lg
                ${
                  allLessonsCompleted
                    ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
              disabled={!allLessonsCompleted}
              onClick={() => router.push("/myCourses")}
            >
              Complete Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
