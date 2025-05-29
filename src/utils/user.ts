export const get = async (access_token?: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${access_token}`,
    },
    credentials: "include", // Ensure cookies are included
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  return result;
};
