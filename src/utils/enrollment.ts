import { me } from "@/utils/auth";
interface EnrollmentData {
  user_id: string;
  course_id: string;
}

export const checkAccess = async (
  course_id: string,
  cookies: string
): Promise<boolean> => {
  if (!course_id) {
    return false;
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/enrollments/check-access`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      body: JSON.stringify({ course_id }), // no user_id
    }
  );

  if (!res.ok) {
    return false;
  }
  const access = await res.json();

  return access; // Assuming result is a boolean
};

export const enroll = async (courseId: string): Promise<any> => {
  // Check if the user is authenticated

  try {
    const user = await me();

    // Proceed with the enrollment process
    const enrollRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enrollments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_id: user.id,
          course_id: courseId,
        } as EnrollmentData),
      }
    );

    if (!enrollRes.ok) {
      throw new Error(`Enrollment failed! Status: ${enrollRes.status}`);
    }

    const result = await enrollRes.json();
    return result;
  } catch (error) {
    console.error("Fetch error:", error);
    return {};
  }
};

export const getByUser = async (
  user_id: string,
  cookies: string
): Promise<{}> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enrollments/getEnrollmentsByUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookies || "",
        },
        body: JSON.stringify({ user_id }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const courses = await res.json();

    return courses;
  } catch (error) {
    console.error("Fetch error:", error);
    return {};
  }
};
export const getEnrolledCourses = async (
  cookies: string
): Promise<{ enrolledCourseIds: string[]; error?: string }> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enrollments/getEnrolledCourses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookies || "",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP Error! Status: ${res.status}`);
    }

    const data = await res.json();
    return { enrolledCourseIds: data };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      enrolledCourseIds: [],
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
