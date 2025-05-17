import { parse } from "cookie";

interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
interface SignupData {
  username: string;
  email: string;
  password: string;
}
export const recoverSession = async (): Promise<
  { username: any } | undefined
> => {
  try {
    const cookies = parse(document.cookie || "");
    const refresh_token = cookies["refresh_token"];
    if (!refresh_token) {
      return undefined;
    }
    const res = await fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
      credentials: "include", // Ensure cookies are included
    });

    if (!res.ok) {
      // Handle server-side errors, e.g., invalid password or expired token
      const errorData = await res.json();
      throw new Error(errorData.message || "Recover reset failed");
    }

    const data = await res.json();
    return { username: data.username }; // Assuming the response contains a username field
    // Handle success (you can redirect or show a success message here)
  } catch (error) {
    console.error("Password reset error:", error);
    alert(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
    return undefined;
  }
};

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
export const handleGoogleLogin = async () => {
  const res = await fetch("http://localhost:5000/auth/login-with-google", {
    method: "POST",
    credentials: "include", // optional: in case cookies involved
  });
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await res.json();

  window.location.href = data.url; // Redirect user to Google login page
};
export const logout = async () => {
  const response = await fetch("http://localhost:5000/auth/logout", {
    method: "post",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response;
};

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

export const login = async (data: LoginData) => {
  const res = await fetch("http://localhost:5000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result.user;
};
export const resetPassword = async (password: string): Promise<void> => {
  try {
    const res = await fetch("http://localhost:5000/auth/reset-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword: password }),
      credentials: "include", // Ensure cookies are included
    });

    if (!res.ok) {
      // Handle server-side errors, e.g., invalid password or expired token
      const errorData = await res.json();
      throw new Error(errorData.message || "Password reset failed");
    }

    const data = await res.json();
    // Handle success (you can redirect or show a success message here)
  } catch (error) {
    console.error("Password reset error:", error);
    alert(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
};
export const setSession = async ({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token: string;
}): Promise<{ username: any } | undefined> => {
  try {
    if (!refresh_token || !access_token) {
      return undefined;
    }
    const res = await fetch("http://localhost:5000/auth/set-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token, access_token }),
      credentials: "include", // Ensure cookies are included
    });

    if (!res.ok) {
      // Handle server-side errors, e.g., invalid password or expired token
      const errorData = await res.json();
      throw new Error(errorData.message || "Recover reset failed");
    }

    const data = await res.json();
    return { username: data.username }; // Assuming the response contains a username field
    // Handle success (you can redirect or show a success message here)
  } catch (error) {
    console.error("Password reset error:", error);
    alert(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
    return undefined;
  }
};
