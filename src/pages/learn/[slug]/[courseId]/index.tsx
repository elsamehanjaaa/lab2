import { getCourseById } from "@/utils/getCourseById";
import VideoPlayer from "@/components/learn/VideoPlayer";
import { ArrowDown } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { checkEnrollment } from "@/utils/checkEnrollment";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import Link from "next/link";
import Image from "next/image";
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
    return { redirect: { destination: "/404", permanent: false } };
  }

  const cookies = parse(req.headers.cookie || "");
  const access_token = cookies["access_token"];

  if (!access_token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const access = await checkEnrollment(courseId, access_token);
  if (!access) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  // Optionally: Fetch course data here and pass it as props
  return {
    props: {
      courseId,
    },
  };
};

const CoursePage = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const [course, setCourse] = useState<Course | null>(null);
  const [video, setVideo] = useState<{ url: string; title: string } | null>(
    null
  );
  const [openSectionIndex, setOpenSectionIndex] = useState<number | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);

  const toggleSection = (index: number) => {
    setOpenSectionIndex((prev) => (prev === index ? null : index));
  };
  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return;
      const fetchedCourse = (await getCourseById(courseId as string)) as Course;
      console.log(fetchedCourse);

      setCourse(fetchedCourse);

      const firstVideoUrl =
        fetchedCourse?.sections?.[0]?.lessons?.[0]?.video_url ?? null;

      // setVideo({ url: firstVideoUrl || "", title: video?.title || "" });
      setVideo({
        url: firstVideoUrl || "",
        title: fetchedCourse?.sections?.[0]?.lessons?.[0]?.title || "",
      });
      setCurrentSectionIndex(0);
      setCurrentLessonIndex(0);
    }
    fetchCourse();
  }, [courseId]);

  const goToNextLesson = () => {
    if (!course) return;
    const currentSection = course.sections[currentSectionIndex];
    const nextLessonIndex = currentLessonIndex + 1;

    if (nextLessonIndex < currentSection.lessons.length) {
      // Next lesson in same section
      const nextLesson = currentSection.lessons[nextLessonIndex];
      setVideo({ url: nextLesson.video_url || "", title: nextLesson.title });
      setCurrentLessonIndex(nextLessonIndex);
    } else if (currentSectionIndex + 1 < course.sections.length) {
      // Move to next section
      const nextSection = course.sections[currentSectionIndex + 1];
      const nextLesson = nextSection.lessons[0];
      setVideo({ url: nextLesson.video_url || "", title: nextLesson.title });
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
      setVideo({ url: prevLesson.video_url || "", title: prevLesson.title });
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentSectionIndex > 0) {
      // Go to last lesson in previous section
      const prevSection = course.sections[currentSectionIndex - 1];
      const lastLessonIndex = prevSection.lessons.length - 1;
      const prevLesson = prevSection.lessons[lastLessonIndex];
      setVideo({ url: prevLesson.video_url || "", title: prevLesson.title });
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentLessonIndex(lastLessonIndex);
    }
  };

  return (
    <div className="-mt-[100px]">
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
            />
          )}
        </div>
        <div className="w-lg mx-auto bg-gray-100 rounded-md overflow-hidden shadow">
          {course &&
            course?.sections.map((section, index) => (
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
                        onClick={() =>
                          setVideo({
                            url: lesson.video_url || "",
                            title: lesson.title || "",
                          })
                        }
                        className="py-2 px-6 bg-gray-300 hover:bg-gray-400 transition cursor-pointer"
                      >
                        {lesson.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
