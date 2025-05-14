interface Lesson {
  index: number;
  content: string;
  video_url: string;
  created_at: string;
  status: string;
  _id: string;
}

export const getByCourse = async (
  section_id: string,
  cookies: string
): Promise<{ lessons: Lesson[] }> => {
  try {
    const fetchUser = await fetch("http://localhost:3000/api/me", {
      method: "GET",
      headers: {
        cookie: cookies,
      },
    });

    const { user } = await fetchUser.json();

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
