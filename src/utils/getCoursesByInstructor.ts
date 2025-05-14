// utils/getCourses.ts

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  thumbnail_url: string;
  _id: string;
}

export const getCoursesByInstructor = async (
  user_id: string
): Promise<Course[]> => {
  try {
    const res = await fetch(
      "http://localhost:5000/courses/getCoursesByInstructor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const courses = await res.json();
    return courses;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
