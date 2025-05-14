// utils/getCourses.ts

export const getEnrollmentsByUser = async (user_id: string): Promise<{}> => {
  try {
    const res = await fetch(
      "http://localhost:5000/enrollments/getEnrollmentsByUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const courses = await res.json();

    const data = courses.map(
      (course: {
        _id: any;
        title: any;
        slug: any;
        progress: number;
        thumbnail_url: string;
      }) => {
        return {
          id: course._id,
          title: course.title,
          slug: course.slug,
          progress: course.progress,
          thumbnail_url: course.thumbnail_url,
        };
      }
    );
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    return {};
  }
};
