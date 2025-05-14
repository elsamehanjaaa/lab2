// utils/recoverySession.ts

import { parse } from "cookie";
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
