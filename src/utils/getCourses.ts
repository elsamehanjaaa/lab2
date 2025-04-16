// utils/getCourses.ts

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  slug: string;
  _id: string;
}

interface GetCoursesResponse {
  courses: Course[];
  error?: string;
}

export const getCourses = async (): Promise<GetCoursesResponse> => {
  try {
    const res = await fetch("http://localhost:5000/courses", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const courses = await res.json();
    return { courses };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      courses: [],
      error: "Failed to load courses. Please try again later.",
    };
  }
};
