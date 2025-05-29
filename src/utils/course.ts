import * as sectionUtils from "./section";

interface Course {
  title: string;
  description: string;
  price: number;
  rating: number;
  status: boolean;
  created_at: string;
  fullDescription: string;
  requirements: string[];
  learn: string[];
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

export const create = async (courseData: FormData, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`, // Authorization token
      },
      body: courseData, // Directly send the FormData (no need to set Content-Type)
      credentials: "include", // Include credentials (if needed)
    }
  );

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${course_id}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const course = await res.json();

    if (cookies) {
      const sections = await sectionUtils.getByCourse(course_id, cookies);
      course.sections = sections;
    } else {
      const sections = await sectionUtils.getTitlesByCourse(course_id);
      course.sections = sections;
    }

    if (!course || course.length === 0) {
      return null;
    }
    return { ...course };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
};

export const getAll = async (): Promise<GetCoursesResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
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
      `${process.env.NEXT_PUBLIC_API_URL}/courses/getCoursesByInstructor`,
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
      `${process.env.NEXT_PUBLIC_API_URL}/courses/getCoursesByCategory`,
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

export const remove = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`,
      {
        // SHËNIM: ndrysho URL-në në endpointin e saktë
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);
    return true;
  } catch (error) {
    console.error("Fetch error:", error);
    return false;
  }
};
