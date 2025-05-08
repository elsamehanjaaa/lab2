import { fetchUser } from "./fetchUser";

export const updateProgress = async (
  status: string,
  lesson_id: string,
  access_token: string,
  course_id: string
): Promise<boolean> => {
  const user = await fetchUser(access_token);
  if (!user) {
    return false;
  }
  const user_id = user.id;
  if (!status.match(/^(not_started|incomplete|completed)$/)) {
    return false;
  }

  const res = await fetch("http://localhost:5000/progress", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, lesson_id, user_id, course_id }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update progresse");
  }
  console.log(res);

  const result = await res.json();
  return result;
};
