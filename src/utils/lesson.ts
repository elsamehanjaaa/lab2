import { me } from "./auth";

interface Lesson {
  index: number;
  content: string;
  video_url: string;
  created_at: string;
  status: string;
  _id: string;
}

export const getBySection = async (
  section_id: string,
  cookies: string
): Promise<{ lessons: Lesson[] }> => {
  try {
    const user = await me();
    const user_id = user.id;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/getLessonsBySection`,
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
export const getTitlesBySection = async (
  section_id: string
): Promise<{ lessons: Lesson[] }> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/getLessonsBySection`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section_id }),
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
