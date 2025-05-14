// utils/getCourses.ts

import { getSectionsByCourse } from "./getSectionsByCourse";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  sections: SectionsWithLessons[];
  thumbnail_url: string;
  instructor_name: string;
  _id: string;
  categories: number[];
}
interface SectionsWithLessons {
  index: number;
  title: string;
  created_at: string;
  _id: string;
  lessons: [];
}
export const getCourseById = async (
  course_id: string,
  cookies?: any
): Promise<Course | null> => {
  try {
    const res = await fetch(`http://localhost:5000/courses/${course_id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const course = await res.json();
    if (cookies) {
      const sections = await getSectionsByCourse(course_id, cookies);
      course.sections = sections;
    }
    return { ...course };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};
