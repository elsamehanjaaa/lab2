export const handleGoogleLogin = async () => {
  const res = await fetch("http://localhost:5000/auth/login-with-google", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await res.json();
  console.log(data);

  return data;
};
