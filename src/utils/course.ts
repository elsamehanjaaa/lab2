import * as sectionUtils from "./section";

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

interface GetCoursesResponse {
  courses: Course[];
  error?: string;
}

export const create = async (courseData: FormData) => {
  const token = "eyJhbGciOiJIUzI1NiIsImtpZCI6ImtnbGpIZlNKMGJ2ZmZYYUoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2lqdHRscGZ6dHpnZ2hraGlrZWN1LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJjZTAyM2VmZi0zNTNlLTQzMDQtYTJjOC0yN2MwYTU2ODgzZDEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3NDA1MzA4LCJpYXQiOjE3NDc0MDE3MDgsImVtYWlsIjoieGVudG9ybzAwMEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIiwiZ29vZ2xlIl0sInJvbGUiOiJpbnN0cnVjdG9yIn0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0txQ0lhUC1DUTloTVNmWWpEWGl4UFZBR3RMWFpxUkMzZl9qRHlOQ3M0aWlPLUF0dz1zOTYtYyIsImVtYWlsIjoieGVudG9ybzAwMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoieGVuIHRvcm8iLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoieGVuIHRvcm8iLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLcUNJYVAtQ1E5aE1TZllqRFhpeFBWQUd0TFhacVJDM2ZfakR5TkNzNGlpTy1BdHc9czk2LWMiLCJwcm92aWRlcl9pZCI6IjEwNTcxNjE4NTUzODg5MDE1MDg1NyIsInN1YiI6IjEwNTcxNjE4NTUzODg5MDE1MDg1NyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQ3NDAxNzA4fV0sInNlc3Npb25faWQiOiJmNGY1NTkzMC05MTQ3LTQ2ZmQtOTUyOS00OGJmYTkzMWNiNDAiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.nxSqqPJhvWJ5A7tfSpV8IKRerMXrVgsBGeyCnORAkh4"
  const response = await fetch("http://localhost:5000/courses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // Authorization token
    },
    body: courseData, // Directly send the FormData (no need to set Content-Type)
    credentials: "include", // Include credentials (if needed)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create course");
  }

  return data;
};

export const edit = async (id: string, courseData: FormData, token: string) => {
  const response = await fetch(`http://localhost:5000/courses/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, // Authorization token
    },
    body: courseData, // Directly send the FormData (no need to set Content-Type)
    credentials: "include", // Include credentials (if needed)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create course");
  }

  return data;
};
export const getById = async (
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
      const sections = await sectionUtils.getByCourse(course_id, cookies);
      course.sections = sections;
    }
    return { ...course };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getAll = async (): Promise<GetCoursesResponse> => {
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

export const getByInstructor = async (user_id: string): Promise<Course[]> => {
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
export const getByCategory = async (category_id: string): Promise<Course[]> => {
  try {
    const res = await fetch(
      "http://localhost:5000/courses/getCoursesByCategory",
      {
        // SHËNIM: ndrysho URL-në në endpointin e saktë
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: category_id }),
      }
    );

    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
    const courses = await res.json();
    return courses;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
