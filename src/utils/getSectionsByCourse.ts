// utils/getCourses.ts
import { getLessonsByCourse } from "./getLessonsByCourse";

interface Lesson {
  index: number;
  content: string;
  video_url: string;
  created_at: string;
  _id: string;
}

interface Section {
  index: number;
  title: string;
  created_at: string;
  _id: string;
}

interface SectionsWithLessons extends Section {
  lessons: Lesson[];
}

export const getSectionsByCourse = async (
  course_id: string
): Promise<SectionsWithLessons[]> => {
  try {
    const res = await fetch(
      `http://localhost:5000/section/getSectionsByCourseId`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const sections: Section[] = await res.json();

    const sectionsWithLessons = await Promise.all(
      sections.map(async (s) => {
        try {
          const { lessons } = await getLessonsByCourse(s._id);
          return { ...s, lessons };
        } catch (err) {
          console.error(`Failed to fetch lessons for section ${s._id}:`, err);
          return { ...s, lessons: [] };
        }
      })
    );

    return sectionsWithLessons;
  } catch (error) {
    console.error("Fetch error:", error);
    return []; // Return an empty array to match the correct return type
  }
};
