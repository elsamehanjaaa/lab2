export const checkUsername = async (username: string): Promise<boolean> => {
  const res = await fetch("http://localhost:5000/auth/checkUsername", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to check username");
  }

  const result = await res.json();
  return result; // Assuming result is a boolean
};
