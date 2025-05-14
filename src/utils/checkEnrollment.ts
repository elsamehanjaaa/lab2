import { fetchUser } from "./fetchUser";

export const checkEnrollment = async (
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
  return access; // Assuming result is a boolean
};
