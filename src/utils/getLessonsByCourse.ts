// utils/getCourses.ts

interface Lesson {
  index: number;
  content: string;
  video_url: string;
  created_at: string;
  _id: string;
}

export const getLessonsByCourse = async (
  section_id: string
): Promise<{ lessons: Lesson[] }> => {
  try {
    const res = await fetch(
      `http://localhost:5000/lessons/getLessonsByCourse`,
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
