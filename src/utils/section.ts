// utils/getCourses.ts
import * as lessonUtils from "./lesson";

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
interface SectionsTitleWithLessons {
  index: number;
  title: string;
  lessons: Lesson[];
}

export const getByCourse = async (
  course_id: string,
  cookies: string
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
          const { lessons } = await lessonUtils.getBySection(s._id, cookies);
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
export const getTitlesByCourse = async (
  course_id: string
): Promise<SectionsTitleWithLessons[]> => {
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
          const { lessons } = await lessonUtils.getTitlesBySection(s._id);
          const title = s.title;
          const index = s.index;
          return { title, index, lessons };
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
