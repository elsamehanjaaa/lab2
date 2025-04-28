export const fetchUser = async () => {
  const response = await fetch("http://localhost:5000/auth/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensure cookies are included
  });

  if (!response.ok) {
    return null;
  }

  const result = await response.json();

  return result;
};
