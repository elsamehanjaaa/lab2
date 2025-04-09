"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Loader2, X, Check } from "lucide-react";

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameExist, setUsernameExist] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const [emailValid, setEmailValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordConditions = {
    length: /^.{8,}$/, // at least 8 characters
    uppercase: /[A-Z]/, // at least one uppercase
    lowercase: /[a-z]/, // at least one lowercase
    number: /\d/, // at least one number
  };

  const validatePassword = (password: string) => {
    setPasswordValid({
      length: passwordConditions.length.test(password),
      uppercase: passwordConditions.uppercase.test(password),
      lowercase: passwordConditions.lowercase.test(password),
      number: passwordConditions.number.test(password),
    });
  };

  async function handleUsernameInput(
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    setData({ ...data, username: e.target.value });
    try {
      const res = await fetch("http://localhost:5000/auth/checkUsername", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: e.target.value }),
        credentials: "include",
      });

      const result = await res.json();
      setUsernameExist(result);
    } catch {}
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        throw new Error(result.message || "Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Create an account
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your details to get started
          </p>
        </div>
        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="username"
                type="text"
                placeholder="johndoe"
                className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                  usernameExist
                    ? "focus:ring-red-500 border-red-500 "
                    : "focus:ring-blue-500 border-gray-300 "
                }`}
                value={data.username}
                onChange={handleUsernameInput}
                required
                minLength={3}
              />
              {usernameExist ? (
                <X
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  color="red"
                />
              ) : (
                data.username.length >= 3 && (
                  <Check
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    color="green"
                  />
                )
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setData({ ...data, email });
                  setEmailValid(emailRegex.test(email));
                }}
                required
              />
              {data.email &&
                (emailValid ? (
                  <Check
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    color="green"
                  />
                ) : (
                  <X
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    color="red"
                  />
                ))}
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.password}
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-1 text-sm">
              <p
                className={`text-${
                  passwordValid.length ? "green" : "gray"
                }-400`}
              >
                • At least 8 characters
              </p>
              <p
                className={`text-${
                  passwordValid.uppercase ? "green" : "gray"
                }-400`}
              >
                • One uppercase letter
              </p>
              <p
                className={`text-${
                  passwordValid.lowercase ? "green" : "gray"
                }-400`}
              >
                • One lowercase letter
              </p>
              <p
                className={`text-${
                  passwordValid.number ? "green" : "gray"
                }-400`}
              >
                • One number
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={
              isLoading ||
              !Object.values(passwordValid).every(Boolean) ||
              usernameExist ||
              data.username.length <= 3 ||
              !emailValid
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating account..." : "Create account"}
          </button>
          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
