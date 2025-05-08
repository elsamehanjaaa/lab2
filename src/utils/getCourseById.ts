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
  _id: string;
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
  access_token: string
): Promise<Course> => {
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

    const sections = await getSectionsByCourse(course_id, access_token);
    course.sections = sections;
    return { ...course };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      title: "",
      description: "",
      price: 0,
      rating: 0,
      status: false,
      created_at: "",
      slug: "",
      sections: [],
      _id: "",
    };
  }
};
