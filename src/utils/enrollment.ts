interface EnrollmentData {
  user_id: string;
  course_id: string;
}

export const checkAccess = async (
  course_id: string,
  access_token: string
): Promise<boolean> => {
  if (!course_id) {
    return false;
  }
  const res = await fetch("http://localhost:5000/enrollments/check-access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ course_id }), // no user_id
  });

  if (!res.ok) {
    return false;
  }
  const access = await res.json();
  console.log(access);

  return access; // Assuming result is a boolean
};

export const enroll = async (courseId: string): Promise<any> => {
  // Check if the user is authenticated

  const res = await fetch("/api/me", {
    method: "GET",
    credentials: "include", // ensure cookies are sent
  });

  const { user } = await res.json();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Proceed with the enrollment process
  const enrollRes = await fetch("http://localhost:5000/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      user_id: user.id,
      course_id: courseId,
    } as EnrollmentData),
  });

  if (!enrollRes.ok) {
    throw new Error(`Enrollment failed! Status: ${enrollRes.status}`);
  }

  const result = await enrollRes.json();
  return result;
};

export const getByUser = async (user_id: string): Promise<{}> => {
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
