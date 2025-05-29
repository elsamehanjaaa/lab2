interface TeacherProfile {
  teachingType: string;
  experienceYears: string;
  ageGroups: string[];
  subjects: string[];
  createdVideoContent: string;
  tools: string[];
  motivation: string;
  weeklyAvailability: string;
  publishTime: string;
}
export const createTeacherProfile = async (
  teacher: TeacherProfile
): Promise<any> => {
  const res = await fetch("/api/me", {
    method: "GET",
    credentials: "include", // ensure cookies are sent
  });

  const { user } = await res.json();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teachers`, {
    method: "POST",
    body: JSON.stringify({ userId: user.id, ...teacher }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create teacher profile");
  }

  return data;
};

export const checkInstructorRole = async (
  access_token: string
): Promise<boolean> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teachers/checkUser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  return data;
};
