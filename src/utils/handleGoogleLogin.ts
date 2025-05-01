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
