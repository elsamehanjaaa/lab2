"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Loader2, X, Check } from "lucide-react";
import * as authUtils from "@/utils/auth";

export default function SignUpModal({ onClose }: { onClose: () => void }) {
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

  // Prevent background scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordConditions = {
    length: /^.{8,}$/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
  };

  const validatePassword = (password: string) => {
    setPasswordValid({
      length: passwordConditions.length.test(password),
      uppercase: passwordConditions.uppercase.test(password),
      lowercase: passwordConditions.lowercase.test(password),
      number: passwordConditions.number.test(password),
    });
  };

  async function handleUsernameInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setData({ ...data, username: value });

    try {
      const exists = await authUtils.checkUsername(value);
      setUsernameExist(exists);
    } catch (err) {
      console.error("Username check failed:", err);
    }
  }
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const isValidUsername = !usernameExist && data.username.length > 3;
    const isValidEmail = emailValid;
    const isValidPassword = Object.values(passwordValid).every(
      (value) => value === true
    );

    if (!isValidUsername || !isValidEmail || !isValidPassword) {
      setIsLoading(false);
      return;
    }

    try {
      await authUtils.signup(data); // <- Cleaner call
      router.refresh();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm  flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an account
            </h2>
            <p className="text-gray-600 mt-1">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-900" />
                <input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                    usernameExist
                      ? "focus:ring-red-500 border-red-500"
                      : "focus:ring-blue-500 border-gray-300"
                  }`}
                  value={data.username}
                  onChange={handleUsernameInput}
                  required
                  minLength={3}
                />
                {usernameExist ? (
                  <X
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    color="red"
                  />
                ) : (
                  data.username.length > 3 && (
                    <Check
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      color="green"
                    />
                  )
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-900" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      color="green"
                    />
                  ) : (
                    <X
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      color="red"
                    />
                  ))}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-900" />
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.password}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                    validatePassword(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="text-xs space-y-1 text-gray-500">
                <p className={passwordValid.length ? "text-green-600" : ""}>
                  • At least 8 characters
                </p>
                <p className={passwordValid.uppercase ? "text-green-600" : ""}>
                  • One uppercase letter
                </p>
                <p className={passwordValid.lowercase ? "text-green-600" : ""}>
                  • One lowercase letter
                </p>
                <p className={passwordValid.number ? "text-green-600" : ""}>
                  • One number
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-950 text-white py-2 px-4 rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
