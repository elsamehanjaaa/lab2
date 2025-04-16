export const fetchUser = async () => {
  const response = await fetch("http://localhost:5000/auth/protected", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const result = await response.json();
  return result;
};
