export const update = async (
  status: string,
  lesson_id: string,
  course_id: string
): Promise<boolean> => {
  const fetchUser = await fetch("/api/me", {
    method: "GET",
    credentials: "include", // ensure cookies are sent
  });

  const { user } = await fetchUser.json();

  if (!user) {
    throw new Error("User not authenticated");
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

  const result = await res.json();
  return result;
};
