import { me } from "./auth";

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
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/teachers`,
      {
        method: "POST",
        body: JSON.stringify({ teacher }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create teacher profile");
    }

    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const checkInstructorRole = async (
  cookies: string
): Promise<boolean> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teachers/checkUser`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  return data;
};

export const getData = async (cookies: string): Promise<any> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/teachers/getData`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies || "",
      },
      credentials: "include",
    }
  );

  const data = await res.json();

  return data;
};
