import { me } from "./auth";

export const update = async (
  status: string,
  lesson_id: string,
  course_id: string
): Promise<boolean> => {
  try {
    const user = await me();
    const user_id = user.id;
    if (!status.match(/^(not_started|incomplete|completed)$/)) {
      return false;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/progress`, {
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
  } catch (err) {
    console.log(err);
    return false;
  }
};
