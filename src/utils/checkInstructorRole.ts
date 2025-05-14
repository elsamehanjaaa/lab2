export const checkInstructorRole = async (
  access_token: string
): Promise<boolean> => {
  const res = await fetch("http://localhost:5000/auth/get-role", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    credentials: "include",
  });

  const data = await res.json();
  if (data.role === "instructor") {
    return true;
  }
  return false; // Assuming result is a boolean
};
