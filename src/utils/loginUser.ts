interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export const loginUser = async (data: LoginData) => {
  const res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  localStorage.setItem("access_token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token);

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result.user;
};
