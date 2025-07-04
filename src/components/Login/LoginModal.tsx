// components/LoginModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, BookOpen, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as authUtils from "@/utils/auth";
import Loading from "../Loading";
import { useAuth } from "@/contexts/AuthContext"; // Adjust path if needed
export default function LoginModal({
  onClose,
  onResetPassword,
}: {
  onClose: () => void;
  onResetPassword: () => void;
}) {
  const { login, loading: authLoading } = useAuth(); // Rename loading to avoid conflict if LoginModal has its own
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Lock scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // If using authLoading from context, you might not need LoginModal's own setIsLoading
    // setIsLoading(true); // Or rely on authLoading

    try {
      // 'data' from your modal's state should match the Credentials interface
      await login(data); // This now calls the context's login
      // The context's login function will handle setting the user
      // and its useEffect will reflect this.

      router.refresh(); // Keep this if you have server components that need to update
      onClose(); // Close modal on successful login
    } catch (error) {
      console.error("Login error:", error);
      // The error thrown by context's login will be caught here
      alert(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      // setIsLoading(false); // Or rely on authLoading
    }
  }
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl w-full max-w-md shadow-lg relative p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X />
          </button>

          <div className="text-center mb-6">
            <BookOpen className="mx-auto h-10 w-10 text-blue-900" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
            <p className="text-gray-600 text-sm">
              Continue your learning journey
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-900" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-blue-500 bg-gray-50"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) =>
                    setData({ ...data, rememberMe: !data.rememberMe })
                  }
                />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={authLoading} // Use loading state from context
              className="w-full bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
            >
              {
                authLoading && (
                  <Loading show={authLoading} />
                ) 
              }
              {authLoading ? "Signing in..." : "Sign in"}
            </button>
            <div className="text-center mt-4">
              <button
                onClick={onResetPassword}
                className="text-blue-900 hover:text-blue-800 font-semibold text-sm"
              >
                Reset Password
              </button>
            </div>
            <div className="flex items-center justify-center mt-2">
              <div className="border-t border-gray-300 w-1/3"></div>
              <span className="text-gray-500 text-sm px-2">or</span>
              <div className="border-t border-gray-300 w-1/3"></div>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  await authUtils.handleGoogleLogin();
                } catch (err) {
                  alert("Failed to start Google login");
                  console.error(err);
                }
              }}
              className="w-full mt-4 border cursor-pointer border-gray-300 py-3 rounded-xl text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              <img src="/icons/google.png" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
