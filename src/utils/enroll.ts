import { fetchUser } from "./fetchUser";

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
  const auth = await fetchUser();
  const currentUser: User = {
    id: auth.user.id,
    name: auth.user.name,
    email: auth.user.email,
  };

  // Proceed with the enrollment process
  const enrollRes = await fetch("http://localhost:5000/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      user_id: currentUser.id,
      course_id: courseId,
    } as EnrollmentData),
  });

  if (!enrollRes.ok) {
    throw new Error(`Enrollment failed! Status: ${enrollRes.status}`);
  }

  const result = await enrollRes.json();
  return result;
};
