import { fetchUser } from "./fetchUser";

export const checkInstructorRole = async (
  access_token: string
): Promise<boolean> => {
  const user = await fetchUser(access_token);
  if (!user) {
    return false;
  }

  if (user.role == "instructor") {
    return true;
  }
  return false; // Assuming result is a boolean
};
