// utils/getCourses.ts

import { fetchUser } from "./fetchUser";

interface Lesson {
  index: number;
  content: string;
  video_url: string;
  created_at: string;
  status: string;
  _id: string;
}

export const getLessonsByCourse = async (
  section_id: string,
  access_token: string
): Promise<{ lessons: Lesson[] }> => {
  try {
    const user = await fetchUser(access_token);
    if (!user) {
      return { lessons: [] };
    }
    const user_id = user.id;
    const res = await fetch(
      `http://localhost:5000/lessons/getLessonsBySection`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_id, user_id }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const lessons = await res.json();

    return { lessons };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      lessons: [],
    };
  }
};
