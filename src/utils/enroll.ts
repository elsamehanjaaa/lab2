import { fetchUser } from "./fetchUser";
import { parse } from "cookie";

interface User {
  id: string;
  name: string;
  email: string;
}

interface EnrollmentData {
  user_id: string;
  course_id: string;
}

export const enrollInCourse = async (courseId: string): Promise<any> => {
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
