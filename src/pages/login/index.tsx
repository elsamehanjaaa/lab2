// pages/login.tsx

import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export const Login = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  async function handleLogin() {
    console.log(JSON.stringify(data));

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    const result = await res.json();
    if (res.ok) {
      // Redirect to the home page or dashboard
      router.push("/");
    } else {
      alert("Login failed: " + result.message);
    }
    // Handle login logic here (e.g., API call)
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-black">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          onInput={(e) =>
            setData({ ...data, email: (e.target as HTMLInputElement).value })
          }
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          onInput={(e) =>
            setData({ ...data, password: (e.target as HTMLInputElement).value })
          }
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
