import { getCourseById } from "@/utils/getCourseById";
import VideoPlayer from "@/components/learn/VideoPlayer";
import { ArrowDown, SquarePlay } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { checkEnrollment } from "@/utils/checkEnrollment";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Link from "next/link";
import Image from "next/image";
import { updateProgress } from "@/utils/updateProgress";
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
  status: string;
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const courseId = params?.courseId as string;

  if (!courseId) {
    return { redirect: { destination: "/", permanent: false } };
  }

  const parsedCookies = parse(req.headers.cookie || "");
  const access_token = parsedCookies["access_token"];

  if (!access_token) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  const access = await checkEnrollment(courseId, access_token);
  if (!access) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }
  const cookies = req.headers.cookie || "";
  // ✅ Fetch course data here
  const course = await getCourseById(courseId, cookies);
  if (!course) {
    return { redirect: { destination: "/404", permanent: false } };
  }

  return {
    props: {
      course,
    },
  };
};

const CoursePage = ({ course }: { course: Course }) => {
  const router = useRouter();
  const [video, setVideo] = useState<{ url: string; title: string } | null>(
    null
  );
  const [currentLesson, setCurrectLesson] = useState<Lesson | null>(null);
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(0);
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
  useEffect(() => {
    setCourseState(course);
    setCurrectLesson(course?.sections?.[0]?.lessons?.[0]);
    setCurrentSectionIndex(0);
    setCurrentLessonIndex(0);
  }, [course]);

  const goToNextLesson = () => {
    if (!course) return;
    const currentSection = course.sections[currentSectionIndex];
    const nextLessonIndex = currentLessonIndex + 1;

    if (nextLessonIndex < currentSection.lessons.length) {
      // Next lesson in same section
      const nextLesson = currentSection.lessons[nextLessonIndex];
      setCurrectLesson(nextLesson);

      setCurrentLessonIndex(nextLessonIndex);
    } else if (currentSectionIndex + 1 < course.sections.length) {
      // Move to next section
      const nextSection = course.sections[currentSectionIndex + 1];
      const nextLesson = nextSection.lessons[0];
      setCurrectLesson(nextLesson);

      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const goToPreviousLesson = () => {
    if (!course) return;

    if (currentLessonIndex > 0) {
      // Previous lesson in same section
      const prevLesson =
        course.sections[currentSectionIndex].lessons[currentLessonIndex - 1];

      setCurrectLesson(prevLesson);
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Go to last lesson in previous section
      const prevSection = course.sections[currentSectionIndex - 1];
      const lastLessonIndex = prevSection.lessons.length - 1;
      const prevLesson = prevSection.lessons[lastLessonIndex];

      setCurrectLesson(prevLesson);
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentLessonIndex(lastLessonIndex);
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
      const update = await updateProgress(
        progress,
        currentLesson?._id,
        access_token as string,
        course._id
      );

      // Update lesson status immutably
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
    <div className="">
      <div className="absolute top-0 left-0 p-3">
        <Link href="/">
          <Image
            src="/icons/logo.png"
            alt="Logo"
            width={100}
            height={100}
            quality={100}
          />
        </Link>
      </div>
      <div className="flex ">
        <div className="flex-grow bg-gray-700">
          <div className="w-full h-20 bg-gray-700 text-3xl text-black flex items-center justify-center">
            {video?.title}
          </div>

          {video?.url && (
            <VideoPlayer
              src={video?.url}
              onNext={goToNextLesson}
              onPrev={goToPreviousLesson}
              onProgressChange={(progress) => {
                handleProgressChange(progress);
              }}
            />
          )}
        </div>
        <div className="w-lg mx-auto flex flex-col justify-between  bg-gray-100 rounded-md overflow-hidden shadow">
          <div className="">
            {courseState &&
              courseState.sections.map((section, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex justify-between items-center text-left py-4 px-4 bg-gray-300 font-semibold cursor-pointer"
                  >
                    {section.title}
                    <ArrowDown
                      className={`transition-transform duration-300 ${
                        openSectionIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openSectionIndex === index && (
                    <div className="bg-gray-200">
                      {section.lessons.map((lesson, i) => (
                        <div
                          key={i}
                          onClick={() => setCurrectLesson(lesson)}
                          className="py-2 px-6 bg-gray-300 flex items-center justify-between hover:bg-gray-400 transition cursor-pointer"
                        >
                          {/* Progress Indicator Box */}
                          <div className="flex items-center gap-2">
                            <div
                              className={`
                              w-3 h-3 rounded-sm border-2 border-gray-500
                               ${
                                 lesson.status === "completed"
                                   ? "bg-green-500 border-green-500"
                                   : lesson.status === "incomplete"
                                   ? "bg-gray-500"
                                   : ""
                               }

                            `}
                            />
                            {lesson.title}
                          </div>
                          <SquarePlay />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <button
            className={`w-11/12 mx-auto rounded-2xl p-5 mb-4 text-center font-bold transition duration-300 ${
              allLessonsCompleted
                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!allLessonsCompleted}
            onClick={() => router.push("/myCourses")}
          >
            Complete Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
