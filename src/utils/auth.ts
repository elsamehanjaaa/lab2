import { parse } from "cookie";
import { IncomingMessage } from "http";
interface AuthData {
  user: { id: string; [key: string]: any } | null; // Adjust user type as needed
  isLoggedIn: boolean;
}
interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}
interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export const recoverSession = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Session recovery failed:", await res.json());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error during session recovery:", error);
    return false;
  }
};
export const checkUsername = async (username: string): Promise<boolean> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/checkUsername`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to check username");
  }

  const result = await res.json();
  return result; // Assuming result is a boolean
};
export const handleGoogleLogin = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login-with-google`,
    {
      method: "POST",
      credentials: "include", // optional: in case cookies involved
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await res.json();

  window.location.href = data.url; // Redirect user to Google login page
};
export const logout = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    {
      method: "post",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response;
};

export const signup = async (data: SignupData): Promise<any> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
export const me = async (cookie?: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      cookie: cookie || "",
    },
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    return null;
  }

  return result;
};
export const resetPassword = async (password: string): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: password }),
        credentials: "include", // Ensure cookies are included
      }
    );

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/set-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token, access_token }),
        credentials: "include", // Ensure cookies are included
      }
    );

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

export async function getUserFromRequest(): Promise<AuthData> {
  try {
    const data = await me();
    if (data) {
      return { user: data, isLoggedIn: true };
    }
    return { user: null, isLoggedIn: false };
  } catch (error) {
    console.error("Server-side auth error:", error);
    return { user: null, isLoggedIn: false };
  }
}
export async function updateProfile(data: any): Promise<any> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to update user:", res.status, res.statusText);

      return null;
    }
    const profile = await res.json();
    return profile;
  } catch (error) {
    console.error("Server-side auth error:", error);
    return null;
  }
}
