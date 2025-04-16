export const handleLogout = async () => {
  const response = await fetch("http://localhost:5000/auth/logout", {
    method: "post",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response;
};
