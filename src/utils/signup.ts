export interface SignupData {
  username: string;
  email: string;
  password: string;
  // Add any additional fields you're using
}

export const signup = async (data: SignupData): Promise<any> => {
  const res = await fetch("http://localhost:5000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Sign up failed");
  }

  return result;
};
