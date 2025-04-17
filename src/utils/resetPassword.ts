// utils/resetPassword.ts

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
